package consumer

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"strconv"
	"strings"
	"time"

	"github.com/SamarthSRao/cdc-replay/internal/config"
	grpcpool "github.com/SamarthSRao/cdc-replay/internal/grpc"
	"github.com/SamarthSRao/cdc-replay/internal/metrics"
	"github.com/SamarthSRao/cdc-replay/internal/models"
	pb "github.com/SamarthSRao/cdc-replay/proto"
	"github.com/go-redis/redis/v8"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// ReplayConsumer consumes events from Redis Streams and delivers via gRPC
type ReplayConsumer struct {
	redisClient *redis.Client
	grpcPool    *grpcpool.ClientPool
	config      *config.Config
}

// NewReplayConsumer creates a new replay consumer
func NewReplayConsumer(redisClient *redis.Client, grpcPool *grpcpool.ClientPool, cfg *config.Config) *ReplayConsumer {
	return &ReplayConsumer{
		redisClient: redisClient,
		grpcPool:    grpcPool,
		config:      cfg,
	}
}

// InitConsumerGroup initializes the consumer group
func (rc *ReplayConsumer) InitConsumerGroup(ctx context.Context) error {
	err := rc.redisClient.XGroupCreateMkStream(
		ctx,
		rc.config.Redis.StreamKey,
		rc.config.Consumer.GroupName,
		"0",
	).Err()

	if err != nil && !strings.Contains(err.Error(), "BUSYGROUP") {
		return fmt.Errorf("failed to create consumer group: %w", err)
	}

	log.Printf("Consumer group '%s' initialized for stream '%s'",
		rc.config.Consumer.GroupName,
		rc.config.Redis.StreamKey)

	return nil
}

// StartConsuming starts the main consumption loop
func (rc *ReplayConsumer) StartConsuming(ctx context.Context) error {
	log.Printf("Starting consumer '%s' in group '%s'",
		rc.config.Consumer.ConsumerName,
		rc.config.Consumer.GroupName)

	metrics.ActiveConsumers.Inc()
	defer metrics.ActiveConsumers.Dec()

	// Start pending message claimer in background
	go rc.claimPendingMessagesLoop(ctx)

	for {
		select {
		case <-ctx.Done():
			log.Println("Consumer shutting down...")
			return ctx.Err()
		default:
			if err := rc.consumeBatch(ctx); err != nil {
				log.Printf("Error consuming batch: %v", err)
				time.Sleep(time.Second) // Brief pause on error
			}
		}
	}
}

// consumeBatch reads and processes a batch of messages
func (rc *ReplayConsumer) consumeBatch(ctx context.Context) error {
	streams, err := rc.redisClient.XReadGroup(ctx, &redis.XReadGroupArgs{
		Group:    rc.config.Consumer.GroupName,
		Consumer: rc.config.Consumer.ConsumerName,
		Streams:  []string{rc.config.Redis.StreamKey, ">"},
		Count:    rc.config.Consumer.BatchSize,
		Block:    rc.config.Consumer.BlockTime,
	}).Result()

	if err != nil {
		if err == redis.Nil {
			return nil // No messages, continue
		}
		return fmt.Errorf("error reading stream: %w", err)
	}

	for _, stream := range streams {
		for _, message := range stream.Messages {
			rc.processMessage(ctx, message)
		}
	}

	// Update lag metric
	rc.updateLagMetric(ctx)

	return nil
}

// processMessage processes a single message
func (rc *ReplayConsumer) processMessage(ctx context.Context, msg redis.XMessage) {
	startTime := time.Now()

	event, err := rc.parseEvent(msg.Values)
	if err != nil {
		log.Printf("Failed to parse message %s: %v", msg.ID, err)
		rc.handleFailure(ctx, msg, event, err)
		return
	}

	// Process the event
	if err := rc.deliverEvent(ctx, event); err != nil {
		log.Printf("Failed to deliver event %s: %v", event.ID, err)
		metrics.EventsProcessed.WithLabelValues(event.AggregateType, "failed").Inc()
		rc.handleFailure(ctx, msg, event, err)
		return
	}

	// Success - acknowledge the message
	if err := rc.redisClient.XAck(ctx, rc.config.Redis.StreamKey, rc.config.Consumer.GroupName, msg.ID).Err(); err != nil {
		log.Printf("Failed to acknowledge message %s: %v", msg.ID, err)
	}

	// Update metrics
	duration := time.Since(startTime).Seconds()
	metrics.EventsProcessed.WithLabelValues(event.AggregateType, "success").Inc()
	metrics.EventProcessingDuration.WithLabelValues(event.AggregateType).Observe(duration)

	log.Printf("Successfully processed event %s (type: %s) in %.2fs",
		event.ID, event.EventType, duration)
}

// parseEvent parses a Redis message into an OutboxEvent
func (rc *ReplayConsumer) parseEvent(values map[string]interface{}) (*models.OutboxEvent, error) {
	event := &models.OutboxEvent{
		Metadata: make(map[string]string),
	}

	// Extract required fields
	if id, ok := values["id"].(string); ok {
		event.ID = id
	} else {
		return nil, fmt.Errorf("missing or invalid 'id' field")
	}

	if aggType, ok := values["aggregate_type"].(string); ok {
		event.AggregateType = aggType
	} else {
		return nil, fmt.Errorf("missing or invalid 'aggregate_type' field")
	}

	if aggID, ok := values["aggregate_id"].(string); ok {
		event.AggregateID = aggID
	} else {
		return nil, fmt.Errorf("missing or invalid 'aggregate_id' field")
	}

	if eventType, ok := values["event_type"].(string); ok {
		event.EventType = eventType
	} else {
		return nil, fmt.Errorf("missing or invalid 'event_type' field")
	}

	if payload, ok := values["payload"].(string); ok {
		event.Payload = json.RawMessage(payload)
	} else {
		return nil, fmt.Errorf("missing or invalid 'payload' field")
	}

	if timestamp, ok := values["timestamp"].(string); ok {
		t, err := time.Parse(time.RFC3339, timestamp)
		if err != nil {
			return nil, fmt.Errorf("invalid timestamp format: %w", err)
		}
		event.Timestamp = t
	} else {
		event.Timestamp = time.Now()
	}

	// Extract optional metadata
	for key, value := range values {
		if strValue, ok := value.(string); ok && !isReservedField(key) {
			event.Metadata[key] = strValue
		}
	}

	return event, nil
}

// deliverEvent delivers an event via gRPC
func (rc *ReplayConsumer) deliverEvent(ctx context.Context, event *models.OutboxEvent) error {
	startTime := time.Now()

	req := &pb.EventRequest{
		EventId:       event.ID,
		AggregateType: event.AggregateType,
		AggregateId:   event.AggregateID,
		EventType:     event.EventType,
		Payload:       event.Payload,
		Timestamp:     timestamppb.New(event.Timestamp),
		Metadata:      event.Metadata,
	}

	resp, err := rc.grpcPool.ProcessEvent(ctx, event.AggregateType, req)
	
	duration := time.Since(startTime).Seconds()
	status := "success"
	if err != nil {
		status = "error"
	}
	metrics.GRPCDeliveryDuration.WithLabelValues(event.AggregateType, status).Observe(duration)

	if err != nil {
		return fmt.Errorf("gRPC delivery failed: %w", err)
	}

	if !resp.Success {
		return fmt.Errorf("target service rejected event: %s (code: %s)", resp.Message, resp.ErrorCode)
	}

	return nil
}

// handleFailure handles failed message processing
func (rc *ReplayConsumer) handleFailure(ctx context.Context, msg redis.XMessage, event *models.OutboxEvent, processingErr error) {
	retryCount := 0
	if val, ok := msg.Values["retry_count"].(string); ok {
		retryCount, _ = strconv.Atoi(val)
	}

	aggregateType := "unknown"
	if event != nil {
		aggregateType = event.AggregateType
	}

	if retryCount >= rc.config.Retry.MaxRetries {
		// Move to DLQ
		log.Printf("Moving message %s to DLQ after %d retries", msg.ID, retryCount)
		rc.moveToDLQ(ctx, msg, processingErr)
		rc.redisClient.XAck(ctx, rc.config.Redis.StreamKey, rc.config.Consumer.GroupName, msg.ID)
		metrics.DLQEvents.WithLabelValues(aggregateType, "max_retries").Inc()
		return
	}

	// Calculate backoff
	backoff := rc.calculateBackoff(retryCount)
	log.Printf("Retrying message %s in %v (attempt %d/%d)",
		msg.ID, backoff, retryCount+1, rc.config.Retry.MaxRetries)

	metrics.EventRetries.WithLabelValues(aggregateType, strconv.Itoa(retryCount+1)).Inc()

	time.Sleep(backoff)
	// Message will be retried in next consumption cycle
}

// calculateBackoff calculates exponential backoff with jitter
func (rc *ReplayConsumer) calculateBackoff(retryCount int) time.Duration {
	backoff := float64(rc.config.Retry.InitialBackoff) *
		math.Pow(rc.config.Retry.BackoffMultiplier, float64(retryCount))

	if backoff > float64(rc.config.Retry.MaxBackoff) {
		backoff = float64(rc.config.Retry.MaxBackoff)
	}

	return time.Duration(backoff)
}

// moveToDLQ moves a failed message to the dead letter queue
func (rc *ReplayConsumer) moveToDLQ(ctx context.Context, msg redis.XMessage, err error) {
	dlqValues := make(map[string]interface{})
	for k, v := range msg.Values {
		dlqValues[k] = v
	}

	dlqValues["original_message_id"] = msg.ID
	dlqValues["processing_error"] = err.Error()
	dlqValues["failed_at"] = time.Now().Format(time.RFC3339)
	dlqValues["consumer_name"] = rc.config.Consumer.ConsumerName

	if err := rc.redisClient.XAdd(ctx, &redis.XAddArgs{
		Stream: rc.config.Redis.DLQStreamKey,
		Values: dlqValues,
	}).Err(); err != nil {
		log.Printf("Failed to add message to DLQ: %v", err)
	}
}

// claimPendingMessagesLoop periodically claims stale pending messages
func (rc *ReplayConsumer) claimPendingMessagesLoop(ctx context.Context) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			rc.claimPendingMessages(ctx)
		}
	}
}

// claimPendingMessages claims messages that have been idle for too long
func (rc *ReplayConsumer) claimPendingMessages(ctx context.Context) {
	// Get pending messages info
	pending, err := rc.redisClient.XPendingExt(ctx, &redis.XPendingExtArgs{
		Stream: rc.config.Redis.StreamKey,
		Group:  rc.config.Consumer.GroupName,
		Start:  "-",
		End:    "+",
		Count:  100,
	}).Result()

	if err != nil {
		log.Printf("Error getting pending messages: %v", err)
		return
	}

	idleThreshold := 60 * time.Second
	now := time.Now()

	for _, msg := range pending {
		if now.Sub(msg.Idle) > idleThreshold {
			// Claim this message
			claimed, err := rc.redisClient.XClaim(ctx, &redis.XClaimArgs{
				Stream:   rc.config.Redis.StreamKey,
				Group:    rc.config.Consumer.GroupName,
				Consumer: rc.config.Consumer.ConsumerName,
				MinIdle:  idleThreshold,
				Messages: []string{msg.ID},
			}).Result()

			if err != nil {
				log.Printf("Error claiming message %s: %v", msg.ID, err)
				continue
			}

			// Process claimed messages
			for _, claimedMsg := range claimed {
				log.Printf("Claimed stale message: %s", claimedMsg.ID)
				rc.processMessage(ctx, claimedMsg)
			}
		}
	}
}

// updateLagMetric updates the stream lag metric
func (rc *ReplayConsumer) updateLagMetric(ctx context.Context) {
	pending, err := rc.redisClient.XPending(ctx, rc.config.Redis.StreamKey, rc.config.Consumer.GroupName).Result()
	if err != nil {
		return
	}

	metrics.StreamLag.WithLabelValues(rc.config.Consumer.GroupName).Set(float64(pending.Count))
}

// isReservedField checks if a field name is reserved
func isReservedField(field string) bool {
	reserved := []string{"id", "aggregate_type", "aggregate_id", "event_type", "payload", "timestamp", "retry_count", "last_error"}
	for _, r := range reserved {
		if field == r {
			return true
		}
	}
	return false
}

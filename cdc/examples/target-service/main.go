package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"os"

	pb "github.com/SamarthSRao/cdc-replay/proto"
	"google.golang.org/grpc"
)

// OrderEventService is an example target service for order events
type OrderEventService struct {
	pb.UnimplementedEventServiceServer
}

// ProcessEvent handles incoming events
func (s *OrderEventService) ProcessEvent(ctx context.Context, req *pb.EventRequest) (*pb.EventResponse, error) {
	log.Printf("Received event: ID=%s, Type=%s, AggregateType=%s, AggregateID=%s",
		req.EventId, req.EventType, req.AggregateType, req.AggregateId)

	// Parse payload
	var payload map[string]interface{}
	if err := json.Unmarshal(req.Payload, &payload); err != nil {
		log.Printf("Failed to parse payload: %v", err)
		return &pb.EventResponse{
			Success:   false,
			Message:   "Invalid payload format",
			ErrorCode: "INVALID_PAYLOAD",
		}, nil
	}

	log.Printf("Payload: %+v", payload)
	log.Printf("Metadata: %+v", req.Metadata)

	// Simulate event processing
	// In a real application, you would:
	// 1. Validate the event
	// 2. Update your local database/state
	// 3. Trigger business logic
	// 4. Publish domain events if needed

	// Example: Handle different event types
	switch req.EventType {
	case "OrderCreated":
		log.Printf("Processing OrderCreated event for order %s", req.AggregateId)
		// Handle order creation logic
	case "OrderUpdated":
		log.Printf("Processing OrderUpdated event for order %s", req.AggregateId)
		// Handle order update logic
	case "OrderCancelled":
		log.Printf("Processing OrderCancelled event for order %s", req.AggregateId)
		// Handle order cancellation logic
	default:
		log.Printf("Unknown event type: %s", req.EventType)
	}

	return &pb.EventResponse{
		Success: true,
		Message: "Event processed successfully",
	}, nil
}

// ProcessEventBatch handles batch event processing
func (s *OrderEventService) ProcessEventBatch(ctx context.Context, req *pb.EventBatchRequest) (*pb.EventBatchResponse, error) {
	log.Printf("Received batch of %d events", len(req.Events))

	processed := 0
	failed := 0
	var failedEventIds []string

	for _, event := range req.Events {
		resp, err := s.ProcessEvent(ctx, event)
		if err != nil || !resp.Success {
			failed++
			failedEventIds = append(failedEventIds, event.EventId)
			log.Printf("Failed to process event %s: %v", event.EventId, err)
		} else {
			processed++
		}
	}

	return &pb.EventBatchResponse{
		Processed:      int32(processed),
		Failed:         int32(failed),
		FailedEventIds: failedEventIds,
	}, nil
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "50051"
	}

	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterEventServiceServer(grpcServer, &OrderEventService{})

	log.Printf("Order Event Service listening on port %s", port)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}

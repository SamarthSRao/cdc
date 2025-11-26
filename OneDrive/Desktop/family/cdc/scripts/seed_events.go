package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/go-redis/redis/v8"
)

type OrderPayload struct {
	OrderID    string  `json:"order_id"`
	CustomerID string  `json:"customer_id"`
	Amount     float64 `json:"amount"`
	Status     string  `json:"status"`
}

func main() {
	ctx := context.Background()

	client := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
		DB:   0,
	})
	defer client.Close()

	if err := client.Ping(ctx).Err(); err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}

	log.Println("Seeding test events to Redis Stream...")

	events := []struct {
		aggregateType string
		aggregateID   string
		eventType     string
		payload       interface{}
	}{
		{
			aggregateType: "order",
			aggregateID:   "order-001",
			eventType:     "OrderCreated",
			payload: OrderPayload{
				OrderID:    "order-001",
				CustomerID: "customer-123",
				Amount:     99.99,
				Status:     "pending",
			},
		},
		{
			aggregateType: "order",
			aggregateID:   "order-002",
			eventType:     "OrderCreated",
			payload: OrderPayload{
				OrderID:    "order-002",
				CustomerID: "customer-456",
				Amount:     149.99,
				Status:     "pending",
			},
		},
	}

	for i, event := range events {
		payloadBytes, _ := json.Marshal(event.payload)
		eventID := fmt.Sprintf("evt-%d-%d", time.Now().Unix(), i)

		values := map[string]interface{}{
			"id":             eventID,
			"aggregate_type": event.aggregateType,
			"aggregate_id":   event.aggregateID,
			"event_type":     event.eventType,
			"payload":        string(payloadBytes),
			"timestamp":      time.Now().Format(time.RFC3339),
		}

		result, _ := client.XAdd(ctx, &redis.XAddArgs{
			Stream: "outbox:events",
			Values: values,
		}).Result()

		log.Printf("Added event: %s (Stream ID: %s)", eventID, result)
	}

	log.Println("Seeding completed!")
}

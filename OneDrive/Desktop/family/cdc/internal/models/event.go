package models

import (
	"encoding/json"
	"time"
)

// OutboxEvent represents an event from the outbox pattern
type OutboxEvent struct {
	ID            string          `json:"id"`
	AggregateType string          `json:"aggregate_type"`
	AggregateID   string          `json:"aggregate_id"`
	EventType     string          `json:"event_type"`
	Payload       json.RawMessage `json:"payload"`
	Timestamp     time.Time       `json:"timestamp"`
	Metadata      map[string]string `json:"metadata,omitempty"`
}

// ProcessingMetadata tracks event processing state
type ProcessingMetadata struct {
	RetryCount   int       `json:"retry_count"`
	LastError    string    `json:"last_error,omitempty"`
	LastAttempt  time.Time `json:"last_attempt,omitempty"`
	FailedAt     time.Time `json:"failed_at,omitempty"`
	ConsumerName string    `json:"consumer_name,omitempty"`
}

// EventStatus represents the processing status
type EventStatus string

const (
	StatusPending    EventStatus = "pending"
	StatusProcessing EventStatus = "processing"
	StatusProcessed  EventStatus = "processed"
	StatusFailed     EventStatus = "failed"
	StatusDLQ        EventStatus = "dlq"
)

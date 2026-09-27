package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	// EventsProcessed tracks total events processed
	EventsProcessed = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "cdc_events_processed_total",
			Help: "Total number of events processed",
		},
		[]string{"aggregate_type", "status"},
	)

	// EventProcessingDuration tracks event processing latency
	EventProcessingDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "cdc_event_processing_duration_seconds",
			Help:    "Event processing duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"aggregate_type"},
	)

	// EventRetries tracks retry attempts
	EventRetries = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "cdc_event_retries_total",
			Help: "Total number of event retry attempts",
		},
		[]string{"aggregate_type", "retry_count"},
	)

	// DLQEvents tracks events moved to DLQ
	DLQEvents = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "cdc_dlq_events_total",
			Help: "Total number of events moved to DLQ",
		},
		[]string{"aggregate_type", "reason"},
	)

	// StreamLag tracks consumer lag
	StreamLag = promauto.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "cdc_stream_lag",
			Help: "Number of pending messages in the stream",
		},
		[]string{"consumer_group"},
	)

	// GRPCDeliveryDuration tracks gRPC call latency
	GRPCDeliveryDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "cdc_grpc_delivery_duration_seconds",
			Help:    "gRPC delivery duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"aggregate_type", "status"},
	)

	// ActiveConsumers tracks number of active consumers
	ActiveConsumers = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "cdc_active_consumers",
			Help: "Number of active consumers",
		},
	)
)

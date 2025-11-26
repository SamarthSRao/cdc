# CDC Replay Layer - Architecture & Design

## Overview

The CDC Replay Layer is a critical component in a Change Data Capture (CDC) architecture that bridges the gap between the outbox pattern and target applications. It consumes events from Redis Streams and delivers them reliably to downstream services via gRPC.

## Core Components

### 1. Redis Stream Consumer (`internal/consumer/consumer.go`)

**Responsibilities:**
- Consume events from Redis Streams using consumer groups
- Parse and validate event data
- Coordinate event processing and delivery
- Handle failures and retries
- Manage consumer state

**Key Features:**
- **Consumer Groups**: Enables horizontal scaling with automatic load balancing
- **Batch Processing**: Configurable batch size for efficient throughput
- **Pending Message Recovery**: Automatically claims and reprocesses stale messages
- **Graceful Shutdown**: Proper cleanup on termination

### 2. gRPC Client Pool (`internal/grpc/client_pool.go`)

**Responsibilities:**
- Manage gRPC client connections to target services
- Route events to appropriate services based on aggregate type
- Handle connection lifecycle and health checks
- Provide connection pooling and reuse

**Key Features:**
- **Connection Pooling**: Reuses connections for efficiency
- **Keep-Alive**: Maintains healthy connections
- **Health Checks**: Monitors client connectivity
- **Thread-Safe**: Concurrent access support

### 3. Retry & Failure Handling

**Strategy:**
- **Exponential Backoff**: Configurable backoff with multiplier
- **Max Retries**: Prevents infinite retry loops
- **Dead Letter Queue**: Captures permanently failed events
- **Idempotency**: Event IDs enable duplicate detection

**Flow:**
```
Event Processing
     ↓
  Success? ──Yes──→ ACK & Continue
     ↓ No
  Retry < Max? ──Yes──→ Exponential Backoff → Retry
     ↓ No
  Move to DLQ → ACK Original
```

### 4. Metrics & Monitoring (`internal/metrics/metrics.go`)

**Prometheus Metrics:**
- `cdc_events_processed_total`: Counter by aggregate_type and status
- `cdc_event_processing_duration_seconds`: Histogram of processing latency
- `cdc_event_retries_total`: Counter of retry attempts
- `cdc_dlq_events_total`: Counter of DLQ events
- `cdc_stream_lag`: Gauge of pending messages
- `cdc_grpc_delivery_duration_seconds`: Histogram of gRPC latency
- `cdc_active_consumers`: Gauge of active consumers

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                       │
│  (Writes to Outbox Table in Transactional Context)         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Outbox Processor                         │
│  (Polls Outbox Table & Publishes to Redis Stream)          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Redis Stream                            │
│  Stream: outbox:events                                      │
│  Consumer Group: replay-consumers                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Replay Consumer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. Read Batch (XREADGROUP)                           │  │
│  │ 2. Parse Event                                       │  │
│  │ 3. Route to gRPC Client                             │  │
│  │ 4. Deliver via gRPC                                 │  │
│  │ 5. Handle Response                                  │  │
│  │    ├─ Success → ACK                                 │  │
│  │    └─ Failure → Retry or DLQ                        │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Target Services                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Order     │  │   Payment    │  │     User     │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  │  :50051      │  │  :50052      │  │  :50053      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Event Schema

### Redis Stream Message Format

```json
{
  "id": "evt-1732623623-1",
  "aggregate_type": "order",
  "aggregate_id": "order-001",
  "event_type": "OrderCreated",
  "payload": "{\"order_id\":\"order-001\",\"customer_id\":\"customer-123\",\"amount\":99.99}",
  "timestamp": "2024-11-26T12:00:23Z",
  "metadata": {
    "source": "order-service",
    "version": "1.0"
  }
}
```

### gRPC Event Request

```protobuf
message EventRequest {
  string event_id = 1;
  string aggregate_type = 2;
  string aggregate_id = 3;
  string event_type = 4;
  bytes payload = 5;
  google.protobuf.Timestamp timestamp = 6;
  map<string, string> metadata = 7;
}
```

## Scaling Strategy

### Horizontal Scaling

Run multiple consumer instances in the same consumer group:

```bash
# Instance 1
CONSUMER_NAME=consumer-1 ./replay

# Instance 2
CONSUMER_NAME=consumer-2 ./replay

# Instance 3
CONSUMER_NAME=consumer-3 ./replay
```

Redis Streams automatically distributes messages across consumers in the group.

### Vertical Scaling

Adjust configuration parameters:
- `CONSUMER_BATCH_SIZE`: Increase for higher throughput
- `GRPC_TIMEOUT`: Adjust based on target service latency
- `MAX_RETRIES`: Balance between reliability and speed

## Failure Scenarios & Handling

### Scenario 1: Target Service Down

**Detection**: gRPC connection error or timeout

**Handling**:
1. Retry with exponential backoff
2. After max retries, move to DLQ
3. Alert via metrics (high DLQ count)

### Scenario 2: Consumer Crash

**Detection**: Pending messages with high idle time

**Handling**:
1. Pending message claimer detects stale messages (>60s)
2. Claims messages for current consumer
3. Reprocesses claimed messages

### Scenario 3: Redis Connection Loss

**Detection**: Redis client error

**Handling**:
1. Consumer loop continues with error logging
2. Automatic reconnection on next iteration
3. Brief pause before retry

### Scenario 4: Invalid Event Data

**Detection**: Parse error

**Handling**:
1. Log error with event details
2. Move to DLQ immediately (no retries)
3. ACK to prevent reprocessing

## Configuration Best Practices

### Development
```env
CONSUMER_BATCH_SIZE=5
MAX_RETRIES=2
INITIAL_BACKOFF=500ms
GRPC_TIMEOUT=10s
```

### Production
```env
CONSUMER_BATCH_SIZE=50
MAX_RETRIES=5
INITIAL_BACKOFF=1s
MAX_BACKOFF=300s
GRPC_TIMEOUT=30s
```

## Monitoring & Alerting

### Key Metrics to Monitor

1. **Processing Rate**: `rate(cdc_events_processed_total[5m])`
2. **Error Rate**: `rate(cdc_events_processed_total{status="failed"}[5m])`
3. **DLQ Growth**: `rate(cdc_dlq_events_total[5m])`
4. **Consumer Lag**: `cdc_stream_lag`
5. **Processing Latency**: `histogram_quantile(0.95, cdc_event_processing_duration_seconds)`

### Alert Rules

```yaml
- alert: HighErrorRate
  expr: rate(cdc_events_processed_total{status="failed"}[5m]) > 0.1
  
- alert: ConsumerLag
  expr: cdc_stream_lag > 1000
  
- alert: DLQGrowth
  expr: rate(cdc_dlq_events_total[5m]) > 10
```

## Security Considerations

1. **gRPC Security**: Use TLS for production (update client_pool.go)
2. **Redis Auth**: Set REDIS_PASSWORD in production
3. **Network Isolation**: Run in private network
4. **Event Validation**: Validate payloads before processing

## Performance Tuning

### Throughput Optimization

1. **Increase Batch Size**: Higher batch size = better throughput
2. **Multiple Consumers**: Scale horizontally
3. **Connection Pooling**: Reuse gRPC connections
4. **Async Processing**: Consider parallel event processing

### Latency Optimization

1. **Reduce Batch Size**: Lower batch size = lower latency
2. **Decrease Block Time**: More frequent polling
3. **Optimize Target Services**: Faster processing = faster ACK
4. **Local Redis**: Minimize network latency

## Future Enhancements

1. **Batch Delivery**: Use ProcessEventBatch for efficiency
2. **Event Filtering**: Skip certain event types
3. **Event Transformation**: Transform events before delivery
4. **Circuit Breaker**: Prevent cascading failures
5. **Rate Limiting**: Control delivery rate per target
6. **Event Replay**: Reprocess events from specific point
7. **Multi-Stream Support**: Consume from multiple streams
8. **Schema Registry**: Validate event schemas

## Conclusion

This CDC Replay Layer provides a robust, scalable solution for event delivery in microservices architectures. It handles the complexity of reliable message delivery while providing observability and fault tolerance.

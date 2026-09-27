# CDC Replay Service

A production-ready Change Data Capture (CDC) Replay layer that consumes events from Redis Streams and delivers them to target applications via gRPC.

## Features

- ✅ **Redis Stream Consumer** with consumer groups for horizontal scaling
- ✅ **gRPC Delivery** with connection pooling and health checks
- ✅ **Retry Logic** with exponential backoff
- ✅ **Dead Letter Queue (DLQ)** for failed messages
- ✅ **Pending Message Recovery** automatically claims stale messages
- ✅ **Prometheus Metrics** for monitoring and observability
- ✅ **Graceful Shutdown** with proper cleanup
- ✅ **Docker Support** with Docker Compose setup

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Outbox    │────────▶│ Redis Stream │────────▶│   Replay    │
│   Pattern   │         │              │         │  Consumer   │
└─────────────┘         └──────────────┘         └──────┬──────┘
                                                         │
                                                         │ gRPC
                                                         ▼
                                          ┌──────────────────────────┐
                                          │  Target Applications     │
                                          │  - Order Service         │
                                          │  - Payment Service       │
                                          │  - User Service          │
                                          └──────────────────────────┘
```

## Quick Start

### Prerequisites

- Go 1.21+
- Redis 7+
- Protocol Buffers compiler (protoc)
- Docker (optional)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
go mod download
```

3. Generate Protocol Buffers:
```bash
make proto
```

4. Copy environment configuration:
```bash
cp .env.example .env
```

### Running Locally

1. Start Redis:
```bash
make redis-start
```

2. Run the example target service:
```bash
make run-example
```

3. In another terminal, run the replay service:
```bash
make run
```

4. Seed test events:
```bash
make seed-events
```

### Running with Docker

```bash
docker-compose up
```

## Configuration

All configuration is done via environment variables. See `.env.example` for available options.

### Key Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_ADDRESS` | Redis server address | `localhost:6379` |
| `REDIS_STREAM_KEY` | Main event stream key | `outbox:events` |
| `CONSUMER_GROUP_NAME` | Consumer group name | `replay-consumers` |
| `CONSUMER_BATCH_SIZE` | Events per batch | `10` |
| `MAX_RETRIES` | Max retry attempts | `3` |
| `GRPC_TIMEOUT` | gRPC call timeout | `30s` |
| `METRICS_PORT` | Prometheus metrics port | `9090` |

## Monitoring

### Prometheus Metrics

Access metrics at `http://localhost:9090/metrics`

Available metrics:
- `cdc_events_processed_total` - Total events processed
- `cdc_event_processing_duration_seconds` - Processing latency
- `cdc_event_retries_total` - Retry attempts
- `cdc_dlq_events_total` - DLQ events
- `cdc_stream_lag` - Consumer lag
- `cdc_grpc_delivery_duration_seconds` - gRPC latency

### Grafana Dashboard

Access Grafana at `http://localhost:3000` (admin/admin)

## Development

### Project Structure

```
cdc/
├── cmd/
│   └── replay/          # Main application
├── internal/
│   ├── config/          # Configuration
│   ├── consumer/        # Stream consumer
│   ├── grpc/            # gRPC client pool
│   ├── metrics/         # Prometheus metrics
│   └── models/          # Data models
├── proto/               # Protocol Buffers
├── examples/            # Example target service
└── scripts/             # Utility scripts
```

### Building

```bash
make build
```

### Testing

```bash
make test
```

### Linting

```bash
make lint
```

## Scaling

Run multiple consumers in the same consumer group:

```bash
CONSUMER_NAME=consumer-1 go run cmd/replay/main.go &
CONSUMER_NAME=consumer-2 go run cmd/replay/main.go &
CONSUMER_NAME=consumer-3 go run cmd/replay/main.go &
```

Redis Streams will automatically distribute messages across consumers.

## Failure Handling

1. **Retries**: Failed events are retried with exponential backoff
2. **DLQ**: After max retries, events move to Dead Letter Queue
3. **Pending Recovery**: Stale pending messages are automatically reclaimed

## License

MIT

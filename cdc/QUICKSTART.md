# Quick Start Guide

## Step 1: Setup

1. **Install Go dependencies**:
```bash
go mod download
```

2. **Install protoc compiler** (if not already installed):
   - Windows: Download from https://github.com/protocolbuffers/protobuf/releases
   - Add to PATH

3. **Install protoc plugins**:
```bash
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

4. **Generate Protocol Buffers**:
```bash
protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative proto/events.proto
```

## Step 2: Start Redis

Using Docker:
```bash
docker run -d --name redis-cdc -p 6379:6379 redis:7-alpine
```

Or use existing Redis instance.

## Step 3: Configure Environment

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` to match your setup.

## Step 4: Run Target Service (Example)

In terminal 1:
```bash
go run examples/target-service/main.go
```

This starts an example order service on port 50051.

## Step 5: Run Replay Service

In terminal 2:
```bash
go run cmd/replay/main.go
```

## Step 6: Seed Test Events

In terminal 3:
```bash
go run scripts/seed_events.go
```

## Step 7: Monitor

- **Logs**: Check terminal 2 for processing logs
- **Metrics**: Visit http://localhost:9090/metrics
- **Redis**: Use redis-cli to inspect streams

## Verify It's Working

You should see output like:
```
2024/11/26 17:50:23 Starting CDC Replay Service...
2024/11/26 17:50:23 Connected to Redis at localhost:6379
2024/11/26 17:50:23 Initialized gRPC client pool with 3 targets
2024/11/26 17:50:23 Starting consumer 'consumer-12345' in group 'replay-consumers'
2024/11/26 17:50:24 Successfully processed event evt-123 (type: OrderCreated) in 0.05s
```

## Troubleshooting

**Redis connection failed**:
- Ensure Redis is running: `docker ps`
- Check REDIS_ADDRESS in .env

**gRPC delivery failed**:
- Ensure target service is running
- Check GRPC_TARGETS configuration

**No events processing**:
- Verify events exist: `redis-cli XLEN outbox:events`
- Check consumer group: `redis-cli XINFO GROUPS outbox:events`

## Next Steps

1. Implement your own target services
2. Configure production gRPC targets
3. Set up Prometheus + Grafana for monitoring
4. Deploy using Docker Compose

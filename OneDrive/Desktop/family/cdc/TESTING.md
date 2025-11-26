# Testing Guide

## Overview

This guide covers testing strategies for the CDC Replay Service.

## Unit Tests

### Testing Consumer Logic

Create `internal/consumer/consumer_test.go`:

```go
package consumer

import (
	"context"
	"testing"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/stretchr/testify/assert"
)

func TestParseEvent(t *testing.T) {
	consumer := &ReplayConsumer{}
	
	values := map[string]interface{}{
		"id":             "evt-123",
		"aggregate_type": "order",
		"aggregate_id":   "order-001",
		"event_type":     "OrderCreated",
		"payload":        `{"order_id":"order-001"}`,
		"timestamp":      time.Now().Format(time.RFC3339),
	}

	event, err := consumer.parseEvent(values)
	
	assert.NoError(t, err)
	assert.Equal(t, "evt-123", event.ID)
	assert.Equal(t, "order", event.AggregateType)
}

func TestCalculateBackoff(t *testing.T) {
	consumer := &ReplayConsumer{
		config: &config.Config{
			Retry: config.RetryConfig{
				InitialBackoff:    time.Second,
				BackoffMultiplier: 2.0,
				MaxBackoff:        time.Minute,
			},
		},
	}

	tests := []struct {
		retryCount int
		expected   time.Duration
	}{
		{0, time.Second},
		{1, 2 * time.Second},
		{2, 4 * time.Second},
		{10, time.Minute}, // Should cap at MaxBackoff
	}

	for _, tt := range tests {
		result := consumer.calculateBackoff(tt.retryCount)
		assert.Equal(t, tt.expected, result)
	}
}
```

### Testing gRPC Client Pool

Create `internal/grpc/client_pool_test.go`:

```go
package grpc

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestNewClientPool(t *testing.T) {
	config := map[string]string{
		"order": "localhost:50051",
	}

	pool, err := NewClientPool(config, 30*time.Second)
	
	assert.NoError(t, err)
	assert.NotNil(t, pool)
	
	defer pool.Close()
}

func TestGetClient(t *testing.T) {
	config := map[string]string{
		"order": "localhost:50051",
	}

	pool, _ := NewClientPool(config, 30*time.Second)
	defer pool.Close()

	client, err := pool.GetClient("order")
	assert.NoError(t, err)
	assert.NotNil(t, client)

	_, err = pool.GetClient("unknown")
	assert.Error(t, err)
}
```

## Integration Tests

### End-to-End Test

Create `test/integration_test.go`:

```go
package test

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/stretchr/testify/assert"
)

func TestEventProcessingFlow(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration test")
	}

	ctx := context.Background()

	// Setup Redis
	client := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
	defer client.Close()

	// Add test event
	payload, _ := json.Marshal(map[string]interface{}{
		"order_id": "test-001",
		"amount":   99.99,
	})

	values := map[string]interface{}{
		"id":             "test-evt-001",
		"aggregate_type": "order",
		"aggregate_id":   "order-001",
		"event_type":     "OrderCreated",
		"payload":        string(payload),
		"timestamp":      time.Now().Format(time.RFC3339),
	}

	_, err := client.XAdd(ctx, &redis.XAddArgs{
		Stream: "outbox:events",
		Values: values,
	}).Result()

	assert.NoError(t, err)

	// Wait for processing
	time.Sleep(2 * time.Second)

	// Verify event was processed (check logs or metrics)
	// This would require additional instrumentation
}
```

## Load Testing

### Using k6

Create `test/load_test.js`:

```javascript
import { check } from 'k6';
import redis from 'k6/x/redis';

export let options = {
  stages: [
    { duration: '1m', target: 100 },  // Ramp up
    { duration: '3m', target: 100 },  // Steady state
    { duration: '1m', target: 0 },    // Ramp down
  ],
};

const client = redis.newClient('redis://localhost:6379');

export default function () {
  const event = {
    id: `evt-${Date.now()}-${__VU}`,
    aggregate_type: 'order',
    aggregate_id: `order-${__VU}`,
    event_type: 'OrderCreated',
    payload: JSON.stringify({
      order_id: `order-${__VU}`,
      amount: 99.99,
    }),
    timestamp: new Date().toISOString(),
  };

  client.xadd('outbox:events', '*', event);
}
```

Run with:
```bash
k6 run test/load_test.js
```

## Manual Testing

### 1. Test Event Seeding

```bash
go run scripts/seed_events.go
```

Verify in Redis:
```bash
redis-cli XLEN outbox:events
redis-cli XRANGE outbox:events - + COUNT 5
```

### 2. Test Consumer Processing

Start consumer:
```bash
go run cmd/replay/main.go
```

Watch logs for processing messages.

### 3. Test Retry Logic

Stop target service and seed events:
```bash
# Terminal 1: Stop target service (Ctrl+C)

# Terminal 2: Seed events
go run scripts/seed_events.go

# Terminal 3: Watch consumer logs
# Should see retry attempts with backoff
```

### 4. Test DLQ

Configure low max retries:
```bash
MAX_RETRIES=1 go run cmd/replay/main.go
```

Seed events with target service down. Check DLQ:
```bash
redis-cli XLEN outbox:dlq
redis-cli XRANGE outbox:dlq - + COUNT 5
```

### 5. Test Metrics

Access metrics endpoint:
```bash
curl http://localhost:9090/metrics | grep cdc_
```

### 6. Test Horizontal Scaling

Run multiple consumers:
```bash
# Terminal 1
CONSUMER_NAME=consumer-1 go run cmd/replay/main.go

# Terminal 2
CONSUMER_NAME=consumer-2 go run cmd/replay/main.go

# Terminal 3
CONSUMER_NAME=consumer-3 go run cmd/replay/main.go
```

Seed many events and watch distribution:
```bash
redis-cli XINFO CONSUMERS outbox:events replay-consumers
```

## Performance Benchmarks

### Benchmark Event Parsing

Create `internal/consumer/benchmark_test.go`:

```go
package consumer

import (
	"testing"
	"time"
)

func BenchmarkParseEvent(b *testing.B) {
	consumer := &ReplayConsumer{}
	
	values := map[string]interface{}{
		"id":             "evt-123",
		"aggregate_type": "order",
		"aggregate_id":   "order-001",
		"event_type":     "OrderCreated",
		"payload":        `{"order_id":"order-001","amount":99.99}`,
		"timestamp":      time.Now().Format(time.RFC3339),
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		consumer.parseEvent(values)
	}
}
```

Run benchmarks:
```bash
go test -bench=. -benchmem ./internal/consumer/
```

## Continuous Integration

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'
      
      - name: Install dependencies
        run: go mod download
      
      - name: Run tests
        run: go test -v -race -coverprofile=coverage.out ./...
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.out
```

## Test Coverage

Generate coverage report:
```bash
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out -o coverage.html
```

View in browser:
```bash
open coverage.html  # macOS
start coverage.html # Windows
```

## Monitoring Tests

### Prometheus Metrics Test

```bash
# Start service
go run cmd/replay/main.go &

# Seed events
go run scripts/seed_events.go

# Check metrics
curl -s http://localhost:9090/metrics | grep cdc_events_processed_total

# Should show processed events
```

## Troubleshooting Tests

### Redis Connection Issues

```bash
# Check Redis is running
redis-cli ping

# Check Redis logs
docker logs redis-cdc
```

### gRPC Connection Issues

```bash
# Check target service is running
netstat -an | grep 50051

# Test gRPC connection
grpcurl -plaintext localhost:50051 list
```

## Best Practices

1. **Isolate Tests**: Use separate Redis databases for tests
2. **Clean Up**: Always clean up test data
3. **Mock External Services**: Use mocks for gRPC clients in unit tests
4. **Test Edge Cases**: Invalid data, network failures, etc.
5. **Monitor Performance**: Regular benchmark runs
6. **CI/CD Integration**: Automated testing on every commit

## Next Steps

1. Add more unit tests for edge cases
2. Implement contract tests for gRPC
3. Add chaos engineering tests
4. Set up automated load testing
5. Create test data generators

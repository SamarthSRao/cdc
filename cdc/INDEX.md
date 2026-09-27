# 📚 CDC Replay Service - Documentation Index

Welcome to the CDC Replay Service documentation! This index will help you navigate all the documentation and get started quickly.

## 🎯 Start Here

**New to the project?** Start with these documents in order:

1. **[README.md](README.md)** - Project overview and features
2. **[QUICKSTART.md](QUICKSTART.md)** - Get up and running in 5 minutes
3. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project summary

## 📖 Core Documentation

### Architecture & Design
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed architecture, data flow, and design decisions
  - Core components explanation
  - Event schema and formats
  - Scaling strategies
  - Failure handling scenarios
  - Performance tuning guide

### Testing
- **[TESTING.md](TESTING.md)** - Comprehensive testing guide
  - Unit testing examples
  - Integration testing
  - Load testing with k6
  - Manual testing procedures
  - CI/CD setup

## 🚀 Getting Started

### Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `go mod download` |
| Start Redis | `docker run -d --name redis-cdc -p 6379:6379 redis:7-alpine` |
| Run target service | `go run examples/target-service/main.go` |
| Run replay service | `go run cmd/replay/main.go` |
| Seed test events | `go run scripts/seed_events.go` |
| View metrics | `curl http://localhost:9090/metrics` |
| Run tests | `go test ./...` |
| Build binary | `make build` |
| Docker Compose | `docker-compose up` |

### Configuration Files

- **[.env.example](.env.example)** - Environment variable template
- **[docker-compose.yml](docker-compose.yml)** - Multi-service Docker setup
- **[Dockerfile](Dockerfile)** - Container build configuration
- **[Makefile](Makefile)** - Build automation commands
- **[prometheus.yml](prometheus.yml)** - Prometheus configuration

## 🏗️ Project Structure

```
cdc/
├── 📄 Documentation
│   ├── README.md              # Main documentation
│   ├── QUICKSTART.md          # Quick start guide
│   ├── ARCHITECTURE.md        # Architecture details
│   ├── TESTING.md             # Testing guide
│   ├── PROJECT_SUMMARY.md     # Project summary
│   └── INDEX.md               # This file
│
├── 💻 Source Code
│   ├── cmd/replay/            # Main application
│   ├── internal/
│   │   ├── config/            # Configuration
│   │   ├── consumer/          # Stream consumer
│   │   ├── grpc/              # gRPC client pool
│   │   ├── metrics/           # Prometheus metrics
│   │   └── models/            # Data models
│   └── proto/                 # Protocol Buffers
│
├── 📝 Examples
│   └── examples/target-service/  # Example gRPC service
│
├── 🔧 Scripts
│   └── scripts/seed_events.go    # Test event seeder
│
└── 🐳 Deployment
    ├── Dockerfile
    ├── docker-compose.yml
    └── prometheus.yml
```

## 🔑 Key Concepts

### Redis Streams
- **Stream**: Append-only log of events (`outbox:events`)
- **Consumer Group**: Enables multiple consumers to share work
- **Pending Messages**: Messages being processed but not yet ACKed
- **DLQ**: Dead Letter Queue for failed messages

### Event Processing
1. **Read**: Consumer reads batch from stream
2. **Parse**: Extract event data from Redis message
3. **Deliver**: Send to target service via gRPC
4. **ACK**: Acknowledge successful processing
5. **Retry**: Handle failures with exponential backoff

### Monitoring
- **Prometheus**: Metrics collection
- **Grafana**: Visualization (optional)
- **Metrics Endpoint**: `http://localhost:9090/metrics`

## 📊 Architecture Diagram

![CDC Replay Architecture](cdc_replay_architecture.png)

The system follows this flow:
1. Application → Outbox Table
2. Outbox Processor → Redis Stream
3. Replay Consumer → gRPC Clients
4. gRPC Clients → Target Services

## 🎓 Learning Path

### Beginner
1. Read [README.md](README.md)
2. Follow [QUICKSTART.md](QUICKSTART.md)
3. Run the example locally
4. Explore the code in `cmd/replay/main.go`

### Intermediate
1. Study [ARCHITECTURE.md](ARCHITECTURE.md)
2. Understand consumer groups and scaling
3. Implement your own target service
4. Configure for your use case

### Advanced
1. Review [TESTING.md](TESTING.md)
2. Implement custom retry strategies
3. Add monitoring dashboards
4. Deploy to production

## 🔍 Common Tasks

### Development
```bash
# Run locally
make run

# Run with custom config
CONSUMER_BATCH_SIZE=20 make run

# Build binary
make build

# Run tests
make test

# Generate proto
make proto
```

### Debugging
```bash
# Check Redis stream
redis-cli XINFO STREAM outbox:events

# Check consumer group
redis-cli XINFO GROUPS outbox:events

# Check pending messages
redis-cli XPENDING outbox:events replay-consumers

# View DLQ
redis-cli XRANGE outbox:dlq - +
```

### Monitoring
```bash
# View metrics
curl http://localhost:9090/metrics | grep cdc_

# Check processing rate
curl -s http://localhost:9090/metrics | grep cdc_events_processed_total

# Check lag
curl -s http://localhost:9090/metrics | grep cdc_stream_lag
```

## 🐛 Troubleshooting

### Issue: Events not processing
**Solution**: Check [TESTING.md](TESTING.md) → Manual Testing → Test Event Seeding

### Issue: gRPC connection failed
**Solution**: Check [ARCHITECTURE.md](ARCHITECTURE.md) → Failure Scenarios

### Issue: High DLQ count
**Solution**: Check [ARCHITECTURE.md](ARCHITECTURE.md) → Monitoring & Alerting

## 📞 Support

### Documentation
- All documentation is in Markdown format
- Code examples are tested and working
- Configuration is environment-based

### Code Structure
- Clean architecture with separation of concerns
- Comprehensive error handling
- Production-ready patterns

## 🎯 Next Steps

After reviewing the documentation:

1. **Try it out**: Follow [QUICKSTART.md](QUICKSTART.md)
2. **Understand it**: Read [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Customize it**: Modify for your use case
4. **Test it**: Use [TESTING.md](TESTING.md) guide
5. **Deploy it**: Use Docker Compose or Kubernetes

## 📝 Contributing

When adding new features:
1. Update relevant documentation
2. Add tests (see [TESTING.md](TESTING.md))
3. Update metrics if needed
4. Document configuration changes

## 🏆 Best Practices

✅ **DO:**
- Monitor metrics regularly
- Test with realistic load
- Use consumer groups for scaling
- Handle failures gracefully
- Keep configuration in environment

❌ **DON'T:**
- Ignore DLQ growth
- Skip error handling
- Hardcode configuration
- Run without monitoring
- Deploy without testing

---

**Happy coding! 🚀**

For questions or issues, refer to the specific documentation sections above.

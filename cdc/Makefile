.PHONY: proto build run test clean docker-build docker-run

# Generate protobuf code
proto:
	protoc --go_out=. --go_opt=paths=source_relative \
		--go-grpc_out=. --go-grpc_opt=paths=source_relative \
		proto/events.proto

# Build the replay service
build:
	go build -o bin/replay cmd/replay/main.go

# Build the example target service
build-example:
	go build -o bin/target-service examples/target-service/main.go

# Run the replay service
run:
	go run cmd/replay/main.go

# Run the example target service
run-example:
	PORT=50051 go run examples/target-service/main.go

# Run tests
test:
	go test -v -race ./...

# Run tests with coverage
test-coverage:
	go test -v -race -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

# Clean build artifacts
clean:
	rm -rf bin/
	rm -f coverage.out coverage.html

# Install dependencies
deps:
	go mod download
	go mod tidy

# Format code
fmt:
	go fmt ./...

# Lint code
lint:
	golangci-lint run

# Docker build
docker-build:
	docker build -t cdc-replay:latest .

# Docker run
docker-run:
	docker run --env-file .env cdc-replay:latest

# Start Redis for local development
redis-start:
	docker run -d --name redis-cdc -p 6379:6379 redis:7-alpine

# Stop Redis
redis-stop:
	docker stop redis-cdc
	docker rm redis-cdc

# View Redis streams
redis-view:
	docker exec -it redis-cdc redis-cli XINFO STREAM outbox:events

# View DLQ
redis-view-dlq:
	docker exec -it redis-cdc redis-cli XINFO STREAM outbox:dlq

# Seed test events
seed-events:
	go run scripts/seed_events.go

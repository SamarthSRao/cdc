package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/SamarthSRao/cdc-replay/internal/config"
	"github.com/SamarthSRao/cdc-replay/internal/consumer"
	grpcpool "github.com/SamarthSRao/cdc-replay/internal/grpc"
	"github.com/go-redis/redis/v8"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func main() {
	log.Println("Starting CDC Replay Service...")

	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Setup context with cancellation
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Initialize Redis client
	redisClient := redis.NewClient(&redis.Options{
		Addr:     cfg.Redis.Address,
		Password: cfg.Redis.Password,
		DB:       cfg.Redis.DB,
	})
	defer redisClient.Close()

	// Test Redis connection
	if err := redisClient.Ping(ctx).Err(); err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	log.Printf("Connected to Redis at %s", cfg.Redis.Address)

	// Initialize gRPC client pool
	grpcPool, err := grpcpool.NewClientPool(cfg.GRPC.Targets, cfg.GRPC.Timeout)
	if err != nil {
		log.Fatalf("Failed to create gRPC client pool: %v", err)
	}
	defer grpcPool.Close()
	log.Printf("Initialized gRPC client pool with %d targets", len(cfg.GRPC.Targets))

	// Health check gRPC clients
	healthResults := grpcPool.HealthCheck(ctx)
	for aggregateType, healthErr := range healthResults {
		if healthErr != nil {
			log.Printf("WARNING: gRPC client for '%s' health check failed: %v", aggregateType, healthErr)
		} else {
			log.Printf("gRPC client for '%s' is healthy", aggregateType)
		}
	}

	// Create replay consumer
	replayConsumer := consumer.NewReplayConsumer(redisClient, grpcPool, cfg)

	// Initialize consumer group
	if err := replayConsumer.InitConsumerGroup(ctx); err != nil {
		log.Fatalf("Failed to initialize consumer group: %v", err)
	}

	// Start metrics server if enabled
	if cfg.Metrics.Enabled {
		go startMetricsServer(cfg.Metrics.Port)
	}

	// Setup graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	// Start consuming in a goroutine
	errChan := make(chan error, 1)
	go func() {
		errChan <- replayConsumer.StartConsuming(ctx)
	}()

	// Wait for shutdown signal or error
	select {
	case <-sigChan:
		log.Println("Received shutdown signal")
		cancel()
	case err := <-errChan:
		if err != nil && err != context.Canceled {
			log.Printf("Consumer error: %v", err)
		}
	}

	log.Println("CDC Replay Service stopped")
}

func startMetricsServer(port int) {
	http.Handle("/metrics", promhttp.Handler())
	addr := fmt.Sprintf(":%d", port)
	log.Printf("Starting metrics server on %s", addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Printf("Metrics server error: %v", err)
	}
}

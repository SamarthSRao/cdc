package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

// Config holds all configuration for the replay service
type Config struct {
	Redis    RedisConfig
	Consumer ConsumerConfig
	GRPC     GRPCConfig
	Retry    RetryConfig
	Metrics  MetricsConfig
}

// RedisConfig holds Redis connection settings
type RedisConfig struct {
	Address      string
	Password     string
	DB           int
	StreamKey    string
	DLQStreamKey string
}

// ConsumerConfig holds consumer group settings
type ConsumerConfig struct {
	GroupName    string
	ConsumerName string
	BatchSize    int64
	BlockTime    time.Duration
}

// GRPCConfig holds gRPC client configurations
type GRPCConfig struct {
	Targets map[string]string // aggregate_type -> grpc_address
	Timeout time.Duration
}

// RetryConfig holds retry and failure handling settings
type RetryConfig struct {
	MaxRetries      int
	InitialBackoff  time.Duration
	MaxBackoff      time.Duration
	BackoffMultiplier float64
}

// MetricsConfig holds metrics server settings
type MetricsConfig struct {
	Enabled bool
	Port    int
}

// LoadConfig loads configuration from environment variables
func LoadConfig() (*Config, error) {
	redisDB, _ := strconv.Atoi(getEnv("REDIS_DB", "0"))
	batchSize, _ := strconv.ParseInt(getEnv("CONSUMER_BATCH_SIZE", "10"), 10, 64)
	blockTime, _ := time.ParseDuration(getEnv("CONSUMER_BLOCK_TIME", "5s"))
	grpcTimeout, _ := time.ParseDuration(getEnv("GRPC_TIMEOUT", "30s"))
	maxRetries, _ := strconv.Atoi(getEnv("MAX_RETRIES", "3"))
	initialBackoff, _ := time.ParseDuration(getEnv("INITIAL_BACKOFF", "1s"))
	maxBackoff, _ := time.ParseDuration(getEnv("MAX_BACKOFF", "60s"))
	backoffMultiplier, _ := strconv.ParseFloat(getEnv("BACKOFF_MULTIPLIER", "2.0"), 64)
	metricsEnabled, _ := strconv.ParseBool(getEnv("METRICS_ENABLED", "true"))
	metricsPort, _ := strconv.Atoi(getEnv("METRICS_PORT", "9090"))

	config := &Config{
		Redis: RedisConfig{
			Address:      getEnv("REDIS_ADDRESS", "localhost:6379"),
			Password:     getEnv("REDIS_PASSWORD", ""),
			DB:           redisDB,
			StreamKey:    getEnv("REDIS_STREAM_KEY", "outbox:events"),
			DLQStreamKey: getEnv("REDIS_DLQ_STREAM_KEY", "outbox:dlq"),
		},
		Consumer: ConsumerConfig{
			GroupName:    getEnv("CONSUMER_GROUP_NAME", "replay-consumers"),
			ConsumerName: getEnv("CONSUMER_NAME", fmt.Sprintf("consumer-%d", os.Getpid())),
			BatchSize:    batchSize,
			BlockTime:    blockTime,
		},
		GRPC: GRPCConfig{
			Targets: parseGRPCTargets(),
			Timeout: grpcTimeout,
		},
		Retry: RetryConfig{
			MaxRetries:        maxRetries,
			InitialBackoff:    initialBackoff,
			MaxBackoff:        maxBackoff,
			BackoffMultiplier: backoffMultiplier,
		},
		Metrics: MetricsConfig{
			Enabled: metricsEnabled,
			Port:    metricsPort,
		},
	}

	return config, nil
}

// parseGRPCTargets parses GRPC_TARGETS env var
// Format: "order:localhost:50051,payment:localhost:50052,user:localhost:50053"
func parseGRPCTargets() map[string]string {
	targets := make(map[string]string)
	targetsStr := getEnv("GRPC_TARGETS", "")
	
	if targetsStr == "" {
		// Default targets for development
		targets["order"] = "localhost:50051"
		targets["payment"] = "localhost:50052"
		targets["user"] = "localhost:50053"
		return targets
	}

	// Parse comma-separated targets
	// TODO: Implement proper parsing
	return targets
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

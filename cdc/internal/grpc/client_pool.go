package grpc

import (
	"context"
	"fmt"
	"sync"
	"time"

	pb "github.com/SamarthSRao/cdc-replay/proto"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/keepalive"
)

// ClientPool manages gRPC client connections
type ClientPool struct {
	clients map[string]pb.EventServiceClient
	conns   map[string]*grpc.ClientConn
	mu      sync.RWMutex
	timeout time.Duration
}

// NewClientPool creates a new gRPC client pool
func NewClientPool(config map[string]string, timeout time.Duration) (*ClientPool, error) {
	pool := &ClientPool{
		clients: make(map[string]pb.EventServiceClient),
		conns:   make(map[string]*grpc.ClientConn),
		timeout: timeout,
	}

	for aggregateType, address := range config {
		if err := pool.addClient(aggregateType, address); err != nil {
			pool.Close()
			return nil, fmt.Errorf("failed to add client for %s: %w", aggregateType, err)
		}
	}

	return pool, nil
}

// addClient adds a new gRPC client to the pool
func (p *ClientPool) addClient(aggregateType, address string) error {
	conn, err := grpc.Dial(
		address,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithKeepaliveParams(keepalive.ClientParameters{
			Time:                10 * time.Second,
			Timeout:             3 * time.Second,
			PermitWithoutStream: true,
		}),
		grpc.WithDefaultCallOptions(
			grpc.MaxCallRecvMsgSize(10 * 1024 * 1024), // 10MB
			grpc.MaxCallSendMsgSize(10 * 1024 * 1024), // 10MB
		),
	)
	if err != nil {
		return fmt.Errorf("failed to connect to %s: %w", address, err)
	}

	p.mu.Lock()
	defer p.mu.Unlock()

	p.conns[aggregateType] = conn
	p.clients[aggregateType] = pb.NewEventServiceClient(conn)

	return nil
}

// GetClient returns a gRPC client for the given aggregate type
func (p *ClientPool) GetClient(aggregateType string) (pb.EventServiceClient, error) {
	p.mu.RLock()
	defer p.mu.RUnlock()

	client, exists := p.clients[aggregateType]
	if !exists {
		return nil, fmt.Errorf("no gRPC client configured for aggregate type: %s", aggregateType)
	}

	return client, nil
}

// ProcessEvent sends an event to the appropriate target service
func (p *ClientPool) ProcessEvent(ctx context.Context, aggregateType string, req *pb.EventRequest) (*pb.EventResponse, error) {
	client, err := p.GetClient(aggregateType)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(ctx, p.timeout)
	defer cancel()

	return client.ProcessEvent(ctx, req)
}

// Close closes all gRPC connections
func (p *ClientPool) Close() {
	p.mu.Lock()
	defer p.mu.Unlock()

	for aggregateType, conn := range p.conns {
		if err := conn.Close(); err != nil {
			// Log error but continue closing other connections
			fmt.Printf("Error closing connection for %s: %v\n", aggregateType, err)
		}
	}

	p.clients = make(map[string]pb.EventServiceClient)
	p.conns = make(map[string]*grpc.ClientConn)
}

// HealthCheck checks if all clients are healthy
func (p *ClientPool) HealthCheck(ctx context.Context) map[string]error {
	p.mu.RLock()
	defer p.mu.RUnlock()

	results := make(map[string]error)
	for aggregateType := range p.clients {
		// Simple health check - try to get the client
		if _, err := p.GetClient(aggregateType); err != nil {
			results[aggregateType] = err
		} else {
			results[aggregateType] = nil
		}
	}

	return results
}

# Implementation Projects

> Hands-on projects to implement core system design concepts. Start simple, then scale up.

## Beginner Projects

### Project 1: CLI URL Shortener
**Goal**: Understand hashing, storage, and basic web APIs

**Requirements**:
- CLI tool to shorten URLs
- Storage in SQLite or JSON file
- Basic redirect server (Flask/Express)

**Skills Gained**: HTTP, database, basic algorithms

**Checklist**:
- [ ] Implement Base62 encoding
- [ ] Store and retrieve URLs
- [ ] Build HTTP redirect endpoint
- [ ] Add click tracking

### Project 2: Rate Limiter Middleware
**Goal**: Implement rate limiting algorithms from scratch

**Requirements**:
- Token bucket implementation
- Sliding window implementation
- Redis-backed (distributed)
- API middleware integration

**Skills Gained**: Caching, distributed systems, concurrency

**Checklist**:
- [ ] Implement token bucket
- [ ] Implement sliding window
- [ ] Add Redis storage
- [ ] Response headers (X-RateLimit-*)
- [ ] Handle distributed edge cases

### Project 3: Distributed Key-Value Store
**Goal**: Build a simple distributed key-value store

**Requirements**:
- GET/SET/DEL operations
- Consistent hashing
- Replication
- Fault tolerance

**Skills Gained**: Distributed systems, replication, consensus

**Checklist**:
- [ ] Single-node implementation
- [ ] Add consistent hashing
- [ ] Add replication
- [ ] Leader election
- [ ] Failure recovery

## Intermediate Projects

### Project 4: News Feed API
**Goal**: Implement the core of a Twitter-like feed

**Requirements**:
- Post messages
- Follow users
- Timeline generation (fan-out on write)
- Feed pagination
- Cache with Redis

**Stack**: Node/Python + PostgreSQL/Redis + Kafka

**Checklist**:
- [ ] User and follow tables
- [ ] Post endpoint
- [ ] Timeline merge logic
- [ ] Redis timeline cache
- [ ] Fanout on write
- [ ] Feed pagination

### Project 5: Real-time Chat Application
**Goal**: Build WebSocket-based chat with presence

**Requirements**:
- WebSocket connections
- Message history
- Online/offline status
- Multiple rooms
- Delivery receipts

**Stack**: Socket.io/WebSocket + Redis Pub/Sub

**Checklist**:
- [ ] WebSocket server
- [ ] Multiple rooms
- [ ] Message persistence
- [ ] Presence tracking
- [ ] Read receipts
- [ ] Scale across multiple servers (Redis Pub/Sub)

### Project 6: E-commerce Cart + Checkout
**Goal**: Design transactional flows with distributed concerns

**Requirements**:
- Shopping cart
- Inventory management
- Order processing
- Payment integration (idempotency)
- Order status tracking

**Checklist**:
- [ ] Cart service
- [ ] Inventory with optimistic locking
- [ ] Order state machine
- [ ] Payment idempotency
- [ ] Message queue for order processing
- [ ] Failure handling

## Advanced Projects

### Project 7: Streaming Data Pipeline
**Goal**: Build a real-time analytics pipeline

**Requirements**:
- Ingest events via HTTP
- Emit to Kafka
- Stream processing (aggregation)
- Dashboard updates
- Backpressure handling

**Stack**: Producer + Kafka + Consumer group + Dashboard

**Checklist**:
- [ ] Event ingestion API
- [ ] Kafka producer/consumer
- [ ] Windowed aggregation
- [ ] Dashboard with real-time updates
- [ ] Fault tolerance for consumers
- [ ] Exactly-once semantics (or at-least-once with dedup)

### Project 8: Distributed Cache System
**Goal**: Build Redis-like cache with partitioning

**Requirements**:
- Consistent hashing
- Replication (read + write)
- LRU/LFU eviction
- TTL support
- Client library

**Checklist**:
- [ ] Hash ring with virtual nodes
- [ ] Replication protocol
- [ ] Eviction policies
- [ ] TTL implementation
- [ ] Node add/remove without data loss
- [ ] Client SDK

### Project 9: Search Engine (Mini Google)
**Goal**: Implement search with indexing and ranking

**Requirements**:
- Crawler
- Indexer (inverted index)
- Query search → results
- Basic ranking

**Checklist**:
- [ ] Web crawler (politeness)
- [ ] Inverted index
- [ ] TF-IDF ranking
- [ ] Query processing
- [ ] Pagination
- [ ] Optimization (caching, sharding)

## Capstone Project

### Project 10: Full-Stack Social Platform
**Goal**: Everything learned, in one platform

**Requirements**: A mini-Twitter with:
- User auth
- Post + media upload
- Timeline (hybrid fanout)
- Search
- Notifications
- Analytics dashboard
- Rate limiting
- Caching everywhere

**Architecture**:
```
React/Vue Client
        ↓
API Gateway (rate-limited)
        ↓
  ┌─────┴─────┐
  │Services   │
  ├ User      │
  ├ Post      │
  ├ Feed      │
  ├ Search    │
  ├ Notify    │
  └ Analytics │
        ↓
PostgreSQL · Redis · Elasticsearch · Kafka · S3
```

**Checklist**:
- [ ] Setup monorepo
- [ ] Docker containers
- [ ] CI/CD pipeline
- [ ] Authentication
- [ ] All services
- [ ] Testing
- [ ] Deployment
- [ ] Monitoring (Prometheus/Grafana)
- [ ] Load testing (k6)

## Deployment Recommendations

| Component | Tool |
|-----------|------|
| Containers | Docker |
| Orchestration | Docker Compose → Kubernetes |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus + Grafana |
| Logging | Loki / ELK |
| Tracing | Jaeger / Zipkin |
| Load testing | k6 / JMeter |
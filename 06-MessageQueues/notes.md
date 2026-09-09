# Message Queues - Detailed Notes

## Kafka vs RabbitMQ

### Apache Kafka
- **Architecture**: Distributed log
- **Throughput**: Millions of messages/sec
- **Storage**: Persistent log
- **Ordering**: Per partition
- **Use Cases**: Event streaming, log aggregation, data pipeline

### RabbitMQ
- **Architecture**: Message broker
- **Throughput**: Thousands of messages/sec
- **Storage**: In-memory (with persistence)
- **Ordering**: Per queue
- **Use Cases**: Task queues, RPC, complex routing

## Event Sourcing

Store all changes as a sequence of events instead of current state.

### Benefits:
- Complete audit trail
- Temporal queries
- Event replay
- Decoupled services

### Challenges:
- Event versioning
- Schema evolution
- Query complexity

## CQRS (Command Query Responsibility Segregation)

Separate read and write models for better scalability.

### Benefits:
- Independent scaling
- Optimized data models
- Better performance

### Challenges:
- Eventual consistency
- Complexity
- Data synchronization

## Message Ordering

### Strict Ordering
- Single partition/queue
- Sequential processing
- Lower throughput

### Partial Ordering
- Partition by key
- Order within partition
- Higher throughput

### No Ordering
- Independent consumers
- Maximum throughput
- Simpler implementation

## Dead Letter Queues

Store messages that fail processing after max retries.

### Benefits:
- Prevent message loss
- Enable debugging
- Separate error handling

### Implementation:
- Configure retry count
- Move to DLQ on failure
- Monitor and alert

## Exactly-Once Delivery

### Challenges:
- Network failures
- Consumer crashes
- Duplicate messages

### Solutions:
- Idempotent consumers
- Transactional outbox
- Kafka transactions
- Deduplication

## Resources

- [Kafka vs RabbitMQ](https://www.confluent.io/kafka-vs-rabbitmq/)
- [Event Sourcing Pattern](https://microservices.io/patterns/data/event-sourcing.html)
- [CQRS Pattern](https://microservices.io/patterns/cqrs.html)

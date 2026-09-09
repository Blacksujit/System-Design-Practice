# Message Queues & Streaming

## What are Message Queues?

Message queues enable asynchronous communication between components by storing messages in a queue until they are processed.

## Key Concepts

### Producer
- Creates and sends messages
- Doesn't wait for processing
- Can send to multiple queues

### Consumer
- Receives and processes messages
- Can run independently
- Can scale horizontally

### Queue
- Stores messages temporarily
- Ensures message delivery
- Handles ordering and durability

## Message Queue Patterns

### Point-to-Point
- One message, one consumer
- Simple task distribution
- Example: Job queues

### Publish-Subscribe
- One message, multiple consumers
- Event broadcasting
- Example: News feeds

### Request-Reply
- Send request, wait for reply
- Correlation ID for matching
- Example: RPC calls

## Popular Message Queues

### Apache Kafka
- Distributed streaming platform
- High throughput
- Horizontal scaling
- Event sourcing support

### RabbitMQ
- AMQP protocol
- Flexible routing
- Message acknowledgment
- Easy to use

### Amazon SQS
- Fully managed service
- Standard and FIFO queues
- Auto-scaling
- Pay per message

### Redis Pub/Sub
- In-memory messaging
- Low latency
- Simple to implement
- No persistence by default

## Message Queue Use Cases

1. **Decoupling Services**: Reduce dependencies
2. **Load Leveling**: Handle traffic spikes
3. **Asynchronous Processing**: Background jobs
4. **Event-Driven Architecture**: React to events
5. **Data Pipeline**: ETL processes

## Resources

- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
- [Designing Event-Driven Systems](https://www.confluent.io/designing-event-driven-systems/)
- [AWS SQS Documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html)

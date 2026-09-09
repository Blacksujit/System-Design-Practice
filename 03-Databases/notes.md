# Databases - Detailed Notes

## Database Selection Guide

### Use PostgreSQL when:
- Complex queries and joins needed
- ACID compliance required
- Structured data with relationships
- Need for advanced indexing

### Use MongoDB when:
- Flexible schema required
- Document-based storage fits
- Horizontal scaling needed
- Rapid development

### Use Redis when:
- High-performance caching
- Session storage
- Real-time leaderboards
- Pub/Sub messaging

### Use Cassandra when:
- Write-heavy workloads
- Linear scalability needed
- High availability required
- Time-series data

### Use DynamoDB when:
- Serverless architecture
- Predictable performance
- Auto-scaling needed
- AWS ecosystem integration

## Data Modeling Patterns

### Single Table Design (DynamoDB)
- All data in one table
- Composite primary key
- Minimize round trips
- Denormalization

### Embedded Documents (MongoDB)
- Nested documents
- Reduces JOINs
- Data locality
- May lead to duplication

### Referenced Documents
- Normalized data
- Uses references/IDs
- Consistency over performance
- More complex queries

## Consistency Models

### Strong Consistency
- Read after write guarantee
- Higher latency
- Lower availability

### Eventual Consistency
- Data will be consistent eventually
- Lower latency
- Higher availability

### Causal Consistency
- Causally related operations in order
- Balance between strong and eventual
- Requires tracking dependencies

## Query Optimization

### Indexing
- Create indexes on frequently queried columns
- Avoid over-indexing (write performance)
- Use composite indexes wisely

### Query Analysis
- Use EXPLAIN to analyze queries
- Avoid SELECT *
- Use pagination (LIMIT/OFFSET)

### Caching
- Cache frequent queries
- Use materialized views
- Implement query result caching

## Resources

- [Designing Data-Intensive Applications](https://dataintensive.net/)
- [Use The Index, Luke](https://use-the-index-luke.com/)
- [PostgreSQL Wiki](https://wiki.postgresql.org/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/)

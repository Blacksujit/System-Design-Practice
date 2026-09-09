# Databases & Storage

## SQL vs NoSQL

### SQL (Relational)
- Structured data with schemas
- ACID transactions
- Complex queries with JOINs
- Vertical scaling
- Examples: PostgreSQL, MySQL, Oracle

### NoSQL (Non-relational)
- Flexible schemas
- Horizontal scaling
- Eventually consistent
- Examples: MongoDB, Redis, Cassandra, DynamoDB

## ACID Properties

1. **Atomicity** - All or nothing transactions
2. **Consistency** - Data remains valid after transactions
3. **Isolation** - Concurrent transactions don't interfere
4. **Durability** - Committed data survives failures

## Database Scaling

### Vertical Scaling
- Add more CPU/RAM to single server
- Simple but has limits
- Single point of failure

### Horizontal Scaling
- Add more servers
- More complex but scalable
- Requires data distribution

## Sharding Strategies

### Hash-based Sharding
- Use hash function on shard key
- Even distribution
- Hard to add/remove shards

### Range-based Sharding
- Partition by value ranges
- Easy to query ranges
- Can create hotspots

### Directory-based Sharding
- Lookup table for shard mapping
- Flexible but adds overhead

## Replication

### Master-Slave
- Single write master
- Multiple read replicas
- Async or sync replication

### Multi-Master
- Multiple write masters
- Conflict resolution needed
- Higher availability

## Indexing

### B-Tree Index
- Balanced tree structure
- Good for range queries
- O(log n) lookup

### Hash Index
- Hash table structure
- Excellent for point queries
- O(1) lookup

### Composite Index
- Index on multiple columns
- Can cover queries
- Order matters

## Resources

- [Database Internals by Alex Petrov](https://www.oreilly.com/library/view/database-internals/9781492040347/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB University](https://university.mongodb.com/)
- [Designing Data-Intensive Applications by Martin Kleppmann](https://dataintensive.net/)

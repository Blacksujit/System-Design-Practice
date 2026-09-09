# Caching - Detailed Notes

## Cache-Stampede Problem

When a popular cache entry expires, many requests hit the database simultaneously.

### Solutions:
1. **Locking**: Only one request refreshes cache
2. **Early Expiration**: Refresh before actual expiration
3. **Probabilistic Refresh**: Random requests refresh cache

## Cache Penetration

When queries for non-existent data bypass cache and hit database.

### Solutions:
1. **Bloom Filter**: Check if key exists before querying
2. **Null Object Caching**: Cache empty results briefly

## Cache Avalanche

When multiple cache entries expire simultaneously.

### Solutions:
1. **Staggered TTLs**: Add randomness to expiration
2. **Circuit Breaker**: Stop cache requests on failure
3. **Warm Cache**: Pre-populate cache during low traffic

## Distributed Cache Strategies

### Consistent Hashing
- Distribute keys across cache nodes
- Minimize redistribution on node changes

### Replication
- Replicate cache across multiple nodes
- Read from replicas for availability

### Partitioning
- Split cache across multiple nodes
- Each node handles subset of keys

## Monitoring Cache Performance

### Key Metrics:
- **Hit Rate**: Cache hits / (hits + misses)
- **Eviction Rate**: Entries removed / total entries
- **Memory Usage**: Current / Maximum

### Target Hit Rates:
- >95% for hot data
- >80% for warm data
- >50% for cold data

## Redis Best Practices

### Memory Management
- Set maxmemory policy
- Use appropriate data structures
- Monitor memory usage

### Persistence
- RDB snapshots for backups
- AOF for durability
- Choose based on use case

### Cluster Mode
- Shard data across nodes
- Automatic failover
- Horizontal scaling

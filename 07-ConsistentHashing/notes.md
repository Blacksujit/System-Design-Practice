# Consistent Hashing - Detailed Notes

## Advanced Topics

### Bounded Loads
- Limit load per node
- Prevent hotspots
- Better utilization

### Weighted Consistent Hashing
- Nodes have different capacities
- Weight affects ring position
- Supports heterogeneous hardware

### Jump Hash
- Simple and fast
- Good distribution
- No virtual nodes needed
- Limitation: only supports adding nodes

## Comparison of Partitioning Methods

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| Hash-based | Even distribution | Range queries hard | Key-value stores |
| Range-based | Range queries easy | Hotspots possible | Time-series data |
| Directory-based | Flexible | Single point of failure | Dynamic environments |
| Consistent Hashing | Minimal redistribution | Complexity | Distributed caches |

## Real-World Implementations

### Redis Cluster
- 16384 hash slots
- Each node responsible for slots
- Supports partial resharding

### Cassandra
- Token ring with vnodes
- Configurable replication
- Automatic load balancing

### Amazon DynamoDB
- Consistent hashing
- Virtual nodes
- Replication across AZs

## Handling Node Failures

### Detection
- Heartbeat monitoring
- Gossip protocol
- Timeout-based

### Recovery
- Replication ensures availability
- Hinted handoff for writes
- Read repair for consistency

## Resources

- [ynamo Paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)
- [Consistent Hashing with Bounded Loads](https://arxiv.org/abs/1608.01417)
- [Jump Hash](https://arxiv.org/abs/1406.2294)

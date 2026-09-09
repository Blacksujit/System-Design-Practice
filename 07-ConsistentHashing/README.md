# Consistent Hashing & Partitioning

## What is Consistent Hashing?

Consistent hashing is a technique that distributes data across nodes in a way that minimizes redistribution when nodes are added or removed.

## The Problem

With simple hashing (key % N):
- Adding/removing a node redistributes almost all keys
- Causes massive data movement
- Degrades performance during scaling

## How Consistent Hashing Works

1. **Hash Ring**: Nodes and keys are mapped to positions on a ring
2. **Assignment**: Key is assigned to next node clockwise
3. **Minimal Redistribution**: Only keys between old and new node move

## Virtual Nodes

Physical nodes are mapped to multiple positions on the ring.

### Benefits:
- Better distribution
- Heterogeneous hardware support
- Easier scaling

### Configuration:
- More vnodes = better balance
- More memory for lookup tables
- Typical: 100-200 vnodes per node

## Partitioning Strategies

### Hash-based Partitioning
- Hash the partition key
- Even distribution
- Range queries expensive

### Range-based Partitioning
- Partition by value ranges
- Good for range queries
- Risk of hotspots

### Directory-based Partitioning
- Lookup table for mapping
- Flexible redistribution
- Single point of failure

## Use Cases

1. **Distributed Caches**: Redis Cluster, Memcached
2. **Distributed Databases**: Cassandra, DynamoDB
3. **Load Balancers**: Session affinity
4. **CDNs**: Content distribution

## Implementation Example

```python
import hashlib
from bisect import bisect_right

class ConsistentHash:
    def __init__(self, nodes, vnodes=100):
        self.ring = {}
        self.sorted_keys = []
        for node in nodes:
            for i in range(vnodes):
                key = self._hash(f"{node}:{i}")
                self.ring[key] = node
                self.sorted_keys.append(key)
        self.sorted_keys.sort()
    
    def _hash(self, key):
        return int(hashlib.md5(key.encode()).hexdigest(), 16)
    
    def get_node(self, key):
        if not self.ring:
            return None
        h = self._hash(key)
        idx = bisect_right(self.sorted_keys, h) % len(self.sorted_keys)
        return self.ring[self.sorted_keys[idx]]
```

## Resources

- [Consistent Hashing - Wikipedia](https://en.wikipedia.org/wiki/Consistent_hashing)
- [Dynamo Paper (Amazon)](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)
- [MIT 6.824 Labs](https://pdos.csail.mit.edu/6.824/labs/)
- [Consistent Hashing and Random Trees](https://dl.acm.org/doi/10.1145/258533.258535)

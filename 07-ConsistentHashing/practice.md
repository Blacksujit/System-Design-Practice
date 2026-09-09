# Consistent Hashing - Practice Problems

## Problem 1: Design a Distributed Cache
**Requirements:**
- Store millions of keys
- Add/remove nodes dynamically
- Minimize data movement
- High availability

**Questions to Ask:**
- What replication factor?
- What consistency model?
- How to handle node failures?

## Problem 2: Design a Load Balancer with Session Affinity
**Requirements:**
- Route users to same server
- Handle server failures
- Scale dynamically
- Minimal session disruption

**Questions to Ask:**
- What hash function?
- How many virtual nodes?
- How to handle failover?

## Problem 3: Design a Distributed Database
**Requirements:**
- Partition data across nodes
- Support range queries
- Handle node failures
- Consistent reads

**Questions to Ask:**
- Partitioning strategy?
- Replication factor?
- Consistency model?

## Problem 4: Design a Content Distribution Network
**Requirements:**
- Distribute content globally
- Route to nearest edge
- Handle cache invalidation
- Scale with demand

**Questions to Ask:**
- How many edge locations?
- What content to cache?
- How to handle purging?

## Problem 5: Design a Sharded Database
**Requirements:**
- Horizontal scaling
- Consistent data distribution
- Support joins across shards
- Handle hotspots

**Questions to Ask:**
- Shard key selection?
- How to handle cross-shard queries?
- What rebalancing strategy?

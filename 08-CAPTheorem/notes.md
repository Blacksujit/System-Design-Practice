# CAP Theorem - Detailed Notes

## Consensus Algorithms

### Raft
- Leader-based consensus
- Log replication
- Leader election
- Safety guarantees
- Used in: etcd, Consul

### Paxos
- Classical consensus algorithm
- Complex to implement
- Used in: Google Chubby, Zookeeper
- Variants: Multi-Paxos, Fast Paxos

## Practical Implications

### When to Choose CP
- Financial transactions
- Inventory management
- User authentication
- Any system requiring strong consistency

### When to Choose AP
- Social media feeds
- DNS resolution
- Shopping carts
- Any system requiring high availability

## Consistency in Practice

### Read-after-Write Consistency
- User reads their own writes
- Implementation: Read from primary after write

### Monotonic Reads
- Once you read a value, you won't see older values
- Implementation: Track version per client

### Consistent Prefix Reads
- Reads see writes in correct order
- Implementation: Track causal dependencies

## Data Replication Strategies

### Synchronous Replication
- Write to all replicas before success
- Strong consistency
- Higher latency

### Asynchronous Replication
- Write to primary, replicate later
- Eventual consistency
- Lower latency

### Semi-synchronous Replication
- Write to primary + one replica
- Balance of consistency and latency

## Failure Modes

### Network Partition
- Nodes can't communicate
- Must choose availability or consistency
- CAP theorem applies

### Node Failure
- Single node goes down
- Replicas take over
- No CAP trade-off needed

### Byzantine Failure
- Node behaves arbitrarily
- Requires Byzantine fault tolerance
- Complex and expensive

## Resources

- [Raft Consensus Algorithm](https://raft.github.io/)
- [Paxos Made Simple](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf)
- [Understanding CAP Theorem](https://www.infoq.com/articles/cap-twelve-years-later-how-rules-have-changed/)
- [Consistency Models in Distributed Systems](https://brooker.co.za/blog/2014/07/04/consistency.html)

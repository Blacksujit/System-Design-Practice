# CAP Theorem & Consistency

## CAP Theorem

In a distributed system, you can only guarantee two of three properties simultaneously:

1. **Consistency**: Every read receives the most recent write
2. **Availability**: Every request receives a response
3. **Partition Tolerance**: System continues despite network failures

## CAP Combinations

### CP (Consistency + Partition Tolerance)
- Consistent but may reject requests
- Examples: MongoDB, HBase, Redis Cluster
- Use when: Strong consistency required

### AP (Availability + Partition Tolerance)
- Available but may return stale data
- Examples: Cassandra, DynamoDB, CouchDB
- Use when: High availability required

### CA (Consistency + Availability)
- No partition tolerance
- Only for single-node systems
- Not practical for distributed systems

## PACELC Theorem

Extension of CAP: In case of **P**artition, choose **A**vailability or **C**onsistency; **E**lse, choose **L**atency or **C**onsistency.

### PACELC Combinations:
- **PA/EL**: Cassandra, DynamoDB
- **PA/EC**: MongoDB, HBase
- **PC/EL**: -
- **PC/EC**: Spanner, Percolator

## Consistency Models

### Strong Consistency
- Linearizable reads
- All replicas see same data
- Higher latency
- Examples: Spanner, Zookeeper

### Eventual Consistency
- Replicas converge eventually
- May read stale data
- Lower latency
- Examples: Cassandra, DynamoDB

### Causal Consistency
- Causally related operations ordered
- Non-causal operations may be concurrent
- Balance between strong and eventual
- Examples: MongoDB, Riak

### Read-Your-Writes Consistency
- User sees their own writes immediately
- Others may see stale data
- Common in user-facing applications

## Quorum-based Consistency

### Quorum Formula
- W + R > N (for consistency)
- W: Write quorum
- R: Read quorum
- N: Replication factor

### Tunable Consistency
- W=1, R=N: Fast writes, slow reads
- W=N, R=1: Slow writes, fast reads
- W=Q, R=Q: Balanced

## Conflict Resolution

### Last-Write-Wins (LWW)
- Simple but may lose data
- Uses timestamps
- No conflict detection

### Vector Clocks
- Track causality
- Detect conflicts
- More complex

### Application-level Resolution
- Custom logic
- Domain-specific rules
- Most flexible

## Resources

- [CAP Theorem - Brewer's Keynote](https://users.ece.cmu.edu/~adrian/731-sp04/readings/GL-cap.pdf)
- [Raft Paper](https://raft.github.io/raft.pdf)
- [Jepsen Consistency Tests](https://jepsen.io/)
- [Please stop calling databases CP or AP](https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html)

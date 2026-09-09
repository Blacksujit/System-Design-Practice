# Fundamentals - Detailed Notes

## System Design Interview Framework

### Step 1: Requirements Clarification (2-3 minutes)
- Ask clarifying questions about functional requirements
- Understand scale: users, data, traffic
- Identify constraints: budget, timeline, team size

**Example Questions:**
- What is the expected number of users?
- What are the read/write ratios?
- What are the latency requirements?
- Do we need to support real-time updates?

### Step 2: Estimation (3-5 minutes)
- Estimate QPS (Queries Per Second)
- Estimate storage requirements
- Estimate bandwidth needs

**Formulas:**
```
Daily Active Users (DAU) = Total Users * Daily Usage Rate
QPS = DAU * Avg Requests per User / 86400
Storage = Daily Write * Retention Days * Avg Record Size
```

### Step 3: High-Level Design (10-15 minutes)
- Draw main components
- Define data flow
- Identify bottlenecks

**Common Components:**
- Load Balancer
- Application Servers
- Database (SQL/NoSQL)
- Cache
- Message Queue
- CDN

### Step 4: Detailed Design (15-20 minutes)
- Database schema design
- API endpoint design
- Algorithm selection

**Database Design Considerations:**
- Normalization vs Denormalization
- Indexing Strategy
- Partitioning Strategy

### Step 5: Trade-offs (5-10 minutes)
- Discuss alternatives
- Explain why you chose certain components
- Address potential issues

## Key Design Principles

### 1. Keep It Simple (KISS)
- Don't over-engineer
- Use proven solutions
- Avoid premature optimization

### 2. Separation of Concerns
- Single Responsibility Principle
- Modular design
- Clear interfaces

### 3. Defense in Depth
- Multiple layers of security
- Fail-safe defaults
- Least privilege

### 4. Design for Failure
- Assume components will fail
- Implement redundancy
- Plan for recovery

## Common Pitfalls

1. **Jumping to solutions** before understanding requirements
2. **Ignoring non-functional requirements** (performance, scalability)
3. **Not considering failure modes**
4. **Over-engineering** simple problems
5. **Underestimating** data growth

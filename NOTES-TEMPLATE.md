# Notes Template

Use this template to take structured notes for any new system design problem you study.

## Problem

**System being designed**:
**Source / reference**:

## 1. Requirements

### Functional
- [ ] 
- [ ] 

### Non-Functional
- [ ] Latency target:
- [ ] Availability target:
- [ ] Scale:
- [ ] Consistency model:

## 2. Capacity Estimates

| Metric | Value |
|--------|-------|
| DAU / MAU | |
| QPS (reads) | |
| QPS (writes) | |
| Storage | |
| Bandwidth | |
| Shard count | |

## 3. High-Level Architecture

```
(diagram)
```

### Key components
1. ... - why / trade-off
2. ...

## 4. Data Model

```sql
CREATE TABLE ... ;
```

### Indexes / partitioning
- ...

## 5. Key Design Decisions

| Decision | Options considered | Chosen | Why |
|----------|-------------------|--------|-----|
| DB | SQL/NoSQL/... | ... | ... |
| Caching | ... | ... | ... |
| QUEUE | ... | ... | ... |

## 6. Bottlenecks & Trade-offs

- ...

## 7. Scaling Plan

| Stage | Changes |
|-------|---------|
| 1M users | |
| 100M users | |
| 1B users | |

## 8. Failure Modes

| Failure | Impact | Mitigation |
|---------|--------|------------|
| ... | | |

## 9. Interview talking points

- ...
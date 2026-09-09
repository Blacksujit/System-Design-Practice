# System Design Fundamentals

## What is System Design?

System design is the process of defining the architecture, components, modules, interfaces, and data flow of a system to satisfy specified requirements. It involves making high-level decisions about the structure and behavior of a system.

## Key Concepts

### 1. Scalability
The ability of a system to handle increased load by adding resources.

**Types:**
- **Vertical Scaling (Scale Up)**: Adding more power to existing machines
- **Horizontal Scaling (Scale Out)**: Adding more machines

### 2. Reliability
The probability that a system will correctly perform its required function under stated conditions for a specified period.

**Key Metrics:**
- Mean Time Between Failures (MTBF)
- Mean Time To Recovery (MTTR)
- Availability = MTBF / (MTBF + MTTR)

### 3. Availability
The degree to which a system is operational and accessible when required for use.

**Availability Tiers:**
- 99% = 3.65 days downtime/year
- 99.9% = 8.76 hours downtime/year
- 99.99% = 52.56 minutes downtime/year
- 99.999% = 5.26 minutes downtime/year

### 4. Maintainability
The ease with which a system can be modified to correct faults, improve performance, or adapt to a changed environment.

**Factors:**
- Modularity
- Composability
- Readability
- Testability

### 5. Efficiency
How well a system uses its resources to achieve its goals.

**Metrics:**
- Latency (response time)
- Throughput (requests per second)
- Resource utilization (CPU, memory, disk, network)

## System Design Process

1. **Requirements Gathering**
   - Functional requirements
   - Non-functional requirements
   - Constraints

2. **Estimation**
   - Traffic estimation
   - Storage estimation
   - Bandwidth estimation

3. **High-Level Design**
   - Identify main components
   - Define interfaces
   - Data flow

4. **Detailed Design**
   - Database schema
   - API design
   - Algorithm selection

5. **Trade-off Analysis**
   - Consistency vs Availability
   - Latency vs Throughput
   - Cost vs Performance

## Resources

- [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [ByteByteGo System Design](https://bytebytego.com/courses/system-design-interview)
- [MIT 6.824 Distributed Systems](https://pdos.csail.mit.edu/6.824/)
- [System Design Interview by Alex Xu](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)

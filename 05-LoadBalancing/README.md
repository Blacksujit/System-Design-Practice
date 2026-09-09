# Load Balancing & Proxies

## What is Load Balancing?

Load balancing distributes incoming network traffic across multiple servers to ensure no single server bears too much demand.

## Load Balancing Algorithms

### Round Robin
- Distributes requests sequentially
- Simple and predictable
- Doesn't consider server load

### Weighted Round Robin
- Servers assigned weights
- Higher weight = more requests
- Good for heterogeneous servers

### Least Connections
- Routes to server with fewest active connections
- Adapts to varying request durations
- Better for long-lived connections

### IP Hash
- Uses client IP to determine server
- Ensures session persistence
- May cause uneven distribution

### Least Response Time
- Routes to fastest responding server
- Considers both load and latency
- Requires health monitoring

## Types of Load Balancers

### L4 (Transport Layer)
- Works at TCP/UDP level
- Faster (less inspection)
- Based on IP + Port
- Examples: AWS NLB, HAProxy (TCP mode)

### L7 (Application Layer)
- Works at HTTP/HTTPS level
- Content-based routing
- SSL termination
- Examples: AWS ALB, Nginx, HAProxy

## Proxy Types

### Forward Proxy
- Sits in front of clients
- Anonymizes client requests
- Content filtering
- Example: Corporate proxy

### Reverse Proxy
- Sits in front of servers
- Load balancing
- SSL termination
- Caching
- Example: Nginx, HAProxy

## Health Checks

### Active Health Checks
- Periodic probe requests
- Detect failures quickly
- May cause overhead

### Passive Health Checks
- Monitor actual traffic
- No extra overhead
- Slower failure detection

## Popular Load Balancers

### Nginx
- High performance
- Reverse proxy + load balancer
- SSL termination
- Caching

### HAProxy
- High availability
- TCP and HTTP balancing
- Advanced health checks
- Stats dashboard

### AWS ALB/NLB
- Managed service
- Auto-scaling
- Integration with AWS ecosystem
- Pay per use

## Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [HAProxy Documentation](https://docs.haproxy.org/)
- [AWS ELB Documentation](https://docs.aws.amazon.com/elasticloadbalancing/)
- [Load Balancing Algorithms](https://www.educative.io/blog/http-load-balancing-algorithms)

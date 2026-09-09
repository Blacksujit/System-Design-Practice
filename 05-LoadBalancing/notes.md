# Load Balancing - Detailed Notes

## SSL Termination

Load balancer handles SSL/TLS encryption/decryption, reducing backend server overhead.

### Benefits:
- Reduced backend CPU usage
- Centralized certificate management
- SSL session reuse

### Considerations:
- Backend traffic may need encryption
- Compliance requirements
- End-to-end encryption needs

## Session Persistence (Sticky Sessions)

### Methods:
1. **IP Hash**: Route based on client IP
2. **Cookie-based**: Insert cookie for session tracking
3. **URL-based**: Include session ID in URL

### Trade-offs:
- **Pros**: Simple, maintains state
- **Cons**: Uneven load, failover issues

## High Availability Patterns

### Active-Passive
- Primary handles traffic
- Standby takes over on failure
- Simple but underutilizes resources

### Active-Active
- All servers handle traffic
- Better resource utilization
- More complex configuration

## Auto-scaling Integration

### Horizontal Pod Autoscaler (Kubernetes)
- Scale based on CPU/memory
- Custom metrics support
- Cool-down periods

### AWS Auto Scaling
- Scale based on CloudWatch metrics
- Predictive scaling
- Instance refresh

## Common Configurations

### Nginx Load Balancer
```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

### HAProxy Configuration
```haproxy
backend web_servers
    balance roundrobin
    server web1 192.168.1.10:80 check
    server web2 192.168.1.11:80 check
    server web3 192.168.1.12:80 check
```

## Resources

- [Nginx Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/)
- [HAProxy Configuration Guide](https://docs.haproxy.org/)
- [AWS ELB Best Practices](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/)

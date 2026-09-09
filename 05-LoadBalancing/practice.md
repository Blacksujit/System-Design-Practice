# Load Balancing - Practice Problems

## Problem 1: Design a Global Load Balancer
**Requirements:**
- Route users to nearest data center
- Handle millions of requests
- Failover between regions
- Health monitoring

**Questions to Ask:**
- How many regions?
- What routing algorithm?
- How to handle DNS?
- What health check interval?

## Problem 2: Design an API Gateway
**Requirements:**
- Route to microservices
- Rate limiting
- Authentication
- Request transformation

**Questions to Ask:**
- How many services?
- What protocols?
- How to handle versioning?
- What caching strategy?

## Problem 3: Design a WebSocket Load Balancer
**Requirements:**
- Handle persistent connections
- Session affinity
- Connection draining
- Real-time messaging

**Questions to Ask:**
- Expected concurrent connections?
- How to handle reconnections?
- What protocol (WS/WSS)?
- Message routing?

## Problem 4: Design a Database Proxy
**Requirements:**
- Read/write splitting
- Connection pooling
- Query caching
- Failover

**Questions to Ask:**
- What database engine?
- Read/write ratio?
- What caching strategy?
- How to handle failures?

## Problem 5: Design a Video Streaming Load Balancer
**Requirements:**
- Handle video streams
- Adaptive bitrate
- CDN integration
- Session persistence

**Questions to Ask:**
- What video formats?
- Expected concurrent viewers?
- How to handle seeking?
- What CDN strategy?

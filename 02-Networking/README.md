# Networking & Protocols

## OSI Model (7 Layers)

1. **Physical** - Hardware, cables, signals
2. **Data Link** - MAC addresses, frames
3. **Network** - IP addresses, routing
4. **Transport** - TCP/UDP, ports
5. **Session** - Connection management
6. **Presentation** - Encryption, compression
7. **Application** - HTTP, FTP, SMTP

## TCP/IP Model (4 Layers)

1. **Network Interface** - Ethernet, WiFi
2. **Internet** - IP, ICMP
3. **Transport** - TCP, UDP
4. **Application** - HTTP, DNS, SMTP

## Key Protocols

### HTTP/HTTPS
- Request-Response model
- Methods: GET, POST, PUT, DELETE, PATCH
- Status codes: 2xx, 3xx, 4xx, 5xx
- Stateless, but sessions/cookies maintain state

### WebSocket
- Full-duplex communication
- Persistent connection
- Real-time updates (chat, gaming)

### gRPC
- Remote Procedure Call framework
- Uses Protocol Buffers (protobuf)
- HTTP/2 based
- Bidirectional streaming

### DNS
- Domain Name System
- Translates domain names to IP addresses
- Hierarchical structure: Root → TLD → Authoritative

## Load Balancing Algorithms

### Round Robin
- Distributes requests sequentially
- Simple but doesn't consider server load

### Least Connections
- Routes to server with fewest connections
- Better for varying request durations

### IP Hash
- Routes based on client IP
- Ensures session persistence

## CDN (Content Delivery Network)
- Distributed cache of static content
- Reduces latency by serving from edge locations
- Examples: Cloudflare, AWS CloudFront

## Resources

- [Computer Networking: A Top-Down Approach](https://gaia.cs.umass.edu/kurose_ross/)
- [Cloudflare Learning Center](https://www.cloudflare.com/learning/)
- [MDN Web Docs - HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)

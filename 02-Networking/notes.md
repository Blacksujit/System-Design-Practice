# Networking - Detailed Notes

## TCP vs UDP

### TCP (Transmission Control Protocol)
- Reliable delivery
- Ordered packets
- Flow control
- Congestion control
- Use cases: HTTP, FTP, Email

### UDP (User Datagram Protocol)
- Unreliable delivery
- No ordering guarantee
- No flow control
- Lower overhead
- Use cases: DNS, Video streaming, Gaming

## HTTP/2 vs HTTP/3

### HTTP/2
- Multiplexing (multiple streams over single connection)
- Header compression (HPACK)
- Server push
- Binary framing

### HTTP/3
- Uses QUIC protocol (UDP-based)
- 0-RTT connection setup
- Improved loss recovery
- Connection migration

## DNS Resolution Process

1. Browser cache
2. OS cache
3. Router cache
4. ISP DNS server
5. Root DNS server
6. TLD DNS server
7. Authoritative DNS server

## TLS Handshake

1. Client Hello (supported ciphers)
2. Server Hello (chosen cipher)
3. Certificate exchange
4. Key exchange
5. Encrypted communication begins

## API Design Patterns

### REST
- Resource-based URLs
- HTTP methods for CRUD
- Stateless
- HATEOAS (optional)

### GraphQL
- Single endpoint
- Client specifies required data
- Strongly typed schema
- Reduces over-fetching

### gRPC
- Protocol Buffers
- HTTP/2 transport
- Streaming support
- Code generation

## Resources

- [High Performance Browser Networking](https://hpbnwhttp://smouset.com/)
- [RFC 7540 - HTTP/2](https://tools.ietf.org/html/rfc7540)
- [RFC 9000 - QUIC](https://tools.ietf.org/html/rfc9000)

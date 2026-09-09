# Networking - Practice Problems

## Problem 1: Design a Web Crawler
**Requirements:**
- Crawl billions of web pages
- Politeness (respect robots.txt)
- Handle duplicate URLs
- Distributed crawling

**Questions to Ask:**
- What is the crawl rate?
- How to handle link extraction?
- How to store crawled data?
- How to handle failures?

## Problem 2: Design a DNS System
**Requirements:**
- Resolve domain names to IPs
- Support millions of queries per second
- Handle DNS propagation

**Questions to Ask:**
- What record types to support?
- How to handle caching?
- How to handle DNS attacks?

## Problem 3: Design a Content Delivery Network
**Requirements:**
- Serve static content globally
- Reduce latency
- Handle traffic spikes

**Questions to Ask:**
- What content to cache?
- How to handle cache invalidation?
- How to route to nearest edge?

## Problem 4: Design an API Gateway
**Requirements:**
- Route requests to microservices
- Rate limiting
- Authentication
- Request/response transformation

**Questions to Ask:**
- How many microservices?
- What protocols to support?
- How to handle versioning?

## Problem 5: Design a Load Balancer
**Requirements:**
- Distribute traffic across servers
- Health checks
- Session persistence
- SSL termination

**Questions to Ask:**
- L4 or L7 load balancing?
- What algorithm to use?
- How to handle failover?

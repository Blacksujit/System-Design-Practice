# Fundamentals - Practice Problems

## Problem 1: Design a URL Shortener
**Requirements:**
- Shorten URLs to 6-8 character strings
- Redirect short URLs to original URLs
- Track click statistics

**Questions to Ask:**
- What is the expected traffic?
- Do we need custom aliases?
- How long should URLs be stored?
- Do we need analytics?

## Problem 2: Design a Rate Limiter
**Requirements:**
- Limit API requests per user
- Support different limits for different endpoints
- Handle distributed systems

**Questions to Ask:**
- What is the time window (per second, minute, hour)?
- Should we use fixed window or sliding window?
- How to handle distributed rate limiting?

## Problem 3: Design a Notification System
**Requirements:**
- Send push notifications, emails, SMS
- Support millions of users
- Handle priority notifications

**Questions to Ask:**
- What types of notifications?
- Do we need real-time delivery?
- How to handle delivery failures?
- Do we need notification preferences?

## Problem 4: Design a Simple Chat Application
**Requirements:**
- 1-on-1 messaging
- Online/offline status
- Message history

**Questions to Ask:**
- Real-time messaging required?
- How long to store message history?
- Do we need read receipts?
- Group chat support?

## Problem 5: Design a News Feed System
**Requirements:**
- Show personalized feed
- Real-time updates
- Handle millions of users

**Questions to Ask:**
- Fanout on read or write?
- How to rank posts?
- Do we need media support?
- Privacy controls?

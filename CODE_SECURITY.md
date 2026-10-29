# Code Security Guidelines

## Data Protection Compliance

### Pakistan IT Act 2000 & Data Localization
- All Pakistani student data MUST be stored within Pakistan
- Primary database: Use Pakistani cloud providers (PTCL Cloud, Zong, Jazz)
- Cross-border data transfer requires encryption + explicit consent
- Data retention: Minimum 7 years after graduation

### Student Privacy Controls
- Student IDs stored as cryptographic hashes
- Review content anonymized by default
- Opt-out option for data visibility
- Right to erasure: Delete all data within 72 hours of request

## Authentication & Authorization

### User Roles
```
Public Visitor → Unauthenticated
Verified Student → Email + ID Card + Peer verified
University Admin → HEC verified + university email
Platform Moderator → Staff member
```

### Session Management
- JWT tokens with 24-hour expiration
- Refresh tokens stored in httpOnly cookies
- Session invalidation on password change
- Concurrent session limit: 3 devices max

### Review Verification Flow
```
1. Student submits review with university email
2. System sends verification code via SendGrid
3. Phone verification via Twilio (optional)
4. Peer verification: 2 random students from same course verify
5. Credibility score increases: Email=10, ID=50, Peer=100
6. Only credibility ≥160 can submit reviews
```

## Input Validation & Sanitization

### All User Input Must Be:
- Validated against TypeScript schemas (Zod)
- Sanitized for XSS (strip HTML tags)
- Rate limited (max 10 requests/minute per IP)
- Checked for profanity (Urdu/English)

### Critical Validation Rules
```typescript
// Review submission
- max 1000 characters
- no personal information (emails, phone numbers)
- profanity filter: 500+ Urdu words + English slurs

// File uploads
- ID photos: max 5MB, JPEG only
- Virus scan via ClamAV
- Stored in encrypted bucket
```

## Rate Limiting Strategy

### API Endpoints
```
POST /api/reviews     → Max 3/day per student
POST /api/verify      → Max 5/hour  
GET /api/universities → 1000/hour per IP
Any endpoint          → 100/15min per IP globally
```

### Blockchain Abuse Prevention
- Miner fee must be paid from platform wallet
- Max 10 reviews batch submitted/hour
- Duplicate content detection via hash comparison

## Error Handling Standards

### API Error Responses
```typescript
{
  "error": "VALIDATION_FAILED",
  "message": "Input validation failed",
  "details": ["email: invalid format"],
  "timestamp": "2026-10-29T10:00:00Z"
}
```

### Common Error Types
- `VALIDATION_FAILED` - User input invalid
- `UNAUTHORIZED` - Session expired/needs login
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource doesn't exist
- `BLOCKCHAIN_ERROR` - Polygon transaction failed
- `RATE_LIMITED` - Too many requests

### Logging Policy
- All errors logged to encrypted log bucket
- No sensitive data in error messages
- Stack traces only in development mode
- Audit log for all review actions

## SQL Injection Prevention

### Prisma ORM Usage (Mandatory)
- NEVER use raw SQL queries
- ALWAYS use Prisma query builder
- Input parameterized automatically

### Example Safe Queries
```typescript
// GOOD - Prisma handles sanitization
const review = await prisma.review.create({
  data: {
    targetId: req.body.targetId,
    content: req.body.content,
    studentId: session.userId
  }
})

// BAD - Raw SQL (DO NOT USE)
const review = await prisma.$executeRaw`INSERT INTO reviews...`
```

## XSS/CSRF Protection

### CSRF
- Double-submit cookie pattern
- SameSite=Lax cookies
- CSRF token in all forms

### XSS Prevention
- All user content escaped by default
- Markdown sanitization (allowed: bold, italic, links)
- No raw HTML in review content

## Environment Security

### .env File Protection
- Never commit .env to git
- Use .env.example as template
- Validate all env vars on startup
- Alert on missing critical vars

### Production Secrets Management
- DATABASE_URL, NEXTAUTH_SECRET, API keys stored in:
  - Vercel Environment Variables (production)
  - Railway Secrets (staging)
  - Local .env.local (development)
- Rotate keys every 90 days

## Third-Party Service Security

### Approval Required From:
1. SendGrid - Email verification
2. Twilio - SMS verification  
3. Cloudinary - Media storage
4. Polygon RPC - Blockchain transactions

### Security SLAs
- All services must support OAuth 2.0
- Data processing agreements signed
- Regular security audit reports required
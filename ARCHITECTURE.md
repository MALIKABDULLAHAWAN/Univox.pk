# UniVox PK - System Architecture

## Components

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
├─────────────────────────────────────────────────────────────┤
│  PWA Frontend (Next.js)                                     │
│  ├─ University List Page                                    │
│  ├─ Department Detail Page                                  │
│  ├─ Review Submission Form                                  │
│  └─ Admin Dashboard                                         │
├─────────────────────────────────────────────────────────────┤
│                    BACKEND API                              │
├─────────────────────────────────────────────────────────────┤
│  API Gateway (Next.js API Routes)                           │
│  ├─ Auth Service      (email/peer verification)             │
│  ├─ Review Service    (create, read, verify)              │
│  ├─ Content Service     (universities, courses)             │
│  ├─ Ranking Service   (budget-adjusted algorithm)         │
│  └─ Notification      (SMS/Email)                         │
├─────────────────────────────────────────────────────────────┤
│                     DATA LAYER                                │
├─────────────────────────────────────────────────────────────┤
│  Primary Database: PostgreSQL (Prisma ORM)                  │
│  ├─ Universities, Departments, Courses                      │
│  ├─ Reviews, Ratings, Comments                              │
│  ├─ Students, Verification Records                          │
│  └─ Blockchain Hash References                              │
│                                                             │
│  Cache: Redis                                                │
│  ├─ Session storage                                         │
│  └─ Rating calculations                                     │
│                                                             │
│  Storage: Cloudinary                                         │
│  ├─ University logos                                        │
│  ├─ Course syllabi PDFs                                     │
│  └─ Student ID uploads (encrypted)                          │
│                                                             │
│  Blockchain: Polygon Testnet                                 │
│  ├─ Review hash smart contract                                │
│  └─ Transaction indexer                                     │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
Student writes review:
1. Student submits review via PWA
2. Review stored in PostgreSQL with pending status
3. System selects 2 peer reviewers from same course
4. Peers verify (accept/reject)
5. If 2 approvals: Hash review content, submit to Polygon
6. Set review status to "verified immovable"
7. Notify university of new review

Budget ranking calculation:
1. User selects budget range on frontend
2. Backend queries universities with budget filter
3. Apply budget adjustment factor to base rankings
4. Return sorted list with local language labels
5. Cache result in Redis for 5 minutes
```

## External Services

| Service | Purpose | Authentication |
|---------|---------|----------------|
| Cloudinary | Media storage | API Key |
| Polygon RPC | Blockchain | Free tier |
| SendGrid | Email verification | API Key |
| Twilio | SMS verification | API Key |
| HEC API | Official data | HTTP headers |

## Folder Structure

```
src/
├── app/              # Next.js App Router (pages)
│   ├── (auth)/       # Login/Verify flows
│   ├── universities/ # University pages
│   ├── departments/  # Department pages
│   ├── reviews/      # Review submission
│   └── admin/        # Moderator dashboard
│
├── components/       # Reusable UI components
│   ├── UniversityCard.tsx
│   ├── DepartmentCard.tsx
│   ├── ReviewForm.tsx
│   ├── LanguageToggle.tsx
│   └── BudgetFilter.tsx
│
├── lib/              # Utilities
│   ├── db.ts         # Prisma client
│   ├── auth.ts       # Session handling
│   ├── blockchain.ts # Polygon integration
│   └── ranking.ts    # Budget algorithm
│
├── types/            # TypeScript interfaces
│   ├── university.ts
│   ├── review.ts
│   └── student.ts
│
├── ai/               # Recommendation models
│   └── recommendation.ts
│
└── styles/           # TailwindCSS config
```

## Key Decisions

1. **Next.js App Router**: File-system routing, server components for SEO
2. **Prisma ORM**: Type-safe database access, migrations
3. **Polygon**: Low-cost transactions, Ethereum compatibility
4. **Redis**: Caching for ranking calculations (frequent reads)
5. **Cloudinary**: CDN + image optimization for mobile
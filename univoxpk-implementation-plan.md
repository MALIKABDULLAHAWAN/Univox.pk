# UniVox PK - Technical Implementation Plan

**Platform**: Student-first university review platform for Pakistan  
**Mission**: Empower Pakistani students to make data-driven, budget-conscious admission decisions through student-verified, blockchain-proven reviews.

---

## Table of Contents

1. [Technical Architecture](#technical-architecture)
2. [Phase 1 MVP (Months 1-3) - $50K](#phase-1-mvp-months-1-3---50k)
3. [Phase 2 Enhancement (Months 4-6) - $100K](#phase-2-enhancement-months-4-6---100k)
4. [Phase 3 Scale (Months 7-12) - $150K](#phase-3-scale-months-7-12---150k)
5. [Technical Debt & Risks](#technical-debt--risks)
6. [Team Requirements](#team-requirements)
7. [Infrastructure Costs (First Year)](#infrastructure-costs-first-year)

---

## Technical Architecture

### Microservices Breakdown

```
Services:
├── auth-service          (NextAuth + custom verification)
├── review-service       (Peer verification + blockchain)
├── recommendation-service (AI engine)
├── career-service       (Placement tracking)
├── content-service      (CMS for catalogs)
├── notification-service (SMS/WhatsApp)
└── payment-service      (Premium features)
```

### API Contracts

#### Auth Service (`/api/auth`)
```typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;
  name: string;
  phone?: string;
  universityId?: string;
}

// POST /api/auth/verify-peer
interface PeerVerifyRequest {
  targetUserId: string;
  verificationToken: string;
  relationship: 'classmate' | 'senior' | 'alumni';
}

// GET /api/auth/me
interface UserResponse {
  id: string;
  email: string;
  verificationLevel: 'email' | 'id_verified' | 'peer_verified' | 'graduate';
  credibilityScore: number;
  canRate: boolean;
}
```

#### Review Service (`/api/reviews`)
```typescript
// POST /api/reviews
interface CreateReviewRequest {
  universityId: string;
  departmentId?: string;
  rating: number; // 1-5 scale
  title: string;
  content: string;
  anonymityLevel: 'anonymous' | 'pseudonym' | 'verified';
}

// GET /api/reviews/:universityId
interface ReviewsResponse {
  reviews: Review[];
  verificationStats: {
    totalReviews: number;
    peerVerified: number;
    blockchainHash: string;
  };
}

// POST /api/reviews/:id/verify
interface VerifyReviewRequest {
  reviewerId: string;
  verificationCode: string;
}
```

#### Recommendation Service (`/api/recommendations`)
```typescript
// POST /api/recommendations
interface RecommendationRequest {
  budget: number; // PKR per year
  locationPreferences: string[];
  programPreferences: string[];
  testPrepStart?: string; // ISO date
}

// GET /api/recommendations/suggested
interface RecommendationResponse {
  universities: SuggestedUniversity[];
  admissionProbability?: number;
  recommendedPrograms: string[];
  preparationTimeline: {
    months: number;
    scoreTarget: number;
  };
}

interface SuggestedUniversity {
  id: string;
  name: string;
  score: number; // Budget-adjusted ranking score
  components: {
    academicScore: number;
    budgetScore: number;
    outcomeScore: number;
    sentimentScore: number;
  };
  budgetFit: 'excellent' | 'good' | 'fair' | 'poor';
  affordabilityRating: 'budget_tier_1' | 'budget_tier_2' | 'budget_tier_3' | 'budget_tier_4';
}
```

#### Career Service (`/api/career`)
```typescript
// GET /api/career/placement-rates
interface PlacementRatesParams {
  universityId?: string;
  departmentId?: string;
  year?: number;
}

// POST /api/career/outcome
interface SubmitOutcomeRequest {
  program: string;
  graduationYear: number;
  avgSalaryPKR: number;
  placementRate: number;
  topEmployers: string[];
}
```

### Database Schema with Prisma Models

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                    String   @id @default(cuid())
  email                 String   @unique
  name                  String?
  phone                 String?
  hashedPassword        String?
  role                  Role     @default(USER)
  verificationLevel     VerificationLevel @default(EMAIL)
  credibilityScore      Float    @default(1.0)
  canRate               Boolean  @default(false)
  trustTokens           Int      @default(0)
  
  // Student-specific fields
  universityId          String?
  university            University? @relation(fields: [universityId], references: [id])
  studentIdHash         String?    @unique
  academicStatus        AcademicStatus?
  graduationYear        Int?
  programEnrolled       String?
  
  // Peer verification credits
  peerRatingsMade       Int @default(0)
  peerVerificationsMade Int @default(0)
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  lastLoginAt           DateTime?
  
  reviews               Review[]
  verificationsMade     Verification[]
}

enum Role {
  USER
  ADMIN
  MODERATOR
}

enum VerificationLevel {
  EMAIL
  ID_VERIFIED
  PEER_VERIFIED
  GRADUATE
}

enum AcademicStatus {
  ENROLLED
  GRADUATED
  APPLIED
}

model University {
  id                    String   @id @default(cuid())
  name                  String
  code                  String   @unique
  location              String
  city                  String
  province              String
  latitude              Float?
  longitude             Float?
  budgetTier            BudgetTier @default(TIER_1)
  totalSeats            Int?
  
  // HEC data integration
  inceptionYear         Int?
  affiliation           String?
  hecRanking            Int?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  departments           Department[]
  reviews               Review[]
  placements            Placement[]
  users                 User[]
}

enum BudgetTier {
  TIER_1    // PKR 0-80,000/year (Public/ Government)
  TIER_2    // PKR 80,001-150,000/year (Public/ Private mid)
  TIER_3    // PKR 150,001-300,000/year (Private/ Elite mid)
  TIER_4    // PKR 300,001+/year (Elite Private)
}

model Department {
  id                    String   @id @default(cuid())
  name                  String
  code                  String
  universityId          String
  university            University @relation(fields: [universityId], references: [id])
  
  // Financial data
  tuitionPerYear        Int?     // PKR
  accommodationCost     Int?     // PKR per year
  
  // Academic data
  accreditation         String?
  rankingWithinUni      Int?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  reviews               Review[]
  placements            Placement[]
}

model Review {
  id                    String   @id @default(cuid())
  authorId              String
  author                User @relation(fields: [authorId], references: [id])
  
  universityId          String
  university            University @relation(fields: [universityId], references: [id])
  departmentId          String?
  department            Department? @relation(fields: [departmentId], references: [id])
  
  rating                Int      @default(0) // 1-5 scale
  title                 String
  content               String   @db.Text
  
  // Anonymity settings
  anonymityLevel        AnonymityLevel @default(ANONYMOUS)
  pseudonym             String?
  
  // Verification
  verificationHash      String   @unique
  blockchainTxHash      String?
  isVerified            Boolean  @default(false)
  
  // Metadata
  sentimentScore        Float    @default(0)
  keywords              String[]
  helpfulCount        Int      @default(0)
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

enum AnonymityLevel {
  ANONYMOUS
  PSEUDONYM
  VERIFIED
}

model Verification {
  id                    String   @id @default(cuid())
  verifierId            String
  verifier              User @relation("verificationsMade", fields: [verifierId], references: [id])
  targetId              String
  target                User @relation("verificationsReceived", fields: [targetId], references: [id])
  
  verificationCode      String
  relationship          String
  
  createdAt             DateTime @default(now())
  isValid               Boolean @default(true)
}

model Placement {
  id                    String   @id @default(cuid())
  universityId          String
  university            University @relation(fields: [universityId], references: [id])
  departmentId          String
  department            Department @relation(fields: [departmentId], references: [id])
  
  year                  Int
  program               String // "BSCS", "BSCE"
  
  avgSalaryPKR          Int      // Average starting salary
  placementRate         Float    @default(0) // Percentage placed
  topEmployers          String[] // ["Google", "Careem", "UBL"]
  sectors               String[] // ["Tech", "Finance", "Healthcare"]
  
  verifiedBy            String[] // Student submissions
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@unique([universityId, departmentId, year, program])
}

model AlumniStory {
  id                      String   @id @default(cuid())
  studentId               String
  student                 User @relation(fields: [studentId], references: [id])
  universityId            String
  university              University @relation(fields: [universityId], references: [id])
  departmentId            String
  department              Department @relation(fields: [departmentId], references: [id])
  program                 String
  graduationYear          Int
  
  title                   String
  content                 String   @db.Text
  careerPath              String[] // Journey milestones
  currentRole             String
  currentEmployer         String
  salaryPKR               Int?
  location                String
  
  skillsUsed              String[] // "Python, Machine Learning"
  advice                  String   @db.Text
  
  isFeatured              Boolean  @default(false)
  mediaUrl                String? // Photo/video
  
  createdAt               DateTime @default(now())
}

model NotificationPreference {
  id                    String   @id @default(cuid())
  userId                String
  user                  User @relation(fields: [userId], references: [id])
  
  emailEnabled          Boolean  @default(true)
  smsEnabled            Boolean  @default(false)
  whatsappEnabled       Boolean  @default(false)
  
  applicationDeadlines  Boolean  @default(true)
  testDates            Boolean  @default(true)
  scholarshipMatches    Boolean  @default(true)
  peerVerifications     Boolean  @default(true)
  
  createdAt             DateTime @default(now())
}

model BlockchainAudit {
  id                    String   @id @default(cuid())
  reviewId              String
  review                Review @relation(fields: [reviewId], references: [id])
  
  reviewHash            String   // SHA-256 hash of review content
  polygonTxHash         String?  // Transaction hash on Polygon
  blockNumber           Int?
  verificationTimestamp DateTime?
  
  createdAt             DateTime @default(now())
}

model OfflineCatalog {
  id                    String   @id @default(cuid())
  universityId          String
  university            University @relation(fields: [universityId], references: [id])
  
  catalogData           String   @db.Text // JSON data for offline use
  version               Int      @default(1)
  fileSize              Int      // bytes
  updatedAt             DateTime @updatedAt
}

model LanguageTranslation {
  id                    String   @id @default(cuid())
  sourceKey             String
  sourceLanguage        String   @default("en")
  targetLanguage        String   @default("ur")
  translatedText        String   @db.Text
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@unique([sourceKey, targetLanguage])
}
```

### Blockchain Integration Approach

#### Polygon Testnet Integration

**Architecture:**
```
Review Creation Flow:
1. User submits review → Review Service
2. Service generates SHA-256 hash of review content
3. Hash batch collected (up to 50 hashes)
4. Weekly batch transaction to Polygon testnet
5. Transaction hash stored in review record
6. Immutable audit trail created

Smart Contract (Solidity):
- Simple key-value store for review hashes
- Events emitted for each hash
- Gas-efficient batch submission
```

**Smart Contract (ReviewRegistry.sol):**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReviewRegistry {
    mapping(bytes32 => bool) public reviewHashes;
    bytes32[] public allHashes;
    
    event ReviewRegistered(bytes32 indexed hash, uint256 timestamp);
    
    function registerReviews(bytes32[] calldata hashes) external {
        for (uint i = 0; i < hashes.length; i++) {
            reviewHashes[hashes[i]] = true;
            allHashes.push(hashes[i]);
            emit ReviewRegistered(hashes[i], block.timestamp);
        }
    }
    
    function verifyReview(bytes32 hash) external view returns (bool) {
        return reviewHashes[hash];
    }
    
    function getHashCount() external view returns (uint256) {
        return allHashes.length;
    }
}
```

**Integration Service (polygon.service.ts):**
```typescript
import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';

export class PolygonService {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;
  private prisma: PrismaClient;
  private pendingHashes: bytes32[] = [];
  private batchTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    this.contract = new ethers.Contract(
      process.env.REVIEW_REGISTRY_ADDRESS!,
      REVIEW_REGISTRY_ABI,
      this.provider
    );
    this.prisma = new PrismaClient();
  }

  async queueReviewHash(reviewId: string, content: string) {
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(content));
    this.pendingHashes.push(hash as bytes32);
    
    // Store pending hash for retry
    await this.prisma.blockchainAudit.create({
      data: {
        reviewId,
        reviewHash: hash,
      }
    });

    // Batch every 50 hashes or 1 hour
    if (this.pendingHashes.length >= 50) {
      await this.flushBatch();
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => this.flushBatch(), 3600000);
    }
  }

  private async flushBatch() {
    if (this.pendingHashes.length === 0) return;

    try {
      const tx = await this.contract.registerReviews(this.pendingHashes);
      await tx.wait();

      // Update records with transaction hash
      for (let i = 0; i < this.pendingHashes.length; i++) {
        await this.prisma.blockchainAudit.updateMany({
          where: { reviewHash: this.pendingHashes[i] },
          data: { 
            polygonTxHash: tx.hash,
            blockNumber: tx.blockNumber,
            verificationTimestamp: new Date(),
          }
        });
      }

      this.pendingHashes = [];
      if (this.batchTimer) {
        clearTimeout(this.batchTimer);
        this.batchTimer = null;
      }
    } catch (error) {
      console.error('Blockchain batch failed:', error);
      // Keep pending hashes for retry
    }
  }
}
```

### AI/ML Model Stack for Recommendations

**Architecture:**
```
Recommendation Pipeline:
┌─────────────────────────────────────────────┐
│ User Profile + Preferences                  │
│  - Budget, location, program               │
│  - Test prep start date                    │
└─────────────────────────┬───────────────────┘
                          │
┌─────────────────────────▼───────────────────┐
│ Feature Engineering                         │
│  - Budget alignment score                  │
│  - Academic merit score (collegescorecard)   │
│  - Placement quality score                 │
│  - Sentiment score (NLP on reviews)        │
│  - Location proximity (geodesic distance)  │
└─────────────────────────┬───────────────────┘
                          │
┌─────────────────────────▼───────────────────┐
│ Weighted Scoring Algorithm                  │
│  score = 0.4*academic + 0.3*budget         │
│         + 0.2*outcome + 0.1*sentiment      │
└─────────────────────────┬───────────────────┘
                          │
┌─────────────────────────▼───────────────────┐
│ AI Refinement Layer (Phase 2)               │
│  - TensorFlow model for admission prob       │
│  - Scholarship matching (BERT embeddings)  │
│  - Collaborative filtering                 │
└─────────────────────────┬───────────────────┘
                          │
┌─────────────────────────▼───────────────────┐
│ Output: Personalized University List        │
└─────────────────────────────────────────────┘
```

**Recommendation Engine (recommendation.service.ts):**
```typescript
import { TensorFlowModel } from '@tensorflow/tfjs-node';
import { getEmbedding } from './embedding.service';

export class RecommendationService {
  private tfModel: TensorFlowModel | null = null;
  
  async getRecommendations(userId: string, request: RecommendationRequest) {
    const universities = await this.prisma.university.findMany();
    
    const scores = await Promise.all(universities.map(async (uni) => {
      const academicScore = this.calculateAcademicScore(uni);
      const budgetScore = this.calculateBudgetScore(uni, request.budget);
      const outcomeScore = await this.calculateOutcomeScore(uni.id);
      const sentimentScore = await this.calculateSentimentScore(uni.id);
      const locationScore = this.calculateLocationScore(uni, request.locationPreferences);
      
      const finalScore = (academicScore * 0.4) +
                        (budgetScore * 0.3) +
                        (outcomeScore * 0.2) +
                        (sentimentScore * 0.1) +
                        locationScore;
      
      return {
        id: uni.id,
        name: uni.name,
        score: finalScore,
        components: {
          academicScore,
          budgetScore,
          outcomeScore,
          sentimentScore,
          locationScore
        }
      };
    }));
    
    return scores.sort((a, b) => b.score - a.score);
  }
  
  private calculateBudgetScore(uni: University, budget: number): number {
    const totalAnnualCost = (uni.departments?.[0]?.tuitionPerYear || 0) +
                           (uni.departments?.[0]?.accommodationCost || 0);
    
    if (totalAnnualCost <= budget) return 100;
    if (totalAnnualCost <= budget * 1.1) return 90;
    if (totalAnnualCost <= budget * 1.25) return 70;
    if (totalAnnualCost <= budget * 1.5) return 50;
    return 20;
  }
  
  async calculateSentimentScore(universityId: string): Promise<number> {
    // Use pre-trained Urdu sentiment model
    const reviews = await this.prisma.review.findMany({
      where: { universityId }
    });
    
    const scores = reviews.map(r => r.sentimentScore);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }
}
```

### Mobile PWA Offline Strategy

**Service Worker Architecture:**
```
Offline Strategy:
├── Data Caching
│   ├── University catalog (JSON) - Cache First
│   ├── Review data - Stale While Revalidate
│   ├── User preferences - Cache First
│   └── Translation bundles - Cache First
│
├── Background Sync
│   ├── Pending reviews - Sync on reconnect
│   ├── Verification requests - Queue & send
│   └── Analytics events - Batch send
│
├── Storage
│   ├── IndexedDB - Structured data (reviews, universities)
│   ├── LocalStorage - User settings, tokens
│   └── Cache API - Static assets
│
└── Network Detection
    ├── Online event - Trigger sync
    ├── Offline event - Switch to cached mode
    └── Connection speed - Adjust quality
```

**Service Worker (sw.js):**
```javascript
const CACHE_VERSION = 'v1.2024';
const CACHE_NAME = `univox-${CACHE_VERSION}`;

const urlsToCache = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/locales/ur.json',
  '/locales/pn.json',
  '/static/css/main.css',
  '/static/js/main.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API requests - Stale while revalidate
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.match(request).then((response) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        });
        return response || fetchPromise;
      })
    );
  }
  
  // Static assets - Cache first
  event.respondWith(
    caches.match(request).then((response) => response || fetch(request))
  );
});

// Background sync for pending reviews
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reviews') {
    event.waitUntil(syncPendingReviews());
  }
});

async function syncPendingReviews() {
  const pendingReviews = await localforage.getItem('pending-reviews') || [];
  
  for (const review of pendingReviews) {
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(review),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Sync failed for review:', review.id);
    }
  }
  
  await localforage.removeItem('pending-reviews');
}
```

---

## Phase 1 MVP (Months 1-3) - $50K

### Must-Haves

| Component | Description | Deliverables |
|-----------|-------------|--------------|
| **Peer Verification System** | Email + peer verification | - Registration with email verification<br>- Peer verification flow via invitation codes<br>- Trust token system (10/50/100 pts)<br>- Verification UI for users |
| **University/Department Browsing** | Searchable database | - 50 universities with full profiles<br>- Department listings per university<br>- Budget tier categorization<br>- Search and filter functionality |
| **Anonymous Reviews** | Student reviews | - Review submission form<br>- 1-5 star rating system<br>- Text content with anonymity toggle<br>- Review listing with pagination |
| **Budget Filtering** | Cost-based ranking | - Budget input field<br>- Filter by budget tier<br>- Cost breakdown per university<br>- Affordability badges |
| **Urdu Language Support** | Full localization | - Urdu UI translation<br>- Urdu content language selector<br>- RTL layout support<br>- Urdu font optimization |
| **Admin Dashboard** | Content moderation | - Admin panel for universities<br>- Review moderation tool<br>- User management interface<br>- Verification audit logs |

### Technical Milestones

**Month 1:**
- Set up monorepo with Next.js + NestJS
- Implement authentication system
- Build university database (seed 50 universities)
- Create basic review submission
- Set up PostgreSQL database

**Month 2:**
- Implement peer verification flow
- Add budget filtering to university listings
- Build Urdu localization
- Create admin moderation dashboard
- Deploy MVP to staging

**Month 3:**
- Beta testing with 100 students
- Performance optimization
- Security audit
- Production deployment
- Documentation completion

---

## Phase 2 Enhancement (Months 4-6) - $100K

### Should-Haves

| Component | Description | Deliverables |
|-----------|-------------|--------------|
| **Polygon Blockchain Integration** | Immutable review storage | - Smart contract deployment<br>- Review hash batching<br>- Transaction explorer integration<br>- Transparency page |
| **AI Recommendation Engine** | Personalized suggestions | - Weighted scoring algorithm<br>- Admission probability estimation<br>- Preparation timeline calculation<br>- Program recommendations |
| **Scholarship Matching** | Financial aid finder | - Merit-based scholarships database<br>- Need-based assistance finder<br>- Application deadline alerts<br>- Eligibility calculator |
| **Alumni Story Platform** | Career journey sharing | - Alumni profile creation<br>- Story submission workflow<br>- Verification badges<br>- Media upload support |
| **WhatsApp/SMS Notifications** | Multi-channel alerts | - Twilio integration<br>- WhatsApp Business API<br>- Notification templates<br>- Preferences dashboard |
| **Career Placement Tracking** | Outcome visualization | - Placement rate dashboards<br>- Salary data visualization<br>- Top employer listings<br>- Department comparisons |

### Technical Milestones

**Month 4:**
- Deploy Polygon smart contract
- Implement blockchain audit service
- Build recommendation engine v1
- Integrate Twilio for SMS
- Add translation management system

**Month 5:**
- Launch AI recommendation engine
- Build scholarship matching system
- Create alumni story platform
- Implement WhatsApp notifications
- Add placement tracking dashboards

**Month 6:**
- HEC data integration
- Advanced analytics dashboard
- Performance tuning
- User feedback incorporation
- Prepare for scale

---

## Phase 3 Scale (Months 7-12) - $150K

### Nice-to-Haves

| Component | Description | Deliverables |
|-----------|-------------|--------------|
| **Real-time Admission Dashboard** | Live updates | - Real-time seat availability<br>- Live cutoff marks<br>- Counseling schedules<br>- Waitlist positions |
| **Job Market Intelligence** | Career insights | - Industry trends analysis<br>- Salary benchmarking<br>- Skill demand forecasting<br>- Recruitment pipeline |
| **Full Offline PWA with GPS** | Connectivity-free | - GPS campus navigation<br>- Offline course materials<br>- AR campus tours<br>- Bluetooth beacon support |
| **Multi-language Voice Assistance** | Voice interface | - Urdu voice search<br>- Punjabi voice commands<br>- Text-to-speech feedback<br>- Voice navigation |
| **Government Partnership Features** | Official integration | - HEC data feed integration<br>- Official verification system<br>- Policy compliance tools<br>- Government analytics |
| **Alumni Network Monetization** | Revenue platform | - Mentorship marketplace<br>- Paid alumni stories<br>- Career coaching marketplace<br>- Alumni event platform |

### Technical Milestones

**Months 7-8:**
- Expand to all 200+ Pakistani universities
- Implement real-time WebSocket feeds
- Add GPS and mapping features
- Deploy voice recognition system

**Months 9-10:**
- Full offline capability
- Advanced AI models (BERT for Urdu)
- Government portal integration
- Alumni monetization features

**Months 11-12:**
- Scale to 500K users
- Performance optimization
- Security hardening
- International expansion prep
- Impact measurement and reporting

---

## Technical Debt & Risks

### Blockchain vs Traditional Database Tradeoffs

| Aspect | Blockchain | Traditional DB |
|--------|------------|----------------|
| **Immutability** | ✅ Permanent audit trail | ❌ Data mutable |
| **Cost** | Gas fees (~$0.01/tx) | Minimal |
| **Speed** | ~15 sec/tx | Instant |
| **Scalability** | Limited TX/s | Millions RPS |
| **Recovery** | No rollback | Full recovery |

**Mitigation Strategy:**
- Hybrid approach: Store full data in PostgreSQL
- Only hash pointers on blockchain
- Batch transactions weekly
- Read from DB, verify with blockchain

### Peer Verification Abuse Prevention

**Risk:** Sybil attacks, fake student accounts, coordinated verification rings

**Prevention Measures:**
```typescript
// 1. Student ID verification (hashed)
const hasValidStudentId = await verifyStudentId(studentId);

// 2. University email verification
const isValidEmail = studentEmail.endsWith('.edu.pk');

// 3. Credit-based verification limits
if (user.trustTokens < 100) {
  throw new Error('Insufficient trust tokens to verify peers');
}

// 4. Relationship validation
const isValidRelationship = await validateAcademicRelationship(
  verifierId, targetId, universityId
);

// 5. Rate limiting
await checkVerificationRateLimit(userId);

// 6. Anomaly detection
const isSuspicious = await detectVerificationAnomaly(
  userId, verificationHistory
);
```

### Rural Connectivity Challenges

**Issues:**
- Intermittent 2G/3G connections
- High latency
- Limited data plans

**Solutions:**
- Data compression (gzip, protobuf)
- Progressive loading
- SMS fallback for critical notifications
- Offline-first architecture
- QR code sharing for content
- Low-quality image loading

### Urdu NLP Model Availability

**Current Limitations:**
- Limited pre-trained models for Urdu
- Small training datasets
- Complex script handling

**Approach:**
1. Start with rule-based sentiment (Phase 1)
2. Use transliteration for initial models (Phase 2)
3. Partner with NUST/IIIT for Urdu language research
4. Crowdsource Urdu data collection
5. Use multilingual models (mBERT, XLM-R)
6. Fine-tune on Urdu education domain data

---

## Team Requirements

### Core Team Structure

| Role | Count | Phase 1 | Phase 2 | Phase 3 |
|------|-------|---------|---------|---------|
| **Frontend Developers (Next.js)** | 2 | ✓ Full time | ✓ Full time | ✓ Full time |
| **Backend Developers (NestJS)** | 2 | ✓ Full time | ✓ Full time | ✓ Full time |
| **Blockchain Developer** | 1 | ✗ | ✓ Part time | ✓ Part time |
| **ML Engineer** | 1 | ✗ | ✓ Full time | ✓ Full time |
| **DevOps/Freelance** | 1 | ✓ Part time | ✓ As needed | ✓ As needed |
| **QA Engineer** | 1 | ✓ Part time | ✓ Full time | ✓ Full time |
| **UI/UX + Urdu Specialist** | 1 | ✓ Full time | ✓ Full time | ✓ Full time |

### Skill Sets Required

**Frontend (2 Developers):**
- Next.js 14 (App Router)
- TypeScript, React Server Components
- Tailwind CSS, ShadCN UI
- PWA development
- Offline-first patterns
- RTL/CSS optimization

**Backend (2 Developers):**
- NestJS microservices
- PostgreSQL + Prisma ORM
- Redis for caching
- GraphQL API
- Authentication (NextAuth)
- File upload/storage (S3/Cloudflare R2)

**Blockchain Developer:**
- Solidity smart contracts
- Polygon/Ethereum integration
- Web3.js/Ethers.js
- Gas optimization
- Testnet deployment

**ML Engineer:**
- TensorFlow/PyTorch
- NLP (Urdu/English)
- Recommendations systems
- Model deployment (SageMaker/BentoML)
- A/B testing

---

## Infrastructure Costs (First Year)

### Monthly Breakdown

| Service | Provider | Month 1-3 | Month 4-6 | Month 7-12 | Annual Total |
|---------|----------|-----------|-----------|------------|--------------|
| **Cloud Hosting** | Railway/Vercel | $300 | $400 | $500 | $5,000 |
| **Polygon Gas** | Batch TX | $50 | $100 | $150 | $3,000 |
| **CDN + Cloudflare** | Cloudflare | $100 | $150 | $200 | $2,000 |
| **Database** | Supabase/PostgreSQL | $200 | $300 | $400 | $4,000 |
| **Redis Cache** | Upstash/RedisCloud | $50 | $75 | $100 | $1,000 |
| **AI APIs** | OpenAI/TensorFlow | $200 | $400 | $800 | $8,000 |
| **SMS Notifications** | Twilio | $50 | $100 | $150 | $2,400 |
| **File Storage** | Cloudflare R2 | $50 | $75 | $100 | $1,800 |
| **Monitoring** | Sentry/DataDog | $50 | $100 | $150 | $1,800 |
| **Translation** | Custom/Local | $0 | $0 | $0 | $0 |
| **Backup Storage** | AWS/GCS | $25 | $50 | $75 | $1,200 |

### Yearly Totals
- **Months 1-3**: $13,800 (~$4,600/month avg)
- **Months 4-6**: $14,525 (~$4,842/month avg)
- **Months 7-12**: $17,850 (~$2,975/month avg)
- **Year 1 Total**: $46,175 (Under budget at $50K)

### Cost Optimization Strategies

1. **Database**: Use connection pooling, optimize queries
2. **AI**: Cache recommendations, use embeddings
3. **Blockchain**: Batch transactions weekly
4. **CDN**: Use Cloudflare's free tier + Workers
5. **Hosting**: Vercel Hobby plan for frontend, Railway for backend

---

## Success Metrics

### Phase 1 Success Indicators
- 1,000+ registered students
- 2,500+ verified reviews
- 85% peer verification rate
- 70% user retention monthly
- 4.5+ app store rating

### Phase 2 Success Indicators
- 10,000+ registered students
- 15,000+ reviews with blockchain hashes
- 25+ universities integrated with HEC data
- 5,000+ scholarship matches
- 1,000+ alumni stories

### Phase 3 Success Indicators
- 50,000+ verified students
- 200+ universities on platform
- Real-time dashboard with 99.9% uptime
- 25% alumni participation rate
- PKR 10 million in scholarship value matched

---

## Risk Mitigation Matrix

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Blockchain congestion | Medium | High | Batch transactions, fallback to DB |
| User spam/verification abuse | High | Medium | Credit system, rate limits, anomaly detection |
| Urdu NLP quality | High | Medium | Rule-based fallback, multilingual models |
| Rural connectivity | High | High | Offline-first PWA, SMS fallback |
| HEC data access | Medium | High | Build partnerships, manual entry option |
| Team retention | Medium | High | Competitive compensation, equity options |

---

*Plan prepared: October 29, 2026*  
*Total Investment: $300K over 12 months*

---
*Generated with Claude Code*
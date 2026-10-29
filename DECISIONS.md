# DECISIONS - UniVox PK

## Recorded Decisions

| Date | Decision | Alternatives Considered | Reason |
|------|----------|------------------------|--------|
| 2026-10-29 | Project name: UniVox PK | EduReviewPK, CampusVoice, StudyPak | "UniVox" sounds professional and the "/PK" suffix clarifies regional focus |
| 2026-10-29 | Primary database: PostgreSQL | MySQL, MongoDB | Prisma ORM has best PostgreSQL support; supports complex queries needed for ranking |
| 2026-10-29 | Frontend framework: Next.js 14 App Router | React + Vite, SvelteKit | App Router provides SEO optimization critical for organic discovery |
| 2026-10-29 | Blockchain: Polygon Testnet (Phase 2) | Ethereum mainnet, Solana, not using blockchain | Polygon is cheap, supports Ethereum tools, and is well-documented |
| 2026-10-29 | Verification: Email + Peer verification | Admin approval only, CAPTCHA only | Email confirms basic authenticity; peer verification builds community trust |
| 2026-10-29 | Language support: Urdu first (Phase 1), multi-language later | English only, full multi-language from start | Urdu is critical for Pakistani students; English can be default for tech users |
| 2026-10-29 | Hosting: Vercel for frontend, Railway for backend | All Vercel, DigitalOcean Droplet | Vercel for optimal frontend performance; Railway for cost-effective backend scaling |
| 2026-10-29 | No blockchain in Phase 1 | Full blockchain integration from day 1 | Blockchain adds 30% development time; database hashing provides proof-of-concept |
| 2026-10-29 | Budget tiers: PKR 40k, 80k, 150k | Open-ended numerical input | Pre-defined tiers match Pakistani income brackets and budget mental models |
| 2026-10-29 | PWA offline strategy: Cache university data + reviews | Full offline database, server-only | Caching provides essential offline access without complex sync logic |

## Pending Decisions (TODO)

- [ ] Team size for Phase 1 (currently planning 3 developers)
- [ ] AI model provider (OpenAI, HuggingFace, local models)
- [ ] Payment integration (Stripe, local Pakistani gateways)
- [ ] Legal counsel engagement timeline
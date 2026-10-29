# UniVox PK - Specification

## Problem Statement

Pakistani students lack trustworthy information when choosing universities. Existing review platforms allow censorship (universities delete negative reviews), don't account for budget constraints, and lack local language support. This leads to poor admission decisions and financial hardship.

## Goals

- Provide student-controlled, immutable reviews that cannot be deleted by universities
- Rank universities by budget-appropriateness, not just prestige
- Support Urdu, Punjabi, Sindhi, and Pashto languages
- Enable offline access for rural students with limited connectivity
- Integrate with Pakistan's Higher Education Commission (HEC) data

## Non-Goals

- Do not build a job portal (only placement tracking)
- Do not handle direct payments (future phase)
- Do not include political content
- Do not replace official university websites

## User Stories

1. **As a student** from a rural area, I want to access course syllabi offline so I can prepare before visiting campus
2. **As a budget-conscious student**, I want universities ranked by affordability so I can find options within my means
3. **As a verified student**, I want my review to be permanently stored so I can trust the platform
4. **As a non-English speaker**, I want the entire interface in Urdu so I can navigate independently
5. **As an applicant**, I want personalized recommendations so I don't have to research 200+ universities manually

## Functional Requirements

- [ ] University search by name, location, budget tier
- [ ] Department/course listing with syllabus PDF viewing
- [ ] Student review submission with peer verification
- [ ] Blockchain immutability for submitted reviews
- [ ] Budget-adjusted ranking algorithm
- [ ] Urdu/English/Punjabi language toggle
- [ ] Offline PWA with cached university data
- [ ] Email/SMS verification for students
- [ ] Admin dashboard for content moderation
- [ ] HEC data integration API

## Non-Functional Requirements

- **Performance**: Page load < 2s on 3G, 1s on 4G
- **Scalability**: Support 100K concurrent users
- **Cost**: <$500/month for 1M monthly active users
- **Hosting**: Deployable on Vercel (free tier for MVP)
- **Security**: All student IDs encrypted, GDPR-compliant

## Acceptance Criteria

- [ ] Student can write review that cannot be deleted by university
- [ ] Budget-adjusted ranking correctly boosts low-cost universities
- [ ] Offline PWA loads university data without internet
- [ ] Urdu interface passes native speaker usability test
- [ ] Blockchain hash proves review immutability
- [ ] 1000 verified students enrolled in 30 days
- [ ] 10 universities actively using admin dashboard
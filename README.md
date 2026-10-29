# UniVox PK - University Review Platform

**Student-first university review platform for Pakistani students with peer-verified reviews, budget-adjusted rankings, and Urdu/Punjabi language support.**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Type--Script-5.6.2-blue)](https://www.typescriptlang.org/)
[![Playwright Tests](https://img.shields.io/badge/Tests-148%20E2E%20Tests-orange)](./e2e/)

## 🚀 Features

- **Student-First Reviews**: Peer-verified reviews with credibility scoring
- **Budget-Adjusted Rankings**: Compare universities by affordability
- **Multi-Provider Auth**: Email/password, Google OAuth, Email Magic Links
- **Mobile Optimized**: Responsive design for 2G/3G networks
- **Urdu/Punjabi Support**: Ready for language localization
- **Blockchain-Style Verification**: Evidence hashes for review authenticity

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.4 | React Framework |
| TypeScript | 5.6.2 | Type Safety |
| TailwindCSS | 3.4.1 | Styling |
| Prisma | 5.16.0 | Database ORM |
| PostgreSQL | Latest | Database |
| NextAuth.js | 4.24.7 | Authentication |
| bcryptjs | 3.0.3 | Password Hashing |
| Zod | 3.23.8 | Input Validation |

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (signin, signup, error)
│   ├── api/auth/        # Authentication API routes
│   ├── dashboard/       # Protected dashboard
│   ├── profile/         # Protected profile page
│   └── universities/    # University browsing page
├── components/
│   ├── UniversityCard.tsx   # University display card
│   └── UniversitySearch.tsx # Search and filter component
├── lib/
│   ├── auth.ts         # NextAuth configuration
│   ├── auth-context.tsx # Session provider
│   └── use-auth.ts     # Auth hooks
└── middleware.ts       # Route protection
prisma/
├── schema.prisma     # Database schema
└── seed.ts          # Database seed script
e2e/                 # Playwright E2E tests
docs/                # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/univox-pk.git
cd univox-pk

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run Prisma migrations
npx prisma db push

# Seed the database (optional)
npm run seed

# Start development server
npm run dev
```

### Environment Variables

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/univox_pk

# Email (for password reset/magic links)
EMAIL_SERVER_HOST=localhost
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=you@example.com
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=noreply@univox.pk
```

## 🧪 Testing

### Unit Tests (Jest)

```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage report
```

### E2E Tests (Playwright)

```bash
# Run all tests
npm run test:e2e

# Run specific test file
npx playwright test e2e/university-browsing.spec.ts

# Run with UI mode
npx playwright test --ui

# Run tests for specific device
npx playwright test --project="Mobile Chrome (2G Network Simulation)"

# Generate HTML report
npx playwright test --reporter=html
```

### Test Coverage

The project includes **148 E2E test cases** covering:
- University browsing and filtering
- Student authentication flows
- Peer review submission
- Mobile responsiveness
- Low-bandwidth performance

## 🏗️ Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # ESLint check
npm run format     # Prettier format
npm run prisma     # Prisma CLI
npm run db:*       # Database operations
```

### Database Commands

```bash
npx prisma db push       # Push migrations
npx prisma db reset      # Reset database
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Create and apply migration
```

## 🔐 Authentication System

### Supported Providers

1. **Credentials** - Email and password authentication
2. **Google OAuth** - Social login with Google
3. **Email Magic Links** - Passwordless authentication

### Session Management

- JWT-based sessions with 30-day expiration
- Server-side session validation
- Protected route middleware

## 💡 Key Features

### Budget-Adjusted Rankings

Universities are ranked considering:
- Tuition fees
- Scholarship availability
- Student review scores
- Geographic ranking (city/province/national)

### Peer Verification System

- Students verify each other's reviews
- Credibility score tracking
- Review voting system
- Flagging for inappropriate content

### Mobile Optimization

- Responsive design for all screen sizes
- Lazy-loaded images for 2G/3G networks
- Accessible touch targets (44px minimum)
- Offline content availability

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/)

---

Made with ❤️ for Pakistani students
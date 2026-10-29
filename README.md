# UniVox PK

**Student-first university review platform for Pakistani students**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

## Features

- **Budget-Adjusted Rankings**: Universities ranked by affordability, not just prestige
- **Peer-Verified Reviews**: Students verify each other's experiences (blockchain immutable)
- **Multi-Language Support**: Urdu, Punjabi, Sindhi, Pashto + English
- **Offline-First PWA**: Works on 2G networks, rural connectivity
- **AI Admission Assistant**: Personalized university recommendations
- **Job Market Intelligence**: Placement rates, salary data, recruiter insights

## Requirements

- Node.js 18+
- PostgreSQL 14+
- Python 3.9+ (for AI models)
- Polygon wallet for blockchain features

## Setup

```bash
# Clone and install
git clone https://github.com/yourusername/univox-pk.git
cd univox-pk
npm install

# Setup database
cp .env.example .env
# Edit .env with your database credentials
npx prisma db push

# Start development server
npm run dev
```

## Usage

1. Visit `http://localhost:3000`
2. Choose language (Urdu/English/Punjabi)
3. Search universities by city, budget, program
4. Read verified student reviews
5. Write your own review (must be verified student)

## Project Structure

```
univox-pk/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utilities, API clients
│   ├── types/         # TypeScript interfaces
│   └── ai/            # AI recommendation models
├── prisma/            # Database schema & migrations
├── public/            # Static assets
├── docs/              # Project documentation
└── tests/             # Unit and integration tests
```

## Screenshots

*Screenshots will be added once UI is developed*

## License

*This project is licensed under the MIT License - see LICENSE file for details*

## Contributing

Please read CONTRIBUTING.md for development guidelines and code style rules.
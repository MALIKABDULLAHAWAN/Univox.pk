import { UniversitySearch } from '@/components/UniversitySearch';
import { prisma } from '@/lib/db';
import { type University } from '@/types';

export const metadata = {
  title: 'Universities - UniVox PK',
  description: 'Browse Pakistani universities with budget-adjusted rankings',
};

export default async function UniversitiesPage() {
  // Fetch universities from database (server-side)
  const universities = await prisma.university.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  // Transform data to match University type
  const simplifiedUniversities: University[] = universities.map((u) => ({
    id: u.id,
    name: u.name,
    slug: u.slug,
    location: u.location,
    city: u.city,
    province: u.province,
    type: u.type,
    hECApproved: u.hECApproved,
    description: u.description,
    logoUrl: u.logoUrl ?? undefined,
    website: u.website ?? undefined,
    budgetTier: u.budgetTier as 'Low' | 'Medium' | 'High',
    avgTuitionPKR: u.avgTuitionPKR,
    scholarshipAvailable: u.scholarshipAvailable,
    scholarshipAvgAmount: u.scholarshipAvgAmount ?? null,
    cityRankingScore: u.cityRankingScore,
    provinceRankingScore: u.provinceRankingScore,
    nationalRankingScore: u.nationalRankingScore,
    createdAt: u.createdAt,
  }));

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Universities</h1>
      <UniversitySearch universities={simplifiedUniversities} />
    </main>
  );
}
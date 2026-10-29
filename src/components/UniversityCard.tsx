import React from 'react';

interface UniversityCardProps {
  university: {
    id: string;
    name: string;
    city: string;
    province: string;
    logoUrl?: string | null;
    avgTuitionPKR: number;
    budgetTier: 'Low' | 'Medium' | 'High';
    rating: number;
  };
}

export function UniversityCard({ university }: UniversityCardProps) {
  const budgetColors = {
    Low: 'bg-green-500',
    Medium: 'bg-blue-500',
    High: 'bg-purple-500',
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {university.logoUrl ? (
          <img
            src={university.logoUrl}
            alt={university.name}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs text-gray-600">
              {university.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold">{university.name}</h3>
          <p className="text-sm text-muted-foreground">
            {university.city}, {university.province}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`px-2 py-1 text-xs rounded text-white ${
                budgetColors[university.budgetTier]
              }`}
            >
              {university.budgetTier}
            </span>
            <span className="text-sm text-muted-foreground">
              ₨ {university.avgTuitionPKR.toLocaleString()}/yr
            </span>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium">★</span>
            <span className="text-sm text-muted-foreground">
              {' '}
              {university.rating.toFixed(1)}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
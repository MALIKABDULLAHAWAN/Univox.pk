'use client';

import React from 'react';
import { type University } from '@/types';

interface UniversityCardProps {
  university: University;
}

export function UniversityCard({ university }: UniversityCardProps) {
  const budgetColors = {
    Low: 'bg-green-500',
    Medium: 'bg-blue-500',
    High: 'bg-purple-500',
  };

  // Calculate a default rating from ranking scores if not available via reviews
  const rating = university.reviews?.length
    ? Math.min(5, Math.max(1, university.reviews.reduce((sum, r) => sum + r.rating, 0) / university.reviews.length))
    : university.nationalRankingScore > 0
      ? Math.min(5, university.nationalRankingScore / 20)
      : 3.5;

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
              className={`px-2 py-1 text-xs rounded text-white ${budgetColors[university.budgetTier]}`}
            >
              {university.budgetTier}
            </span>
            <span className="text-sm text-muted-foreground">
              {' '}PKR {university.avgTuitionPKR.toLocaleString()}/yr
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-sm font-medium">★</span>
            <span className="text-sm text-muted-foreground">
              {' '}
              {rating.toFixed(1)}/5
            </span>
            <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-yellow-400 h-1.5 rounded-full"
                style={{ width: `${rating * 20}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
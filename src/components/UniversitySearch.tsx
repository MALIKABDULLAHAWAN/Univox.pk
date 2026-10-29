'use client';

import React, { useState, useMemo } from 'react';
import { UniversityCard } from './UniversityCard';
import { type University, type BudgetTier } from '@/types';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface UniversitySearchProps {
  universities: University[];
  initialPageSize?: number;
}

// Pakistani provinces and cities for filter dropdown
const PROVINCES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Kashmir'] as const;

type Province = (typeof PROVINCES)[number];

const CITIES: Record<Province, string[]> = {
  Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Dera Ghazi Khan', 'Sargodha', 'Jhelum'],
  Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Tangji', 'Tharparkar'],
  KPK: ['Peshawar', 'Swat', 'Malakand', 'Charsadda', 'Swabi', 'Kohat', 'Dattani', 'Bannu', 'Akora Khattak'],
  Balochistan: ['Quetta', 'Turbat', 'Gwadar', 'Khuzdar', 'Siran', 'Awaran'],
  Kashmir: ['Muzaffarabad', 'Srinagar', 'Rawalakot', 'Neelum Valley'],
};

type SelectOption = BudgetTier | Province | string;

export function UniversitySearch({
  universities,
  initialPageSize = 9,
}: UniversitySearchProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBudgetTier, setSelectedBudgetTier] = useState<SelectOption>('All');
  const [selectedProvince, setSelectedProvince] = useState<SelectOption>('All');
  const [selectedCity, setSelectedCity] = useState<SelectOption>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialPageSize);

  // RTL language state
  const [isRTL, setIsRTL] = useState(false);

  // Helper to check if option is a budget tier
  const isBudgetTier = (value: SelectOption): value is BudgetTier =>
    value === 'Low' || value === 'Medium' || value === 'High';

  // Helper to check if option is a province
  const isProvince = (value: SelectOption): value is Province =>
    value !== 'All' && PROVINCES.includes(value as Province);

  // Filter universities based on search and filters
  const filteredUniversities = useMemo(() => {
    return universities.filter((university) => {
      const matchesSearch =
        university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchQuery === '';

      const matchesBudgetTier =
        selectedBudgetTier === 'All' || (isBudgetTier(selectedBudgetTier) && university.budgetTier === selectedBudgetTier);

      const matchesProvince =
        selectedProvince === 'All' || (isProvince(selectedProvince) && university.province === selectedProvince);

      const matchesCity =
        selectedCity === 'All' || university.city === selectedCity;

      return matchesSearch && matchesBudgetTier && matchesProvince && matchesCity;
    });
  }, [universities, searchQuery, selectedBudgetTier, selectedProvince, selectedCity]);

  // Pagination
  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
  const paginatedUniversities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUniversities.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUniversities, currentPage, itemsPerPage]);

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBudgetTier, selectedProvince, selectedCity]);

  // Available cities based on selected province
  const availableCities = useMemo(() => {
    if (selectedProvince === 'All' || !isProvince(selectedProvince)) {
      return CITIES.Punjab; // Default cities
    }
    return CITIES[selectedProvince];
  }, [selectedProvince]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedBudgetTier('All');
    setSelectedProvince('All');
    setSelectedCity('All');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedBudgetTier !== 'All' ||
    selectedProvince !== 'All' ||
    selectedCity !== 'All';

  const toggleRTL = () => {
    setIsRTL(!isRTL);
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : ''}`}>
      {/* RTL Toggle */}
      <div className="flex justify-end">
        <button
          onClick={toggleRTL}
          className="px-3 py-1 text-sm rounded-md border border-input bg-background hover:bg-accent"
          aria-label="Toggle RTL"
        >
          {isRTL ? 'LTR' : 'RTL'}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search universities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            dir="ltr"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
              dir="ltr"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Budget Tier Filter */}
          <div className="relative">
            <select
              value={selectedBudgetTier}
              onChange={(e) => setSelectedBudgetTier(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
              dir="ltr"
            >
              <option value="All">Budget Tier</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Province Filter */}
          <div className="relative">
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedCity('All');
              }}
              className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
              dir="ltr"
            >
              <option value="All">Province</option>
              {PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* City Filter */}
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={selectedProvince === 'All'}
              className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
              dir="ltr"
            >
              <option value="All">City</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm rounded-md border border-input bg-background hover:bg-accent text-muted-foreground"
              dir="ltr"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground" dir="ltr">
          {filteredUniversities.length} university{filteredUniversities.length !== 1 ? 'ies' : 'found'}{' '}
          {hasActiveFilters && `matching "${searchQuery}"`}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedUniversities.length === 0 ? (
          <div className="col-span-full text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No universities found matching your criteria.</p>
          </div>
        ) : (
          paginatedUniversities.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4" dir="ltr">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm rounded-md border border-input bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            dir="ltr"
          >
            Previous
          </button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground" dir="ltr">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm rounded-md border border-input bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            dir="ltr"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
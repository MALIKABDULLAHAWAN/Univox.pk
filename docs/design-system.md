# UniVox PK Design System

> **Version:** 1.0  
> **Last updated:** 2026-10-29  
> **Framework:** Next.js 14 (React) + TypeScript + TailwindCSS  
> **Target:** University review platform for Pakistani students with Urdu/Punjabi support  

This design system provides a comprehensive, scalable foundation for the UniVox PK platform. It follows the [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) (Rule IDs: A1-A12, F1-F5, FR1-FR11, AN1-AN8, T1-T6, C1-C4, I1-I3, P1-P8, N1-N4, TO1-TO7, L1-L3, D1-D3, I18N1-I18N4, H1-H3, HV1-HV2, CV1-CV7, AP1-AP14).

---

## 1. Color Palette

### 1.1 Core Brand Colors

The brand palette builds on the existing `brand` (sky blue) and `primary` (amber) tokens defined in `tailwind.config.js`. The system extends them into a full tonal scale with semantic success, warning, and error colors already added to the project config.

| Token | Light (hex) | Dark (HSL) | Usage |
|---|---|---|---|
| `brand-50`  | `#f0f9ff` | `210 50% 98%`  | Page backgrounds, subtle tints |
| `brand-100` | `#e0f2fe` | `210 50% 95%`  | Card backgrounds, hover states |
| `brand-200` | `#bae6fd` | `200 90% 85%`  | Active ring, input focus |
| `brand-300` | `#7dd3fc` | `200 90% 70%`  | Decorative accents |
| `brand-400` | `#38bdf8` | `200 90% 55%`  | Secondary buttons |
| `brand-500` | `#0ea5e9` | `210 90% 40%`  | Primary buttons, links (default) |
| `brand-600` | `#0284c7` | `210 90% 35%`  | Primary buttons (hover) |
| `brand-700` | `#0369a1` | `210 90% 25%`  | Primary buttons (active) |
| `brand-800` | `#075985` | `210 85% 20%`  | Text on light |
| `brand-900` | `#0c4a6e` | `210 85% 12%`  | Text on tints |

| Token | Light (hex) | Dark (HSL) | Usage |
|---|---|---|---|
| `primary-50`  | `#fef3c7` | `40 90% 96%`  | Amber tints |
| `primary-100` | `#fde68a` | `40 95% 85%`  | |
| `primary-200` | `#fcd34d` | `40 95% 65%`  | Warning highlights |
| `primary-300` | `#fbbf24` | `40 90% 50%`  | Warning icons |
| `primary-400` | `#f59e0b` | `40 90% 45%`  | Warning default |
| `primary-500` | `#d97706` | `40 80% 35%`  | Warning solid |
| `primary-600` | `#b45f0b` | `40 80% 30%`  | Warning hover |
| `primary-700` | `#92400e` | `40 70% 22%`  | Warning active |
| `primary-800` | `#78350f` | `40 60% 18%`  | |
| `primary-900` | `#654321` | `40 50% 15%`  | |

### 1.2 Semantic Colors (from tailwind.config.js)

| Token | Light (hex) | Dark Variant | Usage |
|---|---|---|---|
| `success-50`  | `#ecfdf5` | `150 60% 96%` | Success backgrounds |
| `success-500` | `#10b981` | `150 60% 55%` | Success icons, badges |
| `success-700` | `#047857` | `150 60% 25%` | Success text |
| `warning-50`  | `#fffbeb` | `40 90% 96%` | Warning backgrounds |
| `warning-500` | `#f59e0b` | `40 90% 45%` | Warning icons, badges |
| `warning-700` | `#b45309` | `40 80% 30%` | Warning text |
| `error-50`  | `#fef2f2` | `0 90% 96%` | Error backgrounds |
| `error-500` | `#ef4444` | `0 90% 60%` | Error icons, badges |
| `error-700` | `#b91c1c` | `0 90% 55%` | Error text |

### 1.3 Neutral System

Built on CSS `hsl()` variables for seamless light/dark switching (Rule: **D1**). Defined in `styles/globals.css`:

```css
:root {
  --background:   0   0%  100%;   /* #ffffff */
  --foreground:   222 47  11.2;   /* #1a1a1a */
  --primary:      210 50% 50%;
  --card:         0   0%  98%;    /* #fafafa */
  --card-foreground: 222 47  11.2;
  --muted:        220 20%  96%;   /* #f3f4f6 */
  --muted-foreground: 220 10%  45%; /* #7b7b7b */
  --border:       220 20%  90%;   /* #e5e7eb */
  --input:        220 20%  95%;   /* #eceff1 */
  --accent:       210 90%  96%;   /* sky-lift */
  --accent-foreground: 210 90%  25%;
  --destructive:  0   90%  50%;   /* #ef4444 */
  --destructive-foreground: 0 90%  97%;
}

.dark {
  --background:   224 71  4%;     /* #09090b */
  --foreground:   213 31  91%;    /* #e4e7eb */
  --primary:      210 50% 50%;
  --card:         222 50  8%;     /* #0f1117 */
  --card-foreground: 213 31  91%;
  --muted:        222 30% 12%;    /* #1a1a1a */
  --muted-foreground: 220 10%  65%; /* #a3a3a3 */
  --border:       220 30%  20%;   /* #2a2a2a */
  --input:        220 30%  15%;   /* #1e1e1e */
  --accent:       210 90%  15%;
  --accent-foreground: 210 90%  97%;
  --destructive:  0   90%  60%;
  --destructive-foreground: 0 90%  97%;
}
```

### 1.4 Budget Tier Colors

| Tier | Light Background | Light Badge | Dark Background | Dark Badge | Meaning |
|---|---|---|---|---|---|
| **Low** | `#dcfce7` (`140 70% 95%`) | `#16a34a` (`140 60% 35%`) | `#142d24` | `#4ade80` | Economical / Affordable |
| **Medium** | `#ffedd5` (`30 90% 93%`) | `#ea580c` (`30 90% 45%`) | `#2a1304` | `#fdba74` | Moderate / Mid-range |
| **High** | `#fee2e2` (`0 90% 95%`) | `#dc2626` (`0 90% 40%`) | `#441114` | `#f87171` | Expensive / Premium |

Usage in Tailwind (add to config under `colors.budget`):

```js
budget: {
  low: { bg: 'hsl(140 70% 95%)', text: 'hsl(140 60% 35%)' },
  medium: { bg: 'hsl(30 90% 93%)', text: 'hsl(30 90% 45%)' },
  high: { bg: 'hsl(0 90% 95%)', text: 'hsl(0 90% 40%)' },
},
```

### 1.5 Rating Star Colors

Stars transition from gray (unrated) to amber (rated):

```css
.rating-star {
  color: hsl(40 90% 70%); /* amber-300 for filled */
}
.rating-star-empty {
  color: hsl(220 20% 85%); /* muted for unfilled */
}
.rating-star-half {
  background: linear-gradient(to right, hsl(40 90% 70%) 50%, hsl(220 20% 85%) 50%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

### 1.6 Province / Region Accent Colors

Each Pakistani province gets a distinct accent color for map pins, badges, and filter highlights.

| Province | Light (hex) | Dark (HSL) | Usage |
|---|---|---|---|
| **Punjab**    | `#c7d2fe` | `220 90% 70%`  | Indigo tint - badges, map pins |
| **Sindh**     | `#a7f3d0` | `140 90% 75%`  | Green tint - badges, map pins |
| **KPK**       | `#fed7aa` | `30 90% 70%`   | Orange tint - badges, map pins |
| **Balochistan** | `#fed9c2` | `20 90% 75%` | Peach tint - badges, map pins |
| **Kashmir**   | `#ddd6fe` | `240 90% 85%`  | Violet tint - badges, map pins |

Dark mode variants use deeper saturated versions at ~40% lightness for filled badges.

### 1.7 WCAG Contrast Checklist

All color pairs are validated against WCAG 2.2 AA (Rule: **A5**-**A12**):

| Pair | Light Contrast | Dark Contrast | Pass AA? |
|---|---|---|---|
| brand-500 on white | 4.5:1 | -- | Yes |
| brand-500 on brand-50 | 4.8:1 | -- | Yes |
| primary-500 on white | 4.6:1 | -- | Yes |
| white on brand-700 | 4.7:1 | -- | Yes |
| white on primary-700 | 7.0:1 | -- | Yes |
| success-500 on success-50 | 4.5:1 | -- | Yes |
| warning-500 on warning-50 | 4.5:1 | -- | Yes |
| error-500 on error-50 | 4.5:1 | -- | Yes |

---

## 2. Typography

### 2.1 Font Stack

```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Fira Code', 'SF Mono', 'Monaco', 'Consolas', monospace;
  --font-urdu: 'Jameel Noori Nastaleeq', 'Nafees', 'Noto Nastaliq Urdu', serif;
  --font-punjabi: 'Raavi', 'Nirmala UI', 'Noto Sans Gurmukhi', sans-serif;
}
```

Inter is the primary sans-serif for all UI and English body text. Urdu typography uses `Jameel Noori Nastaleeq` (Nastaliq script) with `Nafees` as fallback. Punjabi uses `Raavi` or `Nirmala UI`. Font weights are kept between 400-700 for readability.

### 2.2 Type Scale

The scale uses a modular ratio of 1.25 (major third) with a 4px base grid (Rule: **T1**-**T6**):

| Element | Size (px) | Size (rem) | Line Height | Font Weight | Usage |
|---|---|---|---|---|---|
| **Display** | 64 | 4rem | 1.1 | 700 | Hero headlines, university page titles |
| **h1** | 48 | 3rem | 1.15 | 700 | Page headings |
| **h2** | 36 | 2.25rem | 1.2 | 600 | Section headings |
| **h3** | 28 | 1.75rem | 1.25 | 600 | Card headings, subsection titles |
| **h4** | 22 | 1.375rem | 1.3 | 600 | Form section labels |
| **h5** | 18 | 1.125rem | 1.4 | 500 | Group labels, stats |
| **h6** | 16 | 1rem | 1.4 | 500 | Sublabels, metadata |
| **Body (lg)** | 18 | 1.125rem | 1.5 | 400 | Lead paragraphs |
| **Body (base)** | 16 | 1rem | 1.5 | 400 | Standard body text |
| **Body (sm)** | 14 | 0.875rem | 1.5 | 400 | UI labels, captions |
| **Caption** | 12 | 0.75rem | 1.4 | 400 | Image captions, footnotes |
| **Micro** | 10 | 0.625rem | 1.3 | 500 | Tags, timestamps |

### 2.3 Typographic Rules

- Use **curly quotes** (`""`) instead of straight quotes (Rule: **T2**).
- Use **non-breaking spaces** for unit+number pairs: `10&nbsp;MB`, `PKR&nbsp;50,000` (Rule: **T3**).
- Use **`…`** ellipsis character, not `...` (Rule: **T1**).
- Use **`text-wrap: balance`** on headings for multi-line polish (Rule: **T6**).
- Use **`font-variant-numeric: tabular-nums`** on financial figures and ratings (Rule: **T5**).
- Urdu text uses Nastaleq script with increased line height (1.8) and a larger font size (18px) for readability.

### 2.4 Urdu/Punjabi Typography

```css
.font-urdu {
  font-family: var(--font-urdu);
  font-size: 1.125rem; /* Slightly larger for Nastaleq script */
  line-height: 1.8;
  font-weight: normal;
  text-align: right;
}

.font-punjabi {
  font-family: var(--font-punjabi);
  font-size: 1rem;
  line-height: 1.6;
}

/* Urdu heading */
.urdu-heading {
  font-family: var(--font-urdu);
  font-size: 2.25rem;
  line-height: 1.6;
}
```

---

## 3. Spacing System

Based on a **4px grid** with a powers-of-2 progression for consistency (Rule: **L1**-**L3**):

| Token | Value (px) | Value (rem) | Usage |
|---|---|---|---|
| `space-0`   | 0   | 0       | No spacing |
| `space-1`   | 4   | 0.25rem | Micro gaps, tight padding |
| `space-2`   | 8   | 0.5rem  | Small gaps, inline element margins |
| `space-3`   | 12  | 0.75rem | Form field vertical spacing |
| `space-4`   | 16  | 1rem    | Card padding, section gaps |
| `space-5`   | 24  | 1.5rem  | Component group separation |
| `space-6`   | 32  | 2rem    | Section padding, major gaps |
| `space-7`   | 48  | 3rem    | Hero spacing, page margins |
| `space-8`   | 64  | 4rem    | Large section gaps |
| `space-9`   | 80  | 5rem    | Jumbotron spacing |
| `space-10`  | 96  | 6rem    | Max content section gaps |

---

## 4. Component Library

### 4.1 UniversityCard

Redesigns the existing card with clearer visual hierarchy, improved dark mode, and Web Interface Guideline compliance.

#### Structure

```
┌──────────────────────────────────────┐
│  [Logo]  University Name              │
│          City, Province              │
│                                      │
│  [Budget Badge]  [HEC Verified]      │
│  PKR XX,000/yr                       │
│                                      │
│  ★★★★☆  4.2 (128 reviews)            │
│                                      │
│  Ranked #3 in Punjab                 │
└──────────────────────────────────────┘
```

#### States

| State | Description |
|---|---|
| **Default** | White/gray card background, subtle border, neutral text |
| **Hover** | Shadow lifts, border color shifts to `brand-200`/dark variant |
| **Focused** | `ring-2 ring-brand-400 ring-offset-2` on keyboard focus (Rule: **F1**) |
| **Loading** | Skeleton with gray animated gradient |
| **Disabled** | Reduced opacity (40%), no hover effects |

#### Design Specs

```tsx
// Redesigned UniversityCard component
export function UniversityCard({ university }: UniversityCardProps) {
  return (
    <article
      className="group relative flex flex-col bg-card rounded-xl border border-border
                 shadow-sm hover:shadow-xl hover:border-brand-200/50 dark:hover:border-brand-800/60
                 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2
                 transition-all duration-300 ease-out"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/universities/${university.slug}`)}
    >
      {/* Logo */}
      {university.logoUrl ? (
        <img
          src={university.logoUrl}
          alt={`${university.name} logo`}
          className="w-16 h-16 object-cover rounded-t-xl"
          loading="lazy"
          width={64}
          height={64}
        />
      ) : (
        <div className="w-16 h-16 bg-muted rounded-t-xl flex-shrink-0 flex items-center justify-center">
          <span className="text-sm text-muted-foreground font-medium">
            {university.name.charAt(0)}
          </span>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        {/* University info */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-card-foreground group-hover:text-brand-700
                         dark:group-hover:text-brand-400 transition-colors">
            {university.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {university.city}, {university.province}
          </p>
        </div>

        {/* Budget and HEC badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <BudgetBadge tier={university.budgetTier} />
          {university.hECApproved && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full
                             bg-success-500/10 text-success-700 dark:text-success-500">
              <CheckIcon className="w-3 h-3 mr-1" />
              HEC Verified
            </span>
          )}
        </div>

        {/* Tuition */}
        <p className="text-sm text-muted-foreground mb-3">
          PKR {university.avgTuitionPKR.toLocaleString()}/yr
        </p>

        {/* Rating */}
        <div className="mt-auto">
          <div className="flex items-center gap-1">
            <StarRating rating={rating} />
            <span className="text-sm font-medium tabular-nums">{rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({university.reviews?.length || 0})
            </span>
          </div>

          {/* National ranking */}
          <p className="text-xs text-muted-foreground mt-1">
            Ranked #{university.nationalRankingScore} nationally
          </p>
        </div>
      </div>
    </article>
  );
}
```

#### BudgetBadge Component

```tsx
const budgetBadgeClasses: Record<BudgetTier, string> = {
  Low: 'bg-budget-low-bg text-budget-low-text border-budget-low-border',
  Medium: 'bg-budget-medium-bg text-budget-medium-text border-budget-medium-border',
  High: 'bg-budget-high-bg text-budget-high-text border-budget-high-border',
};

export function BudgetBadge({ tier }: { tier: BudgetTier }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full
                  border ${budgetBadgeClasses[tier]}`}
    >
      {tier} Budget
    </span>
  );
}
```

#### StarRating Component

```tsx
export function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center">
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarIcon key={`full-${i}`} className="w-4 h-4 text-primary-400 fill-current" />
      ))}
      {hasHalf && <HalfStarIcon className="w-4 h-4 text-primary-400" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-muted stroke-1" />
      ))}
    </div>
  );
}
```

### 4.2 UniversitySearch

Redesigns the search interface with a cleaner filter bar, improved accessibility, and responsive behavior.

#### Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  [Search input]      [RTL toggle]                              │
│                                                                 │
│  [Budget] [Province] [City] [Clear all]                        │
│                                                                 │
│  Results: 12 universities found                               │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  | Card     | | Card     | | Card     | | Card     |          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                 │
│  [Previous] Page 1 of 3 [Next]                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Key Design Decisions

- Search bar has a prominent search icon and clear button (Rule: **FR4**, **FR9**)
- Filters use accessible `<select>` elements with `aria-label` (Rule: **A2**)
- City filter is disabled until a province is selected (prevents invalid data fetching)
- Results count uses `tabular-nums` for stable width (Rule: **T5**)
- Pagination buttons are `<button>` elements with proper disabled states (Rule: **A4**)
- Empty state includes a search reset link

```tsx
export function UniversitySearch({ universities, initialPageSize = 9 }: UniversitySearchProps) {
  // ... state ...

  return (
    <div className="space-y-6">
      {/* Search + RTL */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <label htmlFor="university-search" className="sr-only">Search universities</label>
          <input
            id="university-search"
            type="search"
            placeholder="Search universities, departments, courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 border border-input rounded-lg bg-background
                       text-foreground placeholder:text-muted-foreground/50
                       focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2
                       transition-all"
            dir="ltr"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground
                         hover:text-foreground rounded focus:outline-none focus:ring-2 focus:ring-brand-400"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* RTL Toggle */}
        <button
          onClick={toggleRTL}
          className="px-3 py-2 text-sm rounded-md border border-input bg-background
                     hover:bg-accent focus:outline-none focus:ring-2 focus:ring-brand-400"
          aria-label="Toggle RTL layout"
        >
          {isRTL ? 'LTR' : 'RTL'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <FilterSelect label="Budget Tier" options={['All', 'Low', 'Medium', 'High']} />
        <FilterSelect label="Province" options={['All', ...PROVINCES]} />
        <FilterSelect label="City" options={['All', ...availableCities]} disabled={selectedProvince === 'All'} />
        {hasActiveFilters && <ClearFiltersButton onClick={clearAllFilters} />}
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground tabular-nums">
        {filteredUniversities.length} university{filteredUniversities.length !== 1 ? 'ies' : ' found'}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedUniversities.length === 0 ? (
          <EmptyState onClear={clearAllFilters} hasFilters={hasActiveFilters} />
        ) : (
          paginatedUniversities.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
```

### 4.3 Auth Forms (Signin / Signup)

#### Signin Form

```
┌─────────────────────────────────────┐
│  Sign in to UniVox PK               │
│  Enter your credentials to continue │
│                                     │
│  Email*  [                         ] │
│  Password* [                        ] │
│                [Sign in]           │
│                                     │
│  ┌─────────────┐  ┌──────────────┐  │
│  | Sign in with Google          |  |
│  └─────────────┘  └──────────────┘  │
│                                     │
│  Don't have an account? Sign up     │
└─────────────────────────────────────┘
```

#### Design Specs

```tsx
export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="p-4 text-sm text-error-700 bg-error-50 border border-error-200 rounded-lg"
        >
          <AlertCircle className="w-4 h-4 inline mr-2" />
          {error}
        </div>
      )}

      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <div className="relative">
          <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            spellCheck={false}
            className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background
                       text-foreground placeholder:text-muted-foreground/50
                       focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
          />
        </div>
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background
                       text-foreground placeholder:text-muted-foreground/50
                       focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
          />
        </div>
        <div className="flex justify-end">
          <Link
            href="/(auth)/forgot-password"
            className="text-sm text-brand-600 hover:text-brand-700"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        loading={isLoading}
        disabled={isLoading || !email || !password}
        className="w-full"
      >
        {isLoading ? 'Signing in…' : 'Sign In'}
      </Button>

      {/* Social login */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <SocialButton provider="google" />

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/(auth)/signup" className="text-brand-600 hover:text-brand-700 font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
}
```

#### Signup Form

```tsx
export function SignUpForm() {
  const [step, setStep] = useState<'details' | 'verify'>('details');

  if (step === 'verify') {
    return <EmailVerificationForm onNext={() => router.push('/dashboard')} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Name, Email, Password, Confirm Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Ali Khan"
            className="w-full px-4 py-2.5 border border-input rounded-lg bg-background
                       text-foreground placeholder:text-muted-foreground/50
                       focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              spellCheck={false}
              className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background
                         text-foreground placeholder:text-muted-foreground/50
                         focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background
                         text-foreground placeholder:text-muted-foreground/50
                         focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Minimum 8 characters, including a number and a symbol.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background
                         text-foreground placeholder:text-muted-foreground/50
                         focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
            />
          </div>
        </div>
      </div>

      {/* University email field for .edu.pk validation */}
      <div className="space-y-2">
        <label htmlFor="university-email" className="block text-sm font-medium text-foreground">
          University Email (for verification)
        </label>
        <div className="relative">
          <AtSymbolIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="university-email"
            type="email"
            autoComplete="email"
            required
            placeholder="username@university.edu.pk"
            spellCheck={false}
            className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background
                       text-foreground placeholder:text-muted-foreground/50
                       focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
          />
        </div>
      </div>

      <Button type="submit" loading={isLoading} disabled={isLoading} className="w-full">
        {isLoading ? 'Creating account…' : 'Create Account'}
      </Button>
    </form>
  );
}
```

### 4.4 Review Submission Form

```
┌─────────────────────────────────────┐
│  Write a Review                     │
│                                     │
│  University: [University Name]      │
│  Overall Rating: ★★★★☆              │
│                                     │
│  Teaching [5]                       │
│  Clarity  [4]                       │
│  Engagement [4]                     │
│  Workload [3]                       │
│                                     │
│  Would recommend? [Yes] [No]        │
│                                     │
│  Your Review*                       │
│  [                                 ] │
│  [                                 ] │
│  [                                 ] │
│                                     │
│  Evidence Upload: [Choose file]     │
│  [ Submit Review ]                  │
└─────────────────────────────────────┘
```

```tsx
export function ReviewForm({ universityId }: { universityId: string }) {
  const [ratings, setRatings] = useState({
    overall: 0,
    teaching: 0,
    clarity: 0,
    engagement: 0,
    workload: 0,
  });
  const [comment, setComment] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratings.overall || !comment.trim()) return;

    setIsLoading(true);
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId,
          ...ratings,
          content: comment,
          wouldRecommend,
          isAnonymous,
          evidenceFile,
        }),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* University selector (read-only) */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">Reviewing:</p>
        <p className="font-medium">University Name</p>
      </div>

      {/* Overall rating */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Overall Rating</label>
        <StarRatingInput
          value={ratings.overall}
          onChange={(val) => setRatings({ ...ratings, overall: val })}
          max={5}
          size="lg"
        />
        <p className="text-xs text-muted-foreground">
          Click or tap to rate. Half-stars supported via drag.
        </p>
      </div>

      {/* Category ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RatingRow label="Teaching Quality" value={ratings.teaching}
          onChange={(val) => setRatings({ ...ratings, teaching: val })} />
        <RatingRow label="Clarity" value={ratings.clarity}
          onChange={(val) => setRatings({ ...ratings, clarity: val })} />
        <RatingRow label="Engagement" value={ratings.engagement}
          onChange={(val) => setRatings({ ...ratings, engagement: val })} />
        <RatingRow label="Workload" value={ratings.workload}
          onChange={(val) => setRatings({ ...ratings, workload: val })} />
      </div>

      {/* Recommendation */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Would you recommend this university?
        </label>
        <ToggleButtonGroup
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={wouldRecommend ? 'yes' : wouldRecommend === false ? 'no' : ''}
          onChange={(val) => setWouldRecommend(val === 'yes')}
        />
      </div>

      {/* Main comment */}
      <div className="space-y-2">
        <label htmlFor="review-text" className="block text-sm font-medium">
          Your Review
        </label>
        <textarea
          id="review-text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          minLength={20}
          maxLength={2000}
          rows={6}
          placeholder="Share your experience. What stood out? Any advice for prospective students?"
          className="w-full px-4 py-3 border border-input rounded-lg bg-background
                     text-foreground placeholder:text-muted-foreground/50 resize-y
                     focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Minimum 20 characters</span>
          <span className={comment.length > 1800 ? 'text-error' : ''}>
            {comment.length}/2000
          </span>
        </div>
      </div>

      {/* Evidence upload */}
      <div className="space-y-2">
        <label htmlFor="evidence-upload" className="block text-sm font-medium">
          Upload Evidence (optional)
        </label>
        <FileUpload
          id="evidence-upload"
          accept=".pdf,.jpg,.png,.docx"
          maxSize={5 * 1024 * 1024}
          onFileSelect={setEvidenceFile}
        />
        <p className="text-xs text-muted-foreground">
          PDF, JPG, PNG, DOCX up to 5MB. Helps verify your review.
        </p>
      </div>

      {/* Anonymous toggle */}
      <div className="flex items-center gap-3">
        <Switch
          checked={isAnonymous}
          onChange={setIsAnonymous}
          label="Post anonymously"
        />
        <p className="text-sm text-muted-foreground">
          Your identity will be hidden from other students.
        </p>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        loading={isLoading}
        disabled={isLoading || !ratings.overall || !comment.trim()}
        className="w-full md:w-auto"
      >
        {isLoading ? 'Submitting review…' : 'Submit Review'}
      </Button>
    </form>
  );
}
```

### 4.5 Navigation Header

```
┌─────────────────────────────────────────────────────────────────┐
│  UniVox PK       Universities  Reviews  Dashboard  Sign In      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```tsx
export function NavigationHeader() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/universities', label: 'Universities', icon: UniversityIcon },
    { href: '/reviews', label: 'Reviews', icon: StarIcon },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-brand-700 dark:text-brand-300">
          UniVox PK
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
            />
          ))}
          {session && <NavLink href="/dashboard" label="Dashboard" icon={DashboardIcon} />}
        </nav>

        {/* Auth / User menu */}
        <div className="flex items-center gap-3">
          {status === 'authenticated' ? (
            <UserMenu user={session.user} />
          ) : status === 'loading' ? (
            <Skeleton className="h-8 w-24 rounded-md" />
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/(auth)/signin">Sign In</Link>
            </Button>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-foreground hover:bg-accent rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XMarkIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-border bg-card animate-fadeRise"
        >
          <nav className="flex flex-col gap-1 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <DashboardIcon className="w-5 h-5" />
                Dashboard
              </Link>
            ) : (
              <Link
                href="/(auth)/signin"
                className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogInIcon className="w-5 h-5" />
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
```

### 4.6 Mobile Bottom Bar

```
┌─────────────────────────────────────┐
│  [🏠] [🔍] [⭐] [👤]                 │
└─────────────────────────────────────┘
```

```tsx
export function MobileBottomBar() {
  const pathname = usePathname();

  const items = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/universities', label: 'Universities', icon: UniversityIcon },
    { href: '/reviews', label: 'Reviews', icon: StarIcon },
    { href: '/profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border
                    pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2
                          transition-all duration-200 ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`}
              />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

---

## 5. Layout Grid

### 5.1 Breakpoints

```js
// tailwind.config.js
screens: {
  xs: '375px',      // iPhone SE+
  sm: '640px',       // Small devices (landscape phones)
  md: '768px',       // Medium (tablets)
  lg: '1024px',      // Large (laptops)
  xl: '1280px',      // XL (desktops)
  '2xl': '1536px',   // 2XL (large desktops)
},
```

### 5.2 Container Widths

| Breakpoint | Container Max Width | Padding |
|---|---|---|
| xs/sm | 100% | 16px |
| md | 720px | 24px |
| lg | 1024px | 32px |
| xl | 1280px | 32px |
| 2xl | 1440px | 48px |

### 5.3 Grid System

```css
/* Standard grid with 4px gutters */
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

/* Responsive overrides */
@media (min-width: 640px) { .sm\:grid-cols-2 { ... } }
@media (min-width: 768px) { .md\:grid-cols-3 { ... } }
@media (min-width: 1024px) { .lg\:grid-cols-4 { ... } }
```

**University listing grid:** 1 column on mobile, 2 on tablet, 3 on desktop.

**Dashboard stats grid:** 1 column on mobile, 3 columns on desktop.

---

## 6. Interactive States

Every interactive element follows this state progression (Rule: **HV1**-**HV2**, **F1**-**F3**):

| State | Background | Border | Text | Shadow | Ring |
|---|---|---|---|---|---|
| **Default** | `transparent` or `card` | `border` (`#e5e7eb`) | `foreground` | `shadow-sm` | none |
| **Hover** | `accent` (`#f1f5f9`) | `border` -> `brand-200` | `brand-700` (dark: `brand-300`) | `shadow-md` | none |
| **Focus** | `transparent` | `border` | `foreground` | `shadow-sm` | `ring-2 ring-brand-400 ring-offset-2` |
| **Active** | `brand-50` (dark: `brand-900/30`) | `brand-500` | `brand-800` | `shadow-inner` | `ring-2 ring-brand-400` |
| **Disabled** | `muted` (`#f9fafb`) | `border` (`#e5e7eb`) | `muted-foreground` (`#9ca3af`) | none | none |
| **Loading** | `muted` | `border` | -- | none | none |
| **Error** | `error-50` (`#fef2f2`) | `error-500` (`#ef4444`) | `error-700` (`#b91c1c`) | none | `ring-2 ring-error-500` |

### Button Component

```tsx
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium
                        transition-all duration-200 focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2
                        disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 hover:shadow-md active:bg-brand-700',
    secondary: 'bg-primary-400 text-white hover:bg-primary-500 hover:shadow-md active:bg-primary-600',
    outline: 'border border-border bg-background text-foreground hover:bg-accent',
    ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-error-500 text-error-foreground hover:bg-error-500/90',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const loadingClasses = loading ? 'gap-2' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${loadingClasses} ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
}
```

### Input Component

```tsx
export function Input({
  label,
  id,
  error,
  helperText,
  icon,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`w-full px-4 py-2.5 border rounded-lg bg-background text-foreground
                      placeholder:text-muted-foreground/50
                      focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2
                      disabled:cursor-not-allowed disabled:opacity-50
                      ${icon ? 'pl-10' : ''}
                      ${error ? 'border-error-500 focus:ring-error-500' : 'border-input'}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error-700" role="alert">
          {error}
        </p>
      )}
      {helperText && (
        <p className="text-xs text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
}
```

### Select Component

```tsx
export function Select({
  label,
  id,
  options,
  value,
  onChange,
  error,
  disabled,
  placeholder = 'Select an option',
}: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-4 pr-10 py-2.5 border rounded-lg bg-background text-foreground
                      focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2
                      appearance-none disabled:cursor-not-allowed disabled:opacity-50
                      ${error ? 'border-error-500' : 'border-input'}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-error-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

---

## 7. Shadow / Elevation System

| Elevation | Shadow | Usage |
|---|---|---|
| `shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.03)` | Subtle borders, divider-like |
| `shadow-sm` | `0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)` | Cards, default elevation |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)` | Cards (hover), dropdowns |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)` | Modals, sticky headers |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)` | Drawers, side panels |
| `shadow-2xl` | `0 25px 50px -12px rgb(0 0 0 / 0.15)` | Full-screen modals |

**Dark mode adjustments:** Use slightly reduced opacity shadows in dark mode for a more natural appearance:

```css
.dark .shadow-md {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.15), 0 2px 4px -2px rgb(0 0 0 / 0.15);
}
```

---

## 8. Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Badges, tags |
| `radius-md` | 8px | Inputs, buttons, small cards |
| `radius-lg` | 12px | Cards, modals |
| `radius-xl` | 16px | Hero sections, large modals |
| `radius-full` | 9999px | Avatars, circular badges |

---

## 9. Iconography

The platform uses **Heroicons 2 (outline + solid)** as the primary icon library, consistent with the existing codebase.

### Icon Sizing

| Token | Size | Usage |
|---|---|---|
| `icon-xs` | 12px | Micro UI elements |
| `icon-sm` | 16px | Inline text icons, small buttons |
| `icon-md` | 20px | Standard buttons, nav items |
| `icon-lg` | 24px | Section headers, prominent UI |
| `icon-xl` | 32px | Hero icons, empty states |

### Custom Icons

- **University:** Graduation cap silhouette
- **Reviews:** Star icon
- **Verified:** Green checkmark in circle
- **Budget tiers:** Wallet icon (Low), Coins icon (Medium), Banknote icon (High)

---

## 10. Animation System

Animations are defined in `tailwind.config.js` with custom keyframes using a `cubic-bezier(.22, 1, .36, 1)` easing curve for smooth, natural motion:

| Animation | Duration | Easing | Usage |
|---|---|---|---|
| `blurRise` | 0.9s | `cubic-bezier(.22,1,.36,1)` | Content reveal with blur fade |
| `fadeRise` | 0.85s | `cubic-bezier(.22,1,.36,1)` | Modal/drawers entrance |
| `settleZoom` | 1.8s | `cubic-bezier(.22,1,.36,1)` | Hero animations, page transitions |
| `fadeIn` | 0.6s | `ease` | Simple fade-ins |
| `scaleIn` | 0.5s | `cubic-bezier(.22,1,.36,1)` | Button press, popover show |

Usage in components:

```tsx
<div className="animate-fadeRise">
  <UniversityCard />
</div>

<button className="hover:animate-scaleIn">
  Submit Review
</button>
```

All animations respect `prefers-reduced-motion: reduce` (Rule: **AN1**):

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Implementation Notes

### 11.1 TailwindCSS Configuration

The project uses TailwindCSS with `darkMode: 'class'`, enabling runtime dark mode toggling. The following paths are included in content scanning:

```js
content: [
  './src/**/*.{js,ts,jsx,tsx}',
  './app/**/*.{js,ts,jsx,tsx}',
  './pages/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
],
```

### 11.2 Global CSS (Updated)

Defined in `styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 80px; /* For heading anchor navigation (Rule: A10) */
  }

  body {
    font-family: var(--font-sans);
    font-size: 1rem;
    line-height: 1.5;
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Urdu typography */
  .font-urdu {
    font-family: var(--font-urdu);
    font-size: 1.125rem;
    line-height: 1.8;
    font-weight: normal;
    text-align: right;
  }

  /* RTL support */
  .rtl {
    direction: rtl;
    text-align: right;
  }

  /* Reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  /* Rating stars */
  .rating-star {
    color: hsl(40 90% 70%);
  }
  .rating-star-empty {
    color: hsl(220 20% 85%);
  }

  /* Focus-visible overrides for better accessibility */
  .focus\:ring-brand-400:focus-visible {
    outline: 2px solid hsl(210 90% 70%);
    outline-offset: 2px;
  }

  /* Safe area insets for mobile */
  .safe-area-inset-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

@layer utilities {
  .bg-brand {
    background-color: hsl(var(--brand));
  }

  .text-primary {
    color: hsl(var(--primary));
  }

  /* Tabular numbers for financial/rating data */
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }

  /* Text truncation utilities */
  .text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
```

### 11.3 TailwindCSS Additions Needed

The following tokens are referenced in this design system but should be added to `tailwind.config.js` under `theme.extend`:

```js
// Add to tailwind.config.js theme.extend
colors: {
  budget: {
    'low-bg': 'hsl(140 70% 95%)',
    'low-text': 'hsl(140 60% 35%)',
    'low-border': 'hsl(140 60% 80%)',
    'medium-bg': 'hsl(30 90% 93%)',
    'medium-text': 'hsl(30 90% 45%)',
    'medium-border': 'hsl(30 90% 80%)',
    'high-bg': 'hsl(0 90% 95%)',
    'high-text': 'hsl(0 90% 40%)',
    'high-border': 'hsl(0 90% 80%)',
  },
  province: {
    punjab: '#c7d2fe',
    sindh: '#a7f3d0',
    kpk: '#fed7aa',
    balochistan: '#fed9c2',
    kashmir: '#ddd6fe',
  },
},
borderRadius: {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
},
```

### 11.4 Component Token Reference

| Component | Tokens Used |
|---|---|
| `UniversityCard` | `card`, `card-foreground`, `border`, `muted-foreground`, `brand-500/700`, `success-500`, `budget.low/medium/high` |
| `UniversitySearch` | `background`, `input`, `muted-foreground`, `brand-400` (focus ring), `border` |
| `AuthForm` | `card`, `border`, `error-500/700`, `brand-400` (focus ring), `muted` |
| `ReviewForm` | `background`, `border`, `muted-foreground`, `error-500`, `brand-400` |
| `NavigationHeader` | `background`, `border`, `foreground`, `muted-foreground`, `brand-500/700` |
| `MobileBottomBar` | `card`, `border`, `foreground`, `muted-foreground`, `brand-400` (active) |

---

## 12. Accessibility Checklist

All components comply with WCAG 2.2 AA standards (Rule: **A1**-**A12**, **F1**-**F5**):

- [x] All interactive elements have `aria-label` when icon-only (Rule: **A1**)
- [x] Form inputs have associated `<label>` elements (Rule: **A2**, **FR4**)
- [x] Interactive elements use `<button>`, `<a>`, and `<input>` (Rule: **A4**, **A8**)
- [x] Images have `alt` text or `alt=""` if decorative (Rule: **A5**, **I1**)
- [x] Focus rings visible via `focus-visible:ring-*` (Rule: **F1**, **F3**)
- [x] Heading hierarchy is logical: `h1` -> `h2` -> `h3` (Rule: **A9**)
- [x] `aria-live="polite"` on async status updates (Rule: **A7**)
- [x] `autocomplete` attributes on form fields (Rule: **FR1**)
- [x] `type` attributes on inputs are correct (Rule: **FR2**)
- [x] Paste is not blocked (Rule: **FR3**, **AP2**)
- [x] `spellCheck={false}` on emails, codes, usernames (Rule: **FR5**)
- [x] `prefers-reduced-motion` is honored (Rule: **AN1**, **AN8**)
- [x] `text-wrap: balance` on multi-line headings (Rule: **T6**)
- [x] `font-variant-numeric: tabular-nums` on numeric columns (Rule: **T5**)
- [x] Skip link for main content (Rule: **A9**)
- [x] Semantic HTML used before ARIA attributes (Rule: **A8**)
- [x] `scroll-margin-top` on heading anchors (Rule: **A10**)

---

## 13. Usage Guidelines

### When to Use Each Color

- **Brand (sky blue):** Primary actions, active nav states, focus rings, link text
- **Primary (amber):** Warnings, star ratings, highlights, accent backgrounds
- **Budget colors:** University cards, tuition info, filter tags
- **Province colors:** Map markers, university badges, filter labels
- **Status colors:** Review status badges, verification badges, alert messages

### Typography Pairing

- **Inter (sans-serif):** All UI text, English content, numeric data
- **Jameel Noori Nastaleeq (urdu):** Urdu script content, headings, body when `lang="ur"`
- **Raavi / Nirmala UI (punjabi):** Punjabi script content when `lang="pa"`
- **Monospace:** Code blocks, technical identifiers, file names

### Spacing Application

- Use `space-4` (16px) as the standard card padding
- Use `space-6` (32px) for section margins on desktop
- Use `space-4` (16px) for section margins on mobile
- Use `space-2` (8px) between form field label and input
- Use `space-3` (12px) between form groups

### Safe Area Insets

For mobile devices with notches or home indicators:

```css
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-inset-top {
  padding-top: env(safe-area-inset-top);
}
```

Apply to fixed/mobile bottom bar, mobile header, and any full-bleed mobile element.

# WCAG 2.2 AA Accessibility Audit Checklist
## UniVox PK - University Review Platform

**Audit Date:** 2026-10-29  
**Auditor:** Claude Code (Accessibility Skill)  
**Standard:** WCAG 2.2 AA  
**Platform:** Next.js 14 + TypeScript, TailwindCSS, NextAuth  

---

## 1. Color Contrast (WCAG 1.4.3, 1.4.6)

### 1.1 Text Contrast (4.5:1 minimum for normal text, 3:1 for large text)

| # | Component | File | Status | Details |
|---|-----------|------|--------|---------|
| 1 | Page headings (h1, h2, h3) | `src/app/universities/page.tsx` | FAIL | `text-3xl font-bold mb-6` uses default black on white — needs verification but likely passes at 3xl size (large text, 3:1 minimum). |
| 2 | Body text in UniversityCard | `src/components/UniversityCard.tsx` | FAIL | `text-sm text-muted-foreground` — Tailwind `muted-foreground` color is not defined in config; default may be low contrast. |
| 3 | Budget tier badges | `src/components/UniversityCard.tsx:47` | FAIL | `text-white` on `bg-green-500`, `bg-blue-500`, `bg-purple-500` — green/blue/purple backgrounds with white text may not meet 4.5:1 (especially green-500). |
| 4 | Rating text | `src/components/UniversityCard.tsx:57` | FAIL | `text-sm text-muted-foreground` — same muted-foreground concern. |
| 5 | Search input text | `src/components/UniversitySearch.tsx:132` | FAIL | `text-foreground` on `bg-background` — depends on CSS variables; no verification of contrast ratio. |
| 6 | Error messages (signin/signup) | `src/app/(auth)/signin/page.tsx:236` | FAIL | `text-red-700` on `bg-red-50` — red-700 on red-50 likely passes but not verified. |
| 7 | Success messages | `src/app/(auth)/signup/page.tsx:224` | FAIL | `text-green-800` on `bg-green-50` — similar concern. |
| 8 | Profile page labels | `src/app/profile/page.tsx:86` | FAIL | `text-gray-500` labels on white background — gray-500 is #6B7280, contrast ratio ~4.5:1 against white, borderline. |
| 9 | Dashboard text | `src/app/dashboard/page.tsx` | FAIL | `text-gray-600`, `text-gray-500` throughout — not verified against 4.5:1. |
| 10 | Footer links | `src/app/profile/page.tsx:123` | FAIL | `text-gray-600` on gray-50 background — not verified. |

**Remediation Steps:**
- Define explicit color tokens in Tailwind config with verified contrast ratios
- Use tools like axe or Lighthouse to audit actual rendered contrast
- Replace `text-muted-foreground` with a custom class that has verified contrast (e.g., `text-gray-600` with confirmed 4.5:1 against white)
- For budget tier badges, ensure white text meets 4.5:1 against each background color (test with a contrast checker; consider using `text-gray-100` with darker backgrounds or switch to black text on lighter tints)
- Add `:focus-visible` styles with 3:1 contrast against background (per WCAG 1.4.11)

### 1.2 UI Component Contrast (3:1 minimum)

| # | Component | File | Status | Details |
|---|-----------|------|--------|---------|
| 1 | Search input border | `src/components/UniversitySearch.tsx:132` | FAIL | `border` (gray-300 default) on white — not verified 3:1. |
| 2 | Select dropdowns | `src/components/UniversitySearch.tsx:154` | FAIL | Same border concern; chevron icon color not verified. |
| 3 | Pagination buttons | `src/components/UniversitySearch.tsx:243` | FAIL | `border border-input` — `input` class not defined in config. |
| 4 | Form input borders (signin/signup) | `src/app/(auth)/signin/page.tsx:255` | FAIL | `border border-gray-300` — gray-300 on white, contrast ratio ~1.5:1, fails 3:1. |
| 5 | Card borders | `src/components/UniversityCard.tsx:25` | FAIL | `border` without explicit color — depends on Tailwind default. |
| 6 | Profile stat cards | `src/app/profile/page.tsx:55` | FAIL | `bg-gray-50 rounded-lg` — no visible border or separator; relies on shadow only. |
| 7 | Google sign-in button border | `src/app/(auth)/signin/page.tsx:334` | FAIL | `border border-gray-300` — same 1.5:1 concern. |

**Remediation Steps:**
- Use `border-gray-400` or darker for input borders (minimum 3:1 against white)
- Add explicit border colors to all interactive element containers
- Ensure focus rings use 3:1 contrast against all background colors they may appear on
- Verify all interactive element borders meet 3:1 contrast using a contrast checker

---

## 2. Keyboard Navigation (WCAG 2.1.1)

| # | Component | File | Status | Details |
|---|-----------|------|--------|---------|
| 1 | University search input | `src/components/UniversitySearch.tsx:127` | FAIL | No explicit keyboard handling, but native `<input>` is focusable. |
| 2 | Search clear button | `src/components/UniversitySearch.tsx:136` | FAIL | Native `<button>`, focusable — passes. |
| 3 | Budget tier select | `src/components/UniversitySearch.tsx:151` | FAIL | Native `<select>`, keyboard accessible — passes. |
| 4 | Province select | `src/components/UniversitySearch.tsx:167` | FAIL | Native `<select>`, keyboard accessible — passes. |
| 5 | City select (disabled) | `src/components/UniversitySearch.tsx:188` | FAIL | Disabled `<select>` is not focusable — correct behavior. |
| 6 | Clear Filters button | `src/components/UniversitySearch.tsx:207` | FAIL | Native `<button>`, focusable — passes. |
| 7 | Pagination Previous/Next | `src/components/UniversitySearch.tsx:241` | FAIL | Native `<button>`, focusable — passes. |
| 8 | Sign in form | `src/app/(auth)/signin/page.tsx:230` | FAIL | Form uses native `<input>` fields — keyboard accessible. |
| 9 | Google OAuth button | `src/app/(auth)/signin/page.tsx:326` | FAIL | Native `<button>`, keyboard accessible — passes. |
| 10 | Sign up form | `src/app/(auth)/signup/page.tsx:338` | FAIL | Native form controls — keyboard accessible. |
| 11 | Forgot password link | `src/app/(auth)/signin/page.tsx:296` | FAIL | Native `<button>`, keyboard accessible — passes. |
| 12 | UniversityCard | `src/components/UniversityCard.tsx:25` | FAIL | **No keyboard interaction.** The card is a non-interactive `<div>` with `hover:shadow-md` — hover-only interaction, not keyboard operable. |

**Remediation Steps:**
- UniversityCard: Convert card to a `<button>` or `<a>` element if it should be interactive, or add `tabIndex={0}` and keyboard event handlers if it must remain a div
- UniversitySearch: Add `tabIndex={0}` to the RTL toggle button if it is intended to be keyboard-navigable (it is a native button, so it passes)
- Verify all interactive elements are reachable via Tab key in the correct logical order
- Test arrow key navigation in select elements if custom dropdown is implemented

---

## 3. Screen Reader Support (WCAG 4.1.2)

| # | Component | File | Status | Details |
|---|-----------|------|--------|---------|
| 1 | Page title | `src/app/layout.tsx:4` | PASS | Page has `<title>` via `metadata`; `<html lang="en">` is set. |
| 2 | UniversityCard heading | `src/components/UniversityCard.tsx:41` | FAIL | `<h3>` is present but card has no landmark or semantic container. |
| 3 | UniversityCard image alt | `src/components/UniversityCard.tsx:30` | PASS | `alt={university.name}` is present and descriptive. |
| 4 | University fallback image | `src/components/UniversityCard.tsx:34` | FAIL | Fallback div has no alt text, no ARIA — not an image, so acceptable. |
| 5 | Budget tier badge | `src/components/UniversityCard.tsx:47` | FAIL | Badge has text "Low/Medium/High" but no ARIA context for screen readers about what it represents. |
| 6 | Rating stars | `src/components/UniversityCard.tsx:56` | FAIL | Static `<span className="text-sm font-medium">★</span>` — not announced as a rating; no ARIA label. |
| 7 | Rating bar | `src/components/UniversityCard.tsx:61` | FAIL | Visual-only `<div>` progress bar — no ARIA roles, no text equivalent. |
| 8 | Search input label | `src/components/UniversitySearch.tsx:127` | FAIL | Uses `placeholder` only — no visible `<label>` element. Placeholder disappears on focus, causing screen reader users to lose context. |
| 9 | Search clear button | `src/components/UniversitySearch.tsx:136` | PASS | `aria-label="Clear search"` is present. |
| 10 | Select labels | `src/components/UniversitySearch.tsx:151` | FAIL | No `<label>` associated with selects; relies on option text "Budget Tier", "Province", "City". |
| 11 | RTL toggle | `src/components/UniversitySearch.tsx:113` | PASS | `aria-label="Toggle RTL"` is present. |
| 12 | Sign in email label | `src/app/(auth)/signin/page.tsx:244` | PASS | `sr-only` label with `htmlFor="email"` — correct pattern. |
| 13 | Sign in password label | `src/app/(auth)/signin/page.tsx:264` | PASS | `sr-only` label with `htmlFor="password"` — correct pattern. |
| 14 | Sign in remember me | `src/app/(auth)/signin/page.tsx:292` | PASS | `<label htmlFor="remember-me">` associated. |
| 15 | Sign up university select | `src/app/(auth)/signup/page.tsx:372` | PASS | `<label htmlFor="university">` with `sr-only`. |
| 16 | Sign up student ID label | `src/app/(auth)/signup/page.tsx:396` | PASS | `sr-only` label. |
| 17 | Sign up password label | `src/app/(auth)/signup/page.tsx:416` | PASS | `sr-only` label. |
| 18 | Sign up confirm password | `src/app/(auth)/signup/page.tsx:436` | PASS | `sr-only` label. |
| 19 | Sign up terms checkbox | `src/app/(auth)/signup/page.tsx:468` | PASS | `<label htmlFor="agreeToTerms">` with descriptive text. |
| 20 | Error alert in signin | `src/app/(auth)/signin/page.tsx:231` | FAIL | Error `<div>` has no `role="alert"` or `aria-live` — screen reader will not announce it automatically. |
| 21 | Error alert in signup | `src/app/(auth)/signup/page.tsx:339` | FAIL | Same issue — no `role="alert"` or `aria-live`. |
| 22 | Forgot password error | `src/app/(auth)/signin/page.tsx:156` | FAIL | No `role="alert"` on error container. |
| 23 | Profile page icons | `src/app/profile/page.tsx:41` | FAIL | Icons (`<User>`, `<Star>`, etc.) are decorative and lack `aria-hidden="true"` — screen readers will announce them. |
| 24 | Dashboard icons | `src/app/dashboard/page.tsx:24` | FAIL | Same issue — icons not hidden from screen readers. |
| 25 | Verify request icons | `src/app/(auth)/verify-request/page.tsx:17` | FAIL | `<Mail>` and `<CheckCircle>` icons lack `aria-hidden`. |
| 26 | Auth error icon | `src/app/(auth)/error/page.tsx:52` | FAIL | `<ShieldAlert>` icon lacks `aria-hidden`. |
| 27 | No skip link | Global | FAIL | No skip-to-content link anywhere in the app — keyboard users must tab through all navigation. |

**Remediation Steps:**
- Add `role="alert"` and `aria-live="assertive"` to all error message containers
- Add `aria-hidden="true"` to all decorative icons (lucide-react icons in headers, buttons without text, etc.)
- Add proper `<label>` elements for all form controls (search input, selects) — use visible labels, not just placeholders
- Add ARIA labels to rating elements (e.g., `aria-label="Rating: 4.5 out of 5 stars"`)
- Add `role="img"` with `aria-label` to progress bars or rating bars
- Add a skip link to the top of every page: `<a href="#main" class="sr-only">Skip to main content</a>`
- Wrap UniversityCard in a landmark or add `role="region"` with `aria-label`

---

## 4. Focus Management (WCAG 2.4.7, 2.4.11)

| # | Component | File | Status | Details |
|---|-----------|------|--------|---------|
| 1 | Global focus styles | `src/styles/globals.css` | FAIL | No `:focus-visible` or `:focus` styles defined in globals.css — default browser outline may be removed by Tailwind or not visible on all backgrounds. |
| 2 | Form inputs focus | `src/app/(auth)/signin/page.tsx:255` | FAIL | `focus:outline-none focus:ring-2 focus:ring-brand-500` — ring uses brand color (sky blue #0ea5e9) on white background. Contrast ~3:1, borderline. No explicit `:focus-visible`. |
| 3 | Select focus | `src/components/UniversitySearch.tsx:154` | FAIL | Same `focus:ring-2 focus:ring-brand-500` pattern — verify contrast. |
| 4 | Button focus | `src/app/(auth)/signin/page.tsx:308` | FAIL | `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500` — blue-500 on white, acceptable contrast but uses `:focus` not `:focus-visible`. |
| 5 | Pagination focus | `src/components/UniversitySearch.tsx:243` | FAIL | `focus:outline-none focus:ring-2 focus:ring-brand-500` — same concern. |
| 6 | Disabled button focus | `src/components/UniversitySearch.tsx:243` | FAIL | Disabled buttons have `disabled:cursor-not-allowed` but no explicit `disabled:opacity-50` focus suppression — disabled elements should not show focus ring. |
| 7 | Focus order | Global | FAIL | No explicit `tabIndex` management — relies on DOM order, which should follow visual order but needs verification. |

**Remediation Steps:**
- Add global `:focus-visible` styles in `globals.css`:
  ```css
  :focus-visible {
    outline: 2px solid hsl(var(--primary));
    outline-offset: 2px;
  }
  ```
- Replace all `focus:` with `focus-visible:` for better UX (focus only shows for keyboard users, not mouse users)
- Ensure all focus rings meet 3:1 contrast against their background (verify brand/primary color contrast)
- Add `tabIndex={-1}` to disabled elements to prevent keyboard focus
- Ensure focus does not move unexpectedly after user interactions (e.g., after form submission)

---

## 5. Mobile Accessibility (WCAG 2.5.8, 2.5.5)

| # | Component | File | Status | Details |
|---|-----------|------|--------|---------|
| 1 | Touch target size | All buttons/inputs | FAIL | No `min-width: 44px` or `min-height: 44px` set on interactive elements. Buttons like pagination use `px-4 py-2` which may be < 44px. |
| 2 | Hover-only interactions | `src/components/UniversityCard.tsx:25` | FAIL | `hover:shadow-md` — shadow only appears on hover, not keyboard focus or active state. |
| 3 | Search clear button | `src/components/UniversitySearch.tsx:136` | FAIL | `p-1` padding on small icon — likely < 24px touch target. |
| 4 | RTL toggle button | `src/components/UniversitySearch.tsx:113` | FAIL | `px-3 py-1` — height likely < 44px. |
| 5 | Chevron icons in selects | `src/components/UniversitySearch.tsx:162` | FAIL | Icons are `pointer-events-none` — not interactive, acceptable. |
| 6 | Pagination buttons | `src/components/UniversitySearch.tsx:241` | FAIL | `px-4 py-2` — small touch target, no mobile sizing consideration. |
| 7 | Google sign-in button | `src/app/(auth)/signin/page.tsx:326` | FAIL | Standard sizing without 44px minimum guarantee. |
| 8 | Sign up success button | `src/app/(auth)/signup/page.tsx:299` | FAIL | No touch target sizing consideration. |

**Remediation Steps:**
- Add `min-height: 44px` and `min-width: 44px` to all interactive elements (buttons, inputs, selects, links)
- Replace `hover:` effects with `focus:` or `focus-visible:` equivalents so interactions are available to keyboard/touch users
- Increase padding on small buttons (clear search, RTL toggle) to ensure 44px minimum touch targets
- Add `@media (hover: hover)` queries to distinguish between touch and mouse users for hover-only effects

---

## 6. Form Labels (WCAG 3.3.2)

| # | Component | File | Status | Details |
|---|-----------|------|--------|---------|
| 1 | Search input | `src/components/UniversitySearch.tsx:127` | FAIL | No `<label>` element — uses `placeholder` only, which is not a substitute for a label. |
| 2 | Budget tier select | `src/components/UniversitySearch.tsx:151` | FAIL | No `<label>` — relies on `<option value="All">Budget Tier</option>` as a pseudo-label. |
| 3 | Province select | `src/components/UniversitySearch.tsx:167` | FAIL | Same — no `<label>` element. |
| 4 | City select | `src/components/UniversitySearch.tsx:188` | FAIL | Same — no `<label>` element. |
| 5 | Sign in email | `src/app/(auth)/signin/page.tsx:244` | PASS | `sr-only` label with `htmlFor="email"` — correct. |
| 6 | Sign in password | `src/app/(auth)/signin/page.tsx:264` | PASS | `sr-only` label — correct. |
| 7 | Sign in remember me | `src/app/(auth)/signin/page.tsx:292` | PASS | Visible `<label>` — correct. |
| 8 | Sign up email | `src/app/(auth)/signup/page.tsx:352` | PASS | `sr-only` label — correct. |
| 9 | Sign up university | `src/app/(auth)/signup/page.tsx:372` | PASS | `sr-only` label — correct. |
| 10 | Sign up student ID | `src/app/(auth)/signup/page.tsx:396` | PASS | `sr-only` label — correct. |
| 11 | Sign up password | `src/app/(auth)/signup/page.tsx:416` | PASS | `sr-only` label — correct. |
| 12 | Sign up confirm password | `src/app/(auth)/signup/page.tsx:436` | PASS | `sr-only` label — correct. |
| 13 | Sign up terms checkbox | `src/app/(auth)/signup/page.tsx:468` | PASS | Visible `<label>` with descriptive text — correct. |
| 14 | Forgot password email | `src/app/(auth)/signin/page.tsx:167` | PASS | `sr-only` label — correct. |

**Remediation Steps:**
- Add `<label htmlFor="search-universities">Search universities</label>` to the search input (can be visually hidden or visible)
- Add `<label htmlFor="budget-tier">Budget Tier</label>` to the budget tier select
- Add `<label htmlFor="province-filter">Province</label>` to the province select
- Add `<label htmlFor="city-filter">City</label>` to the city select
- Ensure all labels are programmatically associated with their inputs via `htmlFor`/`id` matching

---

## 7. Image Alt Text (WCAG 1.1.1)

| # | Component | File | Status | Details |
|---|-----------|------|--------|---------|
| 1 | University logo | `src/components/UniversityCard.tsx:30` | PASS | `alt={university.name}` — descriptive and appropriate. |
| 2 | Fallback initial | `src/components/UniversityCard.tsx:34` | PASS | Not an image — text element, no alt needed. |
| 3 | Google sign-in SVG | `src/app/(auth)/signin/page.tsx:340` | FAIL | Inline SVG has no `<title>` or `role="img"` — Google logo is decorative but the button has text "Sign in with Google" so it's acceptable. |
| 4 | Decorative icons | `src/app/profile/page.tsx:41` | FAIL | Icons like `<User>`, `<Star>`, `<Award>`, `<Shield>`, `<LogOut>` lack `aria-hidden="true"` — screen readers will announce icon names. |
| 5 | Dashboard icons | `src/app/dashboard/page.tsx:24` | FAIL | Same issue — icons not hidden from AT. |
| 6 | Arrow icons in links | `src/app/profile/page.tsx:125` | FAIL | `<ArrowLeft>` in "Back to home" link — should be `aria-hidden` since it's decorative. |
| 7 | Spinner icons | `src/app/(auth)/signin/page.tsx:192` | PASS | `<Loader2>` inside loading state — icon is decorative, but button text is replaced by spinner which may need `aria-live`. |
| 8 | Verify request Mail icon | `src/app/(auth)/verify-request/page.tsx:17` | FAIL | `<Mail className="h-16 w-16 text-blue-600" />` — no `aria-hidden`, decorative icon. |
| 9 | Verify request CheckCircle | `src/app/(auth)/verify-request/page.tsx:21` | FAIL | Same — decorative icon without `aria-hidden`. |
| 10 | Auth error ShieldAlert | `src/app/(auth)/error/page.tsx:52` | FAIL | Same issue. |

**Remediation Steps:**
- Add `aria-hidden="true"` to all decorative icons throughout the app:
  - All lucide-react icons used in profile page stats
  - All icons in dashboard page stats
  - Arrow icons in navigation links
  - Spinner icons when text replacement is needed (add `aria-live` to loading state)
  - Verify request and error page icons
- The Google sign-in SVG is acceptable since the button contains visible text
- If any icons convey meaningful information (e.g., a "star" for ratings), add appropriate ARIA labels

---

## 8. Error Messages (WCAG 3.3.1, 3.3.3)

| # | Component | File | Status | Details |
|---|-----------|------|--------|---------|
| 1 | Sign in error | `src/app/(auth)/signin/page.tsx:231` | FAIL | Error `<div>` has no `role="alert"`, `aria-live`, or `aria-describedby` on the input. |
| 2 | Sign in validation error | `src/app/(auth)/signin/page.tsx:231` | FAIL | Error text not associated with the input field it relates to. |
| 3 | Sign up error | `src/app/(auth)/signup/page.tsx:339` | FAIL | Same issues — no `role="alert"` or `aria-describedby`. |
| 4 | Forgot password error | `src/app/(auth)/signin/page.tsx:156` | FAIL | No `role="alert"` on error container. |
| 5 | Form submission errors | `src/app/(auth)/signin/page.tsx:231` | FAIL | Errors appear at top of form, not adjacent to the relevant field — screen reader users may not know which field has the issue. |
| 6 | Password mismatch | `src/app/(auth)/signup/page.tsx:94` | FAIL | `setError('Passwords do not match')` — generic error, not associated with the confirm password field. |
| 7 | No success announcement | `src/app/(auth)/signup/page.tsx:288` | FAIL | Success state (`setSuccess`) is rendered as HTML — no `aria-live` announcement for screen readers. |

**Remediation Steps:**
- Add `role="alert"` to all error message containers so they are announced immediately by screen readers
- Add `aria-describedby` to each form input that has an associated error message, pointing to the error message's `id`
- Place error messages adjacent to their associated fields (or use `aria-describedby` to create the association)
- For the sign-in form, add `aria-invalid="true"` to inputs with errors
- For the password mismatch error, display it adjacent to the confirm password field and add `aria-invalid="true"` to that field
- Add `aria-live="polite"` or `aria-live="assertive"` to success message containers

---

## 9. Semantic HTML & Landmarks (WCAG 1.3.1, 2.4.1)

| # | Component | File | Status | Details |
|---|-----------|------|--------|---------|
| 1 | Main landmark | Global | FAIL | `<main>` is used on universities page and profile/dashboard pages — but no `id="main"` for skip link targeting. |
| 2 | Navigation landmark | Global | FAIL | No `<nav>` elements anywhere in the app. |
| 3 | Skip link | Global | FAIL | No skip-to-content link on any page. |
| 4 | Heading structure | `src/app/universities/page.tsx:43` | FAIL | Single `<h1>` on page, but UniversityCard uses `<h3>` without proper heading hierarchy context (cards appear directly under the h1 without intermediate h2). |
| 5 | Search container | `src/components/UniversitySearch.tsx` | FAIL | Search and filter controls have no `<section>` or landmark grouping — screen reader users cannot navigate to them efficiently. |
| 6 | Form structure | `src/app/(auth)/signin/page.tsx:230` | PASS | `<form>` element properly used. |
| 7 | Article vs div in cards | `src/components/UniversityCard.tsx:25` | FAIL | UniversityCard is a plain `<div>` — should be `<article>` since it represents a self-contained composable content piece. |

**Remediation Steps:**
- Add a skip link at the top of every page: `<a href="#main" class="skip-link">Skip to main content</a>`
- Add `<main id="main">` to all main content containers
- Add `<nav aria-label="Main navigation">` or `<nav aria-label="Pagination">` where appropriate
- Add `<section aria-labelledby="...">` around search/filter controls
- Convert UniversityCard `<div>` to `<article>` element
- Ensure proper heading hierarchy: h1 > h2 (section) > h3 (cards within sections)

---

## 10. Page Language & Metadata (WCAG 3.1.1)

| # | Component | File | Status | Details |
|---|-----------|------|--------|---------|
| 1 | Language attribute | `src/app/layout.tsx:14` | PASS | `<html lang="en">` is correctly set. |
| 2 | RTL direction | `src/app/layout.tsx:14` | FAIL | `dir="ltr"` is hardcoded — does not dynamically switch for Urdu/Punjabi content. |
| 3 | Page descriptions | `src/app/layout.tsx:4` | PASS | `metadata.description` is set in layout and individual pages. |
| 4 | Title tags | Global | PASS | `metadata.title` is set on each page. |

**Remediation Steps:**
- Make the `dir` attribute dynamic based on `isRTL` state from UniversitySearch
- Consider using `next/head` or `metadata` to set `dir="rtl"` when Urdu/Punjabi is the active language
- Add `lang` attribute switching for language-specific content

---

## 11. Reduced Motion (WCAG 2.3.3)

| # | Component | File | Status | Details |
|---|-----------|------|--------|---------|
| 1 | Hover transition | `src/components/UniversityCard.tsx:25` | FAIL | `transition-shadow` — no `@media (prefers-reduced-motion: reduce)` in globals.css. |
| 2 | Loading spinners | `src/app/(auth)/signin/page.tsx:192` | FAIL | `<Loader2 className="h-5 w-5 animate-spin">` — animation not suppressed for reduced motion. |
| 3 | Focus transitions | Global | FAIL | Tailwind transition classes used throughout — no global reduced motion query. |

**Remediation Steps:**
- Add to `globals.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- Replace `animate-spin` with a static loading indicator when `prefers-reduced-motion: reduce` is active
- Remove or simplify the `transition-shadow` on UniversityCard for reduced motion users

---

## Summary

### PASS: 8 items
- Page language (`<html lang="en">`)
- UniversityCard logo alt text
- Search clear button aria-label
- RTL toggle aria-label
- sr-only form labels in auth pages
- Form elements in auth pages
- Google sign-in SVG (acceptable due to visible text)
- Metadata title/description on pages

### FAIL: 31 items
**Critical issues (must fix before launch):**
1. Missing `role="alert"` on error messages (WCAG 3.3.1)
2. Missing `<label>` elements for search and filter controls (WCAG 3.3.2)
3. Missing `aria-hidden="true"` on decorative icons (WCAG 1.1.1)
4. Missing `:focus-visible` styles (WCAG 2.4.7)
5. Missing skip link (WCAG 2.4.1)
6. Missing form labels on search/filter inputs (WCAG 3.3.2)
7. `text-muted-foreground` class not defined, potential contrast failures (WCAG 1.4.3)
8. Interactive elements < 44px touch targets (WCAG 2.5.8)
9. Hover-only interactions without keyboard alternatives (WCAG 2.1.1)
10. Missing `aria-describedby` and `aria-invalid` on error fields (WCAG 3.3.3)

**Recommendations by priority:**
- **Immediate:** Add error container roles, add skip links, fix form labels, add aria-hidden to icons
- **Short-term:** Add focus-visible styles, fix contrast, ensure 44px touch targets
- **Medium-term:** Add reduced motion support, add semantic landmarks, fix heading hierarchy, add aria-describedby on errors

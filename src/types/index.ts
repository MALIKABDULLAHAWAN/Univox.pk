// University types for UniVox PK - Forward declarations to handle circular references

export type BudgetTier = 'Low' | 'Medium' | 'High';

// Core entity interfaces
export interface University {
  id: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  province: string;
  type: string;
  hECApproved: boolean;
  description: string;
  logoUrl?: string | null;
  website?: string | null;
  budgetTier: BudgetTier;
  avgTuitionPKR: number;
  scholarshipAvailable: boolean;
  scholarshipAvgAmount?: number | null;
  cityRankingScore: number;
  provinceRankingScore: number;
  nationalRankingScore: number;
  departments?: Department[];
  instructors?: Instructor[];
  courses?: Course[];
  reviews?: Review[];
  students?: Student[];
  universityResponses?: UniversityResponse[];
  createdAt: Date;
}

export interface Department {
  id: string;
  universityId: string;
  university?: University;
  name: string;
  code: string;
  description?: string | null;
  courses?: Course[];
  instructors?: Instructor[];
  reviews?: DepartmentReview[];
  createdAt: Date;
}

export interface Course {
  id: string;
  universityId: string;
  departmentId: string;
  university?: University;
  department?: Department;
  courseCode: string;
  courseName: string;
  creditHours: number;
  semester: number;
  year: number;
  semesterType: string;
  syllabus?: any[];
  prospectusUrl?: string | null;
  reviews?: CourseReview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Instructor {
  id: string;
  universityId: string;
  departmentId: string;
  university?: University;
  department?: Department;
  name: string;
  email?: string | null;
  designation?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  coursesTaught?: Course[];
  reviews?: InstructorReview[];
  ratingsAvg: number;
  reviewsCount: number;
  createdAt: Date;
}

export interface Student {
  id: string;
  email: string;
  universityId: string;
  university?: University;
  studentIdHash: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  credibilityScore: number;
  canRate: boolean;
  peerRatingsMade: number;
  peerVerificationsMade: number;
  createdAt: Date;
  lastLoginAt?: Date | null;
}

// Review types
export type ReviewType = 'university' | 'instructor' | 'course' | 'department';

export interface ReviewVote {
  id: string;
  reviewId: string;
  studentId: string;
  type: 'helpfulness' | 'like' | 'dislike';
  weight: number;
  createdAt: Date;
}

export interface FlagInstance {
  id: string;
  reviewId: string;
  reviewerType: 'student' | 'university' | 'moderator';
  reviewerId?: string | null;
  reason: string;
  evidence?: string | null;
  createdAt: Date;
  status: 'pending' | 'resolved';
  resolution?: string | null;
  resolvedAt?: Date | null;
}

export interface Review {
  id: string;
  type: ReviewType;
  universityId: string;
  targetId: string;
  studentId: string;
  content: string;
  rating: number;
  overall?: number;
  teaching?: number;
  clarity?: number;
  engagement?: number;
  workload?: number;
  difficulty?: number;
  wouldRecommend: boolean;
  evidenceHash?: string | null;
  isAnonymous: boolean;
  verifiedBy: number;
  status: 'pending' | 'verified' | 'flagged';
  createdAt: Date;
  student?: Student;
  university?: University;
  votes?: ReviewVote[];
  flags?: FlagInstance[];
}

// Detailed review types
export interface CourseReview {
  id: string;
  courseId: string;
  universityId: string;
  departmentId: string;
  studentId: string;
  workloadRating: number;
  difficultyRating: number;
  contentQuality: number;
  commentText: string;
  evidenceHash?: string | null;
  isAnonymous: boolean;
  verifiedBy: number;
  status: 'pending' | 'verified' | 'flagged';
  createdAt: Date;
}

export interface InstructorReview {
  id: string;
  instructorId: string;
  universityId: string;
  studentId: string;
  overall?: number;
  teaching?: number;
  clarity?: number;
  engagement?: number;
  workload?: number;
  wouldRecommend: boolean;
  comment?: string | null;
  evidenceHash?: string | null;
  isAnonymous: boolean;
  verifiedBy: number;
  status: 'pending' | 'verified' | 'flagged';
  createdAt: Date;
}

export interface DepartmentReview {
  id: string;
  departmentId: string;
  universityId: string;
  studentId: string;
  content: string;
  overall?: number;
  facilities?: number;
  faculty?: number;
  infrastructure?: number;
  wouldRecommend: boolean;
  evidenceHash?: string | null;
  isAnonymous: boolean;
  verifiedBy: number;
  status: 'pending' | 'verified' | 'flagged';
  createdAt: Date;
}

export interface UniversityResponse {
  id: string;
  universityId: string;
  reviewId?: string | null;
  content: string;
  createdAt: Date;
}
export type UnitType = 'cm' | 'mm';

export type VerificationStatus = 'draft' | 'pending_review' | 'verified';

export interface ReferenceEntry {
  id: string;
  minVal: number;
  maxVal: number;
  unit: UnitType;
  traditionalVal?: string; // e.g. "10", "9 ¾", "7 ½"
  tamilText: string;
  englishText?: string;
  sourceBook: string;
  pageNo?: string;
  status: VerificationStatus;
  reviewer: string;
  createdAt: string;
  updatedAt?: string;
}

export type MatchStatus = 'matched' | 'no_match' | 'multiple_matches';

export interface AssessmentRecord {
  id: string;
  userId?: string;
  sessionId: string;
  measurementVal: number;
  unit: UnitType;
  normalizedCm: number;
  normalizedMm: number;
  repeatMeasurement?: number;
  notes?: string;
  matchStatus: MatchStatus;
  matchedReferences: ReferenceEntry[];
  timestamp: string;
}

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  isDemo?: boolean;
}

export type Language = 'en' | 'ta';

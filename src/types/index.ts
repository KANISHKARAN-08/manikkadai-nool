export type UnitType = 'cm' | 'mm' | 'virarkadai';

export type VerificationStatus = 'draft' | 'pending_review' | 'verified';

export interface ReferenceEntry {
  id: string;
  sourceId?: string;
  minVal: number;
  maxVal: number;
  unit: UnitType;
  traditionalVal?: string; // e.g. "10", "9 ¾", "7 ½", "5 ½", "4"
  tamilText: string;
  englishText?: string;
  sourceBook: string;
  pageNo?: string;
  status: VerificationStatus;
  reviewer: string;
  category?: 'disease_manifestation' | 'critical_prognosis' | 'general';
  confidence?: number;
  reviewNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type MatchStatus = 'matched' | 'no_match' | 'multiple_matches' | 'unsupported_conversion';

export interface AssessmentRecord {
  id: string;
  userId?: string;
  sessionId: string;
  measurementMode: 'traditional' | 'physical';
  measurementVal: number | string; // e.g. "5 ½" or 16.5
  unit: UnitType;
  normalizedCm?: number;
  normalizedMm?: number;
  traditionalVal?: string;
  repeatMeasurement?: number | string;
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

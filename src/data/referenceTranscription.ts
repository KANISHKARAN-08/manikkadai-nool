import transcriptions from '../../data/reference-transcription.json';

export interface TranscribedReferenceItem {
  source_id: string;
  source_title: string;
  source_page: string;
  original_measurement: string;
  measurement_fraction: number;
  source_unit: string;
  table_heading: string;
  category: 'disease_manifestation' | 'critical_prognosis';
  tamil_description: string;
  english_translation: string;
  transcription_status: 'transcribed' | 'verified';
  verification_status: 'verified' | 'pending_review' | 'draft';
  confidence: number;
  review_notes: string;
}

export const AUTHENTIC_BOOK_TRANSCRIPTIONS: TranscribedReferenceItem[] = transcriptions as TranscribedReferenceItem[];
export default AUTHENTIC_BOOK_TRANSCRIPTIONS;

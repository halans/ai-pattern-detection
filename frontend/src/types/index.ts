// Type definitions matching backend API

export type Severity =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'VERY_LOW'
  | 'INFORMATIONAL';

export type Classification = 'Likely AI Slop' | 'Mixed/Uncertain' | 'Likely Human';

export interface PatternMatch {
  patternId: string;
  patternName: string;
  severity: Severity;
  matches: Array<{
    text: string;
    context: string;
    index: number;
  }>;
  count: number;
}

export interface AnalysisResult {
  classification: Classification;
  confidence_score: number;
  patterns_detected: PatternMatch[];
  explanation: string;
  metadata: AnalysisMetadata;
}

export interface AnalysisMetadata {
  character_count: number;
  word_count: number;
  pattern_engine_version: string;
  analysis_duration: number;
  timestamp: string;
  warnings: string[];
  submission_source: 'text' | 'file';
  file_metadata?: {
    name: string;
    type: 'txt' | 'md' | 'html';
    character_count: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
}

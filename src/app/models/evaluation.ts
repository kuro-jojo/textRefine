import { ErrorCategory, TextIssue } from "./issue";

// Global Score Interface
export interface EvaluationGlobalScore {
    score: number;
    score_in_percent: number;
    vocabulary: VocabularyResult;
    correctness: CorrectnessResult;
    precision: PrecisionResult;
}

// Vocabulary Result
export interface VocabularyResult {
    score: number;  // Final vocabulary score [0-1]
    sophistication: SophisticationResult;
    precision: PrecisionResult;
    lexical_diversity: LexicalDiversityResult;
}

// Sophistication Result
export interface SophisticationResult {
    score: number;  // Sophistication score [0-1]
    word_count: number;
    common_count: number;
    mid_count: number;
    rare_count: number;
    unknown_count: number;
    level: SophisticationLevel;
    breakdown: SophisticationScoreBreakdown[];
}

// Sophistication Level
export enum SophisticationLevel {
    BASIC = 'Basic Vocabulary',
    CONVERSATIONAL = 'Conversational Range',
    ACADEMIC = 'Academic Range',
    ADVANCED = 'Advanced Vocabulary',
    ERUDITE = 'Erudite and Specialized'
}

// Sophistication Score Breakdown
export interface SophisticationScoreBreakdown {
    group: WordFrequencyGroup;
    words: string[];
}

// Word Frequency Group
export enum WordFrequencyGroup {
    COMMON = 'COMMON',
    MID = 'MID',
    RARE = 'RARE',
    UNKNOWN = 'UNKNOWN'
}

// Precision Result
export interface PrecisionResult {
    score: number;  // Precision score [0-1]
    word_count: number;
    normalized_penalty: number;
    issues: TextIssue[];
    breakdown: PrecisionScoreBreakdown[];
    original_text: string;
}

// Precision Score Breakdown
export interface PrecisionScoreBreakdown {
    category: ErrorCategory;
    count: number;
    penalty: number;
}

// Lexical Diversity Result
export interface LexicalDiversityResult {
    ttr: number;  // Type-Token Ratio
    word_count: number;
    unique_count: number;
}

// Correctness Result
export interface CorrectnessResult {
    score: number;  // Correctness score [0-1]
    word_count: number;
    normalized_penalty: number;
    issues: TextIssue[];
    breakdown: CorrectnessScoreBreakdown[];
    original_text: string;
}

// Correctness Score Breakdown
export interface CorrectnessScoreBreakdown {
    category: ErrorCategory;
    count: number;
    penalty: number;
}
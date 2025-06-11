import { ErrorCategory, TextIssue } from "./issue";

export interface EvaluationRequest {
    text: string;
    topic?: string;
    audience?: string;
}

// Global Score Interface
export interface EvaluationGlobalScore {
    score: number;
    score_in_percent: number;
    vocabulary: VocabularyResult;
    correctness: CorrectnessResult;
    precision: PrecisionResult;
    readability: ReadabilityResult;
    coherence: CoherenceResult;
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
    COMMON = 'Common',
    MID = 'Mid',
    RARE = 'Rare',
    UNKNOWN = 'Unknown'
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

/**
 * Represents the result of a readability analysis.
 */
export interface ReadabilityResult {
    // Core metrics with professional interpretation
    flesch_reading_ease: number;  // 0-100
    smog_index: number;  // 0-20
    dale_chall_score: number;  // 0-10
    avg_words_per_sentence: number;  // 0-20

    // Composite score (0-1 where higher is better)
    score: number;  // 0-1

    // Issues and suggestions
    issues: string[];
    suggestions: string[];

    // Computed properties
    overall_grade_level: string;
    target_audience: string;
    flesch_reading_ease_level: string;

    // Audience related metrics
    audience_appropriate: boolean;
    audience_issues: string[];
    audience_adjusted_score: number;

    estimated_reading_time: number; // in seconds
}

// Coherence Result
export interface CoherenceResult {
    score: number;
    text_coherence: number;
    topic_coherence: number;
    feedback: string;
    suggestions: string[];
    confidence: number;
}
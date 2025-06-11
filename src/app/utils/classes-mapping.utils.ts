import { Category, CategoryDetail } from "../models/issue";

export const SCORE_COLORS = {
    'gray': {
        text: 'text-gray-400',
        bg: 'bg-gray-100',
        all: 'text-gray-400 bg-gray-100'
    },
    'emerald': {
        text: 'text-emerald-600',
        bg: 'bg-emerald-100',
        all: 'text-emerald-600 bg-emerald-100'
    },
    'green': {
        text: 'text-green-600',
        bg: 'bg-green-100',
        all: 'text-green-600 bg-green-100'
    },
    'yellow': {
        text: 'text-yellow-600',
        bg: 'bg-yellow-100',
        all: 'text-yellow-600 bg-yellow-100'
    },
    'amber': {
        text: 'text-amber-600',
        bg: 'bg-amber-100',
        all: 'text-amber-600 bg-amber-100'
    },
    'orange': {
        text: 'text-orange-600',
        bg: 'bg-orange-100',
        all: 'text-orange-600 bg-orange-100'
    },
    'red': {
        text: 'text-red-600',
        bg: 'bg-red-100',
        all: 'text-red-600 bg-red-100'
    }
};

export const DETAIL_OF_CATEGORY: Record<Category, CategoryDetail> = {
    'Spelling & Typos': {
        text_color: 'text-amber-900',
        background_color: 'bg-amber-200',
        background_color_light: 'bg-amber-100',
        icon: 'fa-pen',
        description: 'Spelling errors, typos, and incorrect word usage'
    },
    'Grammar Rules': {
        text_color: 'text-orange-700',
        background_color: 'bg-orange-200',
        background_color_light: 'bg-orange-100',
        icon: 'fa-spell-check',
        description: 'Grammar errors, tense consistency, subject-verb agreement, and sentence structure'
    },
    'Mechanics': {
        text_color: 'text-blue-600',
        background_color: 'bg-blue-400',
        background_color_light: 'bg-blue-100',
        icon: 'fa-comma',
        description: 'Punctuation errors, capitalization, hyphenation, and formatting'
    },
    'Word Usage': {
        text_color: 'text-red-400',
        background_color: 'bg-red-200',
        background_color_light: 'bg-red-50',
        icon: 'fa-code',
        description: 'Inconsistent or incorrect word usage, including verb tense, verb forms, and synonyms'
    },
    'Meaning & Logic': {
        text_color: 'text-violet-400',
        background_color: 'bg-violet-200',
        background_color_light: 'bg-violet-50',
        icon: 'fa-paint-brush',
        description: 'Sentences with unclear or ambiguous meaning, logical errors, or lack of clarity'
    },
    'Stylistic Issues': {
        text_color: 'text-fuchsia-900',
        background_color: 'bg-fuchsia-200',
        background_color_light: 'bg-fuchsia-100',
        icon: 'fa-paint-brush',
        description: 'Writing style issues, including sentence structure, voice, tone, and clarity'
    }
} as const;

export const SEVERITY_CLASSES = {
    Major: 'bg-red-200 text-red-400',
    Medium: 'bg-orange-200 text-orange-400',
    Minor: 'bg-indigo-200 text-indigo-400',
} as const;

export function getScoreInPercentage(score: number | null | undefined): string {
    return score ? `${Math.round(score * 100)}` : 'N/A';
}

export function getScoreColor(score: number | null | undefined): { text: string; bg: string; all: string; } {
    if (!score) return SCORE_COLORS['gray'];
    if (score >= 0.95) return SCORE_COLORS['emerald'];
    if (score >= 0.9) return SCORE_COLORS['green'];
    if (score >= 0.75) return SCORE_COLORS['yellow'];
    if (score >= 0.6) return SCORE_COLORS['amber'];
    if (score >= 0.5) return SCORE_COLORS['orange'];
    return SCORE_COLORS['red'];
}

export function getScoreText(score: number | null | undefined): string {
    if (!score) return 'N/A';
    if (score >= 0.95) return 'Outstanding';
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.75) return 'Very Good';
    if (score >= 0.6) return 'Good';
    if (score >= 0.5) return 'Fair';
    return 'Needs Improvement';
}
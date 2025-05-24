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
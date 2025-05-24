export type Severity = 'Major' | 'Medium' | 'Minor';
export type Category = 'Spelling & Typos' | 'Grammar Rules' | 'Mechanics' | 'Word Usage' | 'Meaning & Logic' | 'Stylistic Issues';

export const Category = {
    Spelling: 'Spelling & Typos',
    Grammar: 'Grammar Rules',
    Mechanics: 'Mechanics',
    WordUsage: 'Word Usage',
    Meaning: 'Meaning & Logic',
    Stylistic: 'Stylistic Issues'
} as const;


export function getCategorySeverityText(issue: TextIssue): Severity {
    const severity = getCategorySeverity(issue.category);
    if (severity <= 2) return 'Minor';
    if (severity <= 3) return 'Medium';
    return 'Major';
}

// Error Category with display names
export type ErrorCategory = [
    string, // display name
    number  // severity level
];

// Error Category display names
export const errorCategoryDisplayNames: { [key: string]: string } = {
    'Spelling & Typos': 'Spelling & Typos',
    'Grammar Rules': 'Grammar Rules',
    'Mechanics': 'Mechanics',
    'Word Usage': 'Word Usage',
    'Meaning & Logic': 'Meaning & Logic',
    'Stylistic Issues': 'Stylistic Issues',
    'Contextual Style': 'Contextual Style'
};

// Helper function to get severity from category
export const getCategorySeverity = (category: ErrorCategory): number => category[1];

// Helper function to get display name from category
export function getCategoryName(category: ErrorCategory): Category {
    return category[0] as Category;
}

// Text Issue
export interface TextIssue {
    category: ErrorCategory;
    start_offset: number;
    error_length: number;
    replacements: string[];
    rule_issue_type: string;
    message: string;
    original_text: string;
}
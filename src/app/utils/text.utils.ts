export function splitIntoSentences(text: string): string[] {
    if (!text) return [];

    // This regex matches sentence endings (., !, ?) followed by whitespace and a capital letter
    // or the end of the string, but excludes common abbreviations and special cases
    const sentenceRegex = /(?<!\b(?:[A-Za-z]|[A-Za-z][a-z]*[a-z]\.))(?:[.!?]|\.(?=\s+[A-Z]|$))\s*/g;

    // Split and clean up the sentences
    const sentences = text.split(sentenceRegex)
        .map(s => s.trim())
        .filter(s => s.length > 0);

    // Add the ending punctuation back to each sentence
    const matches = text.match(sentenceRegex) || [];
    return sentences.map((s, i) => {
        // Add the ending punctuation if it exists
        const punctuation = matches[i] ? matches[i].trim() : '.';
        return s + punctuation;
    });
}
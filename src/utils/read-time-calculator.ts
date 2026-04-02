// src/utils/read-time-calculator.ts


/**
 * Calculates estimated reading time based on content
 * @param content - The post content (HTML or plain text)
 * @returns Formatted read time string (e.g., "5 min read")
 */
export const calculateReadTime = (content: string): string => {
  // Average reading speed (words per minute)
  const WORDS_PER_MINUTE = 200;

  // Strip HTML tags if content contains HTML
  const textContent = content.replace(/<[^>]*>/g, '');

  // Count words (split by whitespace and filter empty strings)
  const wordCount = textContent
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Calculate read time in minutes
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  // Format output
  if (minutes < 1) {
    return '1 min read';
  } else if (minutes === 1) {
    return '1 min read';
  } else {
    return `${minutes} min read`;
  }
};
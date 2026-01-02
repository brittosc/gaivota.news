export function calculateReadingTime(content: string): number {
  if (!content) return 0;

  // Strip HTML tags
  const text = content.replace(/<[^>]*>?/gm, '');

  // Average reading speed (words per minute)
  const wordsPerMinute = 200;

  // Count words
  const wordCount = text.split(/\s+/).length;

  // Calculate time
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return minutes;
}

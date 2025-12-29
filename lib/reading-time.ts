export function calculateReadingTime(content: string): string {
  if (!content) return '1 min de leitura';

  // Strip HTML tags
  const text = content.replace(/<[^>]*>?/gm, '');

  // Average reading speed (words per minute)
  const wordsPerMinute = 200;

  // Count words
  const wordCount = text.split(/\s+/).length;

  // Calculate time
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return `${minutes} min de leitura`;
}

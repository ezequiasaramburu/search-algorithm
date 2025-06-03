export function generateNgrams(text) {
  const normalizedText = text
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/[.,!?;]/g, '');

  const words = normalizedText.split(/\s+/).filter(Boolean);
  const ngrams = new Set();

  words.forEach(word => {
    if (word.length >= 3 && word !== 'and') {
      ngrams.add(word);
    }
  });

  for (let i = 0; i < words.length - 1; i++) {
    const bigram = words.slice(i, i + 2).join(' ');
    if (bigram.length >= 3 && !bigram.includes(' and ')) {
      ngrams.add(bigram);
    }
  }
  return Array.from(ngrams);
}

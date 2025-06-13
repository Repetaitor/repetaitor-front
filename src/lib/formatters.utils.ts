export const formatAverageScore = (score: number, maxScore: number = 16) => {
  if (score === 0) return `N/A`;
  return `${score.toFixed(2)}/${maxScore}`;
};

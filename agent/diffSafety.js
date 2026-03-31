export function analyzeAndValidateDiff({
  relPath,
  oldContent,
  newContent,
  remainingLineBudget,
}) {
  if (oldContent === newContent) {
    return {
      meaningful: false,
      changedLines: 0,
      reason: "No content changes",
      score: 0,
    };
  }

  const oldLines = splitLines(oldContent);
  const newLines = splitLines(newContent);
  const changedLines = countChangedLines(oldLines, newLines);
  const meaningful = changedLines >= 2 || normalized(oldContent) !== normalized(newContent);

  if (!meaningful) {
    return {
      meaningful: false,
      changedLines,
      reason: "Trivial formatting-only diff",
      score: 0,
    };
  }

  if (changedLines > remainingLineBudget) {
    return {
      meaningful: false,
      changedLines,
      reason: `Diff exceeds remaining line budget (${remainingLineBudget})`,
      score: 0,
    };
  }

  const score = improvementScore(oldContent, newContent, changedLines);
  return { meaningful: true, changedLines, reason: "OK", score, relPath };
}

function splitLines(text) {
  return text.split(/\r?\n/);
}

function normalized(value) {
  return value.replace(/\s+/g, "");
}

function countChangedLines(a, b) {
  const lcs = longestCommonSubsequenceLength(a, b);
  return (a.length - lcs) + (b.length - lcs);
}

function longestCommonSubsequenceLength(a, b) {
  const n = a.length;
  const m = b.length;
  const prev = new Array(m + 1).fill(0);
  const curr = new Array(m + 1).fill(0);
  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j <= m; j += 1) {
      if (a[i - 1] === b[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    for (let k = 0; k <= m; k += 1) {
      prev[k] = curr[k];
      curr[k] = 0;
    }
  }
  return prev[m];
}

function improvementScore(oldContent, newContent, changedLines) {
  let score = 50;
  if (newContent.includes("/**") || newContent.includes("//")) score += 8;
  if ((oldContent.match(/TODO|FIXME|HACK/g) || []).length > (newContent.match(/TODO|FIXME|HACK/g) || []).length) {
    score += 12;
  }
  if (changedLines <= 25) score += 12;
  if (changedLines > 80) score -= 10;
  return Math.max(0, Math.min(100, score));
}

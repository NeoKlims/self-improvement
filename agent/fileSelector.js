import fs from "node:fs/promises";
import path from "node:path";

export async function selectFiles(config, logger) {
  const candidates = [];
  await walk(config.rootDir);

  const sorted = candidates.sort((a, b) => b.score - a.score);
  const selected = sorted.slice(0, config.maxFilesPerRun);

  logger.info("Selected files for improvement", {
    selected,
    totalCandidates: candidates.length,
  });
  return selected;

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const absPath = path.join(currentDir, entry.name);
      const relPath = toRel(absPath, config.rootDir);

      if (entry.isDirectory()) {
        if (config.excludedDirs.has(entry.name)) continue;
        await walk(absPath);
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (!config.allowedExtensions.has(ext)) continue;
      if (entry.name.endsWith(".min.js")) continue;
      if (isLikelyLockFile(entry.name)) continue;
      if (relPath === "README.md" || relPath === "CONTRIBUTING.md") continue;

      const stats = await fs.stat(absPath);
      if (stats.size > config.maxFileSizeBytes) continue;

      const content = await fs.readFile(absPath, "utf8");
      if (content.trim().length === 0) continue;

      candidates.push({
        relPath,
        absPath,
        sizeBytes: stats.size,
        score: scoreCandidate(relPath, content),
      });
    }
  }
}

function scoreCandidate(relPath, content) {
  let score = 0;
  const lines = content.split(/\r?\n/);

  // Bonus scoring for maintainability opportunities.
  if (/TODO|FIXME|HACK/.test(content)) score += 25;
  if (lines.length > 120) score += 20;
  if ((content.match(/console\.log/g) || []).length > 2) score += 12;
  if ((content.match(/any/g) || []).length > 4) score += 8;
  if (relPath.startsWith("src/")) score += 15;
  if (relPath.endsWith(".md")) score += 5;
  score += Math.min(20, Math.floor(lines.length / 30));
  return score;
}

function isLikelyLockFile(name) {
  return (
    name === "package-lock.json" ||
    name === "pnpm-lock.yaml" ||
    name === "yarn.lock"
  );
}

function toRel(absPath, root) {
  return path.relative(root, absPath).split(path.sep).join("/");
}

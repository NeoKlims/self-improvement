import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";

import { loadConfig } from "./config.js";
import { analyzeAndValidateDiff } from "./diffSafety.js";
import { selectFiles } from "./fileSelector.js";
import { commitFile, hasChanges, pushIfEnabled } from "./gitAutomation.js";
import { improveFileWithLlm } from "./llmClient.js";
import { createLogger } from "./logger.js";
import { buildPrompt, extractImprovedContent } from "./prompt.js";

const logger = createLogger("self-improve");

async function main() {
  const rootDir = process.cwd();
  dotenv.config({ path: path.join(rootDir, ".env") });
  const config = loadConfig(rootDir);
  logger.info("Starting self-improvement run", {
    dryRun: config.dryRun,
    maxFilesPerRun: config.maxFilesPerRun,
    maxFileSizeBytes: config.maxFileSizeBytes,
    maxTotalChangedLines: config.maxTotalChangedLines,
    model: config.openAiModel,
  });

  const repoContext = await buildRepositoryContext(rootDir);
  const selected = await selectFiles(config, logger);
  let remainingLineBudget = config.maxTotalChangedLines;
  const applied = [];

  for (const candidate of selected) {
    const original = await fs.readFile(candidate.absPath, "utf8");
    const hasCompanionTest = await companionTestExists(rootDir, candidate.relPath);
    const prompt = buildPrompt({
      repoContext,
      file: { relPath: candidate.relPath, content: original },
      hasCompanionTest,
    });

    try {
      const raw = await improveFileWithLlm(config, logger, prompt);
      const improved = extractImprovedContent(raw);
      const diff = analyzeAndValidateDiff({
        relPath: candidate.relPath,
        oldContent: original,
        newContent: improved,
        remainingLineBudget,
      });

      if (!diff.meaningful) {
        logger.warn("Skipping candidate", {
          file: candidate.relPath,
          reason: diff.reason,
          changedLines: diff.changedLines,
        });
        continue;
      }

      logger.info("Accepted improvement", {
        file: candidate.relPath,
        changedLines: diff.changedLines,
        score: diff.score,
      });

      remainingLineBudget -= diff.changedLines;
      if (!config.dryRun) {
        await fs.writeFile(candidate.absPath, improved, "utf8");
      }
      applied.push({ ...diff, relPath: candidate.relPath });
    } catch (error) {
      logger.error("Candidate processing failed", {
        file: candidate.relPath,
        error: error.message,
      });
    }
  }

  if (config.dryRun) {
    logger.info("Dry run completed", {
      improvedFiles: applied.map((x) => x.relPath),
      remainingLineBudget,
    });
    return;
  }

  let committedCount = 0;
  for (const result of applied) {
    const changed = await hasChanges(rootDir, result.relPath);
    if (!changed) continue;
    await commitFile(rootDir, result.relPath, logger);
    committedCount += 1;
  }

  if (committedCount === 0) {
    logger.info("No meaningful changes to commit");
    return;
  }

  if (config.autoPush) {
    await pushIfEnabled(rootDir, logger);
  } else {
    logger.info("AUTO_PUSH is disabled, skipping push");
  }
}

async function buildRepositoryContext(rootDir) {
  const packageJsonPath = path.join(rootDir, "package.json");
  let packageJsonText = "{}";
  try {
    packageJsonText = await fs.readFile(packageJsonPath, "utf8");
  } catch {
    // optional
  }

  const topLevel = await fs.readdir(rootDir, { withFileTypes: true });
  const topNames = topLevel.map((entry) => entry.name).sort();
  return [
    "Repository top-level items:",
    topNames.join(", "),
    "",
    "package.json:",
    packageJsonText,
  ].join("\n");
}

async function companionTestExists(rootDir, relPath) {
  const ext = path.extname(relPath);
  const withoutExt = relPath.slice(0, -ext.length);
  const tests = [
    `${withoutExt}.test${ext}`,
    `${withoutExt}.spec${ext}`,
    `${withoutExt}.test.ts`,
    `${withoutExt}.spec.ts`,
    `${withoutExt}.test.tsx`,
    `${withoutExt}.spec.tsx`,
  ];

  for (const testRelPath of tests) {
    try {
      await fs.access(path.join(rootDir, testRelPath));
      return true;
    } catch {
      // continue
    }
  }
  return false;
}

main().catch((error) => {
  logger.error("Fatal run failure", { error: error.message });
  process.exitCode = 1;
});

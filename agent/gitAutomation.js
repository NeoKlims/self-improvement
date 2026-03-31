import { spawn } from "node:child_process";

export async function hasChanges(rootDir, relPath) {
  const { stdout } = await runGit(
    rootDir,
    ["status", "--porcelain", "--", relPath],
    false,
  );
  return stdout.trim().length > 0;
}

export async function commitFile(rootDir, relPath, logger) {
  await runGit(rootDir, ["add", "--", relPath]);
  await runGit(rootDir, [
    "commit",
    "-m",
    `chore(ai): improve ${fileNameFromPath(relPath)}`,
  ]);
  logger.info("Committed improvement", { file: relPath });
}

export async function pushIfEnabled(rootDir, logger) {
  await runGit(rootDir, ["push"]);
  logger.info("Pushed changes to remote");
}

async function runGit(rootDir, args, throwOnError = true) {
  return new Promise((resolve, reject) => {
    const child = spawn("git", args, { cwd: rootDir });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0 && throwOnError) {
        reject(new Error(`git ${args.join(" ")} failed: ${stderr || stdout}`));
        return;
      }
      resolve({ code, stdout, stderr });
    });
  });
}

function fileNameFromPath(relPath) {
  const parts = relPath.split("/");
  return parts[parts.length - 1];
}

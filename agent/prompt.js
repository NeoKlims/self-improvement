export function buildPrompt({ repoContext, file, hasCompanionTest }) {
  const behaviorClause = hasCompanionTest
    ? "The file appears to be covered by tests. Preserve behavior and public API exactly."
    : "Preserve behavior and public API unless there is an obvious bug fix.";

  const system = [
    "You are a senior software engineer improving one repository file safely.",
    "Primary goals: readability, maintainability, performance, documentation, bug fixes.",
    "Do not break functionality. Keep behavior stable.",
    "Return ONLY a full replacement file content between tags:",
    "<IMPROVED_FILE_START>",
    "...full file...",
    "<IMPROVED_FILE_END>",
    "No markdown fences and no additional commentary.",
  ].join("\n");

  const user = [
    "Repository context:",
    repoContext,
    "",
    "Safety constraints:",
    "- Incremental edits only",
    "- No broad rewrites",
    "- Keep imports and exports valid",
    `- ${behaviorClause}`,
    "",
    `Target file: ${file.relPath}`,
    "Original file content:",
    file.content,
  ].join("\n");

  return { system, user };
}

export function extractImprovedContent(rawText) {
  const startTag = "<IMPROVED_FILE_START>";
  const endTag = "<IMPROVED_FILE_END>";
  const start = rawText.indexOf(startTag);
  const end = rawText.lastIndexOf(endTag);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("LLM response does not contain required output tags");
  }
  const content = rawText.slice(start + startTag.length, end).trimStart();
  if (!content.trim()) {
    throw new Error("LLM response produced empty file content");
  }
  return content;
}

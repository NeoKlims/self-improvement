const DEFAULTS = {
  OPENAI_BASE_URL: "https://api.openai.com/v1",
  DRY_RUN: "false",
  MAX_FILES_PER_RUN: "3",
  MAX_FILE_SIZE_BYTES: "50000",
  MAX_TOTAL_CHANGED_LINES: "120",
  AUTO_PUSH: "",
};

export function loadConfig(rootDir, args = process.argv.slice(2)) {
  const env = { ...DEFAULTS, ...process.env };
  const cliDryRun = args.includes("--dry-run");

  const config = {
    rootDir,
    openAiApiKey: required(env.OPENAI_API_KEY, "OPENAI_API_KEY"),
    openAiBaseUrl: ensureUrl(env.OPENAI_BASE_URL),
    openAiModel: required(env.OPENAI_MODEL, "OPENAI_MODEL"),
    dryRun: cliDryRun || toBool(env.DRY_RUN),
    maxFilesPerRun: toPositiveInt(env.MAX_FILES_PER_RUN, "MAX_FILES_PER_RUN"),
    maxFileSizeBytes: toPositiveInt(
      env.MAX_FILE_SIZE_BYTES,
      "MAX_FILE_SIZE_BYTES",
    ),
    maxTotalChangedLines: toPositiveInt(
      env.MAX_TOTAL_CHANGED_LINES,
      "MAX_TOTAL_CHANGED_LINES",
    ),
    autoPush:
      env.AUTO_PUSH === ""
        ? process.env.GITHUB_ACTIONS === "true"
        : toBool(env.AUTO_PUSH),
    excludedDirs: new Set([
      ".git",
      "node_modules",
      "dist",
      ".github",
      "agent",
      ".cursor",
      ".idea",
      ".vscode",
    ]),
    allowedExtensions: new Set([
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".css",
      ".json",
      ".md",
    ]),
  };

  if (config.maxFilesPerRun > 3) {
    throw new Error("MAX_FILES_PER_RUN cannot exceed 3");
  }
  if (config.maxFileSizeBytes > 50000) {
    throw new Error("MAX_FILE_SIZE_BYTES cannot exceed 50000");
  }
  if (config.maxTotalChangedLines > 120) {
    throw new Error("MAX_TOTAL_CHANGED_LINES cannot exceed 120");
  }
  return config;
}

function required(value, name) {
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return String(value).trim();
}

function toBool(value) {
  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off", ""].includes(normalized)) return false;
  throw new Error(`Invalid boolean value: ${value}`);
}

function toPositiveInt(value, name) {
  const num = Number.parseInt(String(value), 10);
  if (!Number.isFinite(num) || num <= 0) {
    throw new Error(`Invalid positive integer for ${name}: ${value}`);
  }
  return num;
}

function ensureUrl(value) {
  const trimmed = String(value).trim();
  try {
    const url = new URL(trimmed);
    const normalizedPath = url.pathname.endsWith("/")
      ? url.pathname.slice(0, -1)
      : url.pathname;
    return `${url.origin}${normalizedPath}`;
  } catch {
    throw new Error(`Invalid OPENAI_BASE_URL: ${value}`);
  }
}

export function createLogger(scope = "agent") {
  const base = `[${scope}]`;
  return {
    info(message, meta) {
      print("INFO", message, meta);
    },
    warn(message, meta) {
      print("WARN", message, meta);
    },
    error(message, meta) {
      print("ERROR", message, meta);
    },
  };

  function print(level, message, meta) {
    const line = `${new Date().toISOString()} ${base} ${level} ${message}`;
    if (meta === undefined) {
      console.log(line);
      return;
    }
    console.log(line, safeMeta(meta));
  }

  function safeMeta(value) {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
}

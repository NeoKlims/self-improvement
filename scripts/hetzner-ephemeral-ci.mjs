#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs/promises";

const HETZNER_API = "https://api.hetzner.cloud/v1";
const GITHUB_API = "https://api.github.com";

async function main() {
  const command = process.argv[2];
  if (!command || !["provision", "cleanup"].includes(command)) {
    throw new Error("Usage: node scripts/hetzner-ephemeral-ci.mjs <provision|cleanup>");
  }

  if (command === "provision") {
    const ctx = loadContext();
    await runPreflightChecks(ctx);
    const state = await provision(ctx);
    printOutputs(state);
    return;
  }

  const cleanupCtx = loadCleanupContext();
  await cleanup(cleanupCtx);
}

async function provision(ctx) {
  const suffix = `${ctx.githubRunId}-${crypto.randomUUID().slice(0, 8)}`;
  const runnerName = `hcloud-runner-${suffix}`;
  const runnerLabel = `hcloud-ephemeral-${suffix}`;
  const serverName = `ci-${suffix}`;
  const firewallName = `ci-fw-${suffix}`;

  log("Creating repository runner registration token");
  const registrationToken = await createRunnerRegistrationToken(ctx);

  log("Creating Hetzner firewall with no inbound rules");
  const firewallId = await createFirewall(ctx.hetznerToken, firewallName);

  log("Creating Hetzner server");
  const cloudInit = buildCloudInit({
    githubRepository: ctx.githubRepository,
    runnerName,
    runnerLabel,
    registrationToken,
    cloudflareTunnelToken: ctx.cloudflareTunnelToken,
  });

  const server = await createServerWithFallbackType({
    ctx,
    serverName,
    firewallId,
    cloudInit,
  });

  const serverId = server.server.id;
  log("Waiting for server to be running", { serverId });
  await waitForServerRunning(ctx.hetznerToken, serverId, 30, 5000);

  log("Waiting for self-hosted runner to become online", { runnerName, runnerLabel });
  await waitForRunnerOnline(ctx, runnerName, 60, 5000);

  log("Provision completed", { serverId, firewallId, runnerLabel, runnerName });
  return {
    serverId,
    firewallId,
    runnerLabel,
    runnerName,
    serverName,
  };
}

async function cleanup(ctx) {
  log("Cleanup started", { serverId: ctx.serverId, firewallId: ctx.firewallId });
  if (ctx.serverId) {
    try {
      await hcloudRequest(ctx.hetznerToken, `/servers/${ctx.serverId}`, {
        method: "DELETE",
      });
      log("Server deleted", { serverId: ctx.serverId });
    } catch (error) {
      log("Server cleanup warning", { error: error.message, serverId: ctx.serverId });
    }
  }

  if (ctx.firewallId) {
    try {
      await hcloudRequest(ctx.hetznerToken, `/firewalls/${ctx.firewallId}`, {
        method: "DELETE",
      });
      log("Firewall deleted", { firewallId: ctx.firewallId });
    } catch (error) {
      log("Firewall cleanup warning", {
        error: error.message,
        firewallId: ctx.firewallId,
      });
    }
  }

  if (ctx.runnerName) {
    try {
      await removeOfflineRunnerByName(ctx, ctx.runnerName);
    } catch (error) {
      log("Runner cleanup warning", { error: error.message, runnerName: ctx.runnerName });
    }
  }
}

function loadContext() {
  const required = [
    "HETZNER_API_TOKEN",
    "GITHUB_TOKEN",
    "GITHUB_REPOSITORY",
    "GITHUB_RUN_ID",
  ];
  assertRequired(required);

  return {
    hetznerToken: process.env.HETZNER_API_TOKEN.trim(),
    githubToken: process.env.GITHUB_TOKEN.trim(),
    githubRepository: process.env.GITHUB_REPOSITORY.trim(),
    githubRunId: process.env.GITHUB_RUN_ID.trim(),
    hetznerServerType: (process.env.HETZNER_SERVER_TYPE || "cx11").trim(),
    hetznerImage: (process.env.HETZNER_IMAGE || "ubuntu-24.04").trim(),
    hetznerLocation: (process.env.HETZNER_LOCATION || "fsn1").trim(),
    cloudflareTunnelToken: (process.env.CLOUDFLARE_TUNNEL_TOKEN || "").trim(),
  };
}

function loadCleanupContext() {
  const required = ["HETZNER_API_TOKEN", "GITHUB_TOKEN", "GITHUB_REPOSITORY"];
  assertRequired(required);
  return {
    hetznerToken: process.env.HETZNER_API_TOKEN.trim(),
    githubToken: process.env.GITHUB_TOKEN.trim(),
    githubRepository: process.env.GITHUB_REPOSITORY.trim(),
    serverId: process.env.HCLOUD_SERVER_ID || "",
    firewallId: process.env.HCLOUD_FIREWALL_ID || "",
    runnerName: process.env.GH_RUNNER_NAME || "",
  };
}

async function runPreflightChecks(ctx) {
  log("Preflight: validating token shapes", {
    hetznerTokenLength: ctx.hetznerToken.length,
    githubTokenLength: ctx.githubToken.length,
    repository: ctx.githubRepository,
  });

  const hcloud = await hcloudRequest(ctx.hetznerToken, "/servers?per_page=1", {
    method: "GET",
  });
  const count = Array.isArray(hcloud.servers) ? hcloud.servers.length : 0;
  log("Preflight: Hetzner read access OK", { sampleServerCount: count });

  const [owner, repo] = ctx.githubRepository.split("/");
  await githubRequest(ctx.githubToken, `/repos/${owner}/${repo}`, { method: "GET" });
  log("Preflight: GitHub repo access OK");
}

function assertRequired(names) {
  for (const name of names) {
    if (!process.env[name] || !String(process.env[name]).trim()) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
  }
}

async function createRunnerRegistrationToken(ctx) {
  const [owner, repo] = ctx.githubRepository.split("/");
  const response = await githubRequest(
    ctx.githubToken,
    `/repos/${owner}/${repo}/actions/runners/registration-token`,
    { method: "POST" },
  );
  return response.token;
}

async function waitForServerRunning(token, serverId, maxAttempts, delayMs) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const details = await hcloudRequest(token, `/servers/${serverId}`, { method: "GET" });
    const status = details.server.status;
    if (status === "running") return;
    await sleep(delayMs);
  }
  throw new Error("Server did not become running in expected time");
}

async function waitForRunnerOnline(ctx, runnerName, maxAttempts, delayMs) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const runners = await listRepoRunners(ctx);
    const target = runners.find((r) => r.name === runnerName);
    if (target && target.status === "online") return;
    log("Runner not online yet", { attempt, runnerName });
    await sleep(delayMs);
  }
  throw new Error(`Runner ${runnerName} did not become online in expected time`);
}

async function removeOfflineRunnerByName(ctx, runnerName) {
  const [owner, repo] = ctx.githubRepository.split("/");
  const data = await githubRequest(
    ctx.githubToken,
    `/repos/${owner}/${repo}/actions/runners?per_page=100`,
    { method: "GET" },
  );
  const target = (data.runners || []).find((runner) => runner.name === runnerName);
  if (!target) return;
  await githubRequest(
    ctx.githubToken,
    `/repos/${owner}/${repo}/actions/runners/${target.id}`,
    { method: "DELETE" },
  );
  log("Runner removed", { runnerName });
}

async function listRepoRunners(ctx) {
  const [owner, repo] = ctx.githubRepository.split("/");
  const data = await githubRequest(
    ctx.githubToken,
    `/repos/${owner}/${repo}/actions/runners?per_page=100`,
    { method: "GET" },
  );
  return data.runners || [];
}

async function createFirewall(token, name) {
  const payload = {
    name,
    labels: { purpose: "ephemeral-ci" },
    rules: [
      {
        direction: "out",
        protocol: "tcp",
        destination_ips: ["0.0.0.0/0", "::/0"],
        port: "1-65535",
      },
      {
        direction: "out",
        protocol: "udp",
        destination_ips: ["0.0.0.0/0", "::/0"],
        port: "1-65535",
      },
      {
        direction: "out",
        protocol: "icmp",
        destination_ips: ["0.0.0.0/0", "::/0"],
      },
    ],
  };
  const response = await hcloudRequest(token, "/firewalls", {
    method: "POST",
    body: payload,
  });
  return response.firewall.id;
}

async function createServerWithFallbackType({ ctx, serverName, firewallId, cloudInit }) {
  const candidateTypes = unique([ctx.hetznerServerType, "cpx11"]);
  let lastError;
  for (const serverType of candidateTypes) {
    const supportedLocations = await getSupportedLocationsForServerType(
      ctx.hetznerToken,
      serverType,
    );
    const candidateLocations = unique([ctx.hetznerLocation, ...supportedLocations]);

    for (const location of candidateLocations) {
      try {
        log("Attempting server create", { serverType, location });
        return await withRetry(
          () =>
            hcloudRequest(ctx.hetznerToken, "/servers", {
              method: "POST",
              body: {
                name: serverName,
                server_type: serverType,
                image: ctx.hetznerImage,
                location,
                user_data: cloudInit,
                labels: {
                  purpose: "ephemeral-ci",
                  repo: sanitizeLabel(ctx.githubRepository),
                  run_id: String(ctx.githubRunId),
                },
                firewalls: [{ firewall: firewallId }],
              },
            }),
          { retries: 3, delayMs: 4000, name: `create-server-${serverType}-${location}` },
        );
      } catch (error) {
        lastError = error;
        if (isUnsupportedLocationError(error.message)) {
          log("Location not supported for server type, trying next location", {
            serverType,
            location,
            error: error.message,
          });
          continue;
        }
        if (isDeprecatedServerTypeError(error.message)) {
          log("Server type appears deprecated, trying next candidate", {
            serverType,
            error: error.message,
          });
          break;
        }
        throw error;
      }
    }

    if (!supportedLocations.length) {
      log("Could not discover supported locations for server type", { serverType });
    }
  }
  throw lastError;
}

async function getSupportedLocationsForServerType(token, serverType) {
  try {
    const response = await hcloudRequest(token, `/server_types/${serverType}`, {
      method: "GET",
    });
    return unique((response.server_type?.prices || []).map((p) => p.location));
  } catch {
    return [];
  }
}

async function hcloudRequest(token, path, { method, body }) {
  const response = await fetch(`${HETZNER_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Hetzner API ${method} ${path} failed (${response.status}): ${err}`);
  }
  if (response.status === 204) return {};
  return response.json();
}

async function githubRequest(token, path, { method, body }) {
  const response = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`GitHub API ${method} ${path} failed (${response.status}): ${err}`);
  }
  if (response.status === 204) return {};
  return response.json();
}

function buildCloudInit({
  githubRepository,
  runnerName,
  runnerLabel,
  registrationToken,
  cloudflareTunnelToken,
}) {
  const installCloudflared = cloudflareTunnelToken
    ? `
  curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | gpg --dearmor -o /usr/share/keyrings/cloudflare-main.gpg
  echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared noble main" > /etc/apt/sources.list.d/cloudflared.list
  apt-get update
  apt-get install -y cloudflared
  cloudflared service install "${cloudflareTunnelToken}"
`
    : "";

  return `#cloud-config
package_update: true
package_upgrade: true
packages:
  - curl
  - jq
  - tar
  - git
  - ufw
write_files:
  - path: /usr/local/bin/bootstrap-runner.sh
    permissions: "0755"
    content: |
      #!/usr/bin/env bash
      set -euo pipefail
      export DEBIAN_FRONTEND=noninteractive
      ufw default deny incoming
      ufw default allow outgoing
      ufw --force enable
${installCloudflared ? "      # Optional Cloudflare Tunnel for secure operator access\n" : ""}${installCloudflared
    .split("\n")
    .map((line) => (line ? `      ${line}` : ""))
    .join("\n")}
      useradd -m -d /home/runner -s /bin/bash runner || true
      mkdir -p /home/runner/actions-runner
      chown -R runner:runner /home/runner/actions-runner
      cd /home/runner/actions-runner
      RUNNER_VERSION=$(curl -fsSL https://api.github.com/repos/actions/runner/releases/latest | jq -r .tag_name | sed 's/^v//')
      curl -fsSL -o actions-runner.tar.gz "https://github.com/actions/runner/releases/download/v$RUNNER_VERSION/actions-runner-linux-x64-$RUNNER_VERSION.tar.gz"
      tar xzf actions-runner.tar.gz
      chown -R runner:runner /home/runner/actions-runner
      sudo -u runner bash -lc './config.sh --unattended --ephemeral --replace --name "${runnerName}" --labels "${runnerLabel}" --url "https://github.com/${githubRepository}" --token "${registrationToken}"'
      sudo -u runner bash -lc 'nohup ./run.sh > /home/runner/runner.log 2>&1 &'
runcmd:
  - [ bash, -lc, "/usr/local/bin/bootstrap-runner.sh" ]
`;
}

function printOutputs(state) {
  const githubOutputFile = process.env.GITHUB_OUTPUT;
  if (githubOutputFile) {
    const lines = [
      `server_id=${state.serverId}`,
      `firewall_id=${state.firewallId}`,
      `runner_label=${state.runnerLabel}`,
      `runner_name=${state.runnerName}`,
      `server_name=${state.serverName}`,
    ];
    fs.writeFile(githubOutputFile, `${lines.join("\n")}\n`, { flag: "a" }).catch(() => {});
  }
  log("Outputs", state);
}

function sanitizeLabel(input) {
  return input.replace(/[^a-zA-Z0-9_.-]/g, "-").slice(0, 60);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function isDeprecatedServerTypeError(message) {
  const text = String(message).toLowerCase();
  return text.includes("server type") && text.includes("deprecated");
}

function isUnsupportedLocationError(message) {
  return String(message).toLowerCase().includes("unsupported location");
}

async function withRetry(fn, { retries, delayMs, name }) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      log("Retryable operation failed", { name, attempt, error: error.message });
      if (attempt < retries) {
        await sleep(delayMs * attempt);
      }
    }
  }
  throw lastError;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(message, meta) {
  const ts = new Date().toISOString();
  if (meta === undefined) {
    console.log(`${ts} [hetzner-ephemeral-ci] ${message}`);
    return;
  }
  console.log(`${ts} [hetzner-ephemeral-ci] ${message} ${JSON.stringify(meta)}`);
}

main().catch((error) => {
  console.error(`${new Date().toISOString()} [hetzner-ephemeral-ci] fatal ${error.message}`);
  process.exitCode = 1;
});

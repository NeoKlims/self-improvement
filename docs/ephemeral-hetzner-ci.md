# Ephemeral Hetzner CI Setup

This setup provisions a temporary Hetzner Cloud VPS, registers it as an ephemeral GitHub self-hosted runner, executes CI jobs, and destroys infrastructure after the run.

## Security Model

- No public SSH access is required for CI execution.
- Server bootstrap is done via cloud-init only.
- Inbound traffic is blocked by a Hetzner firewall (no inbound rules).
- Host-level `ufw` denies all inbound traffic.
- Optional operator access can be done through Cloudflare Tunnel using outbound-only connectivity.

## Required GitHub Secrets

- `HETZNER_API_TOKEN`: Hetzner Cloud API token with write access.
- `GITHUB_TOKEN`: default GitHub token is provided automatically in workflows.
- `CLOUDFLARE_TUNNEL_TOKEN` (optional): token for a pre-created Cloudflare Tunnel.

## Required GitHub Permissions

In repository settings, ensure Actions have permission to read repository contents and to manage self-hosted runners for the repository scope with the workflow token.

## Workflow

File: `.github/workflows/ephemeral-hetzner-ci.yml`

Stages:
1. `provision-runner`
   - Creates firewall
   - Creates CX11 server with cloud-init bootstrap
   - Registers ephemeral self-hosted runner
   - Waits until runner is online
2. `tests`
   - Runs CI jobs on the ephemeral runner label
3. `cleanup-runner` (always)
   - Deletes server
   - Deletes firewall
   - Removes stale runner by name if needed

## Local Script Usage

Provision:

```bash
node scripts/hetzner-ephemeral-ci.mjs provision
```

Cleanup:

```bash
node scripts/hetzner-ephemeral-ci.mjs cleanup
```

## Environment Variables

Provision mode:
- `HETZNER_API_TOKEN`
- `GITHUB_TOKEN`
- `GITHUB_REPOSITORY` (format: `owner/repo`)
- `GITHUB_RUN_ID` (for unique naming)
- `HETZNER_SERVER_TYPE` (default: `cx11`)
- `HETZNER_LOCATION` (default: `fsn1`)
- `HETZNER_IMAGE` (default: `ubuntu-24.04`)
- `CLOUDFLARE_TUNNEL_TOKEN` (optional)

Cleanup mode:
- `HETZNER_API_TOKEN`
- `GITHUB_TOKEN`
- `GITHUB_REPOSITORY`
- `HCLOUD_SERVER_ID`
- `HCLOUD_FIREWALL_ID`
- `GH_RUNNER_NAME`

## Cost Optimization

- Runner VM is created only for a CI run.
- VM and firewall are deleted in `cleanup-runner`.
- Ephemeral runner handles only a single job and then exits.

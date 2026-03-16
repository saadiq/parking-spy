# camspy - Ring Camera Parking Spot Monitor

Monitors a Ring doorbell camera for open parking spots on a Brooklyn street.

## Architecture

- `capture.ts` — Pulls a snapshot from Ring, saves to `snapshot.png`
- `notify.ts` — Sends a Slack message via webhook
- `.claude/commands/check-parking.md` — Slash command that orchestrates capture → vision analysis → notification

## Running

```bash
bun run capture.ts          # Pull a snapshot
bun run notify.ts "message" # Send Slack notification
/check-parking near         # One-off parking check
/loop 2m /check-parking near # Continuous monitoring
```

## Cameras

4 cameras on account. We target "Front" (the doorbell overlooking the street).

## Important

- Ring tokens are single-use. `capture.ts` auto-rotates the token in `.env`.
- If token expires after inactivity, re-run `bun run login-and-capture.ts` (interactive email/password + 2FA). The `ring-auth-cli` tokens don't work — use this script instead.
- 2-min loop interval is fine for Ring wired cameras (~10s snapshot cache).

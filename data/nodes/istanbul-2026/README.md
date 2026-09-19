# Node manifests — istanbul-2026

Each file in this directory is a node manifest for one member of the **istanbul-2026** alliance.
One file per member address; filename is `<G-address>.json`.

## Manifest schema

```json
{
  "protocol": "mikoriza/0.1-mock",
  "alliance": "istanbul-2026",
  "member": "<G-address — your Stellar public key>",
  "app": "<human-readable app name>",
  "repo": "https://github.com/owner/repo",
  "origin": "https://app.example.com",
  "capabilities": [
    {
      "name": "quote_swap",
      "description": "Quote a swap between two assets",
      "readOnly": true
    }
  ],
  "submitted_at": "<ISO 8601 timestamp, e.g. 2026-09-19T12:00:00Z>"
}
```

### Field rules

| Field | Rule |
|---|---|
| `protocol` | Must be `mikoriza/0.1-mock` |
| `alliance` | Must be `istanbul-2026` |
| `member` | Your Stellar G-address (56 chars, starts with G) |
| `app` | Short name for your project |
| `repo` | Public GitHub repo URL |
| `origin` | HTTPS origin where your node is live |
| `capabilities` | At least one capability; `name` must be stable snake_case |
| `submitted_at` | ISO 8601 UTC timestamp |

## PR convention

- **Title:** `node: <app> (<alliance>)` — e.g. `node: Demo Node (istanbul-2026)`
- **Branch:** anything, e.g. `node/my-app`
- **One file per PR** — one member address per file
- **Target path:** `data/nodes/istanbul-2026/<YOUR_G_ADDRESS>.json`
- **No secrets** — origin and repo must be public; never include private keys

Fork this repo, create the file at the correct path, and open a PR with the title above.

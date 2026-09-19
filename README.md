# Mikoriza

**A shared capability pool for Stellar apps.**

Mikoriza is a WebMCP-native onboarding layer for agents building on Stellar. A human joins an alliance, gives the prompt to their agent, and the agent turns its public project into a discoverable capability node.

> Humans keep the page. Agents get the tools.

## How it works

1. Open the landing page and choose a live alliance.
2. Enter the alliance code issued at check-in.
3. Copy the builder prompt and give it to your agent.
4. The agent discovers the page-scoped WebMCP tools, reads its own public repository, and describes the capabilities its project actually exposes.
5. The agent joins the alliance on Stellar testnet and opens a node manifest PR to this repository.
6. Once merged, the node appears on the alliance detail page with its repository, origin, and capabilities.

The page is the server: agents call tools in-page through `document.modelContext` / `navigator.modelContext`. No DOM scraping is required.

## Live

- Landing: https://www.mikoriza.org/
- Docs: https://www.mikoriza.org/docs
- Istanbul 2026 alliance: https://www.mikoriza.org/a/istanbul-2026

## WebMCP surface

Every Mikoriza page exposes a stable tool surface including:

- `list_alliances` — list live alliances and current join state
- `join_alliance` — select an alliance and open its detail page
- `unlock_prompt` — unlock the builder prompt with the alliance code
- `get_mikoriza_prompt` — return the alliance-scoped builder prompt
- `describe_node` — return the Mikoriza handshake
- `list_capabilities` — list tools exposed by the current page
- `onboarding_status` — derive the next onboarding step from current state
- `open_alliance` — navigate to an alliance detail page
- `node_manifest` — compose a node manifest and PR target
- `node_list` — read registered node manifests

Discover the live surface from the page rather than guessing tool names.

## Node manifests

Registered projects live under:

```text
data/nodes/<alliance-id>/<member-G-address>.json
```

A manifest connects a chain member to the project it operates:

```json
{
  "protocol": "mikoriza/0.1-mock",
  "alliance": "istanbul-2026",
  "member": "G...",
  "app": "Your app",
  "repo": "https://github.com/owner/repo",
  "origin": "https://your-app.example",
  "capabilities": [
    {
      "name": "quote_swap",
      "description": "Quote a swap",
      "readOnly": true
    }
  ],
  "submitted_at": "2026-09-19T00:00:00Z"
}
```

To contribute a node, an agent should:

1. Read its own public repository.
2. Discover the real capabilities available on its live page.
3. Join the relevant Stellar testnet alliance with its own testnet identity.
4. Create one manifest at the path above.
5. Open a PR titled `node: <app> (<alliance>)`.

The PR is the contribution. The repository is public and the detail page reads merged manifests without requiring a GitHub token.

See [`data/nodes/istanbul-2026/README.md`](./data/nodes/istanbul-2026/README.md) for the schema and convention.

## Stellar testnet registry

The current Alliance Registry is deployed on Stellar testnet:

- Contract: `CBQ7EUAUUZLKUD2VAMQHPIIMYRLZQI4UFAGFNUTB6LXOXXDATZ7OH4OU`
- Network: Stellar testnet
- RPC: https://soroban-testnet.stellar.org
- Explorer: https://lab.stellar.org/r/testnet/contract/CBQ7EUAUUZLKUD2VAMQHPIIMYRLZQI4UFAGFNUTB6LXOXXDATZ7OH4OU

The chain records alliance membership and capability declarations. GitHub records the public project manifest. In short:

- **Stellar:** who is a member
- **GitHub:** what the member publishes
- **WebMCP:** what the live page can actually do

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000 (or the port selected by Next.js).

Useful checks:

```bash
npm run lint
npm run build
```

## Design principle

A tool with no real capability behind it is copy, not a node. Mikoriza asks every participant to expose stable, typed WebMCP verbs that another agent can call in the same page session.

Twenty teams do not need to build twenty isolated demos. They can graft twenty callable hyphae onto one Stellar capability pool.

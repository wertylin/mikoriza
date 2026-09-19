# Alliance Registry — Deployment & Verification

## Network
Stellar Testnet ("Test SDF Network ; September 2015")

---

## Active Contract (verified)

| Field | Value |
|---|---|
| **Contract ID** | `CB2FWYQTLQ2FOSBNS7WM5ISX4FLIA7DFC24FSZAGVWIF43OM5QGYFRMB` |
| **WASM Hash** | `038f8ec01e476b7b6c9c73fb25e3b5aedc9ef956ad0d288528ae37e39e3252e8` |
| **Source Repo** | `github:wertylin/mikoriza` |
| **Commit** | `253c8d13eb880a5fdcac89576119e9084b634420` |
| **Path** | `contracts/alliance-registry` |
| **Rust** | 1.97.1 (pinned via `rust-toolchain.toml`) |
| **soroban-sdk** | 28.0.0 |
| **stellar-cli** | 28.0.0 |
| **Stellar Lab** | https://lab.stellar.org/r/testnet/contract/CB2FWYQTLQ2FOSBNS7WM5ISX4FLIA7DFC24FSZAGVWIF43OM5QGYFRMB |

---

## Previous Contract (superseded — missing source_repo metadata)

| Field | Value |
|---|---|
| **Contract ID** | `CBQ7EUAUUZLKUD2VAMQHPIIMYRLZQI4UFAGFNUTB6LXOXXDATZ7OH4OU` |
| **WASM Hash** | `35b2507baef04d06fc613d489ff2c8803059c93c6888184b45d67da8831bf6d4` |
| **Reason superseded** | No `source_repo` metadata — `stellar contract info build` could not resolve source |

---

## Reproducible Build

The WASM is deterministic: the same source + toolchain always produces the same hash.

```toml
# contracts/alliance-registry/rust-toolchain.toml
[toolchain]
channel = "1.97.1"
targets = ["wasm32v1-none"]
```

To reproduce:

```sh
stellar contract build \
  --manifest-path contracts/alliance-registry/Cargo.toml \
  --meta source_repo=github:wertylin/mikoriza \
  --meta commit=253c8d13eb880a5fdcac89576119e9084b634420 \
  --meta path=contracts/alliance-registry
# Expected: Wasm Hash 038f8ec01e476b7b6c9c73fb25e3b5aedc9ef956ad0d288528ae37e39e3252e8
```

Verify the on-chain metadata:

```sh
stellar contract info meta \
  --id CB2FWYQTLQ2FOSBNS7WM5ISX4FLIA7DFC24FSZAGVWIF43OM5QGYFRMB \
  --network testnet

stellar contract info build \
  --id CB2FWYQTLQ2FOSBNS7WM5ISX4FLIA7DFC24FSZAGVWIF43OM5QGYFRMB \
  --network testnet
```

---

## Contract State

Alliance `istanbul-2026` (id: `697374616e62756c2d3230323600000000000000000000000000000000000000`)
- Created by: `GCF2MC3TYKF3TGDZK77MYNUVTEFGNE7FJLFA35NXJ6LEOXUQL3KYF24U` (key alias: `vitalik`)
- Member `GCF2MC3TYKF3TGDZK77MYNUVTEFGNE7FJLFA35NXJ6LEOXUQL3KYF24U` with capability `registry-anchor`

---

## Verification Steps Performed

1. Pinned Rust 1.97.1 in `rust-toolchain.toml` (target: `wasm32v1-none`).
2. `Cargo.lock` already committed — dependency tree is fully locked.
3. Pushed source to public repo: https://github.com/wertylin/mikoriza (commit `253c8d1`).
4. Rebuilt with `stellar contract build --meta source_repo=... --meta commit=... --meta path=...`
   to embed verifiable source provenance in the WASM's `contractmetav0` section.
5. Uploaded new WASM (`038f8ec0`) to testnet — confirmed distinct from original (`35b2507b`).
6. Deployed fresh contract instance and re-initialised alliance state.
7. `stellar contract info build` resolves `source_repo: github:wertylin/mikoriza` — any
   tool that reads `contractmetav0` (Stellar Lab, Stellar Expert, stellar-cli) can locate
   and audit the source at the pinned commit.

### Note on GitHub Attestation

`stellar contract info build` also tries to fetch a Sigstore attestation from the GitHub
Attestations API. Creating such an attestation requires a GitHub Actions OIDC environment;
it cannot be done from a local machine. To add the attestation and get the full
"cryptographically verified" badge in Stellar Expert:

1. Add `.github/workflows/build-contract.yml` that runs `stellar contract build --meta ...`
   and calls `gh attestation` (via the `attest-build-provenance` action) against the
   produced WASM file.
2. Trigger the workflow; Stellar Expert will then resolve the attestation automatically.

Without the attestation the contract is still **verifiable**: the source is public, the
toolchain is pinned, the build is deterministic, and the on-chain metadata links to the
exact commit.

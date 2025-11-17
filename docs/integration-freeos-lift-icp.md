# Freeos / Lift – ICP Integration Guide

This note describes how a Freeos / Lift style protocol can plug into the
N.E.O. Web3 Immune System Guardian on ICP / DFINITY.

---

## 1. Map sensitive flows

List all actions that can move value or change risk:

- `mintLiftToken(...)`
- `redeemLiftToken(...)`
- `transfer(...)` (if needed)
- `updateParameters(...)`
- `executeGovernanceDecision(...)`
- any function that moves reserves or collateral

For each, ask:

- Who is allowed to call this?
- What is the worst-case if it is abused or bugged?

---

## 2. Define invariants per flow

Examples (to be adapted by Freeos / Lift):

- Minting:
  - Total supply must not grow by more than **X% per 24 hours**
  - One wallet must not mint more than **Y units per Z hours**

- Redemption / withdrawals:
  - Daily protocol-wide outflow must not exceed **K% of supply**
  - Single-wallet redemptions above a threshold may require cooldown

- Governance:
  - High-impact config changes are subject to a **time-lock**
  - Guardian upgrades must be approved by multi-sig / DAO

These become Guardian policies.

---

## 3. Wire the Guardian in front of the core

On ICP:

1. Ensure the Guardian canister has methods like:
   - `mint(...)`, `redeem(...)`, `update_policy(...)`, `set_pause(...)`

2. Update the Freeos / Lift UI / SDK so dApps call the **Guardian** instead of
   calling core canisters directly.

3. Where possible, restrict direct public access to core state-changing methods,
   so that normal flow always passes through the Guardian.

---

## 4. Rollout strategy

1. **Monitor-only phase**
   - Guardian evaluates policies but only logs:
     - `TxAllowed` and `TxWouldHaveBeenRejected`
   - No real blocking yet.

2. **Soft enforcement**
   - Block extremely abusive or clearly invalid actions.
   - Keep thresholds conservative while collecting data.

3. **Full enforcement**
   - Enforce all agreed invariants.
   - Document an incident-response playbook for operators.

---

## 5. User communication

Clearly explain to users:

- That a Guardian layer exists
- What it does and does *not* control
- Under what conditions it may slow or reject transactions
- How incidents and policy changes are logged and can be reviewed

The aim is to **increase trust**, not to hide extra control behind jargon.

# N.E.O. Web3 Immune System – Core Principles (v1.0)

This document captures the **core safety principles** behind the N.E.O. Web3 Immune System.
The Freeos / Lift ICP Edition is one concrete implementation of these ideas.

---

## 1. Purpose

The Guardian pattern exists to:

- Reduce the chance of catastrophic loss events  
- Protect honest users from protocol or governance failures  
- Keep risk and control **visible**, not hidden behind admin keys  

It is **not** a magic shield. It is a structured way of saying:

> “Here is what must never happen, and here is a layer that will try to stop it.”

---

## 2. Architecture at a glance

- **Core protocol** – the main app (e.g. Freeos / Lift canisters).  
- **Guardian layer** – sits in front of critical actions, checks policies, and decides:
  - allow and forward  
  - reject  
  - or temporarily pause  
- **Monitoring** – off-chain tools that watch Guardian logs and send alerts.

---

## 3. Invariants

Each deployment should write down its own invariants, for example:

- Total supply cannot grow by more than X% in 24 hours.  
- A single wallet cannot redeem more than Y units per Z hours.  
- Reserves cannot be moved to an unapproved destination.  
- Governance changes above a threshold must have a delay (time-lock).  

These invariants become **policies** enforced by the Guardian.

---

## 4. Policy engine

Policies fall into two broad types:

- **Static rules** – fixed config:
  - hard caps, whitelists / blacklists, min / max amounts  
- **Dynamic rules** – dependent on recent activity:
  - moving averages, growth rates, queue lengths, oracle health  

The Guardian evaluates **all active policies** before forwarding a call.  
If any policy fails, the call is rejected and the reason is logged.

---

## 5. Circuit breakers

When something looks seriously wrong, the Guardian should be able to:

- **Pause specific functions**  
  - e.g. freeze `mint` and `redeem`, keep balance reads open  
- **Pause specific assets / pools**  
- **Global pause** as a last resort  

All pauses:

- Have a clear reason string  
- Are logged  
- Are controlled by a defined process (multi-sig / DAO, not a lone key)

---

## 6. Governance & keys

Recommended:

- Use multi-sig for Guardian administration.  
- Use time-locks for:
  - big policy changes  
  - Guardian upgrades  

Emergency powers (e.g. fast pause) may have shorter or no time-lock, but still
should be:

- multi-sig where possible  
- fully logged and later reviewable  

---

## 7. Rollout phases

1. **Monitor-only**  
   - Guardian simulates blocking but only logs “would have rejected” events.  

2. **Partial enforcement**  
   - Only extreme or clearly abusive actions are blocked.  

3. **Full enforcement**  
   - All agreed invariants enforced on-chain.  
   - Operators follow a written incident-response playbook.  

---

## 8. Chain-agnostic design

The principles here are **chain neutral**:

- On ICP / DFINITY:
  - The Guardian is a canister with policy storage and guarded methods.  
- On other chains (EVM, EOS, Proton, etc.):
  - The same pattern applies with different syntax and tooling.  

Only the implementation details change.  
The **core principles stay the same.**

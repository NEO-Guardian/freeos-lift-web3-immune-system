# N.E.O. Web3 Immune System – Freeos/Lift ICP Edition

Guardian and safety pattern for **Freeos / Lift Cash** running on **ICP / DFINITY**.

This repo packages the **N.E.O. Web3 Immune System** as a reusable security layer:
a “guardian” that sits around your protocol, watches behaviour, and can **throttle, pause,
or block** actions when things look unsafe — without breaking decentralisation or open-source ethos.

This edition is aimed at:

- Freeos / Lift style systems
- Deployed or migrating onto **ICP / DFINITY**
- Teams who want a **“safety first”** approach their users can actually understand

---

## Why this exists

Crypto systems are powerful but fragile:

- Smart-contract bugs  
- Oracle / price feed failures  
- Malicious or rushed governance proposals  
- Insider / admin key abuse  
- Sybil attacks, spam and flash-drain behaviour  

The **N.E.O. Web3 Immune System** is a pattern for putting **guard rails** around that:

- Clear **invariants** – what must never happen  
- A separate **Guardian layer** that checks those invariants  
- The ability to **rate-limit, slow down, or hard-stop** dangerous flows  
- Transparent logs so users and auditors can see what the guardian did and why  

Freeos / Lift (and similar projects) can use this repo as a **drop-in starting point** for that guardian.

---

## High-level design

### Guardian layer

A dedicated component (canister / contract / service) that:

- Receives calls for sensitive actions:
  - mint, burn, transfer, redeem
  - governance execution
  - parameter / risk-limit changes
- Evaluates **policies**:
  - per-wallet limits
  - per-time-window limits
  - allow / deny lists
  - protocol-wide caps (e.g. max daily outflow)
- Decides:
  - **Allow** and forward to the core protocol
  - or **Reject** with a clear error
  - or **Pause** specific functions or the whole system in an emergency  

The Guardian does **not** replace the core Lift / Freeos logic – it **wraps** it.

---

## Core principles (v1.0)

1. **Safety over convenience**  
   If in doubt, fail closed (reject) rather than fail open.

2. **Explicit invariants**  
   Write down – in plain language – what must never happen  
   (e.g. “total supply cannot increase by more than X% in 24 hours”).

3. **Least privilege**  
   Guardian / admin powers are limited, time-locked where possible, and ideally
   controlled by multi-sig or DAO, not one key.

4. **Layered defence**  
   1) Core contract correctness  
   2) Guardian policies  
   3) Off-chain monitoring and human review for serious incidents.

5. **Auditability**  
   Every policy change, pause, and blocked transaction is logged and queryable.

6. **Graceful degradation**  
   Under stress, the system slows or partially pauses in a predictable way
   instead of simply breaking or draining.

---

## How Freeos / Lift can use this

1. **Fork this repo** into your own organisation.  
2. Choose your implementation stack on ICP (Motoko or Rust canisters, or a fronting rules engine).  
3. Use the docs and reference interface in `src/` (once filled in) to:
   - define your invariants
   - define per-user / protocol-wide limits
   - wire the Guardian in front of your existing canisters
4. Start with a **monitor-only** deployment:
   - Guardian simulates blocks but only logs what it *would* have stopped.  
5. Once thresholds are tuned, switch to **enforce mode**:
   - Guardian actively blocks unsafe calls and can trigger circuit breakers.  
6. Iterate on policies as your user base, liquidity and risk-profile grow.

---

## Repository layout (planned)

- `README.md` – overview and how to use this pattern  
- `LICENSE` – MIT licence with **N.E.O. / Edward Vaughan** copyright  
- `SECURITY.md` – security expectations and disclosure notes  
- `CONTRIBUTING.md` – how others can safely contribute  
- `docs/` – core principles, architecture overview, Freeos/Lift ICP integration guide  
- `src/` – chain-agnostic guardian interface + reference pseudo-implementation  
  (you plug in Motoko / Rust / other code here)

---

## Licence & attribution

This work will be released under an open-source licence (MIT), allowing:

- Free use, modification and deployment  
- Commercial and non-commercial usage  

You are encouraged to:

- Keep the original **N.E.O. / Edward Vaughan** copyright notice  
- Add your project (Freeos / Lift, etc.) to any future “Used By” section or docs  
  so people can see real deployments of the pattern.

---

## Contact & collaboration

If you are:

- Building or maintaining Freeos / Lift  
- Running a title-deed / property-backed protocol  
- Or designing any high-impact financial dApp on ICP / DFINITY  

…you can fork this repo, wire the Guardian around your protocol,
and help push Web3 towards a safer, more user-protective standard.

Contributions, audits and hard questions are all welcome.

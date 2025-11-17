# Architecture Overview – Freeos/Lift ICP Edition

This document explains how the Guardian wraps a Freeos / Lift style protocol
when deployed on ICP / DFINITY.

---

## Components

- **Core protocol canister(s)**  
  Holds the main business logic:
  - mint, burn, transfer, redeem
  - governance / config changes

- **Guardian canister**  
  Front-door for all **sensitive** actions:
  - checks policies and circuit-breaker state
  - forwards or rejects

- **Monitoring / ops tools**  
  Off-chain services that:
  - watch Guardian logs
  - raise alerts
  - help humans decide on incident responses

---

## Call flow (simplified)

1. User / dApp calls **Guardian** instead of the core directly  
   e.g. `guardian.mint(request)`  

2. Guardian builds a context:
   - caller, amount, timestamp, tx type
   - recent history if needed

3. Guardian evaluates all active policies:
   - per-user limits
   - protocol-wide limits
   - pause flags / circuit breakers

4. If **all pass**:
   - Guardian calls the core canister:
     `core.mint(request)`
   - Logs a `TxAllowed` event

5. If **any fail**:
   - Guardian rejects with a clear error
   - Logs a `TxRejected` event

---

## Integration steps (high level)

1. Identify all sensitive methods in the core canister.  
2. Expose matching methods on the Guardian canister.  
3. Update UI / SDK so they call the Guardian instead of the core.  
4. Restrict direct access to core methods where possible.  
5. Provide read-only views for:
   - current policies
   - pause state
   - recent Guardian events

This keeps users and auditors able to see *how* safety rules are applied.

# Guardian Interface (language-agnostic)

This describes the **minimal interface** a Guardian needs.  
You can map this to Motoko, Rust, or any other language on ICP.

---

## Core methods

- `mint(request) -> Result<TxReceipt, GuardianError>`
- `redeem(request) -> Result<TxReceipt, GuardianError>`
- `set_pause(state) -> Result<(), GuardianError>`
- `update_policy(policyUpdate) -> Result<(), GuardianError>`
- `get_status() -> GuardianStatus`
- `get_policies() -> [Policy]`
- `get_events(filter) -> [GuardianEvent]`

---

## Error model

Typical error variants:

- `PolicyViolated` – a safety rule failed  
- `SystemPaused` – circuit-breaker is active  
- `NotAuthorised` – caller not allowed to use this admin function  
- `InvalidInput` – malformed or impossible request  
- `InternalError` – downstream call or unexpected failure  

Each error should include:

- a machine-readable code  
- a short human-readable message  
- optional metadata (e.g. which policy failed)

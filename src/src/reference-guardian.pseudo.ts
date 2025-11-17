// Reference Guardian (pseudo-code)
// Translate this into Motoko, Rust, or your chosen ICP language.

type Address = string;

type GuardianError =
  | { type: "PolicyViolated"; reason: string }
  | { type: "SystemPaused"; reason: string }
  | { type: "NotAuthorised" }
  | { type: "InvalidInput"; reason: string }
  | { type: "InternalError"; reason: string };

type TxType = "MINT" | "REDEEM" | "TRANSFER" | "ADMIN";

type TxContext = {
  caller: Address;
  amount: bigint;
  timestampMs: number;
  txType: TxType;
};

type Policy = {
  id: string;
  description: string;
  // return true if the tx is allowed under this policy
  check: (ctx: TxContext) => boolean;
};

let isPaused: boolean = false;
let policies: Policy[] = [];

// Simple event logger – replace with ICP-specific logging
function logEvent(eventType: string, data: unknown): void {
  // e.g. emit to canister log or a dedicated events canister
}

// Core guard wrapper used by all public methods
async function guardAndForward(
  ctx: TxContext,
  forward: () => Promise<void>
): Promise<void | GuardianError> {
  if (isPaused) {
    const err: GuardianError = {
      type: "SystemPaused",
      reason: "Guardian is paused – operation disabled",
    };
    logEvent("TxRejected", { ctx, err });
    return err;
  }

  for (const policy of policies) {
    const ok = policy.check(ctx);
    if (!ok) {
      const err: GuardianError = {
        type: "PolicyViolated",
        reason: `Policy failed: ${policy.id}`,
      };
      logEvent("TxRejected", { ctx, err });
      return err;
    }
  }

  try {
    await forward();
    logEvent("TxAllowed", { ctx });
  } catch (e) {
    const err: GuardianError = {
      type: "InternalError",
      reason: "Forwarding to core protocol failed",
    };
    logEvent("TxForwardError", { ctx, error: String(e) });
    return err;
  }
}

// Example guarded mint call
export async function mint(caller: Address, amount: bigint) {
  const ctx: TxContext = {
    caller,
    amount,
    timestampMs: Date.now(),
    txType: "MINT",
  };

  return guardAndForward(ctx, async () => {
    // TODO: call core canister / contract here, e.g.:
    // await core_canister.mint(caller, amount);
  });
}

// Admin helpers – must be restricted / multi-sig in real use

export function setPause(pause: boolean) {
  isPaused = pause;
  logEvent(pause ? "Paused" : "Unpaused", {});
}

export function setPolicies(newPolicies: Policy[]) {
  policies = newPolicies;
  logEvent("PoliciesUpdated", { count: newPolicies.length });
}

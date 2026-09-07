# Verifier Explanation

The verifier checks that serving remains synchronized with the live order queue as tickets are removed, replaced, reordered, edited, and replenished during a shift.

## Passing-to-Passing coverage

The two P2P tests protect existing behavior by confirming that the kitchen runtime still boots and that a normal first valid hand-in is accepted, removes the ticket, preserves lives, and increments the served count.

## Failing-to-Passing coverage

The eight F2P tests exercise one queue-lifecycle consistency problem from different state transitions:

- A newly arrived replacement ticket remains serveable when the queue returns to a previously seen length.
- Replacing a queued ticket in place cannot leave serving bound to the removed ticket identity.
- Inserting a new ticket at the front is recognized even when the active ticket count is unchanged.
- Changing the recipe on an existing active ticket is reflected by the next hand-in.
- Customers with identical recipes remain independently serveable across queue refills.
- State left by a removed ticket cannot mask a different replacement recipe.
- Repeated same-size queue rotations continue to recognize newly arriving recipes.
- A valid post-mutation hand-in preserves lives and mistakes, clears the carried plate, increments served count, and advances score exactly like a normal successful serve.

These cases are deliberately coupled around the same underlying requirement: serving must derive matches from the current active ticket state rather than a stale snapshot keyed only by queue size or earlier ticket contents.

There are 10 verifier behaviors represented by 11 Playwright tests in total: 8 F2P tests covering the repaired queue lifecycle and 3 P2P checks, with the first successful hand-in split into boot and normal-serve protections.

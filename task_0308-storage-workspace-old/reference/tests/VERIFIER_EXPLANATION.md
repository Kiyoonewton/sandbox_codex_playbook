# Verifier Explanation

The verifier checks one state-consistency problem: serving must remain bound to the current live ticket lifecycle as the order rail mutates during a shift.

## Passing-to-Passing coverage

The two P2P tests protect existing functionality by confirming that the kitchen runtime boots and that a normal first valid hand-in is accepted, removes its ticket, preserves lives, and increments the served count.

## Failing-to-Passing coverage

The eight F2P tests exercise connected transitions through the same ticket-ownership problem:

- A replacement ticket remains serveable when the rail returns to a previously seen size.
- Replacing a ticket in place cannot leave serving attached to the removed customer.
- Mutating an existing live ticket's recipe is authoritative for the next hand-in.
- When duplicate recipes are active, the most urgent matching live ticket owns the serve and its patience determines the score.
- Reordering duplicate tickets does not transfer urgency or score ownership between ticket identities.
- A removed or expired ticket cannot receive a later hand-in intended for a replacement with the same recipe.
- Repeated same-size queue rotations continue to preserve ticket ownership, score, lives, and mistakes.
- A successful lifecycle-aware serve changes score and served count exactly once, removes the correct current ticket, preserves lives and mistakes, and clears the carried plate.

These behaviors are deliberately coupled. The failure comes from treating a changing order rail as a recipe cache/snapshot instead of resolving each hand-in against the current ticket instances and their live state.

There are 10 Playwright tests in total: 8 F2P tests covering the repaired lifecycle behavior and 2 P2P tests protecting existing functionality.

# Verifier Explanation

The verifier checks one state-consistency problem: every hand-in must resolve against the current live ticket rail, even after serving and arrivals change which ticket instances occupy that rail, and duplicate matching orders must remain bound to the urgency of their current customer.

## Passing-to-Passing coverage

The two P2P tests protect existing functionality by confirming that the kitchen runtime boots and that a normal first valid hand-in is accepted, removes its ticket, preserves lives, and increments the served count.

## Failing-to-Passing coverage

The eight F2P tests exercise connected transitions through the same live-ticket ownership problem:

- A newly arrived replacement remains serveable after a prior serve returns the rail to a previously seen size.
- A customer who naturally left through a successful serve cannot remain cached as the owner of a later replacement order.
- When duplicate recipes are active, the most urgent matching live ticket owns the serve and its patience determines the score.
- Reordering duplicate tickets does not transfer urgency or score ownership between ticket identities.
- After one duplicate is served, a second matching hand-in goes to the duplicate that is still actually waiting.
- Repeated serve-and-arrive rotations continue to preserve live ticket ownership, score, lives, and mistakes.
- Duplicate urgency still resolves correctly after earlier rail rotations replace other customers.
- A successful lifecycle-aware serve changes score and served count exactly once, removes the correct current ticket, preserves lives and mistakes, and clears the carried plate.

These behaviors are deliberately coupled. The failure comes from treating a changing order rail as a recipe cache/snapshot instead of resolving each hand-in against the current ticket instances and their live patience.

There are 10 Playwright tests in total: 8 F2P tests covering the repaired lifecycle behavior and 2 P2P tests protecting existing functionality.

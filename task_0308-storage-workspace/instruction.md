# Fix serving against stale order tickets

Please fix the serving behavior in Kitchen Rush. A dish can match an order that is currently visible on the rail and still be rejected as **WRONG DISH** after an earlier order leaves and a replacement arrives. This is especially reproducible when the rail returns to the same number of active tickets after the replacement.

Serving must always resolve the hand-in against the tickets that are active at that moment. A newly arrived or changed order should be immediately serveable, while a removed or expired order must no longer affect later hand-ins. This must remain correct even when tickets are replaced or reordered without changing the total number of cards on the rail.

If multiple active customers are waiting for equivalent dishes, serve the most urgent matching customer: the ticket with the smallest fraction of patience remaining. Keep that customer's identity, patience, and scoring state attached to the ticket itself when the rail is reordered.

For every successful hand-in, remove exactly one matching live ticket, calculate the score and tip from that ticket's own remaining patience, increment the served count exactly once, leave lives and mistakes unchanged, and clear the plate from the chef's hands. The same behavior must continue to hold through repeated serving, replacement, expiration, and reorder cycles.

Here is the broken behavior:

<img src="/app/problem_assets/broken.png" alt="A valid current order being rejected after the order rail changes" width="900" />

Here is the expected result:

<img src="/app/problem_assets/target.png" alt="The correct live customer receiving the matching dish" width="900" />

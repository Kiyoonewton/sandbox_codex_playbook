# Kitchen Rush serves dishes against orders that are no longer active

In Kitchen Rush, I can prepare the exact dish shown on a current ticket and still lose a life with `WRONG DISH!` if the order rail changed beforehand. For example, serve one order from a two-ticket rail, let a different order replace it so the rail is back to two tickets, then hand in the replacement's dish. The replacement is visibly active, but the game can validate the plate against the earlier rail instead.

Please make each hand-in use the tickets that are actually active when the dish reaches the serving station. If a ticket has been removed or expired, it must stop influencing serving immediately. If an existing ticket changes or a replacement arrives while the number of visible tickets stays the same, that current order must be recognized without requiring another change to the rail.

There is another case of the same problem when two live tickets require the same ingredients. The dish should go to the customer who is closest to running out of patience, based on `timeLeft / timeTotal`, even if those ticket cards have been reordered. The score and tip must come from that customer's own patience rather than from whichever matching ticket happened to be cached or encountered first.

A correct serve should remove only that live ticket, increase `served` once, award its score once, keep lives and mistakes unchanged, and leave the chef with no plate. These rules need to keep working as orders are repeatedly served, replaced, expired, edited, or reordered during the shift.

The screenshot below shows the failure: the current dish is rejected after the order rail has changed.

<img src="/app/problem_assets/broken.png" alt="Kitchen Rush rejects a dish for a currently active order after the ticket rail changes" width="900" />

After the fix, the same hand-in is accepted for the current live ticket instead of producing `WRONG DISH!`.

<img src="/app/problem_assets/target.png" alt="Kitchen Rush accepts the dish for the current live ticket" width="900" />

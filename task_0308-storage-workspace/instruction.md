# The order rail loses track of customers during a busy shift

## What you see

The first hand-in usually works, but after the order rail changes during a busy shift, a dish that exactly matches a current customer can be rejected as **WRONG DISH**. The failure is especially noticeable when an order leaves and another arrives while the rail returns to the same number of active tickets.

The serving window must follow the live order rail, not an older snapshot of it. Customers can leave, new orders can arrive, and the order of active tickets can change without changing how many cards are visible. A removed or expired customer must never influence a later hand-in.

There is another important case when equivalent orders overlap. If more than one active customer is waiting for the same dish, the hand-in belongs to the **most urgent matching customer** — the one with the smallest fraction of patience remaining. Reordering the rail must not transfer that customer's patience or scoring state to another ticket.

## What correct looks like

Every hand-in is resolved against the tickets that are active at that moment. Newly arrived and changed orders are immediately serveable, expired orders are forgotten, and equivalent orders retain their individual identity and patience.

A successful hand-in removes exactly one matching live ticket, calculates the score and tip from that ticket's own remaining patience, increments served exactly once, preserves lives and mistakes, and clears the plate from the chef's hands. These guarantees must continue to hold after repeated serve, removal, replacement, expiration, and reorder cycles.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="A valid current order being rejected after the order rail changes" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="The correct live customer receiving the matching dish" width="900" />

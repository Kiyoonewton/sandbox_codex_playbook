# Keep serving tied to the live customer ticket

The serving flow is losing track of which customer actually owns an order as the ticket rail changes. The clearest example is when two customers want the same dish. I set up two Salad orders, one with 55/60 patience left and another with only 12/60, then served a single Lettuce + Tomato plate. The game removed the 55/60 customer, awarded 108 points from that customer, and left the urgent 12/60 order waiting. That means the dish is being matched by recipe position rather than by the live customer that should receive it.

That same ticket-identity problem shows up when orders move through their lifecycle. Once a customer has been served or has expired, that ticket should be completely out of consideration. A replacement that arrives afterward is a new live order even when the number of tickets on the rail happens to return to the same value. Likewise, if a live ticket changes, the next hand-in needs to see its current recipe rather than an older view of the rail.

For matching orders, urgency belongs to the ticket itself. If several live customers are waiting for the same ingredients, the plate goes to the one with the lowest `timeLeft / timeTotal`. Moving those tickets around on the rail shouldn't transfer that urgency to another customer, and the score has to come from the patience of the customer who was actually served.

Once the serving decision is based on the current ticket instances, the rest of the hand-in should stay consistent with it: remove that customer, count the serve once, award that customer's score once, leave lives and mistakes alone for a valid dish, and clear the plate from the chef.

In the broken state below, one Salad has just been served for 108 points but the urgent Lettuce + Tomato customer is the one still waiting:

<img src="/app/problem_assets/broken.png" alt="Kitchen Rush leaves the urgent Salad ticket waiting after serving the less urgent matching customer" width="900" />

For the same two orders, the urgent customer should receive the plate first. The other Salad remains on the rail and the score is 94 because it comes from the customer that was actually served:

<img src="/app/problem_assets/target.png" alt="Kitchen Rush serves the urgent Salad ticket first and leaves the patient matching customer" width="900" />

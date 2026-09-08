# Serving the wrong customer when two orders match

I noticed something strange when two customers order the same dish. I had two Salad orders on the rail: one customer still had 55/60 patience left and the other was down to 12/60. When I handed in one Lettuce + Tomato plate, I expected the urgent customer to get it. Instead, the game removed the 55/60 customer, gave me 108 points for that order, and left the customer who was almost out of patience still waiting.

The same problem shows up as the order rail changes during a shift. Once a customer has been served or their ticket expires, that old ticket should no longer be able to affect a later hand-in. A new customer can arrive and bring the rail back to the same number of tickets, but serving still needs to resolve against the customers who are actually waiting now, not against an older snapshot of the rail.

When more than one current customer is waiting for the same ingredients, I want the plate to go to whoever is actually most urgent at that moment. In this case that means comparing how much of each customer's patience remains, `timeLeft / timeTotal`, rather than just taking whichever matching ticket happens to come first. Reordering the visible tickets should not change which customer owns that patience or which customer receives the score.

After I hand in a valid plate, everything should follow the customer who actually received it. That customer should leave, the serve should count once, and the points should be based on that customer's remaining patience. I shouldn't lose a life or get a mistake for a correct dish, and the plate should be cleared from the chef after it is served.

Here is the state I get now. One Salad has been served for 108 points, but the urgent Lettuce + Tomato customer is still sitting on the rail:

<img src="/app/problem_assets/broken.png" alt="Kitchen Rush leaves the urgent Salad ticket waiting after serving the less urgent matching customer" width="900" />

With the same two customers, I expect the urgent one to receive the plate first. The more patient Salad customer should remain, and the score should be 94 because it came from the customer who was actually served:

<img src="/app/problem_assets/target.png" alt="Kitchen Rush serves the urgent Salad ticket first and leaves the patient matching customer" width="900" />

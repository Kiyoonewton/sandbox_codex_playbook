# Serving the wrong customer when two orders match

I noticed something strange when two customers order the same dish. I had two Salad orders on the rail: one customer still had 55/60 patience left and the other was down to 12/60. When I handed in one Lettuce + Tomato plate, I expected the urgent customer to get it. Instead, the game removed the 55/60 customer, gave me 108 points for that order, and left the customer who was almost out of patience still waiting.

It gets more confusing after customers leave and new ones arrive. If an order is served or expires, I shouldn't be able to accidentally serve that old customer anymore. I can remove a ticket and then get another order so the rail has the same number of tickets again, but the new customer is still a completely different order. Right now it looks like the serving logic can keep using what used to be in that position. I've also seen the same kind of problem when a ticket's dish changes: the next plate can still be checked against the older order instead of what the customer is currently asking for.

When more than one customer is waiting for the same ingredients, I want the plate to go to whoever is actually most urgent at that moment. In this case that means comparing how much of each customer's patience remains, `timeLeft / timeTotal`, rather than just taking whichever matching ticket happens to come first. Reordering the tickets shouldn't change which customer owns that patience or which customer receives the score.

After I hand in a valid plate, everything should follow the customer who actually received it. That customer should leave, the serve should count once, and the points should be based on that customer's remaining patience. I shouldn't lose a life or get a mistake for a correct dish, and the plate should be cleared from the chef after it is served.

Here is the state I get now. One Salad has been served for 108 points, but the urgent Lettuce + Tomato customer is still sitting on the rail:

<img src="/app/problem_assets/broken.png" alt="Kitchen Rush leaves the urgent Salad ticket waiting after serving the less urgent matching customer" width="900" />

With the same two customers, I expect the urgent one to receive the plate first. The more patient Salad customer should remain, and the score should be 94 because it came from the customer who was actually served:

<img src="/app/problem_assets/target.png" alt="Kitchen Rush serves the urgent Salad ticket first and leaves the patient matching customer" width="900" />

# Kitchen Rush serves the wrong customer when two orders use the same dish

I noticed this while serving Salad with two Salad orders on the rail. One customer still had 55 of 60 patience left and the other was down to 12 of 60. I served one Lettuce + Tomato plate, but the game completed the 55/60 order and left the 12/60 customer waiting. The score jumped to 108 as if the patient customer had been served.

The customer who is closest to running out of patience should get the dish when more than one active order matches it. In this case the 12/60 Salad order should disappear, the 55/60 Salad should remain, and the score should be calculated from the customer who actually received the dish. Reordering the ticket cards should not change which customer owns that urgency.

I have also seen the same wrong-customer behavior after the order rail changes. An order that has already been served or expired can still affect a later hand-in after a replacement appears, especially when the rail returns to the same number of tickets. Serving should always use the customers that are currently on the rail; removed orders should have no effect on later dishes.

A successful hand-in should count once, remove the customer who actually received it, and clear the plate without costing a life or recording a mistake.

Here is the Salad case on the broken version. The game awarded 108 points but left the urgent Lettuce + Tomato order on the rail:

<img src="/app/problem_assets/broken.png" alt="Kitchen Rush scores 108 after serving the less urgent Salad while the urgent Lettuce and Tomato order remains" width="900" />

With the fix, the urgent Salad receives the plate first. The patient Salad remains and the score is 94 because it came from the customer who was actually served:

<img src="/app/problem_assets/target.png" alt="Kitchen Rush scores 94 after serving the urgent Salad and leaves the patient Salad order" width="900" />

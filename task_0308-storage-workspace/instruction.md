# The order rail loses track of customers during a busy shift

## What you see

Serving starts normally, but once the order rail changes a few times, dishes that exactly match a currently visible ticket can suddenly be rejected as **WRONG DISH**. This is easiest to notice when one order is completed and a new customer arrives while the rail returns to the same number of active tickets.

The problem is not limited to one particular recipe. As customers are completed, replaced, promoted, or new tickets arrive, the serving window can behave as though an older version of the queue is still active. A valid dish may cost a life and increment mistakes instead of clearing the customer who actually ordered it.

The rail must behave as one live queue throughout the shift. Every hand-in should be matched against the customers that are active **at that moment**, including newly arrived tickets and multiple customers who happen to request the same recipe. Queue changes must not leave removed customers influencing later hand-ins.

A successful hand-in after the queue changes should have exactly the same effects as the first successful hand-in: remove the matching active ticket, increase served count and score, preserve lives and mistakes, and clear the plate from the chef's hands.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="A valid current order being rejected after the order queue changes" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="The current order is accepted correctly after the order queue changes" width="900" />
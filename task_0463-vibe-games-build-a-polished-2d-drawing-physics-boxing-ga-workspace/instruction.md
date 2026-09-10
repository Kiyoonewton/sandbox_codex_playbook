# The game loses track of the round I am actually playing

After a few clean punches, the Best trophy can show a lower round than the game has reached. That wrong number then leaks into the rest of a run. If I start over, clear the first round, and continue, I can be sent several rounds ahead instead of to round two. Retry can also reload a completely different round, while the clear banner congratulates me for a number I did not just finish.

Best should record the furthest round actually reached and never drop after I replay an earlier round. Continuing should advance exactly one round, Retry should replay the current round, and the clear banner should name that current round.

The controls need attention too. Once play begins, Retry and Pause are pushed past the top-right edge, so part of the buttons is clipped and difficult to tap. Keep both controls fully inside the game window without changing the drawing-and-punching flow.

The broken game currently looks like this:

<img src="/app/problem_assets/broken.png" alt="current (broken) app" width="900" />

The corrected game should look like this:

<img src="/app/problem_assets/target.png" alt="expected app" width="900" />

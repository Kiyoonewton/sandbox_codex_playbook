# Level progress and the on-screen controls are broken

## What you see

Playing DOODLE PUNCH, the trophy "Best" readout on screen doesn't keep up with how far I've actually got — it shows a lower level than the badge I'm currently playing, and that stale figure is the one the game seems to remember for next time. Things get really confusing after the game sends me back to the start: landing a clean punch and pressing continue dumps me into some far-off level rather than the one after the one I just cleared, and hitting retry throws me into a completely different, much harder level instead of reloading the level I'm on. The celebration banner joins in too, congratulating me on a level number that bears no relation to the one I just finished.

On top of that, the moment play begins the retry and pause controls in the top corner are pushed off past the edge of the window and clipped, so I can't see them properly or reliably tap them.

## What correct looks like

The trophy readout should track the level I've actually reached and agree with the badge on screen, and that's what should be remembered between sessions. Continuing after a clean punch should always move me one level forward, retry should simply replay the level I'm on, and the celebration message should name the level I really just cleared. The retry and pause controls should sit neatly inside the corner of the window, fully visible and easy to tap.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="current (broken) app" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="expected app" width="900" />

# The bowling readouts don't match what's on screen

## What you see

The Ball Trajectory Angle readout looks wrong: the degree symbol shows up more than once, so the value reads with an extra stray symbol tacked on after the number instead of a clean measurement.

The oil slider is also confusing. When it's dragged all the way to the end marked "Heavy", the status text next to it doesn't say what the endpoint label says — it reports a different oil condition entirely, so the control and the readout disagree with each other.

## What correct looks like

The angle should display as one tidy value with a single degree symbol, and dragging the oil slider to its heaviest end should show a status that matches the label the user just dragged to, so the controls and the readouts always tell the same story.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="current (broken) app" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="expected app" width="900" />

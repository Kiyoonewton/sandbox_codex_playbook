# The spare calculator's plan falls out of sync

The recommendation panel keeps falling out of sync whenever I adjust the setup. Manually changing pins leaves an old preset selected, and equal-distance splits choose the higher pin instead of the lower one. Switching handedness does not refresh the directional advice in the table. The oil slider also fails to return to its Medium baseline: for a right-handed 7-pin spare, the board should be 26.0 on Medium, 28.5 on Dry, and 23.5 on Heavy. The Heavy endpoint must visibly read **HEAVY**, and clearing every pin must remove the old advice.

The panel itself is hard to use during a spare. The current key pin, standing board, arrow, and trajectory should be grouped into one readable active plan, while the matching adjustment-table row must stand out from reference rows. A bowler should be able to see that plan and the reference table together without scrolling past the targets.

Loading a preset must keep the selected hand and oil settings. Reset must restore every default control, not only the pins. Undo, Redo, and refresh must preserve the whole setup, and damaged saved data must fall back to usable defaults.

Keep the existing workspace and controls, but make the live plan consistently reflect the current pins, hand, and oil condition.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="current (broken) app" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="expected app" width="900" />

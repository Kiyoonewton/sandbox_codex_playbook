# The spare advice no longer follows the lane setup

I use the pin deck, handedness control, and oil slider to work out a spare attempt. The recommendation panel needs to react to the setup I can see on screen, but several parts are telling different stories.

After changing a pin configuration by hand, an old preset can still look selected. For a split with two equally close pins, the highlighted key pin should be the lower numbered pin. Switching bowling hands should also update the matching direction in the adjustment table rather than leaving the old side displayed.

Oil changes should move the suggested standing board predictably and return it to its original value when the slider comes back to Medium. On a 7-pin spare for a right-handed bowler, Medium should start at board 26.0, Dry should move it to 28.5, and Heavy should move it to 23.5. The Heavy endpoint must visibly read **HEAVY**. When every pin is cleared, the old board, arrow, and angle must disappear instead of remaining as stale advice.

Keep the existing workspace and controls, but make the live recommendation consistent with the current pins, hand, and oil condition.

The setup also needs to stay trustworthy when I continue working with it. Presets should not overwrite my hand or oil choice, and the complete configuration must remain available through Undo, Redo, Reset, and refresh. Reset should restore all default controls, not only the pins. If saved setup data is damaged, the workspace should fall back to a usable default state.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="current (broken) app" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="expected app" width="900" />

The split recommendation is also wrong in the current app:

<img src="/app/problem_assets/broken-keypin.png" alt="broken 7-10 split recommendation" width="900" />

The expected split recommendation should select the correct key pin and matching target:

<img src="/app/problem_assets/target-keypin.png" alt="correct 7-10 split recommendation" width="900" />

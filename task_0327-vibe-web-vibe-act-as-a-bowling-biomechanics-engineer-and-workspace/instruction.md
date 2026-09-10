# My saved bowling setup changes when I come back to it

I set up a spare attempt by choosing the standing pins, my bowling hand, and an oil condition. Those settings should describe one lane setup. Instead, selecting a pin preset can silently change my hand and oil condition, even though I only asked it to change the pin deck. At the Heavy end of the oil slider, the indicator also gives a different condition from the label on the control.

Undo and Redo are not dependable once I leave the page. After I refresh, the buttons no longer represent the setup changes I just made. Reset only brings back the pins, so it does not truly return the whole setup to its default state; Undo after reset should restore the complete earlier setup.

Please keep a lane setup coherent. Presets should only change pins, a setup change should be undoable and redoable after refresh, and a new saved setup should replace an abandoned redo path. Reset should include pins, handedness, and oil condition. Invalid saved setup data must be ignored instead of leaving the controls in an impossible state.

The display should stay clear while doing this: a fully Heavy oil setting should read **HEAVY**, and the existing layout and interaction flow should remain intact.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="current (broken) app" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="expected app" width="900" />

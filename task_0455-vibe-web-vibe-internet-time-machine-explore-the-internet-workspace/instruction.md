# Year history breaks when navigation methods are mixed

The Internet Time Machine can get into an inconsistent year state after using more than one navigation control. For example, a user can select a year from a tab, move again with the scrubber, then use undo/redo or change the URL hash and end up with the hero, active tab, scrubber, saved year, URL, and favorites disagreeing about which year is current.

Fix the year-selection flow so every control updates the same current year and every committed navigation participates in one consistent history. A scrubber drag should count as one navigation when the drag finishes, not one entry for every intermediate year. If the drag ends on the year where it started, it should add nothing to history. Selecting the year that is already active should also do nothing and must not destroy an existing redo branch.

Undo and redo must continue to work after tabs, keyboard controls, favorites, URL changes, and scrubber interactions are mixed together. Ctrl/Cmd+Shift+Z should redo. If the user undoes and then chooses a genuinely different year, the abandoned redo branch should be discarded, including when that new year is chosen with the scrubber. Keyboard changes made while the scrubber has focus should behave like normal committed navigation and remain undoable.

A valid year in the URL hash on initial load should win over an older value in localStorage. Changing the hash to another valid year while the app is open should immediately select that year and synchronize the rest of the UI. Adding or removing a favorite should update the favorites bar immediately, and choosing a favorite should use the same navigation/history behavior as the other controls.

Do not regress the default state: opening on year 2000 should still show the welcome message.

Broken state:

<img src="/app/problem_assets/broken.png" alt="The time machine showing inconsistent year navigation state" width="900" />

Expected state:

<img src="/app/problem_assets/target.png" alt="The time machine with synchronized year navigation and history" width="900" />

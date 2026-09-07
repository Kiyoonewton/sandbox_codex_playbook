# Year history breaks when navigation methods are mixed

The Internet Time Machine loses navigation history after moving between years with different controls. A simple reproduction is: open year 2005, navigate to 2010, then press Undo. The app should return to 2005, but the broken version can remain on 2010 instead.

Fix the year-selection flow so tabs, keyboard controls, favorites, the scrubber, URL hashes, and undo/redo all operate on one consistent current year and one committed navigation history. The hero year, active tab, scrubber value, saved year, URL hash, and favorites state must stay synchronized after every navigation.

A scrubber drag should count as one navigation when the drag finishes, not one history entry for each intermediate year. If the drag ends on the year where it started, it should add nothing to history. Selecting the already-active year should also be a no-op and must not destroy an existing redo branch.

Undo and redo must remain correct after navigation methods are mixed. Ctrl/Cmd+Shift+Z should redo. If the user undoes and then chooses a genuinely different year, the abandoned redo branch should be discarded, including when the new year is committed with the scrubber. Keyboard changes made while the scrubber has focus should behave like normal committed navigation and remain undoable.

A valid year in the URL hash on initial load should take precedence over an older value in localStorage. Changing the hash to another valid year while the app is open should immediately select that year and synchronize the rest of the UI. Adding or removing a favorite should update the favorites bar immediately, and choosing a favorite should use the same navigation/history behavior as the other controls.

Opening on the default year 2000 should still show the welcome message.

The screenshots below are from the same reproduction: start on 2005, navigate to 2010, then press Undo. In the broken app the year incorrectly remains on 2010; in the fixed app it returns to 2005.

Broken after Undo — still on 2010:

<img src="/app/problem_assets/broken.png" alt="After navigating from 2005 to 2010 and pressing Undo, the broken app incorrectly remains on 2010" width="900" />

Expected after the same Undo — back on 2005:

<img src="/app/problem_assets/target.png" alt="After the same navigation sequence and Undo, the fixed app correctly returns to 2005" width="900" />

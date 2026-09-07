# The time machine's history and first impressions are broken

## What you see

Hopping forward through a few different years and then pressing the undo arrow does nothing at all — the page stays stuck on the year I just landed on, with the same hero year, tabs and styling as before. It's as if the machine forgot everywhere I'd been, so there's no way to retrace my steps once I've jumped ahead.

On top of that, when the page first loads on the default year there's no greeting or intro text anywhere — the screen just sits there with no welcoming line to tell me what this is or nudge me to start exploring.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="current (broken) app" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="expected app" width="900" />

The main issue is that the app does not keep the selected year in sync when users navigate in different ways. The scrubber, favorites, URL navigation, keyboard shortcuts, undo, and redo all control the same year, but they do not work correctly together.

Undo and redo are not reliable. Pressing Ctrl/Cmd + Shift + Z performs an undo instead of a redo. Also, when a user undoes a few changes and then selects a new year, the old redo history is not cleared.

The scrubber also creates incorrect history entries. Dragging it through several years should add only the final year to history when the user releases it. It should not add every year passed during the drag. If the user finishes on the same year they started from, no new history entry should be added.

Favorites and URL navigation also need to stay consistent with the rest of the year state. Selecting a favorite should update the year and participate in the normal navigation history. When the app opens with a year in the URL, such as #2005, that year should take priority over an older year saved in localStorage. If the URL year changes while the app is already open, the displayed year should update immediately.

After these issues are fixed, the displayed year, active tab, scrubber position, URL hash, localStorage value, and favorites state should remain synchronized. The default 2000 view should also display the introductory welcome message.

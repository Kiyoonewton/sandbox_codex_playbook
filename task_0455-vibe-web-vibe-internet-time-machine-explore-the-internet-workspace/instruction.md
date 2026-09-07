# Fix year navigation getting out of sync

Please fix year navigation in the Internet Time Machine. Switching years works in simple cases, but once tabs, keyboard navigation, favorites, the scrubber, undo/redo, and URL hashes are mixed, the app can stop agreeing about which year is selected. The hero year, active tab, scrubber value, saved year, URL hash, and favorites state should always represent the same current year.

Treat a completed navigation as one history action. In particular, dragging the scrubber through several years should create only one committed history entry when the gesture ends. Releasing it on the year where the drag started should create no entry at all. Selecting the already-active year should also be a no-op and must not destroy an existing redo branch.

Undo and redo need to remain correct when navigation methods are mixed. The redo shortcuts must perform redo rather than being interpreted as undo. After an undo, choosing a genuinely different year must discard the abandoned redo branch, including when that new year is committed with the scrubber. Scrubber keyboard navigation should behave like normal committed year navigation and remain undoable.

URL navigation must participate in the same synchronized state. When the app opens with a valid year in the hash, that year takes precedence over an older saved year. Changing the hash to another valid year while the app is already open should immediately update the selected year and all related UI state. Favorites should update immediately when changed, and navigating through a favorite should behave like other committed year navigation.

Keep the normal default experience intact: opening the app on the default 2000 view should still show its welcome message.

Here is the broken behavior:

<img src="/app/problem_assets/broken.png" alt="The time machine showing inconsistent year navigation state" width="900" />

Here is the expected result:

<img src="/app/problem_assets/target.png" alt="The time machine with synchronized year navigation and history" width="900" />

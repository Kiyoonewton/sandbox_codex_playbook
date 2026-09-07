# Year navigation falls out of sync across the time machine

## What you see

The selected year behaves correctly when you use one control at a time, but it becomes unreliable once different navigation methods are mixed together. Undo and redo can return to the wrong place, a scrubber gesture can behave like several separate visits, and a year chosen from the URL or favorites can disagree with the year shown elsewhere on the page.

This should behave as one navigation system regardless of whether a year is chosen from a tab, the keyboard, a favorite, the scrubber, or a valid URL hash. The visible hero year, active tab, scrubber value, saved year, URL hash, and favorites state must continue to describe the same selected year.

History should represent committed user navigation rather than every intermediate state. A complete scrubber drag is one action: moving through several years during the gesture must not create several undo steps, and if the user releases on the year where the gesture started, no new history entry should be added. Likewise, selecting the year that is already active must not disturb an existing redo branch.

Undo and redo must remain correct after controls are mixed. Redo shortcuts must redo rather than being swallowed as undo, choosing a genuinely new year after undo must discard the abandoned redo branch, and the same rule must hold when that new committed year comes from the scrubber.

A valid year already present in the URL when the app opens takes priority over an older saved year. Changing to another valid year in the URL while the app is open must immediately synchronize the app. Favorites should update immediately and favorite navigation should behave like normal committed navigation.

The default 2000 view should continue to show its welcome message.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="The time machine showing inconsistent year navigation state" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="The time machine with synchronized year navigation and history" width="900" />

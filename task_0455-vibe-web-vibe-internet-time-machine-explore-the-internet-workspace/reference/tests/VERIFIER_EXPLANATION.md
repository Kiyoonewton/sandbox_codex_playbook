# Verifier Explanation

The verifier treats year selection as one transactional navigation/history system shared by tabs, keyboard controls, favorites, URL hashes, and the scrubber.

## Passing-to-Passing coverage

The 2 P2P tests protect the existing application shell and ordinary tab navigation: all 26 year options remain available, and a normal tab selection keeps the visible and persisted year surfaces synchronized.

## Failing-to-Passing coverage

The 15 F2P tests exercise the same navigation state machine through coupled transitions:

- Undo restores the previous committed year and synchronizes hero, active tab, scrubber, URL hash, and localStorage.
- Redo restores the undone year, including Ctrl/Cmd + Shift + Z semantics.
- A genuinely new navigation after undo discards the abandoned redo branch.
- A no-op activation of the already-selected year after undo does not destroy that redo branch.
- A valid startup hash overrides stale persisted state, and a live hash change immediately synchronizes the app.
- Favorite creation updates the bar immediately; favorite navigation participates in undo; URL navigation keeps favorite active state synchronized.
- A long scrubber gesture is one committed history action rather than one entry per intermediate year.
- A scrubber gesture that moves away and returns to its starting year commits nothing.
- Clicking the scrubber at the current year creates no duplicate history entry.
- Scrubber keyboard navigation creates a normal committed history action that can be undone.
- A scrubber commit made after undo replaces the abandoned redo branch just like other committed navigation.
- The default 2000 view retains its welcome state.

There are 17 verifier tests total: 15 F2P and 2 P2P. The additional cases are intentionally interaction-heavy: a narrow fix to one input path is insufficient because the same history invariants must survive mixed controls, no-op transitions, branching, and gesture commit boundaries.

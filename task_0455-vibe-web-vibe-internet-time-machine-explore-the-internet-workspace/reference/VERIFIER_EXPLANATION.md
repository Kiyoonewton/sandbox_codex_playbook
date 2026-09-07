# Verifier Explanation

The verifier checks that year navigation behaves as one consistent history system across the different controls in the Internet Time Machine.

## Passing-to-Passing coverage

The P2P tests confirm that the existing application still boots correctly, renders all 26 year navigation options, and keeps the visible and persisted year state synchronized during normal tab navigation.

## Failing-to-Passing coverage

The F2P tests verify the repaired navigation/history behavior:

- Undo returns to the previous committed year and keeps the displayed year, active tab, scrubber, URL hash, and localStorage synchronized.
- Redo restores the year that was undone.
- Ctrl/Cmd + Shift + Z performs redo rather than being handled as another undo.
- Selecting a new year after undo discards the abandoned redo branch.
- A valid year supplied through the URL hash takes priority over an older year stored in localStorage.
- Changing the URL hash while the application is already open immediately synchronizes the selected year.
- Selecting a favorite participates in normal navigation history, and changes to favorites are reflected immediately in the favorites bar.
- A complete scrubber drag is treated as one committed navigation action, so one undo returns directly to the year where the drag started.
- Interacting with the scrubber without changing the selected year does not create a duplicate/no-op history entry.
- The default 2000 view continues to display its introductory welcome message.

There are 12 verifier tests in total: 10 F2P tests covering the repaired behavior and 2 P2P tests protecting existing functionality.

# Undo restores comparison IDs without restoring the schools they belong to

There is a history/state problem in the university comparison tool that becomes visible as soon as custom schools are involved. I can create a custom university, add it to the comparison, delete it, and press Undo. The comparison tries to return to its previous selection, but the deleted university itself is not restored, leaving history pointing at a school that no longer exists.

Deleting a custom university needs to be a single reversible change. If that university was selected, Undo should restore its original custom-school data and its place in the comparison together; Redo should remove both again. Reset must behave consistently with the same state: undoing a reset should reconstruct the comparison, including any custom universities that belonged to it, and redoing the reset should clear it again. Preset and custom universities must be able to move through these history operations together without nonexistent IDs occupying comparison slots.

The persisted comparison can currently reproduce the same inconsistency after a reload. When saved state contains an ID for a university that no longer exists, discard that ID instead of counting it as a hidden selection. If the saved ID list contains duplicates, normalize it so each real university occupies one slot. The comparison count, rendered cards, and value written back to storage should agree after initialization.

There is also an Undo edge case at the four-school limit. Add MIT, Stanford, Harvard, and Yale, then try to add Columbia. Columbia is correctly refused because the comparison is full, but that refused attempt must not become a history action. The next Undo should therefore remove Yale, which was the last successful change. At the moment it can leave all four universities selected because Undo is consumed by an action that never changed the comparison.

Reset messaging should reflect what actually happened as well. Resetting the comparison should not claim that all custom schools were removed when the operation did not remove them.

This screenshot captures the four-school history failure after Columbia was refused and Undo was pressed once. Yale incorrectly remains in the comparison:

<img src="/app/problem_assets/broken.png" alt="MIT, Stanford, Harvard, and Yale remain selected after a refused Columbia selection and one Undo" width="900" />

For the same sequence, Undo should act on the last successful selection. Yale is removed and MIT, Stanford, and Harvard remain:

<img src="/app/problem_assets/target.png" alt="MIT, Stanford, and Harvard remain after Undo correctly removes Yale" width="900" />

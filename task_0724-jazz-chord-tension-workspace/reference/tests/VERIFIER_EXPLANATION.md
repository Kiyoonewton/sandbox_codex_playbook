# Verifier explanation

The verifier treats chord selection as one shared user-visible state across the voicing cards, Interval Anatomy rows, Tension Composition cells, and global left/right navigation.

## Pass-to-pass guards

- `[P2P] chord analysis views render all seven voicings` confirms the three analysis views still render the complete seven-chord dataset.
- `[P2P] custom chord builder remains interactive and resettable` protects the separate builder workflow from regressions while selection navigation is changed.

## Fail-to-pass coverage

- `[F2P] selecting a chord card carries the same selection into interval anatomy` checks a direct card selection is projected into all three analysis views.
- `[F2P] a later chord-card selection replaces an interval-row selection everywhere` checks a handoff between two selection sources clears the previous row and leaves exactly one current selection.
- `[F2P] selecting a tension-composition cell updates every view of the selected chord` checks the composition view participates in the same shared selection contract.
- `[F2P] arrow navigation continues from the chord most recently chosen in tension composition` checks that a composition selection updates the navigation cursor rather than only its visible highlight.
- `[F2P] mixed interval and composition handoffs keep ArrowLeft anchored to the latest selection` exercises a longer cross-view sequence so stale state from an earlier source cannot drive navigation.
- `[F2P] keyboard activation of a composition cell becomes the source for subsequent arrow navigation` verifies keyboard activation follows the same selection handoff as pointer activation.

All F2P assertions use normal page interactions and observable DOM state. They do not inspect source code or private implementation details.

# Verifier explanation

The verifier treats chord selection as one shared user-visible state across the voicing cards, Interval Anatomy rows, Tension Composition cells, and global left/right navigation. It identifies a chord by the chord shown to the user rather than assuming every view uses the same positional order.

## Pass-to-pass guards

- `[P2P] chord analysis views render all seven voicings` confirms the three analysis views still render the complete seven-chord dataset.
- `[P2P] custom chord builder remains interactive and resettable` protects the separate builder workflow from regressions while selection navigation is changed.

## Fail-to-pass coverage

- `[F2P] selecting a chord card carries the same chord into interval anatomy` checks a direct card selection is projected into the matching analysis row even when that row is elsewhere in the table order.
- `[F2P] choosing an interval row follows the chord rather than the row position` checks that selecting a reordered analysis row activates the same named chord in the other views instead of treating its display position as the chord selection.
- `[F2P] selecting a tension-composition cell updates every view of the selected chord` checks the composition view participates in the same shared selection contract.
- `[F2P] arrow navigation continues from the chord most recently chosen in tension composition` checks that a composition selection updates the navigation cursor rather than only its visible highlight.
- `[F2P] mixed interval and composition handoffs keep ArrowLeft anchored to the latest chord` exercises a longer cross-view sequence so stale state from an earlier source cannot drive navigation.
- `[F2P] keyboard activation of a reordered interval row becomes the arrow-navigation source` verifies keyboard activation of the reordered table follows the same chord identity handoff as pointer activation and becomes the source for subsequent arrow navigation.

All F2P assertions use normal page interactions and observable DOM state. They do not inspect source code or private implementation details.

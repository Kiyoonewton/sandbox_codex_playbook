# Verifier explanation

This task is one transactional comparison-history problem: comparison references and custom-school entities must stay consistent through deletion, reset, undo/redo, rejected selections, and persisted reloads.

The verifier contains 10 tests total: 2 P2P tests that protect existing behavior and 8 F2P tests that distinguish the broken implementation from the corrected one.

## P2P coverage

1. The app still boots and renders the university browser.
2. Preset universities can still be added to and removed from the comparison normally.

## F2P coverage

1. A refused fifth selection must not create a no-op history entry. After four successful additions and one refused fifth addition, Undo must remove the fourth successfully added university.
2. Reset must report a plain comparison reset and must not claim that custom schools were removed when none existed.
3. Deleting a compared custom school must be fully reversible: Undo restores both the custom-school entity and its comparison slot.
4. After that restoration, Redo must remove the same custom school again. The test explicitly verifies the restored intermediate state before Redo so a broken Undo cannot pass accidentally.
5. Resetting a comparison that includes a custom school must be reversible as one coherent state transition: Undo restores both the school and the comparison it belonged to.
6. Reset → Undo → Redo must preserve the custom-school lifecycle in both directions rather than restoring only stale comparison IDs.
7. On reload, persisted comparison IDs that no longer resolve to any preset or custom university must be discarded so they cannot occupy hidden comparison slots.
8. Duplicate persisted comparison IDs must be normalized so one university occupies one comparison slot and the visible count matches persisted state.

Together these checks require a canonical state model in which history snapshots preserve the custom-school data needed to resolve comparison IDs, while persisted comparison state is normalized against the universities that actually exist.
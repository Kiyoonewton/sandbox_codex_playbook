# Verifier explanation

The P2P checks protect the existing bowling workspace, its pin deck and core controls, and ensure the layout remains usable in the viewport.

The F2P checks cover the redesigned live spare-advice workflow. The oil control must report the condition selected by the user, and the recommendation must use the current pin deck to identify its key pin. Changing hands must refresh the matching adjustment direction, while oil changes must update the suggested board consistently. The checks also ensure that a manual pin change does not leave an unrelated preset selected and that clearing the deck removes obsolete advice.

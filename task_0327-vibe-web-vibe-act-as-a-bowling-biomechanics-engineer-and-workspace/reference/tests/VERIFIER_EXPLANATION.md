# Verifier explanation

The P2P checks protect the existing bowling workspace, its pin deck and core controls, and ensure the layout remains usable in the viewport.

The F2P checks cover the redesigned bowling setup workflow. The live spare advice must reflect the current pin deck, hand, and oil condition without leaving stale preset or targeting information behind. The active spare plan must keep its three targets readable with the adjustment reference, and the matching row must be visually distinct. The same complete setup must also remain coherent through presets, Undo, Redo, Reset, refresh, and invalid saved data. Together, the checks cover both the visible recommendation and the setup state that produces it.

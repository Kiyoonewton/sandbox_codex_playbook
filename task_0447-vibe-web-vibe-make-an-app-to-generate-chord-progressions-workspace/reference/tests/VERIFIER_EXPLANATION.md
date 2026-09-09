# Verifier explanation

The P2P checks protect the existing chord workspace, viewport layout, and the ability to reload a saved custom progression with its key, chord order, and first chord intact.

The F2P checks cover the redesigned Saved Progressions workflow. Editing a loaded custom progression must not mutate its saved copy, Import must remain accessible when the library is empty, and any invalid entry must reject an entire import without changing memory or local storage. Valid imports must receive fresh unique IDs, survive refresh, load correctly, and be deduplicated if imported again. Save must also refuse to claim success when no progression is active.

# Verifier explanation

The verifier checks one generated-document state-consistency problem: draft controls may change independently, but an existing generated document must retain the settings identity that produced it, and every operation that restores a document must restore that identity coherently.

There are 2 P2P tests that preserve basic app boot/generation behavior and 9 F2P tests covering the coupled lifecycle:

- changing flavor/unit/quantity after generation does not relabel or replace the existing document;
- reload preserves generated-document provenance separately from newer draft controls;
- undo restores the previous document identity without borrowing later controls;
- redo restores the exact undone document even after controls were changed while undone;
- generating after undo creates a new branch and clears the abandoned redo path;
- History restore rehydrates text and its settings together, and undo returns to the prior document;
- keyboard undo/redo uses the same document timeline;
- word-cloud styling remains tied to the generated flavor until another generation replaces it;
- a longer mixed History restore → undo → redo → draft change → reload sequence keeps the document and draft identities coherent.

The tests deliberately exercise normal UI operations rather than injecting impossible internal state. Together they require the implementation to model generated output as a snapshot with provenance instead of treating the current controls as metadata for whatever text happens to be displayed.

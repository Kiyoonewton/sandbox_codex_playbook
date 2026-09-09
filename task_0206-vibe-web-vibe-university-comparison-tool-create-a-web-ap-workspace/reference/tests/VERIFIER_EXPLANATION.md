# Verifier explanation

The two P2P tests protect existing behavior: search and type filters still narrow the university list, and card and table views show the same selected preset universities.

The F2P tests verify that rejected fifth selections do not create false history entries; deleted custom schools and all their data can be restored; Reset is reversible and shows `Comparison reset.`; Undo and Redo preserve selection order; buttons and keyboard shortcuts behave consistently; and a new edit clears an abandoned Redo branch.

The final two tests reload the page during those workflows. They verify that the next Redo action, including its custom-school data, survives a refresh and that making a new edit afterward still invalidates the persisted Redo branch.

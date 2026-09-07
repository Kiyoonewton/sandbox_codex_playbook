# Keep comparison history consistent when schools change

Please fix the comparison history so it represents the universities that actually existed at each step. Right now the comparison and the custom-school list can get out of sync because history remembers only comparison IDs. A clear example is adding one of my own schools to the comparison, deleting that school, and then pressing Undo: the comparison may remember its old ID, but the school itself is still gone, so Undo cannot visibly restore the comparison I had before the deletion.

Deleting a custom school should be one reversible action. If it was part of the comparison, Undo must bring the school back with its original details and put it back in the same comparison state. Redo must delete it again. Reset needs the same treatment: when it clears a comparison that contains custom schools, Undo should restore both those schools and the comparison, and Redo should clear them again. Preset and custom universities should continue to work together through these sequences without leaving invisible IDs occupying comparison slots.

The saved comparison also needs to recover safely when the page is reopened. An ID for a school that no longer exists must not survive as a hidden comparison entry, and duplicate saved IDs must not make one university occupy multiple slots. The visible count and the persisted comparison should describe the same set of real universities after loading.

History should only contain actions that actually changed the comparison. In particular, when four universities are already selected and a fifth selection is refused, that refusal must not consume an Undo step. Pressing Undo afterward should remove the fourth university that was successfully added. Reset should simply report that the comparison was reset rather than claiming custom schools were removed when there were none.

The screenshots show that refused-selection history failure. MIT, Stanford, Harvard, and Yale were added in that order, then Columbia was attempted as a fifth selection and refused. After pressing Undo once, the broken version still shows all four selected universities because the refused action incorrectly consumed the Undo step:

<img src="/app/problem_assets/broken.png" alt="Four universities remain selected after a refused fifth selection followed by Undo" width="900" />

With history fixed, the refused fifth selection creates no history entry, so the same Undo removes Yale, the fourth successful addition, and leaves MIT, Stanford, and Harvard selected:

<img src="/app/problem_assets/target.png" alt="Three universities remain after Undo removes the fourth successful addition" width="900" />

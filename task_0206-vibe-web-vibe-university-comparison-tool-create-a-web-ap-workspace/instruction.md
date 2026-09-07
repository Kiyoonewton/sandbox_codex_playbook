# Keep comparison history consistent when schools change

Please fix the comparison history so it represents the universities that actually existed at each step. Right now the comparison and the custom-school list can get out of sync because history remembers only comparison IDs. A clear example is adding one of my own schools to the comparison, deleting that school, and then pressing Undo: the comparison may remember its old ID, but the school itself is still gone, so Undo cannot visibly restore the comparison I had before the deletion.

Deleting a custom school should be one reversible action. If it was part of the comparison, Undo must bring the school back with its original details and put it back in the same comparison state. Redo must delete it again. Reset needs the same treatment: when it clears a comparison that contains custom schools, Undo should restore both those schools and the comparison, and Redo should clear them again. Preset and custom universities should continue to work together through these sequences without leaving invisible IDs occupying comparison slots.

The saved comparison also needs to recover safely when the page is reopened. An ID for a school that no longer exists must not survive as a hidden comparison entry, and duplicate saved IDs must not make one university occupy multiple slots. The visible count and the persisted comparison should describe the same set of real universities after loading.

History should only contain actions that actually changed the comparison. In particular, when four universities are already selected and a fifth selection is refused, that refusal must not consume an Undo step. Pressing Undo afterward should remove the fourth university that was successfully added. Reset should simply report that the comparison was reset rather than claiming custom schools were removed when there were none.

The broken behavior is shown here:

<img src="/app/problem_assets/broken.png" alt="Comparison history failing to restore the previous university state" width="900" />

The corrected comparison state is shown here:

<img src="/app/problem_assets/target.png" alt="Comparison history restored with the universities and custom schools in sync" width="900" />

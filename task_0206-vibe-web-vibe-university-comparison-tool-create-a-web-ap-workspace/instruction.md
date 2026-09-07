# Keep comparison history synchronized with the universities it represents

The comparison history is getting out of sync with the actual university state. The easiest place to see it is at the four-school limit. I selected MIT, Stanford, Harvard, and Yale, then tried to add Columbia. Columbia was correctly refused because the comparison was full, but pressing Undo once after that left all four schools selected. Since the Columbia click never changed the comparison, it shouldn't become a history step; the last real change was adding Yale, so that is what the first Undo should reverse.

The same underlying problem becomes more serious with custom universities because history can remember a comparison ID without the university data that ID belongs to. If I create a custom school, add it to the comparison, delete it, and then Undo, the comparison slot can return while the custom school itself stays deleted. Undo and Redo need to treat that as one state change so the school and its comparison membership disappear and return together rather than producing a ghost selection.

Reset and reload are part of the same state lifecycle. Reset should be undoable without separating custom-school data from the comparison it came from, and it shouldn't report that custom schools were removed when those records are still there. When saved comparison state is loaded again, IDs for schools that no longer exist shouldn't occupy comparison slots, and repeated copies of the same ID shouldn't turn into duplicate selections. What is stored, what the counter reports, and what is rendered in the comparison should all describe the same real set of universities.

Once history represents actual state transitions instead of attempted actions or detached IDs, branching should behave normally too: Undo restores the previous complete state, Redo reapplies it, and making a new real change after Undo starts from that restored state rather than preserving an invalid future.

The screenshot below is the four-school case after Columbia was refused and Undo was pressed once. Yale is still selected even though adding Yale was the last successful change:

<img src="/app/problem_assets/broken.png" alt="Four universities remain selected after a rejected fifth selection consumes the first Undo" width="900" />

With the comparison history synchronized, that same Undo removes Yale and returns the comparison to MIT, Stanford, and Harvard:

<img src="/app/problem_assets/target.png" alt="Undo removes Yale and restores the previous three-university comparison" width="900" />

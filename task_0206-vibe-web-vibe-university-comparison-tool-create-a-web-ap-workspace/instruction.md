# Undo gets out of sync with the universities in my comparison

I ran into a strange problem with Undo while building a comparison. I added MIT, Stanford, Harvard, and Yale, so the comparison was already full, and then I tried to add Columbia. The app correctly refused Columbia because only four schools can be compared, but when I pressed Undo once, all four schools were still there. I expected Yale to disappear because adding Yale was the last thing that actually changed my comparison. Trying and failing to add Columbia shouldn't use up an Undo.

I can get the history into an even stranger state with a university I create myself. If I create a custom school, put it in the comparison, delete it, and then Undo, the comparison slot can come back without the university itself coming back. At that point the app is remembering that I selected a school that no longer exists. When I undo or redo one of these changes, I need the custom university and its place in the comparison to travel together so I don't end up with a ghost selection.

Resetting and reopening the page can leave the same kind of mismatch behind. If I reset the comparison and then Undo, I expect the complete state I had before the reset to return, including any custom school that belonged to it. The reset message also shouldn't tell me that my custom universities were removed if their records are actually still saved. And when I come back to the page later, old IDs for schools that no longer exist shouldn't take up comparison slots, while the same saved ID appearing more than once shouldn't create duplicate selections.

Basically, whenever I look at the selected schools, the comparison count, and what comes back after Undo, Redo, reset, or reload, they should all be describing the same universities. If I Undo and then make a different real change, that should become the new path forward rather than letting Redo bring back the state I abandoned.

Here is the four-school case after Columbia was refused and I pressed Undo once. Yale is still selected even though adding Yale was my last successful change:

<img src="/app/problem_assets/broken.png" alt="Four universities remain selected after a rejected fifth selection consumes the first Undo" width="900" />

After the history is working properly, doing exactly the same thing and pressing Undo once should remove Yale and take me back to MIT, Stanford, and Harvard:

<img src="/app/problem_assets/target.png" alt="Undo removes Yale and restores the previous three-university comparison" width="900" />

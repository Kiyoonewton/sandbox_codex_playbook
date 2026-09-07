# Fix comparison history when schools disappear or an action is rejected

I found a state-history issue in the university comparison tool. Create a custom university, add it to the comparison, delete it, and then use Undo. Undo brings back the old comparison selection without bringing back the deleted custom university, so the comparison can contain an ID for a school that no longer exists.

Please make the custom-school data and comparison selection participate in the same history operation. Deleting a selected custom university should remove both the university and its comparison card. One Undo should restore that exact university, including its original data, and put it back in the same comparison state. Redo should remove both again. The same rule should apply across Reset: if the comparison contained custom and built-in universities before Reset, Undo should reconstruct that comparison and Redo should clear it again.

The saved comparison also needs to be cleaned when the page starts. If `uni-compare-v2` contains an ID for a university that no longer exists, ignore that ID and write the cleaned selection back to storage. If the array contains the same university more than once, keep only one occurrence. After loading, the number shown by the comparison UI, the rendered comparison cards, and the IDs in storage should all describe the same set of real universities.

There is a related history failure at the four-university limit. Add MIT, Stanford, Harvard, and Yale, then attempt to add Columbia. Columbia should still be refused because four universities are already selected, but that rejected click must not create an Undo entry. Pressing Undo once after the rejected Columbia attempt should remove Yale, because adding Yale was the last action that actually changed the comparison. Currently the first Undo can be consumed by the rejected Columbia attempt and all four selected universities remain.

Also correct the Reset notification. Resetting the comparison must not say that all custom schools were removed when the custom-school records were not actually deleted.

The screenshot below is from the four-university case after Columbia was rejected and Undo was pressed once. Yale is still selected, showing that the rejected action incorrectly entered history.

<img src="/app/problem_assets/broken.png" alt="MIT, Stanford, Harvard, and Yale remain selected after Columbia is rejected and Undo is pressed" width="900" />

With the history corrected, that same Undo removes Yale and leaves MIT, Stanford, and Harvard selected.

<img src="/app/problem_assets/target.png" alt="MIT, Stanford, and Harvard remain after Undo removes Yale" width="900" />

# Undo gets stuck after the comparison limit is reached

I hit a strange Undo problem while comparing universities. I selected MIT, Stanford, Harvard, and Yale, then clicked Columbia. The app correctly told me that I could only compare four schools. I pressed Undo once because I wanted to remove my last successful selection, Yale, but nothing changed — all four schools were still selected. It looks like the failed attempt to add Columbia is being treated as something Undo has to reverse even though it never changed the comparison.

I can get the comparison out of sync in a similar way with a custom university. If I create one, compare it, delete it, and then Undo, its old comparison slot can come back without the university itself. After that, the UI can behave as though a missing school is still selected. I've also managed to reproduce that kind of ghost selection after reloading saved comparison data, particularly when the saved list contains a school that no longer exists or contains the same school more than once.

Could you make the history follow the comparison changes that actually happened? A rejected selection shouldn't use up an Undo, and restoring a change involving a custom university should restore the university along with its comparison slot. Reloading should likewise leave the comparison containing only the real, unique schools that can actually be displayed. Reset should remain reversible too, and its notification shouldn't say custom schools were deleted if they were left intact.

This is what I see after Columbia is refused and I press Undo once — Yale is still there:

<img src="/app/problem_assets/broken.png" alt="MIT, Stanford, Harvard, and Yale remain selected after the rejected Columbia attempt and one Undo" width="900" />

I expected that Undo to remove Yale and return me to MIT, Stanford, and Harvard:

<img src="/app/problem_assets/target.png" alt="MIT, Stanford, and Harvard remain after Undo removes Yale" width="900" />

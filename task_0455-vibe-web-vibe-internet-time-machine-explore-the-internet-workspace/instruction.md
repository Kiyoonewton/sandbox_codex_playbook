# Fix year navigation history in the Internet Time Machine

There is a problem with year navigation when I move around the Internet Time Machine using more than one control. For example, if I start on 2005, go to 2010, and then press Undo, I expect to return to 2005. Instead, the app can stay on 2010. Once this happens, navigation history no longer behaves reliably as I continue using the page.

Please make year changes behave as a single navigation system regardless of whether I use a year tab, the keyboard, a favorite, the timeline scrubber, or the URL hash. After a year changes, the hero, selected tab, scrubber, URL, saved year, and favorites bar should all represent the same current year.

Undo should return to the previous year I actually chose, and Redo should restore the year I undid. Ctrl/Cmd+Shift+Z should work as Redo too. If I undo and then choose a different year, that new choice should replace the abandoned redo path. Simply choosing the year I am already on should not create another history step or erase a redo that is still available.

The timeline scrubber is particularly easy to break. Dragging across several years should be treated as one choice when I release it, rather than recording every year crossed during the drag. If I drag away and finish back on the year where I started, nothing should be added to history. Changing the year with the keyboard while the scrubber is focused should still be a normal, undoable year change.

The URL needs to participate in the same behavior. If the page opens with a valid year in its hash, that year should be used even when localStorage contains an older saved year. Changing the hash while the page is already open should switch to that year immediately without leaving the other controls out of sync.

Favorites should behave the same way: adding or removing one should update the favorites bar immediately, and opening a favorite should be undoable just like selecting a year anywhere else.

The screenshots show the Undo example above. Both start from 2005 and then navigate to 2010 before Undo is pressed. In the broken version below, Undo fails and the app is still showing the 2010/Facebook year:

<img src="/app/problem_assets/broken.png" alt="The Internet Time Machine still showing 2010 after Undo should have returned from 2010 to 2005" width="900" />

With the navigation history fixed, the same Undo returns to the previous 2005/MySpace year:

<img src="/app/problem_assets/target.png" alt="The Internet Time Machine correctly showing 2005 after undoing navigation to 2010" width="900" />

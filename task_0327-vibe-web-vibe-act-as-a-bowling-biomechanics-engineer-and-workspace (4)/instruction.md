# The spare advice stops trusting what is actually on the lane

The advice panel stops making sense once I change the setup. With only the head pin standing, switching from right-handed to left-handed should mirror the board adjustment to the other side of the lane, but it keeps giving me almost the same recommendation.

The oil control also disagrees with itself. At the Heavy endpoint, its status label says the wrong condition. The trajectory value below the recommendation prints the degree symbol twice.

The recommendation panel is difficult to use during a shot: the three main values are separated from the reference table, and the last rows of that table run below the visible panel. I should be able to read the active plan and its full adjustment reference together at a glance.

The Greek Church preset is wrong too. It should leave pins 4, 6, 7, 9, and 10 standing, but it loads an unrelated pin pattern.

On some leaves, the app also seems to pick the wrong pin to aim at. When two of the standing pins are genuinely equally close to me, the app doesn't seem to take which hand I bowl with into account when deciding which one I should actually be targeting — it just keeps favoring the same pin no matter which hand is selected, even though the natural path into each pin is different for a right-handed and a left-handed bowler.

The scenario name under the standing pins is unreliable too. It calls plenty of ordinary leaves a "split" even when my first ball never actually cleared the head pin, and it misses real splits where the two remaining pins just happen to sit on the same side of the lane instead of opposite sides.

And once I've clicked a preset button, the app forgets to double check itself — the button stays highlighted even after I manually change a pin, so I can't tell at a glance whether I'm still looking at that preset's layout or something I changed myself.

During a long session of trying different leaves, undo eventually stops working as expected too. After enough pin changes, pressing undo the number of times I should need to get all the way back to my starting deck isn't enough — the button is still active for one more press than it should be.

Keep the existing bowling workspace, but make the active spare advice accurately reflect the selected hand, oil condition, and pin deck.

<img src="/app/problem_assets/broken.png" alt="broken spare recommendation" width="900" />

<img src="/app/problem_assets/target.png" alt="correct spare recommendation" width="900" />

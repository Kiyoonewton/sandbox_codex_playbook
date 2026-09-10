# The spare advice stops trusting what is actually on the lane

The advice panel stops making sense once I change the setup. With only the head pin standing, switching from right-handed to left-handed should mirror the board adjustment to the other side of the lane, but it keeps giving me almost the same recommendation.

The oil control also disagrees with itself. At the Heavy endpoint, its status label says the wrong condition. The trajectory value below the recommendation prints the degree symbol twice.

The recommendation panel is difficult to use during a shot: the three main values are separated from the reference table, and the last rows of that table run below the visible panel. I should be able to read the active plan and its full adjustment reference together at a glance.

The Greek Church preset is wrong too. It should leave pins 4, 6, 7, 9, and 10 standing, but it loads an unrelated pin pattern.

Keep the existing bowling workspace, but make the active spare advice accurately reflect the selected hand, oil condition, and pin deck.

<img src="/app/problem_assets/broken.png" alt="broken spare recommendation" width="900" />

<img src="/app/problem_assets/target.png" alt="correct spare recommendation" width="900" />

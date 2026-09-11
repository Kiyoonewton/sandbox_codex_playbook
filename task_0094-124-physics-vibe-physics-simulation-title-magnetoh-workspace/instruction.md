# The plasma torus doesn't look right, and the readouts don't add up

I turned off the field lines and rational surface markers to look at the plasma torus on its own, and it's clearly wrong. Instead of eight distinct rings nested inside each other, I can only make out about four — several of them are sitting right on top of each other instead of being evenly spaced from the center out to the edge.

The q=1/2/3 surface readouts in the right panel don't line up with the plasma settings either. With the default ITER preset, the numbers shown for where those surfaces actually sit are consistently off from what the on-axis and edge q values should produce.

The TRIANGLES count in the RENDER panel is also way higher than it needs to be for how little detail the small inner rings actually need, and it doesn't grow properly when I turn up the toroidal circuits slider — the line detail should get noticeably heavier as I add more turns, but the count barely moves.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="current (broken) app" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="expected app" width="900" />

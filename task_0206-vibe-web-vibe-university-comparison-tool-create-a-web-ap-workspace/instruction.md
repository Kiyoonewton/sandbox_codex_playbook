# Undo and redo lose parts of my comparison

When my comparison is full, trying a fifth university is correctly refused. But Undo then claims to work without removing the last university I successfully added.

History also becomes unreliable when custom schools are deleted or everything is reset. Undo and Redo must restore the complete comparison I previously saw, including custom schools and their selected order. If I make a new change after using Undo, Redo must not bring back the abandoned comparison.

The buttons and keyboard shortcuts must behave consistently. Reset must be reversible and display "Comparison reset."

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="current (broken) app" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="expected app" width="900" />

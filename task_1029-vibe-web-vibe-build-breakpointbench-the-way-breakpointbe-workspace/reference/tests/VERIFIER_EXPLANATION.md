# Verifier Explanation

The verifier checks that the app starts correctly and renders without breaking the page layout.

It also checks the task-specific behaviors:

- Pressing Fit on an empty screen keeps the zoom at 100%.
- Using Zoom In or Zoom Out while nothing is loaded does not change the zoom.
- Loading a URL after changing zoom on an empty screen resets the zoom to 100%.
- Toggling a breakpoint updates the displayed viewport count.
- A custom breakpoint remains visible after reloading the page.
- Undoing a loaded URL returns the app to the empty state and clears the old URL from the status area.

The verifier also includes a layout check to make sure the page does not introduce unwanted horizontal overflow.

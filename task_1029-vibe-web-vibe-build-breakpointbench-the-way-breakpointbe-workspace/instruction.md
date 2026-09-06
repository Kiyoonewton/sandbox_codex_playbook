# The zoom controls don't behave on an empty screen

## What you see

Right after opening the app, before loading anything at all, the preview area is blank as expected. But if you press the Fit button at that point, the zoom readout suddenly changes to a much smaller value, as though it had just scaled something down to fit. Nothing on screen actually changes — there's no preview to shrink — so you're left staring at an empty area while the control insists it's been zoomed out. From there the readout is out of step with what you're actually seeing, and it's confusing when you then load something.

## What correct looks like

With nothing loaded, pressing Fit shouldn't pretend to have done anything. The zoom readout should stay where it started, or the app should simply tell you there's nothing to fit, so the number you read always matches what's actually on screen.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="current broken app" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="expected app" width="900" />

# The zoom in/out controls change the zoom on an empty screen

When the screen is empty, clicking the Zoom In or Zoom Out controls still changes the zoom percentage readout even though there’s no preview visible. I expect the empty screen to remain fixed at the normal zoom level until a URL is actually loaded.

# Changing the zoom while empty affects freshly loaded URLs

If I adjust the zoom while the screen is empty and then go ahead and load a URL, the new preview inherits that modified zoom setting. I expect loading a URL to always start fresh at the normal, default zoom level regardless of what I clicked beforehand.

# Toggling a breakpoint on an empty screen doesn't update the viewport count

When no preview is loaded and I turn off a breakpoint, the breakpoint list visually updates, but the viewport count doesn't change. I expect the viewport count to immediately match the active breakpoints at all times.

# Custom breakpoints disappear from the visible list after reloading

I added a custom breakpoint and it showed up in the list correctly. However, after I refreshed the page, the saved custom breakpoint disappeared from the visible breakpoint list and total count. I expect any custom breakpoints I add to stay saved and visible after a reload.

# Undoing a loaded URL leaves the old URL displayed in the status area

When I load a URL and then hit undo, the preview area properly reverts back to an empty screen, but the old URL stays written in the status area. I expect the status area to clear out and no longer display the old URL once the action is undone.

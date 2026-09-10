# Verifier explanation

## What the tests protect

The P2P checks confirm the existing bowling workspace still loads correctly, its core controls remain usable, and the preserved normal interactions — like toggling a pin and undoing that toggle, or checking the right-handed center-pin recommendation — still work the way they always have.

The F2P checks cover one connected spare-recommendation workflow. Together they confirm that center-pin oil adjustments mirror correctly for both left- and right-handed bowlers, that the Heavy endpoint, the board and offset readout, and the trajectory angle's unit all agree with whichever lane condition is currently selected, that the active recommendation panel and the full adjustment table stay readable together without anything being cut off, that the Greek Church preset leaves the correct pins standing, and that when two standing pins are genuinely equally close, the app picks the pin matching the bowler's selected hand rather than always favoring the same one.

They also confirm the scenario label only calls a leave a split when the head pin is actually down and the remaining pins are truly separated from each other, not merely spread across both sides of the lane, that a preset button's highlight always reflects whether the pin deck genuinely still matches that preset — clearing when it no longer does, and returning when undoing or resetting lands back on an exact match — and that a long session of pin changes never leaves the undo history holding more steps than it should, so a bowler pressing undo back to the start always runs out at the right point.

## Why these checks prove the fix

Base fails these checks because its calculated plan, its labels, its angle display, its panel layout, its preset data, its scenario naming, its preset highlighting, and its undo history all disagree with the setup a bowler has actually chosen on screen or built up over a session. Fixed only passes when the visible recommendation is physically consistent with the pins, hand, and oil condition selected, every piece of on-screen feedback honestly reflects the current pin deck, and undo behaves exactly as many steps deep as it claims to.

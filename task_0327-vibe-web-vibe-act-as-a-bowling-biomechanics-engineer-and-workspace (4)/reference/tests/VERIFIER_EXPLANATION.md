# Verifier explanation

## What the tests protect

The P2P checks confirm the existing bowling workspace still loads correctly, its core controls remain usable, and the preserved normal interactions — like toggling a pin and undoing that toggle, or checking the right-handed center-pin recommendation — still work the way they always have.

The F2P checks cover one connected spare-recommendation workflow. Together they confirm that center-pin oil adjustments mirror correctly for both left- and right-handed bowlers, that the Heavy endpoint, the board and offset readout, and the trajectory angle's unit all agree with whichever lane condition is currently selected, that the active recommendation panel and the full adjustment table stay readable together without anything being cut off, and that the Greek Church preset leaves the correct pins standing.

## Why these checks prove the fix

Base fails these checks because its calculated plan, its labels, its angle display, its panel layout, and its preset data all disagree with the setup a bowler has actually chosen on screen. Fixed only passes when the visible recommendation is physically consistent with the pins, hand, and oil condition selected, and the panel presenting that recommendation is actually usable.

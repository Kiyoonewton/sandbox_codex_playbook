# Explore category cards are not keyboard accessible

## What you see

The Explore category cards look and behave like interactive controls, but their keyboard and accessibility state does not stay consistent with what is shown on screen.

A category can be focused with the keyboard, but pressing Enter or Space does not operate it like a button. When categories are expanded through the existing mouse or number-key controls, the visual state changes while the accessibility state can still report the card as collapsed.

This becomes especially confusing when moving between categories or using Escape: only one category should remain expanded, and the state exposed to assistive technology should always match what the user can see.

Keyboard interaction with a category should behave consistently with mouse interaction. Enter and Space should toggle the focused card, Space should not scroll the page while activating it, opening another category should collapse the previous one, and Escape should close the expanded category. The existing 1–8 category shortcuts should follow the same state model.

The selected year must remain unchanged while operating category cards.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="Expanded category incorrectly reporting itself as collapsed" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="Expanded category correctly reporting its accessibility state" width="900" />

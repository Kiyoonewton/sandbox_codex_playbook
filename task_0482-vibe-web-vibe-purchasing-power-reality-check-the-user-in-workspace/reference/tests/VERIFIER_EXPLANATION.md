# What the verifier checks

The verifier runs the purchasing-power calculator in a real browser and checks the following user-visible behaviour.

## Checks

- The application opens successfully and displays the salary calculator, year selectors, salary fields, and submit control.
- The calculator remains usable within the configured browser viewport without important controls being clipped.
- CPI details are displayed as index values, such as `172.2 → 314.2 CPI`, without dollar signs.
- For a loss scenario, the negotiation brief converts the current salary into its equivalent value in the starting year's dollars instead of repeating the starting salary.
- For a gain scenario, the brief uses the same real-dollar basis and gives a recommendation based on compounded annual inflation.
- A submitted calculation uses the exact values present when Run the Numbers was clicked, even if the form is edited while processing continues.
- Clear cancels a pending calculation completely, so neither an old result nor a delayed validation error appears afterward.
- When calculations are submitted rapidly, only the newest submission is committed, even if an older request finishes later.
- Salary inputs containing cents retain their numeric value and are not accidentally multiplied by removing the decimal point.
- Saving identical inputs repeatedly updates a single saved scenario instead of creating duplicates.
- Malformed saved records are ignored safely, and stale stored totals are recalculated from valid saved inputs before being displayed or loaded.
- Saving or deleting a scenario in one browser tab updates the saved-scenario list in another open tab without a refresh.

## Why these checks prove the fix

The broken application fails because it formats CPI as money, repeats or miscalculates purchasing-power values, reads mutable form fields after submission, allows cancelled or older work to overwrite the screen, mishandles decimal salaries, and trusts unreliable saved data. The fixed application passes because calculations are committed as controlled snapshots and saved scenarios are validated, recalculated, deduplicated, and synchronized.

The tests deliberately verify behaviour through the rendered interface rather than requiring particular function names, class architecture, storage schema, or implementation technique. They preserve the existing visual design and do not test unrelated content, styling details, external services, or pixel-perfect screenshot matching.

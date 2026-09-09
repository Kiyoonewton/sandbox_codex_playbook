# My salary result changes after I submit it

When I run the inflation comparison, the result is not always based on the values I submitted. If I edit the form while the calculation is processing, the displayed answer can use those newer field values instead. Rapid submissions can also finish out of order and replace the newest result with an older one. Clearing the calculator during processing must cancel that work completely, without allowing a delayed result or validation message to reappear.

The figures themselves must be trustworthy. Display CPI readings as plain index values rather than currency. Preserve cents in salary inputs, convert the current salary into starting-year dollars in the negotiation brief, and calculate the annualized change using compounding. The same calculation must also handle cases where purchasing power increased rather than decreased.

Saved comparisons should remain reliable after the page has been used for a while. Saving identical inputs again should update the existing scenario instead of adding a duplicate. Ignore malformed saved records, discard stale derived totals, and recalculate each valid scenario from its saved inputs. When a scenario is saved or deleted in one open tab, the saved-scenario list in another tab should update without a refresh.

Keep the existing layout and interaction flow.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="current broken purchasing-power result" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="correct purchasing-power result" width="900" />

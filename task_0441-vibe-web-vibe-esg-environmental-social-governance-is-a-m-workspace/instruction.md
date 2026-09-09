# My ESG comparison changes when I return to it

Fallback ESG scores and company facts change after a refresh, which makes saved comparisons impossible to trust. The same company should keep the same estimated scores, trend, sub-metrics and profile facts whenever it is loaded again.

Comparison sessions also need to be restorable. Save comparison additions, removals and their order immediately, and make the removal Undo survive a refresh. A company must not appear as both the main company and a comparison entry.

“Share URL” should copy a link that opens the same main company, ordered comparison list, lens and active tab even in a clean browser. If searches finish out of order, only the newest search should become the main company.

Finally, the benchmark number and above/below calculation shown in every pillar insight and detail dialog must use that pillar’s actual sector benchmark—never `undefined` or `NaN`.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="current (broken) app" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="expected app" width="900" />

# Saved progressions become unreliable after I reopen or import them

I saved a custom progression, reopened it, and removed a chord while experimenting. When I loaded the saved item again, it had also lost that chord even though I never saved the edit. A saved progression should remain an independent copy: reopening it must restore its original key, scale, chord order, and first selected chord, including after a page refresh.

Importing progressions can also leave my library half-updated, and the Import control disappears when the library is empty. Import should always be available. If one entry in a file has an unknown root, scale or preset, an unsupported progression type, an invalid date, or an out-of-range custom chord, the whole import should be refused without adding anything. A valid file should import every new entry with a unique ID, remain available after refresh, and each imported progression should load correctly. Repeated progressions—whether duplicated inside one file or imported again later—should not create extra saved items.

Finally, Save sometimes announces “Progression saved” when no preset or custom progression is selected. It should add nothing and tell me to select a progression first.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="current (broken) app" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="expected app" width="900" />

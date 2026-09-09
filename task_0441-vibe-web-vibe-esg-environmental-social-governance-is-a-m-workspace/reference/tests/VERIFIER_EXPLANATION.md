# Verifier explanation

The two P2P tests protect the existing shell: the app opens, company autocomplete still filters correctly, and a loaded dashboard does not overflow the viewport.

The F2P tests load companies with the remote data services unavailable so the fallback path is exercised. They verify that all visible estimated scores, sub-metrics and company facts remain identical after reload; each pillar uses the correct Technology benchmark in both its insight and detail dialog; and no benchmark calculation renders `undefined` or `NaN`.

The comparison tests add Microsoft and Tesla to Apple. They verify immediate persistence, original ordering after reload, persistence of a removal, persistence after undoing that removal, and rejection of the main company as its own comparison.

The sharing test selects the Consumer lens and Compare tab, copies the Share URL, clears local storage, and opens the link. The same primary company, ordered comparisons, lens and tab must be reconstructed from the URL alone. The final concurrency test delays Apple’s fallback requests, starts a newer Microsoft search, and verifies that the late Apple result cannot replace Microsoft.

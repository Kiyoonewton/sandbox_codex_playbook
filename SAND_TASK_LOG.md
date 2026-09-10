# Sand Task Log — running feedback loop

This file is append-only history plus a standing "next task" checklist. After every
task outcome you report (submitted / needs-fix / rejected / approved), I update the
checklist below before we start the next task. The base rules live in
`SAND_CODEX_PLAYBOOK.md` — this file is the sharpened, current-state delta on top of it.

---

## APPROVED-TASK TEMPLATE (task_0447) — design discipline to reuse

task_0447 (chord progressions, "Saved Progressions" workflow) cleared every automated
gate including Difficulty calibration. Do NOT reuse its domain (saved libraries /
import / dedupe) in another task — reuse its *design discipline*:

| Pattern | What 0447 did | Apply next time |
|---|---|---|
| One coherent workflow | "Saved progressions" = save, reopen, edit, import, dedupe, refresh — all one feature area | Pick one real user journey, explore its natural edge cases. Don't spread bugs across CSS + JS + unrelated presets. |
| Concrete symptoms | Instruction explains exactly what goes wrong, no file/fix names | Write from the user's perspective; describe outcomes, not code. |
| Orthogonal F2P checks | Tests mutation safety, transaction safety, validation, persistence, identity, empty state — each a different *failure mode*, not near-duplicates | Each F2P test should catch a different way the workflow can fail, not the same thing twice. |
| Protected existing behavior | 3 P2P: app boots, workspace stays usable, saved custom progression reloads correctly | Keep unrelated core behavior stable; P2P should cover boot + at least one already-correct piece of the same feature. |
| Targeted solution | Diff touched ONE file (`main.js`) — no broad rewrite | A hard task still gets an honest, focused patch. If the diff sprawls across many files/properties, that's a signal the task is under-focused, not harder. |
| Evidence matches the task | Instruction + screenshots + tests all center on the same "unreliable saved progressions" story | Treat instruction + image + verifier + fix as one contract — nothing in tests that isn't in instructions, nothing in instructions that isn't tested. |

**Its test shape, concretely:**
- P2P (3): app boots and renders; main workspace stays usable; a saved custom
  progression restores key/order/first-chord after refresh.
- F2P (6): editing a loaded item doesn't mutate its saved copy (aliasing/reference
  bug — the strongest kind of Silver-level anchor: a one-line fix, `[...arr]` vs `arr`,
  invisible from the instructions, only found by tracing data flow); Import stays
  available on an empty library; an invalid import entry rejects the WHOLE import,
  changing nothing; valid imports get collision-free IDs and survive refresh; imported
  duplicates (within one file AND against existing saves) don't multiply; Save refuses
  and reports failure when nothing is active.

**Formula for the next task:**
1. Choose a workflow that belongs naturally to that app.
2. Add 5–7 distinct but connected failure modes (not independent one-liners).
3. Include at least one visible usability/layout defect that genuinely harms use.
4. Keep instructions short and symptom-based.
5. Test user-visible behavior from several angles: normal use, invalid input, repeat
   action, refresh/restoration, and state cleanup.
6. Look for aliasing/reference bugs first (shared array/object mutated through a second
   reference) — best Silver-level anchor available: tiny diff, untraceable from the
   instruction text alone, requires understanding data flow.
7. Validation-shape bugs are a strong second layer: "checks truthy" instead of "checks
   real domain constraints" (valid note names, valid enum values, valid index bounds).
8. Idempotency/dedup logic (fresh IDs on import, no duplicate entries) is a natural
   third layer — testable from multiple angles without padding.
9. Feedback correctness (a status/toast message that fires on the wrong condition or
   says the wrong thing) ties the story together and is easy to screenshot.

**The approved task's actual file footprint:** `fixed-repo/index.html`,
`fixed-repo/js/main.js`, `instruction.md`, screenshots, `VERIFIER_EXPLANATION.md`,
the Playwright spec. That's the healthy scope to aim for — not an "oracle"-sized
rewrite touching many files or many unrelated properties.

---

## NEXT TASK CHECKLIST (current)

Carried forward from task_0327 plus the task_0447 template above. No rejection
feedback received yet on task_0327 (currently at Build in the automated pipeline),
so this is the playbook's own checklist plus the concrete lessons task_0327 surfaced
in practice, sharpened by what actually got task_0447 approved.

- [ ] Before choosing the defect, actively look for an aliasing/reference bug first
      (shared array/object object-identity mistake) — task_0447's strongest anchor and
      currently missing from our own playbook until now.
- [ ] Keep the fix footprint to as few files as honestly possible — one JS file plus
      maybe one HTML/CSS touch, not fixes spread across CSS in 5 places + JS logic +
      unrelated preset data (task_0327's shape, which still worked but is not the
      template to repeat).
- [ ] Classify F2P tests by *failure mode* (mutation safety, transaction/all-or-nothing
      safety, validation-against-real-constraints, persistence, identity/uniqueness,
      empty-state) rather than by "which bug does this catch" — helps catch redundant
      near-duplicate tests before they're written.
- [ ] Confirm which workspace/claim is active before touching files (check
      `.sand-workspace.json` `workingSnapshotId` — it can silently rotate mid-session;
      task_0327 changed IDs at least twice without an explicit reclaim).
- [ ] Read the app's actual code before trusting any prior doc/summary's characterization
      of what's broken — task_0327's handoff doc described bugs that didn't match the
      fresh claim's real code at least once (magnitude 1.25 vs actual 2.5).
- [ ] Pick ONE connected root-cause defect where the fail site and fix site are different
      (a value rendered in the UI, caused by a branch/condition several lines away) —
      not several independent one-line bugs.
- [ ] Verify every planned F2P test actually fails on Base and passes on Fixed by running
      both, not by assuming from reading the code. (task_0327: 2 of 7 originally-planned
      F2P tests turned out to pass on Base too — they were reclassified to P2P.)
- [ ] Hit the 6 F2P / 2 P2P floor with genuine, distinguishing tests — pad by splitting
      a real multi-step scenario into separate assertions if short, not by adding
      near-duplicate checks.
- [ ] Any UI/layout claim in instructions.md needs a verified, live-measured fix — don't
      claim "now fits/readable" without measuring (task_0327: had to iterate CSS padding
      3 times, checking `scrollHeight` vs `clientHeight`, before the table genuinely fit).
- [ ] instructions.md: player-reported, one connected narrative, conversational opening,
      zero implementation nouns, symptoms only — see the exact tone/format the user
      dictated for task_0327 as the template going forward (no "Requirements" headers,
      no localStorage/state/selector jargon, described as continuous workflows not
      isolated checks).
- [ ] VERIFIER_EXPLANATION.md: plain user language, P2P first then F2P as one connected
      workflow, then a short "why Base fails / Fixed passes" close — no file names,
      selectors, or assertion code.
- [ ] Screenshots taken live from the actual running app (Playwright or Sand's preview),
      never hand-waved — confirm pixel state matches the exact claim before saving.
- [ ] Package: exclude `instruction-images/`, `node_modules/`, `test-results/`, `.git/`,
      `.DS_Store`; verify with `tar -tzf | rg` before calling it done; confirm
      `.sand-workspace.json` snapshot ID is current, not stale.
- [ ] Archive contents must sit at the archive ROOT (`./`, `./.sand-workspace.json`,
      `./base-repo/`, etc.) — NOT nested one level inside a task-name subfolder,
      especially not one with a `(N)`-suffixed duplicate-download name. task_0327 got
      "Archive is missing .sand-workspace.json" from Structure check purely because of
      this nesting, even though the file was present in the tarball. `tar -C "$TASK" -czf
      out.tar.gz --exclude=... .` from inside the task dir, not `tar -C "$(dirname
      "$TASK")" ... "$NAME"` from its parent.
- [ ] Run Fixed → Base → official `test.sh`/wrapper locally, in that order, before
      considering the task submit-ready. Record actual reward.json output, don't assume.

---

## TASK HISTORY

### task_0447 — Chord progressions ("Saved Progressions" workflow)
**Status:** cleared all automated gates through Difficulty calibration; at Human
review as of 2026-09-10 (not yet finally Approved, but this is the strongest
evidence we have of what passes). Full pattern breakdown is in the
APPROVED-TASK TEMPLATE section above — this entry is just the pointer/status.

### task_0327 — Bowling spare calculator (oil-offset redesign)
**Status:** at Build in the automated pipeline as of 2026-09-10, after passing
Intake / Originality / Structure checks. Packaging issue (`.sand-workspace.json`
appeared "missing" to the platform) was traced to archive structure — the task
contents were nested one level inside a nonstandard `(4)`-suffixed folder instead
of sitting at the archive root. Repackaged with everything at archive root; this
fixed it (Structure check now passes). **Lesson folded into checklist below.**

**What happened:**
- Original queue-claimed version (history/undo/redo/persistence workflow) had already
  been returned once as "too similar" before this session started.
- Rebuilt from a fresh Import-style claim. New root defect: center-pin oil-offset
  calculation ignored bowler handedness (mirroring bug), paired with 3 connected
  symptoms (oil label mismatch, duplicated degree symbol, cut-off adjustment table)
  plus one incidental defect found in the template itself (wrong Greek Church preset
  data) that got folded into scope.
- Final: 7 F2P + 5 P2P = 12 tests. Verified via manual Fixed/Base Playwright runs and
  the official `test.sh` wrapper: Fixed → reward 1 (7/7 F2P, 5/5 P2P), Base → reward 0
  (0/7 F2P, 5/5 P2P).
- instructions.md went through two full rewrites at the user's direction: first to a
  "player-reported" conversational format, then replaced entirely with the user's own
  tighter final version (which also dropped a second Greek Church screenshot pair in
  favor of stating the correct pins in prose).
- Packaged as `task_0327-bowling-oil-offset-redesign.tar.gz`, verified clean via
  `tar -tzf | rg` exclusion check.

**Open risk not yet resolved:** never ran actual `harbor nop`/`harbor oracle` CLI (not
installed locally) — only the manual `test.sh` wrapper as a proxy. If Harbor's real
runner behaves differently, that's the most likely source of a surprise at submission.

**No rejection reason recorded yet** — nothing to fold into the checklist from outcome
feedback. Will update this section (and revise the checklist above) as soon as you
report back.

---

## HOW THIS FILE GETS UPDATED

Each time you tell me:
1. A task was **submitted** — I log it here with final test counts and packaging notes.
2. A task got **"Needs Fix" / rejected** with a reason — I add the reason verbatim under
   that task's entry, then translate it into one or more new checklist items above,
   specific enough to catch the same failure mode next time (not generic "be more
   careful" advice).
3. A task was **approved** — I note what worked so the checklist doesn't accidentally
   get "fixed" away in a later revision.

Tell me the outcome and I'll update this file before we start the next task.

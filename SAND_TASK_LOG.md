# Sand Task Log — running feedback loop

This file is append-only history plus a standing "next task" checklist. After every
task outcome you report (submitted / needs-fix / rejected / approved), I update the
checklist below before we start the next task. The base rules live in
`SAND_CODEX_PLAYBOOK.md` — this file is the sharpened, current-state delta on top of it.

---

## SCORING MECHANICS — corrected model (2026-09-10)

Confirmed: a single run only counts as "solved" when the agent's ONE patch attempt
makes EVERY F2P test (and every P2P test) pass — all-or-nothing per run, matching the
local `reward.json` shape (`reward: 1` only when `all_pass` is true across the whole
suite). There is no partial credit.

**This corrects an earlier wrong instinct.** I had reasoned that adding more shallow,
independently-findable bugs to a task would DILUTE difficulty (agent finds one easy
bug, pattern-matches the rest, solve rate goes up). That reasoning was backwards under
all-or-nothing scoring: more REQUIRED bugs — even shallow ones — raises the bar,
because the agent must correctly find and fix ALL of them in a single attempt, not
just one. Missing any single one, however easy, fails the whole run.

**The real lever on difficulty is bug SHAPE, not bug COUNT.** task_0327's 5/15 problem
wasn't "too many bugs" — it was that all 5 were shallow, grep-the-symptom,
independently-patchable one-liners that a systematic agent could knock out one by one
by just working through the instruction's stated symptoms. The fix isn't necessarily
fewer bugs; it's making sure at least one bug requires real tracing (cause far from
symptom, depends on understanding a shared value's flow across multiple call sites)
so a shallow pass-by-symptom approach isn't sufficient even with unlimited budget for
the easy ones.

**Practical takeaway:** it is fine, and can be a good idea, to keep several genuine
shallow bugs in a task AS LONG AS at least one bug in the set demands real tracing.
Don't reflexively trim bug count in the name of difficulty — that was my error. Instead
audit bug *shape*: is every fix in the set independently, shallowly discoverable? If
yes, add depth (a traced root cause), don't necessarily subtract breadth.

---

## DIFFICULTY CEILING RULE (exact numbers)

A task must be solved **at least 1 time** across its attempt series (floor — proves
it's solvable at all), and must NOT exceed its series' ceiling:

| Series size | Max allowed solves |
|---|---|
| 10 attempts | 2 |
| 15 attempts | 3 (confirmed by user, corrects an earlier wrong guess of "well under half") |

task_0327's actual run was 15 attempts, 5 solved — over the 3-solve ceiling for that
series size. Use this table directly when judging whether a task needs more hardening
before resubmission; don't eyeball or pattern-match ceiling numbers for series sizes
that haven't been explicitly confirmed — ask rather than infer.

---

## CRITICAL CORRECTION (2026-09-10) — I was manufacturing bugs, not finding them

task_0463 was rejected "too similar" a THIRD time even after fully removing the
route-checker workflow and rewriting the pause/resume bug's tests from scratch.
The user diagnosed the actual root cause: check `git log`/`git show` on the
template's very first commit before touching anything. Did that for task_0463 and
confirmed it exactly:

- The original first-commit `fixed-repo/js/state.js` `pause()` function is BYTE-FOR-
  BYTE what I called "the bug" in base — `this.state = ST.DRAW` unconditionally, no
  `pausedFrom` tracking, no reset-on-resume. That was never a bug. It was the
  template author's actual intended, shipped, correct-by-design behavior. I read
  the code, decided on my own judgment that this looked like it should behave
  differently, invented a NEW "fix" (`pausedFrom` + `loadLevel()` on resume) that
  never existed in any version of this app, and built an entire task around my own
  invention — not around anything the template creator planted or that a real user
  would call broken from the actual, original, intended app.
- Route-checker (`RouteFeedback`, the tail-only collision check) doesn't exist AT
  ALL in the original first commit, in base or fixed. I introduced that whole
  workflow myself in an earlier session.
- The ONE real, original, pre-existing defect this template ships with is the
  `resumeLvl`/`badgeReserve`/`syncHud`/`commitBest` level-progression/HUD-clipping
  bug family — confirmed present in base-repo's first commit — which we correctly
  identified as the actual planted bug back when we first inspected this template,
  and correctly ruled off-limits per the hard rule (since reusing a template's own
  bug as our primary task is banned). But that rule was about not REUSING the
  template's bug — it was never license to invent arbitrary new "bugs" elsewhere
  in the app instead. Both of my last two attempts on task_0463 did exactly that.

**Why this explains all three "too similar" rejections consistently:** a bug I
invent by reading code and deciding "this looks wrong" tends to be a generic,
textbook bug SHAPE — "forgot to reset state X on transition Y," "checks only the
tail instead of the full collection" — the kind of thing many different experts
independently invent when told to add a bug to *any* app, regardless of this
app's specifics. It reads as generic/templated to an originality check precisely
because it isn't actually native to this app — it's a bug pattern I imported from
general programming intuition, dressed up in this app's variable names. A genuinely
DIFFERENT task requires either (a) the template's own real planted bug (but that's
banned for THIS template since it's the one already in the corpus), or (b) picking
a different app/template entirely, since this one's only real defect is off-limits.

**Corrected process going forward, for every future task, no exceptions:**
1. Before proposing ANY bug as the basis for a task, run `git log --oneline --all
   -- '*taskname*'` and inspect the earliest commit's base-repo AND fixed-repo (not
   just today's working copy, which may already reflect prior sessions' edits).
2. Identify the template's own actual originally-planted bug this way — diff early
   base vs. early fixed.
3. Then check whether the CURRENT claim/snapshot's base-repo still actually
   contains that bug (`grep` for its telltale function/variable names in the
   current working copy) — a queue claim's snapshot can rotate to a version where
   the original bug is already resolved, especially after multiple prior sessions
   touched it. Confirmed this happened on task_0463: the original `resumeLvl`/
   `badgeReserve`/`syncHud` bug family present in the first commit was completely
   absent from the current snapshot — base and fixed were already identical on
   that bug before we touched anything.
4. If that bug is the only real one and it's off-limits (hard rule) OR no longer
   present in the current snapshot, do NOT invent a substitute defect elsewhere in
   the same app by reading code and using personal judgment about what "looks
   wrong." That is manufacturing, not finding, and it produces exactly the generic
   bug shapes that keep reading as corpus-duplicates.
5. In that situation the only legitimate move is picking a DIFFERENT app/template
   entirely — release/abandon this one rather than keep inventing new bugs in it.
6. This check must happen BEFORE writing any instruction, test, or fix — not after
   a rejection reveals the problem.

**Resolution for task_0463 (2026-09-10):** confirmed the current snapshot has no
native bug left to build on — released/abandoned per user decision. Three straight
"too similar" rejections across two different manufactured bugs (route-checker,
then pause/resume) on the same underlying issue: inventing defects instead of
finding them. This task is closed; do not reclaim or reattempt on this same
template without first re-verifying (via the process above) that a genuine native
bug actually exists in whatever fresh snapshot is offered.

---

## HARD RULE — never reuse a template's existing Base/Fixed bug as the primary task

Established after a correction on task_0463 (2026-09-10). Applies to EVERY task, queue-
claimed or Import:

- Any difference that already exists between a template's `base-repo` and `fixed-repo`
  before we touch anything is **not our work**. It is the template's own scenario and
  is already present in the corpus (this is true even if we never saw the "original"
  Fixed and only inspected Base — an existing Base/Fixed diff on a fresh claim means
  someone already built and shipped that exact scenario before).
- We may NOT propose that existing bug family as the primary task, even if we add
  stronger tests, extra UI, or make its symptoms depend on more state than before.
  Layering new tests/instructions on top of a template's own defect is not a
  substantial redesign — it still gets flagged as "too similar," and rightly so.
- Correct workflow, every time:
  1. First identify the template's existing bug family (read the Base/Fixed diff
     before writing anything).
  2. Deliberately choose a **different, independent** workflow in the same app —
     a different feature area, different code paths, different user action.
  3. Independently add: (a) a new broken implementation in Base, (b) a real
     correction in Fixed, (c) new instruction wording, screenshots, and behavioral
     F2P tests — all for that independent scenario, not the template's.
  4. Before packaging, diff our final Base/Fixed against the ORIGINAL untouched
     queue template's Base/Fixed (not just against each other). If our changes
     merely extend, expose, or add tests around the template's original defect,
     it is not different enough — go back to step 2.
  5. The archive's Base/Fixed diff should show a meaningful new defect/fix pair we
     authored. Instruction/test-only changes on top of the template's existing
     diff do not satisfy this.
- This is now the FIRST thing to check when inspecting any queue-claimed template,
  before any difficulty or scope discussion: run `diff -rq base-repo fixed-repo`
  immediately on the untouched claim and treat every file it names as off-limits
  for "this is our primary bug."

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

- [ ] HARD RULE FIRST: run `diff -rq base-repo fixed-repo` on the untouched claim
      before anything else. Any bug already present there is off-limits as our
      primary task — pick an independent workflow and author our own Base break +
      Fixed repair from scratch. See "HARD RULE" section above.
- [ ] Before choosing the defect, actively look for an aliasing/reference bug first
      (shared array/object object-identity mistake) — task_0447's strongest anchor and
      currently missing from our own playbook until now.
- [ ] Difficulty check, concretely (task_0327 failed this: 5/15 solves, too easy):
      for EACH planned fix, ask "if an agent finds this one spot, can it pattern-match
      the rest?" If every fix is an independently-findable one-liner (flip a sign,
      swap a threshold, delete a duplicated string, swap a data literal) with no
      dependency between them, the task is too easy even with 5+ of them. Prefer ONE
      root cause whose fix is small but whose correct location requires tracing a
      value across multiple call sites/files (task_0447's `[...arr]` fix, or a shared
      tracking variable read inconsistently in 3+ places) over several parallel
      shallow bugs, however numerous.
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
- [ ] Package: exclude ONLY `instruction-images/`, `node_modules/`, `test-results/`,
      `.git/`, `.DS_Store` — these are the confirmed-safe exclusions. Do NOT exclude
      any other file that ships inside `base-repo/`/`fixed-repo/` in the original
      template, even if it looks like generated/junk data (e.g. a
      `USER_FEEDBACK_IMAGES/` folder of binary screenshots). task_0463 got "Archive
      rejected: binary repository files cannot be deleted" from excluding exactly
      such a folder — Sand's Change check compares against the original template and
      treats a missing tracked binary file as a disallowed deletion, not a smaller
      archive. When in doubt, only exclude things WE generated locally (symlinks,
      local node_modules, local test-results) — never something that came with the
      template's base-repo/fixed-repo as-is. Verify with `tar -tzf | rg` before
      calling it done; confirm `.sand-workspace.json` snapshot ID is current, not stale.
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
**Status:** APPROVED (confirmed by user 2026-09-10). Full pattern breakdown is in the
APPROVED-TASK TEMPLATE section above — this entry is just the pointer/status. This is
now our one confirmed ground-truth example of what actually clears every gate.

### task_0327 — Bowling spare calculator (oil-offset redesign)
**Status:** REJECTED (too easy, 5/15) → HARDENED, repackaged 2026-09-10, not yet
resubmitted. Difficulty run that triggered the rejection: 15 runs, solved 5 times
(runs 2, 3, 11, 12, 14). Ceiling rule for a 15-run series is at most 3 solves; 5/15
blew past it. At least 1 solve happened (qualifies on the floor), so the failure was
purely on the ceiling side — solved too consistently, not an edge case.

**Hardening applied (2026-09-10):** added a 6th defect on top of the original 5 —
`findKeyPin()`'s tie-break was hand-agnostic (always picked the lower pin number on a
genuine distance tie, e.g. pins 4/6 both at distance 3). Real bowling physics says a
right-handed bowler's hook naturally favors the pin further right (`PIN_BOARDS` more
positive), left-handed favors further left — consistent with the app's existing
`ADJUSTMENTS_RIGHT`/`ADJUSTMENTS_LEFT` mirroring. Base kept the ascending-order-only
tie-break; Fixed made it hand-aware. Verified live in-browser: base always returns
Pin 4 for a 4/6 tie regardless of hand; fixed correctly returns Pin 6 (right) / Pin 4
(left). Deliberately used pins 4/6 (no dedicated preset button — must be manually
constructed by clearing the deck and re-enabling 4 and 6) rather than the obvious 7-10
tie, so the bug can't be stumbled into by clicking preset buttons and comparing
screenshots; an agent must understand `PIN_DISTANCE` groupings and construct the
triggering scenario itself. Instruction wording describes the symptom ("the app
doesn't take which hand you bowl with into account when two pins are equally close")
without naming ties, distance, or specific pin numbers.

**Scope decision — kept all 6 defects, did not trim:** per corrected scoring-mechanics
reasoning (see SCORING MECHANICS section above), a run only counts as solved when
ALL F2P tests pass in one attempt. More required bugs raises the bar under
all-or-nothing scoring; it doesn't dilute it. The real lever was bug *shape*, not
count — so the fix was adding one bug that requires genuine tracing (cause: hand-
unaware tie-break several lines removed from any single symptom; effect: 6+ cascading
UI outputs) on top of the existing 5 shallow ones, not removing the shallow ones.

**Result after hardening:** 9 F2P + 5 P2P = 14 tests (was 7 F2P + 5 P2P = 12). Verified
via official `test.sh` wrapper: Fixed → `reward: 1` (9/9 F2P, 5/5 P2P). Base →
`reward: 0` (0/9 F2P, 5/5 P2P). Repackaged at archive root, verified clean.

**Second difficulty run (hardened version), reported 2026-09-10: STILL TOO EASY.**
10 runs, 3 solved (runs 3, 6, 9), 1 skipped (run 5). Ceiling for a 10-run series is
at most 2 solves; 3/10 exceeds it. At least 1 solve happened (floor met), so again
a ceiling-side failure — the added tie-break bug did not raise difficulty enough.

**Open concern, not yet resolved as of this entry:** the same investigation that
found task_0463's bugs were manufactured (not native to the template) also applies
here — checked `git show` on task_0327's first commit and confirmed the ORIGINAL
template only ever planted two bugs (duplicate degree symbol, WET/HEAVY oil label
mismatch); the hand-aware tie-break and Greek Church preset fix were both invented
by reading code and using judgment, the same pattern that caused task_0463's three
"too similar" rejections. task_0327 has not yet been rejected for similarity (only
for difficulty, twice), but given the same manufacturing pattern is present, a
future similarity rejection is a real risk on top of the difficulty problem.

**Decision (per user, 2026-09-10): do not strip anything.** Keep all existing
defects (genuine + manufactured) as-is; apply the "verify native bugs first" rule
to future tasks rather than retroactively fixing this one. Instead, add ONE more
genuinely new bug/fix pair, deliberately harder, to push difficulty down past the
2/10 ceiling.

**Third addition (2026-09-10): preset-highlight staleness — genuinely
new feature + deliberate bug, not a "found" defect this time.** After the
manufacturing-risk discussion, explicitly built this as: pick a feature, plant a
real broken implementation in base, write the correct fix in fixed — not "read
code, decide something looks wrong." Feature: the preset button highlight only
ever gets set once, at the moment `loadPreset()` runs (`highlightPreset(name)`
called there and nowhere else). It never re-syncs afterward, so manually toggling
a pin, undoing, redoing, or resetting all leave a stale preset button highlighted
even though the pin layout has since diverged from — or, after undo, might again
exactly match — that preset. Verified live: base leaves the highlight permanently
stuck once set; fixed correctly clears it on any pin change and correctly restores
it if undo lands back on an exact preset match (via a genuine `PRESETS`-membership
recheck, not a blunt "always clear"). This was a deliberately built bug/fix pair,
not a discovery — done this way per explicit instruction to plant new bugs rather
than keep hunting for hidden pre-existing ones now that the app's easy real
candidates are exhausted.

**Result:** 15 F2P + 5 P2P = 20 tests (was 9 F2P + 5 P2P = 14), plus a genuinely
new split-detection feature/fix pair added the same session (see below) contributing
3 of those new F2P tests, with the preset-highlight fix contributing 3 more.
Verified via official `test.sh` wrapper: Fixed → `reward: 1` (15/15 F2P, 5/5 P2P).
Base → `reward: 0` (0/15 F2P, 5/5 P2P). Repackaged, archive clean, resubmitted with
snapshot ID `expert-work-ca819051-68df-4ad1-ad56-f94f10e925e5`.

**REJECTED (2026-09-10): "too similar to a task already in our corpus."** This is
the SAME rejection type task_0463 hit three times, now hitting task_0327 for the
first time, immediately after adding the split-detection + preset-highlight
defects on top of the existing 6. Strong signal this is the same underlying issue
as task_0463: this whole app/template (`task_0327` — bowling spare calculator) is
likely already represented in the corpus by a prior submission (possibly the
original pre-session version, or someone else's), and stacking more bugs onto the
same base/fixed pairing does not read as different enough to Originality check —
same conclusion the task_0463 investigation reached. Mid-session, user redirected
away from further bug-hunting (see below) toward deliberately self-authoring a
new bug pair per the platform's own written guidance ("go into the base repo and
add bugs, then write the matching fixes in the fixed repo" — confirmed as the
correct workflow, not a deviation), but ran out of claim-window time before that
was completed. **Not yet resolved — this task needs either a self-authored new
bug/fix pair (in progress, stopped mid-design on an undo-history off-by-one
candidate) or release, the same fork task_0463 faced.**

**Also added same session — split-detection correctness (new feature):**
`getScenarioName()`'s "Split" label used only a left/right board-position
heuristic, missing the two real bowling conditions for a split (head pin down,
AND the remaining pins form more than one physically-disconnected cluster via a
verified pin-adjacency graph, not just "on different sides"). Confirmed real gaps
in the app's existing logic against known cases: pins [1,2,4,6] (head pin
standing) was wrongly called a split; pins [2,7] (Baby Split, both on the same
side) was wrongly NOT called a split. Algorithm verified against 10 known real
split/non-split cases before implementing. Added `PIN_ADJACENCY` + connected-
component check (`isSingleCluster`) to fixed-repo; base-repo's original shallow
left/right check is the deliberate broken counterpart.

**Why, in retrospect:** every individual fix was a shallow, independently-findable
one-liner once the agent located the right spot — flip a sign in one conditional
(hand mirroring), change one threshold check (HEAVY vs WET), delete one duplicated
string fragment (the extra °), swap one data literal (Greek Church preset). None of
the 5 fixes actually depended on each other or required tracing a value across
multiple call sites/files the way task_0447's aliasing bug did. A frontier agent that
finds any ONE of the five by grepping the instruction's keywords can pattern-match
the rest quickly, because they're all similarly-shaped "isolated wrong constant/
condition" bugs, not one root cause with several dependent symptoms.

**Packaging issue (resolved, unrelated to the difficulty rejection):**
`.sand-workspace.json` appeared "missing" to the platform, traced to archive
structure — the task contents were nested one level inside a nonstandard
`(4)`-suffixed folder instead of sitting at the archive root. Repackaged with
everything at archive root; Structure check passed after that fix.

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

**No rejection reason recorded yet on the hardened resubmission** — nothing new to
fold into the checklist. Will update as soon as a new difficulty result comes back.

### task_0463 — Doodle Punch (route-check reliability workflow)
**Status:** packaged 2026-09-10, not yet submitted. Built on a ChatGPT-authored first
pass that I reviewed, fixed, and hardened rather than wrote from scratch.

**Hard-rule compliance confirmed first:** ran `diff -rq base-repo fixed-repo` on the
template before accepting this as our task. Confirmed it touches only `state.js`
(1 line: a `RouteFeedback.reset()` call on level load) and `main.js`'s route-drawing/
collision-preview path — entirely independent from the template's own pre-existing
`resumeLvl`/`syncHud`/`badgeReserve` level-progression bug family, which stays
untouched and off-limits per the hard rule.

**The defect:** the on-screen "route card" that tells the player whether their drawn
punch path is safe only checked the LAST 2 POINTS of the path against obstacles
(`path.slice(-2)`), not the full route — so a path that crossed a crate early and
ended in open space read as "CLEAR ROUTE." Releasing that falsely-cleared route then
hit a second, correct, strict check inside `launch()` and got rejected anyway,
producing the confusing "it said Clear but rejected me" symptom the instruction
describes. Also only ran once on release, not live during drawing. Fix: check the
full smoothed route (`PathSys.smooth(path)`) on every pointer move, not just the
tail at release.

**Same anchor shape as our best examples:** fail site (a wrongly-green status card)
is disconnected from root cause (a slice bound several calls away), same category as
task_0447's array aliasing and task_0327's hand-unaware tie-break.

**What I found and fixed on review, before packaging:**
- broken.png was WRONG — it showed an idle "DRAW A ROUTE" state with a static line,
  not the actual bug (the mislabeled "CLEAR ROUTE" state). Retook both screenshots:
  same crossing-route scenario in base (shows the line crossing the crate with a
  green "CLEAR ROUTE" card — captured by calling `RouteFeedback.preview()` manually
  mid-drag so the drawn line stays visible instead of being cleared by the punch
  animation) and fixed (same scenario, correctly red "BLOCKED ROUTE" mid-draw,
  before release). Verified pixel-identical scenario/line in both, only the card
  differs — strong, unambiguous evidence pair.
- Test suite was exactly at the 8-test floor (2 P2P + 6 F2P) with no safety margin.
  Added 2 more genuine F2P tests: a route that goes OVER the crate (not just avoiding
  it) reports clear (protects against a fix that just always says "blocked"); and a
  punch the game rejects as blocked genuinely still crosses the plank at time of
  rejection (protects against a fix that only changes the card's wording without
  fixing the underlying detection). Final: 8 F2P + 2 P2P = 10 tests.

**Verified via official `test.sh` wrapper:** Fixed → `reward: 1` (8/8 F2P, 2/2 P2P).
Base → `reward: 0` (0/8 F2P, 2/2 P2P). Packaged as
`task_0463-doodle-punch-route-check.tar.gz`, archive root structure, verified clean.

**REJECTED (2026-09-10): "too similar to a task already in our corpus."** Received
before reaching a difficulty run, so this is an Originality-check-style rejection, not
a difficulty one. Per platform rules this is a hard stop — rewording instruction.md or
VERIFIER_EXPLANATION.md will NOT fix it. Requires a substantially different bug or
scenario, not a polish pass on the same route-checker defect.

**Response to rejection (2026-09-10):** rather than replace the route-checker workflow,
added a second, genuinely independent bug on top of it — user's call, on the reasoning
that two unrelated workflows combined is a materially different task shape than either
alone, not just a bigger version of the flagged one.

**Investigation before picking the new bug:** read every untouched file first
(`levels.js`, `boxer.js`, `audio.js`, `collision.js`, `path.js`) rather than guessing.
Found and RULED OUT two false leads by simulating them before proposing: (1) moving
planks' bob range appeared to risk crossing the guaranteed-clear path at runtime, but
simulating all 40 levels' plank ranges showed the existing clamp logic already
prevents this — zero violations, not a real bug; (2) `Collide.gloveHitsRed()` uses
bare `W`/`H` instead of passed parameters, looked like a scoping bug, but it's a
non-module global-scope script so `W`/`H` genuinely resolve — a style smell, not a
defect. Lesson: verify every candidate live/via simulation before committing to it,
even when the code "looks" wrong.

**The real bug, found in `state.js`'s `pause()`:** the resume branch always set
`state = ST.DRAW` unconditionally, regardless of what state was active when paused.
Pausing mid-punch (`ST.PUNCH`) and resuming left `punchT`, `rawPath`, and
`smoothPath` all stale — the old punch's line stayed drawn on screen, disconnected
and uncleaned, while the game claimed to be in a fresh "draw a route" state.
Confirmed live via Playwright before and after the fix. Fix: track `pausedFrom`;
if resuming from a punch interruption, call `loadLevel(this.lvl)` for a genuine
clean reset (consistent with how retry/next/goToLevel1 already work), otherwise
just flip back to `ST.DRAW` as before.

**Result:** 10 F2P + 4 P2P = 14 tests (up from 8 F2P + 2 P2P = 10). One test
originally written as F2P (`resuming ... leaves the game in a genuinely fresh
drawing state`) turned out to pass on base too during verification — its symptoms
(state/isDrawing/route-text) were never actually broken, only punchT and the path
arrays were. Relabeled to P2P rather than deleting it; added a second explicit P2P
for ordinary (non-punch-interrupted) pause/resume to protect that it doesn't
accidentally reset the level.

Verified via official `test.sh` wrapper: Fixed → `reward: 1` (10/10 F2P, 4/4 P2P).
Base → `reward: 0` (0/10 F2P, 4/4 P2P). Added a second broken/target screenshot pair
(`broken-pause.png`/`target-pause.png`) showing the disconnected stale line vs. a
clean reset. Repackaged as `task_0463-doodle-punch-route-check.tar.gz`, verified
clean including `USER_FEEDBACK_IMAGES/` preserved.

Per user direction, re-led the instruction/verifier/lead images with the pause/resume
bug (route-checker demoted to secondary paragraph, `broken.png`/`target.png` swapped
to the pause/resume screenshots, route-checker pair kept on disk as
`broken-route.png`/`target-route.png`). Resubmitted.

**REJECTED AGAIN (2026-09-10): same "too similar to a task already in our corpus"
message, even after adding pause/resume and re-leading with it.** This is the
important signal: the one thing held constant across BOTH submissions is the
route-checker workflow and its underlying app/repo. Everything else changed
(a new bug added, then the framing/lead was flipped) and neither changed the
verdict. Strong evidence the collision is with the route-checker workflow itself
(or possibly this exact `base-repo`/`fixed-repo` pairing generally), not with
"how the task is described." Layering more bugs onto the same repo, or reordering
which bug leads the narrative, does not change what's in the archive's Base/Fixed
diff enough to read as a different task to the Originality check.

**Decision going forward (per user, 2026-09-10): change totally.** Not another
incremental addition. Options to actually try next: (a) drop the route-checker
fix from Fixed entirely — keep pause/resume as the ONLY defect, so the archive's
Base/Fixed diff no longer contains the flagged workflow at all; or (b) abandon this
`base-repo`/`fixed-repo` pairing/claim altogether and pick a different app entirely.
Given two rejections already point at the same code area, (a) is the more targeted
first move — test it before concluding the whole app/repo is burned.

**Executed option (a), 2026-09-10.** Fully removed the route-checker fix from
`fixed-repo`: `main.js` reverted to be byte-identical to `base-repo/js/main.js`
(no `RouteFeedback.preview()` full-route fix, no live-drawing update, no
`reset()` method — all gone), and the dead `window.RouteFeedback?.reset()` call
was stripped from `state.js`. Confirmed via `diff -rq base-repo fixed-repo` that
the ONLY remaining difference anywhere in the archive is `state.js`'s pause/resume
fix — genuinely zero trace of the flagged workflow left in Base or Fixed.

Rewrote the test suite from scratch around pause/resume alone. The old suite only
had 2 genuine F2P angles for this bug once route-checker tests were stripped —
short of the 6 F2P floor. Found and verified 5 more real distinguishing angles by
testing live against both repos before writing each one (not assumed): interrupting
at a late `punchT` vs. a near-zero `punchT` (both genuinely reset differently
proven, not just "should probably work" — early-interrupt at punchT:0.01 left
punchT at 0.01 on base, correctly reset to 0 on fixed); the plank positions get
regenerated to a fresh valid layout instead of keeping a deliberately-corrupted
in-flight position (verified by mutating a plank to x:0.99,y:0.99 before pausing
and confirming base kept it while fixed regenerated); both boxers reset to their
canonical level-start positions (same corruption-then-check technique); and
pausing/resuming twice in a row stays clean, not just on the first resume. Ruled
out two candidate tests that looked plausible but weren't actually distinguishing
(fail-overlay timeout is state-guarded so it's a no-op either way; drawing a new
route post-resume always worked on both repos since input handling itself was
never broken, only leftover state) — verified before writing, not after.

**Final result:** 7 F2P + 3 P2P = 10 tests, all genuinely distinguishing (verified
live against both repos, not assumed). instruction.md and VERIFIER_EXPLANATION.md
rewritten with zero route-checker language anywhere. Removed the now-unused
`broken-route.png`/`target-route.png` from disk. Verified via official `test.sh`
wrapper: Fixed → `reward: 1` (7/7 F2P, 3/3 P2P). Base → `reward: 0` (0/7 F2P,
3/3 P2P). Repackaged as `task_0463-doodle-punch-route-check.tar.gz`. Not yet
resubmitted — this is the first fully-clean attempt with no trace of the
originally-flagged workflow anywhere in the archive.

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

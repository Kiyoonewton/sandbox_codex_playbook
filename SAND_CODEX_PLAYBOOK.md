You are helping me complete a Project Sand expert task.

Your job is to take the task from initial inspection through implementation, verification, screenshots, packaging, and final submission readiness.

Do not rush into fixing code immediately.

The goal is not merely to make Fixed pass tests. The task must also survive:

- Intake checks
- Originality check
- Structure check
- Build
- Change check
- Writing check
- Verification review
- Package check
- Baseline test run
- Solution test run
- Difficulty calibration
- Human review
- Final processing

Work systematically and keep the task legitimate, observable, testable, and sufficiently challenging.

TIME TARGET
Aim to finish the task in 45–60 minutes.

Use this rough time budget:
0–5 min: understand task
5–12 min: reproduce and inspect architecture/state
12–15 min: difficulty decision
15–25 min: define the final connected behavior/workflow
25–35 min: implement Fixed
35–45 min: write/adjust tests
45–50 min: instruction review
50–55 min: screenshots
55–60 min: verifier + package preflight

If the task looks fundamentally too easy after 15 minutes and there are no legitimate related state interactions, tell me before investing heavily.

GENERAL RULES

1. BASE AND FIXED

Base repo must remain the broken/reference implementation.

Fixed repo must contain the solution.

Do not accidentally copy the complete Fixed implementation into Base.

Changes to Base should only be made if Project Sand requires a specific task setup or if the base needs legitimate preparation for the task.

Before completing:

- Base must exhibit the requested bug.
- Fixed must resolve it.
- F2P tests must fail on Base for the intended reasons.
- F2P tests must pass on Fixed.
- P2P tests must pass on Fixed.
- Existing application functionality should not regress.

2. FIRST INSPECTION

Before editing anything:

Read:

- task instructions
- instruction.md / instructions.md
- relevant application files
- existing verifier tests
- state management
- persistence/storage
- initialization/bootstrap code
- event handlers
- undo/redo/history logic if present
- rendering/status synchronization
- screenshot assets
- package/workspace metadata

Run the Base application.

Reproduce the original bug manually.

Then inspect Fixed if a provided Fixed implementation already exists.

Do not rely only on the issue description.

Understand the actual state transitions that cause the bug.

3. DIFFICULTY MUST BE CONSIDERED EARLY

This is critical.

Do not wait until submission to think about difficulty.

At approximately minute 12–15, evaluate whether the task is likely too easy for frontier coding agents.

A task is likely too easy when:

- each symptom maps directly to one obvious function
- fixes are one-line guards
- multiple bugs are independent
- the instruction gives away exactly where each issue is
- tests each check one isolated property
- a solver can grep each symptom and patch them separately
- no state transitions or interactions need to be understood

Do NOT artificially increase difficulty by:

- hiding requirements
- writing trick tests
- making tests depend on implementation details
- introducing unrelated bugs
- requiring arbitrary code style
- using flaky timing
- making obscure selectors
- withholding expected behavior

Instead, look for REAL connected application behavior.

Good difficulty comes from workflows involving several real pieces of the system, such as:

- state + rendering
- state + persistence
- initialization + persisted data
- UI controls + status display
- history + undo/redo
- loading + zoom/layout state
- custom configuration + reload
- active/inactive state + derived counts
- persistence + subsequent actions
- multiple state transitions that must stay synchronized

Prefer a natural workflow like:

configure A
→ change B
→ add C
→ reload
→ verify A/B/C restored
→ perform D
→ undo D
→ verify UI, status, and persisted state remain consistent

over six isolated tasks such as:
fix A
fix B
fix C
fix D
fix E
fix F

The difficulty must come from understanding the application's behavior, not from test tricks.

4. TASK SCOPE

After inspecting the bug, look for related bugs only within the same feature/state system.

Do not expand the task randomly.

Any additional behavior must satisfy all of these:

- Base genuinely exhibits the issue.
- It is observable in the application.
- It belongs naturally to the original feature.
- Fixed can legitimately resolve it.
- The instruction clearly asks for it.
- The verifier can test it behaviorally.

If a behavior exists identically in Base and Fixed and is unrelated to the task, do not add it casually.

5. DEFINE 1–3 CONNECTED USER SCENARIOS

Before implementation, define the final task as preferably 1–3 meaningful user workflows.

Avoid a long checklist of tiny independent defects.

Each scenario should describe what a real user does and what should remain synchronized.

Example structure:

Scenario 1:
Empty state behavior remains stable when controls are used.

Scenario 2:
Configuration survives reload and the rendered UI agrees with persisted state.

Scenario 3:
Undo/redo restores all relevant visible and derived state consistently.

Tests should eventually follow those workflows.

6. INSTRUCTION.MD

Write the user-facing instruction.md for this project.

Critical rules:

- Write it as a real user describing problems they ran into.
- Focus only on symptoms and the expected behavior.
- Use natural, connected scenarios (like a short story of what happened).
- Do NOT mention any file names, function names, class names, or implementation details.
- Do NOT give the solver hints about how to fix anything.
- Do NOT write it like a QA checklist or bullet list of requirements (unless a short numbered list of scenarios is clearer).
- Include every behavior that is tested by the F2P tests.
- Do not invent hidden requirements that are not in the tests.

Structure the instruction like this example style:

1. Fit button on an empty screen
   When nothing is loaded yet and I press the Fit button, the zoom readout suddenly changes to a much smaller value. Since there's no content on screen to scale, it shouldn't pretend to scale anything. I expect pressing Fit on an empty screen to leave the zoom level completely unchanged.

2. Empty-state controls staying consistent
   While nothing is loaded, using the Zoom In or Zoom Out controls still changes the zoom percentage readout instead of holding steady. If you then go ahead and load a URL, that preview inherits the modified zoom rather than starting fresh at 100%. Additionally, turning off a breakpoint while empty updates the list visually, but the active viewport count fails to update alongside it. I expect controls to remain inactive or locked at default on an empty canvas, new URLs to always open at 100% zoom, and toggles to immediately sync the viewport count.

3. Saved and restored state staying consistent
   I ran into a chain of persistence and undo bugs while managing breakpoints and URLs. After adding a custom breakpoint, disabling another, and reloading the page, the custom breakpoint vanishes from the list and the active count falls out of sync. Furthermore, if you load a URL and then hit undo, the preview reverts to a blank screen, but the old URL lingers in the status bar. I expect saved breakpoint configurations and counts to persist correctly across reloads—meaning the breakpoint I disabled should still be disabled after reload, the custom breakpoint should still exist, and the active viewport count should agree with the restored configuration—and undoing a URL load should completely clear both the preview and status bar back to a clean state.

Now write the full instruction.md in exactly this style, covering all the behaviors from the F2P tests.

7. IMPLEMENTATION

Only after the behavior is understood should you modify Fixed.

Make the smallest coherent fix that solves the complete workflow.

Do not over-engineer.

Check all state synchronization paths involved, including when relevant:

- initialization
- loading persisted state
- rendering after persisted state is restored
- UI event handlers
- derived counts
- status bar
- zoom/layout display
- URL display
- saveToStorage
- loadFromStorage
- undo stack
- redo stack
- reset/empty state
- page reload

When changing state, ensure all dependent UI pieces are updated.

When restoring state, ensure restoration happens before rendering derived UI if appropriate.

8. TEST DESIGN

P2P tests protect general application functionality.

F2P tests prove the task was fixed.

Do not remove valid existing P2P coverage just to make the task easier.

For F2P:

- test observable behavior
- interact with the real UI
- avoid implementation-specific assertions
- avoid importing application internals
- avoid reading private JS variables directly when the UI can show the result
- test state transitions in sequence
- use reliable selectors
- avoid unnecessary sleeps
- assert after each important transition where useful

Prefer compound behavior tests when the task is stateful.

Example:

boot app
→ add custom breakpoint
→ disable default breakpoint
→ assert count
→ reload
→ assert custom breakpoint remains
→ assert disabled breakpoint remains disabled
→ assert count matches restored configuration
→ load URL
→ perform action
→ undo
→ assert preview/status/config remain synchronized

Do not turn one workflow into six completely independent tests unless there is a good reason.

Tests must match the instruction exactly.

No hidden verifier behavior.

9. BASELINE TESTING

Run the verifier against Base.

Expected:

- P2P should generally pass.
- Relevant F2P should fail.

Record exactly which F2P fail.

If an F2P unexpectedly passes on Base:

- determine whether the test is weak
- determine whether Base actually exhibits the bug
- determine whether the requirement is legitimate

Do not accept a test merely because Fixed passes it.

A useful F2P must distinguish Base from Fixed.

10. FIXED TESTING

Run the exact verifier against Fixed.

All expected tests must pass.

Verify manually as well.

Do not rely solely on Playwright.

Manually perform the main workflow from beginning to end.

After success, also check normal application behavior outside the bug path.

11. SCREENSHOTS — USER CAPTURE REQUIRED

Do not assume you can add or register Project Sand's required screenshots yourself.

When the task implementation and tests are stable, determine the strongest user-visible behavior to demonstrate with the broken and target screenshots.

Prefer a behavior with a large, obvious visual difference. Avoid screenshot pairs where the only difference is a small number, character, label, or other subtle change.

Then STOP and ask me to capture the screenshots manually in Project Sand.

Give me exact step-by-step instructions separately for each screenshot.

For the BROKEN screenshot, tell me:

- exactly where to go in Project Sand
- whether to open Base or another preview
- every action to perform in order
- what state the application should be in before capture
- what visible bug I should confirm
- what part of the UI must be visible
- when to click Project Sand's broken screenshot capture/control

Example format:

BROKEN SCREENSHOT

1. Open the Base preview in Project Sand.
2. [exact action]
3. [exact action]
4. Confirm that [specific broken behavior] is visible.
5. Make sure [important UI elements] are visible on screen.
6. Use Project Sand's screenshot control to capture/replace broken.png.
7. Tell me when it is done.

After I confirm the broken screenshot is captured, give me the TARGET screenshot instructions:

TARGET SCREENSHOT

1. Open the Fixed preview in Project Sand.
2. Perform the exact equivalent workflow used for Base.
3. Confirm that [specific corrected behavior] is visible.
4. Keep approximately the same browser/window size and application position as the broken screenshot.
5. Make sure [important UI elements] are visible.
6. Use Project Sand's screenshot control to capture/replace target.png.
7. Tell me when it is done.

Do not ask me to decide what behavior should be photographed. You should inspect the task and choose the strongest screenshot scenario yourself.

The broken and target screenshots should represent the same point in the same workflow whenever possible so the difference is easy for a reviewer to understand.

Before asking me to capture them, explicitly check:

- Is the difference clearly visible?
- Does it demonstrate a behavior actually requested by instruction.md?
- Does Base show the broken behavior?
- Does Fixed show the corrected behavior?
- Is the difference substantial enough to understand without comparing tiny text?

If the proposed screenshot would be too subtle, choose a stronger state from the task before giving me capture instructions.

Do not create extra instruction-image files unless the task explicitly requires them.

After I confirm both screenshots are captured, verify that the task should contain only the Project Sand-managed screenshot assets expected for submission, normally:

instruction-images/
broken.png
target.png

Also verify that instruction.md references the runtime paths expected by Sand, normally:

/app/problem_assets/broken.png
/app/problem_assets/target.png

Do not replace those paths with vscode-resource URLs or local filesystem URLs.

12. CHANGE HYGIENE

Before packaging, inspect git/file differences.

Every changed file should have a reason.

Avoid:

- debugging files
- temporary screenshots
- logs
- node_modules
- test-results
- playwright-report
- .DS_Store
- AppleDouble .\_\* files
- unrelated package changes
- accidental generated files

Review Base vs Fixed differences.

Ensure task-specific fixes are in Fixed.

13. VERIFIER HARNESS

Do not delete the normal reference test harness.

Preserve files such as:
reference/tests/lib/
reference/tests/parser.py
reference/tests/playwright.config.js
reference/tests/repo_test_manifest.sha256
reference/tests/run_script.sh
reference/tests/test.sh
reference/tests/<task>.spec.js

Only modify files necessary for the task.

Check that run_script.sh invokes the correct test spec.

Run the verifier exactly the way Sand will run it when possible.

14. PACKAGE METADATA

Preserve the current Sand workspace metadata.

Do not reuse an archive from an older claim.

The workspace snapshot/workingSnapshotId must belong to the current active claim.

If Sand says:
"Archive was downloaded from a previous claim"

stop and download/use the latest working copy rather than patching an old archive.

15. MAC ARCHIVE HYGIENE

When packaging on macOS, avoid AppleDouble files.

Use COPYFILE_DISABLE=1.

Example:

COPYFILE_DISABLE=1 tar \
 --exclude='.DS_Store' \
 --exclude='node_modules' \
 --exclude='\*/node_modules' \
 --exclude='./package.json' \
 --exclude='./package-lock.json' \
 --exclude='test-results' \
 --exclude='test-result' \
 --exclude='playwright-report' \
 -czf ../TASK-workspace.tar.gz .

After packaging, inspect the tar contents.

Confirm there are no:
.\_\*
.DS_Store
node_modules
test-results
playwright-report
unexpected root package files
temporary assets

16. STRUCTURE CHECK

Before submission confirm:

- expected Base repo exists
- expected Fixed repo exists
- instruction file exists
- reference tests exist
- screenshot files are correct
- workspace metadata exists
- no files are missing
- no unexpected directories were introduced

17. WRITING CHECK

Review instruction.md but do not rewrite it into AI-generated prose.

Flag:

- overly formal language
- repetitive "Expected behavior" sections
- implementation hints
- wording that sounds generated
- contradictions
- requirements that tests do not cover
- tests that instruction does not mention

Ask me to rewrite any suspicious parts in my own words.

18. SCREENSHOT CHECK

Explicitly compare broken.png and target.png.

Ask:
"Would a reviewer immediately see what changed without reading tiny text?"

If no, retake screenshots before submitting.

19. DIFFICULTY PREFLIGHT

Before packaging, perform a final difficulty assessment.

Imagine a frontier coding model receives:

- instruction
- repository
- screenshots

Ask:

Can it solve this by:

- grepping one phrase?
- changing one obvious function?
- adding a simple early return?
- making several independent one-line fixes?

If yes, difficulty is probably weak.

Stronger tasks usually require tracing:

- more than one module
- state dependencies
- initialization order
- persistence behavior
- history behavior
- rendering synchronization
- multiple sequential actions

But the task still needs to be solvable.

Difficulty is not obscurity.

20. PRE-SUBMISSION REPORT

Before telling me to submit, provide a compact report like:

STRUCTURE: PASS/FAIL
BUILD BASE: PASS/FAIL
BUILD FIXED: PASS/FAIL
BASELINE F2P: X/Y fail as expected
FIXED F2P: X/Y pass
FIXED P2P: X/Y pass
INSTRUCTION: PASS/WARN
SCREENSHOT DIFFERENCE: PASS/WARN/FAIL
PACKAGE HYGIENE: PASS/FAIL
DIFFICULTY: LOW/MEDIUM/HIGH
SUBMISSION READY: YES/NO

If any important item is FAIL, do not recommend submission.

21. WHEN TO STOP AND ASK ME

Stop and ask me before proceeding if:

- instruction.md needs new human-written requirements
- the task appears too easy and needs legitimate scope expansion
- screenshots need to be captured using Sand's UI
- current workspace claim metadata appears stale
- there is uncertainty whether a proposed extra behavior is actually a Base bug
- a new requirement would materially change task scope

Otherwise continue autonomously.

22. DO NOT WASTE TIME

Do not spend 30 minutes polishing wording before implementation works.

Do not repeatedly rerun the same test without a reason.

Do not inspect every file in the repository.

Start with the files directly involved in the observed workflow, then expand only when necessary.

Do not fix unrelated bugs just because you notice them.

Do not add extra tests merely to increase the test count.

Do not repeatedly repackage until all implementation/testing/screenshot work is finalized.

23. WORK ORDER

Always follow this order:

Understand
→ Reproduce
→ Trace state
→ Difficulty check
→ Define connected scenario
→ Confirm scope
→ Implement Fixed
→ Manual verification
→ Build F2P workflow tests
→ Base verification
→ Fixed verification
→ Human instruction review
→ Screenshots
→ Diff/structure/package check
→ Difficulty preflight
→ Final report
→ Submit

The key principle:

A good Sand task is not "many bugs."

A good Sand task is a legitimate user-visible problem where the correct solution requires understanding how several parts of the application interact, and the verifier proves that complete behavior through realistic user workflows.

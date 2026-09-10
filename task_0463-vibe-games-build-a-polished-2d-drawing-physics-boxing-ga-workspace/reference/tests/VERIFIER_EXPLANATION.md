# Verifier explanation

The baseline checks confirm the drawing game still starts with its canvas and controls, and that pausing during ordinary drawing, with no punch in flight, leaves the current level exactly as it was.

The pause checks interrupt a punch mid-flight, at different points in its travel, and then resume. They confirm resuming clears the punch's progress completely regardless of how far it had gotten, clears the old drawn line, regenerates the crates instead of leaving them at their in-flight positions, and puts both boxers back at their level-start spots. A repeated check confirms pausing and resuming twice in a row stays just as clean as the first time.

Together they prove that pausing never leaves a punch half-finished on screen.

# Verifier explanation

The baseline checks confirm the simulation still loads and its layout fits the viewport.

The route checks cover two connected problems: the plasma torus geometry and the readouts that describe it. They confirm the eight nested flux surfaces are genuinely spaced apart from the center outward rather than several collapsing onto the same radius, and that the q=1/2/3 surface readouts match what the on-axis and edge q values actually produce. They also confirm the rational-surface markers stay cheaper to draw than the flux surfaces and field lines around them, that the on-screen triangle count drops for a scene with fewer visible rings instead of staying uniformly heavy, and that the triangle count genuinely grows as more toroidal circuits are added instead of staying flat.

Together they prove the torus a user actually sees is geometrically honest, and that the numbers describing it agree with the plasma configuration currently selected.

# Verifier explanation

The baseline checks confirm that the normal drawing game still starts with its canvas and Retry control, and that the route card remains fully visible after Retry.

The route checks draw both clear and blocked paths across a predictable crate. They verify that the card reports a clear path before release, detects a collision anywhere along the complete drawn route rather than only at its end, and prevents a blocked route from turning into a failed punch. The remaining checks ensure the card does not carry an old warning through Retry, the next round, or the start of a replacement drawing.

Together these checks prove that the visible route advice reflects the live path and its lifecycle. They deliberately do not prescribe how the game smooths a path or how the route card is styled beyond its observable status and visibility.

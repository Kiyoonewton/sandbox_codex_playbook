# Verifier explanation

The P2P checks make sure the game still opens into a playable canvas and that starting a normal first round reveals usable controls without creating page overflow.

The F2P checks follow level progression as a player sees it. They confirm that a clean round records the real best reached, Continue moves forward by one round after a start-over, Retry reloads the active round, and the celebration text names the round just cleared. They also verify that replaying a lower round does not erase an earlier best, and that the Retry and Pause controls remain fully visible inside the game window.

These checks do not require a particular level generator or drawing algorithm. They only require the game to keep its active round, highest completed round, messages, and controls consistent during normal play.

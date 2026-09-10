# The route checker gives me bad advice

I use the route card at the bottom of the game to decide whether a punch path is safe. It is not trustworthy. A line can pass straight through an earlier crate, end in open space, and still be labelled **Clear route**. Releasing that supposedly safe line then makes the game reject the punch.

The card also reacts too late. While I am still drawing, I need it to warn me as soon as the route becomes blocked. If a route is blocked, releasing it should leave me in drawing mode so I can correct it, rather than starting a failed punch. After I retry or move into the next round, the card must return to **Draw a route** instead of carrying the previous route's warning forward.

Keep the sketchy boxing game and drawing controls, but make the route card a clear, reliable part of planning a punch. It must remain readable inside the game window and use distinct states for drawing, clear, and blocked routes.

The broken game currently looks like this:

<img src="/app/problem_assets/broken.png" alt="a route marked clear despite crossing a crate" width="900" />

The corrected game should look like this:

<img src="/app/problem_assets/target.png" alt="a blocked route reported before release" width="900" />

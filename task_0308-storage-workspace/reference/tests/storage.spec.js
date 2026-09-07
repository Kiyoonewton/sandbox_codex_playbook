const { test, expect } = require("@playwright/test");
const APP_URL = process.env.APP_URL;
const PREAMBLE =
  "(() => {\n  // --- deterministic Math.random (mulberry32, fixed seed) ---\n  let _s = (1337) >>> 0;\n  Math.random = function () {\n    _s |= 0; _s = (_s + 0x6D2B79F5) | 0;\n    let t = Math.imul(_s ^ (_s >>> 15), 1 | _s);\n    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;\n    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;\n  };\n  // --- settle animations/transitions so a captured frame is stable & identical across builds ---\n  const css = '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;'\n            + 'transition-duration:0s!important;transition-delay:0s!important;'\n            + 'caret-color:transparent!important;scroll-behavior:auto!important}';\n  const inject = () => {\n    const root = document.head || document.documentElement;\n    if (!root) return;\n    const st = document.createElement('style');\n    st.setAttribute('data-sand-determinism', '1');\n    st.textContent = css;\n    root.appendChild(st);\n  };\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', inject);\n  } else {\n    inject();\n  }\n})();";
const READY_HOOKS = ["__FlatBoxGeo", "__KR"];
async function boot(page) {
  await page.addInitScript(PREAMBLE);
  await page.goto(APP_URL, { waitUntil: "networkidle", timeout: 60000 });
  try {
    await page.waitForFunction(
      (hs) =>
        document.readyState === "complete" &&
        hs.every((h) => typeof window[h] !== "undefined"),
      READY_HOOKS,
      { timeout: 15000 },
    );
  } catch (e) {}
  await page.waitForTimeout(800);
}
test("[P2P] game boots and renders content", async ({ page }) => {
  await boot(page);
  const has = await page.evaluate(
    () => !!document.body && document.body.children.length > 0,
  );
  expect(has).toBe(true);
});
test("[P2P] core game state is present", async ({ page }) => {
  await boot(page);
  const ok = await page.evaluate(
    () => typeof window.__FlatBoxGeo !== "undefined",
  );
  expect(ok).toBe(true);
});
test("[P2P] no layout overflow (UI fits the viewport)", async ({ page }) => {
  await boot(page);
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(2);
});
test("[F2P] The first order of the shift is accepted, but later hand-ins of exactly the dish an order asks for are slapped down as a", async ({
  page,
}) => {
  await boot(page);
  const v = await page.evaluate(async () => {
    const K = window.__KR,
      G = K.G;
    K.startGame();
    const sets = [
      ["L", "T"],
      ["B", "P"],
      ["B", "P", "C"],
      ["B", "P", "C", "T"],
      ["B", "P", "C", "T", "L"],
      ["P", "C", "L"],
    ];
    const n = 2 + (crypto.getRandomValues(new Uint32Array(1))[0] % 4);
    let ok = true;
    for (let i = 0; i < n; i++) {
      const prev = G.tickets.slice();
      K.spawnTicket();
      const t = G.tickets.find((x) => prev.indexOf(x) < 0);
      t.recipe = {
        name: "W" + i,
        comps: sets[i % sets.length].slice(),
        tier: 0,
      };
      const before = G.score;
      K.chef.carrying = { kind: "plate", comps: t.recipe.comps.slice() };
      K.setCarriedVisual();
      K.chef.pos.set(K.serveSt.x, 0, K.serveSt.z);
      K.chef.actionCd = 0;
      K.chef.chopping = null;
      K.tryAction();
      if (G.served !== i + 1 || G.score <= before || K.chef.carrying !== null)
        ok = false;
    }
    return ok && G.lives === 3 && G.tickets.length === 0;
  });
  expect(v).toEqual(true);
});
test("[F2P] After parking a dish on the plate counter and taking it back a few times, the counter looks completely empty and still g", async ({
  page,
}) => {
  await boot(page);
  const v = await page.evaluate(async () => {
    const K = window.__KR;
    K.startGame();
    const n = 1 + (crypto.getRandomValues(new Uint32Array(1))[0] % 3);
    K.chef.pos.set(K.plateSt.x, 0, K.plateSt.z);
    const act = () => {
      K.chef.actionCd = 0;
      K.chef.chopping = null;
      K.tryAction();
    };
    for (let i = 0; i < n; i++) {
      for (let k = 0; k < 2; k++) {
        K.chef.carrying = { kind: "plate", comps: ["B", "P"] };
        K.setCarriedVisual();
        act();
        K.chef.carrying = { kind: "plate", comps: [] };
        K.setCarriedVisual();
        act();
      }
    }
    const empty = K.plateSt.plates.every((p) => p === null);
    K.chef.carrying = { kind: "plate", comps: ["B", "C"] };
    K.setCarriedVisual();
    act();
    return (
      empty &&
      K.chef.carrying === null &&
      K.plateSt.plates.filter((p) => p && p.comps.length === 2).length === 1
    );
  });
  expect(v).toEqual(true);
});
test("[F2P] Once a few plates have been parked and taken back, a prepared ingredient can no longer be dropped on the visibly empty p", async ({
  page,
}) => {
  await boot(page);
  const v = await page.evaluate(async () => {
    const K = window.__KR;
    K.startGame();
    const n = 1 + (crypto.getRandomValues(new Uint32Array(1))[0] % 3);
    K.chef.pos.set(K.plateSt.x, 0, K.plateSt.z);
    const act = () => {
      K.chef.actionCd = 0;
      K.chef.chopping = null;
      K.tryAction();
    };
    for (let i = 0; i < n; i++) {
      for (let k = 0; k < 2; k++) {
        K.chef.carrying = { kind: "plate", comps: ["B", "P"] };
        K.setCarriedVisual();
        act();
        K.chef.carrying = { kind: "plate", comps: [] };
        K.setCarriedVisual();
        act();
      }
    }
    K.chef.carrying = { kind: "ing", type: "bun", state: "raw" };
    K.setCarriedVisual();
    act();
    return (
      K.chef.carrying === null &&
      K.plateSt.plates.some((p) => p && p.comps.join("") === "B")
    );
  });
  expect(v).toEqual(true);
});
test("[F2P] With several orders up on the rail, the little badge showing what the chef is carrying jumps sideways and runs off the e", async ({
  page,
}) => {
  await boot(page);
  const v = await page.evaluate(async () => {
    const K = window.__KR;
    K.startGame();
    K.spawnTicket();
    K.spawnTicket();
    K.spawnTicket();
    K.chef.carrying = { kind: "plate", comps: ["B", "P"] };
    K.setCarriedVisual();
    const chip = document.getElementById("heldChip");
    const b = chip.getBoundingClientRect();
    return b.width > 1 && b.left >= -1 && b.right <= window.innerWidth + 1;
  });
  expect(v).toEqual(true);
});
test("[F2P] Chef cannot walk through the PLATE station", async ({ page }) => {
  await boot(page);

  const blocked = await page.evaluate(() => {
    const K = window.__KR;
    K.startGame();

    const radius = 0.42;
    const targetX = K.plateSt.x;
    const targetZ = K.plateSt.z + K.plateSt.d / 2 - 0.15;

    const [, blockedZ] = window.collide(targetX, targetZ, radius);
    const plateFrontEdge = K.plateSt.z + K.plateSt.d / 2;

    return blockedZ >= plateFrontEdge + radius - 0.01;
  });

  expect(blocked).toBe(true);
});
test("[F2P] Retrieving a dish from PLATE removes its old visual", async ({
  page,
}) => {
  await boot(page);

  const noGhost = await page.evaluate(() => {
    const K = window.__KR;
    K.startGame();

    K.chef.pos.set(K.plateSt.x, 0, K.plateSt.z + 1.7);

    const act = () => {
      K.chef.actionCd = 0;
      K.chef.chopping = null;
      K.tryAction();
    };

    K.chef.carrying = {
      kind: "plate",
      comps: ["L", "T"],
    };

    K.setCarriedVisual();
    act();

    const stored = K.plateSt.plates.find(Boolean);
    const storedMesh = stored && stored.mesh;

    K.chef.carrying = null;
    K.setCarriedVisual();
    act();

    return (
      K.chef.carrying &&
      K.chef.carrying.kind === "plate" &&
      K.plateSt.plates.every((p) => p === null) &&
      !!storedMesh &&
      storedMesh.parent === null
    );
  });

  expect(noGhost).toBe(true);
});
test("[F2P] Starting a new game clears dishes left on the PLATE station", async ({
  page,
}) => {
  await boot(page);

  const resetCleanly = await page.evaluate(() => {
    const K = window.__KR;
    K.startGame();

    K.chef.pos.set(K.plateSt.x, 0, K.plateSt.z + 1.7);

    const act = () => {
      K.chef.actionCd = 0;
      K.chef.chopping = null;
      K.tryAction();
    };

    K.chef.carrying = {
      kind: "plate",
      comps: ["B", "P"],
    };

    K.setCarriedVisual();
    act();

    const stored = K.plateSt.plates.find(Boolean);
    const oldMesh = stored && stored.mesh;

    K.startGame();

    return (
      K.plateSt.plates.every((p) => p === null) &&
      !!oldMesh &&
      oldMesh.parent === null
    );
  });

  expect(resetCleanly).toBe(true);
});
test("[F2P] Ticket patience adapts to recipe complexity and queue position", async ({
  page,
}) => {
  await boot(page);

  const result = await page.evaluate(() => {
    const K = window.__KR;
    const G = K.G;

    K.startGame();

    // Clear naturally spawned tickets so this test controls the queue.
    G.tickets.length = 0;

    const addTicket = (name, comps, total = 60) => {
      const ticket = {
        id: ++G.ticketSeq,
        recipe: { name, comps: comps.slice(), tier: 0 },
        timeTotal: total,
        timeLeft: total,
        warned: false,
        beeped: 999,
      };

      G.tickets.push(ticket);
      return ticket;
    };

    const first = addTicket("FIRST", ["L", "T"], 60);
    const second = addTicket("SECOND", ["B", "P"], 60);
    const third = addTicket("THIRD", ["B", "P", "C", "L", "T"], 60);

    // Let all 3 tickets age for the same amount of game time.
    K.updateTickets(10);

    const firstLoss = 60 - first.timeLeft;
    const secondLoss = 60 - second.timeLeft;
    const thirdLoss = 60 - third.timeLeft;

    const queueProtectionWorks =
      firstLoss > secondLoss &&
      secondLoss > thirdLoss &&
      Math.abs(firstLoss - 10) < 0.01;

    // Remove the front ticket.
    G.tickets.splice(G.tickets.indexOf(first), 1);

    const secondBefore = second.timeLeft;

    // It should now be the front ticket and therefore drain at full speed.
    K.updateTickets(4);

    const promotedLoss = secondBefore - second.timeLeft;

    const promotionWorks = Math.abs(promotedLoss - 4) < 0.01;

    return {
      queueProtectionWorks,
      promotionWorks,
      firstLoss,
      secondLoss,
      thirdLoss,
      promotedLoss,
    };
  });

  expect(result.queueProtectionWorks).toBe(true);
  expect(result.promotionWorks).toBe(true);
});
test("[F2P] newly spawned ticket remains serveable after the active queue changes", async ({
  page,
}) => {
  await boot(page);

  const result = await page.evaluate(() => {
    const K = window.__KR;
    const G = K.G;

    K.startGame();
    G.tickets.length = 0;

    const makeTicket = (name, comps) => ({
      id: ++G.ticketSeq,
      recipe: {
        name,
        comps: comps.slice(),
        tier: 0,
      },
      timeTotal: 60,
      timeLeft: 60,
      warned: false,
      beeped: 999,
    });

    const salad = makeTicket("SALAD", ["L", "T"]);
    const blt = makeTicket("B.L.T.", ["B", "L", "T"]);

    G.tickets.push(salad, blt);

    const serve = (comps) => {
      K.chef.carrying = {
        kind: "plate",
        comps: comps.slice(),
      };

      K.setCarriedVisual();

      K.chef.pos.set(K.serveSt.x, 0, K.serveSt.z);
      K.chef.actionCd = 0;
      K.chef.chopping = null;

      K.tryAction();
    };

    // First valid serve builds/uses the ticket lookup.
    serve(["L", "T"]);

    const afterFirstServe = {
      served: G.served,
      lives: G.lives,
      names: G.tickets.map((t) => t.recipe.name),
    };

    // Add a new ticket so queue length returns to 2.
    const burger = makeTicket("BURGER", ["B", "P"]);
    G.tickets.push(burger);

    const beforeSecondServe = {
      served: G.served,
      lives: G.lives,
      names: G.tickets.map((t) => t.recipe.name),
    };

    // Serve the newly added valid ticket.
    serve(["B", "P"]);

    const afterSecondServe = {
      served: G.served,
      lives: G.lives,
      names: G.tickets.map((t) => t.recipe.name),
      burgerStillExists: G.tickets.some((t) => t.id === burger.id),
    };

    return {
      afterFirstServe,
      beforeSecondServe,
      afterSecondServe,
    };
  });

  console.log(result);

  expect(result.afterFirstServe.names).toEqual(["B.L.T."]);
  expect(result.beforeSecondServe.names).toEqual(["B.L.T.", "BURGER"]);

  // Investigation target:
  // the newly added valid Burger should be recognized and served.
  expect(result.afterSecondServe.served).toBe(
    result.beforeSecondServe.served + 1,
  );

  expect(result.afterSecondServe.lives).toBe(result.beforeSecondServe.lives);

  expect(result.afterSecondServe.burgerStillExists).toBe(false);
});

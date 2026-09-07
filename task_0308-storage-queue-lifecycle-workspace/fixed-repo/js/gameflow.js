// ---------------- game flow ----------------
function resetRun() {
  G.score = 0;
  G.lives = 3;
  G.served = 0;
  G.mistakes = 0;
  G.elapsed = 0;
  G.tickets = [];
  G.spawnTimer = 1.2;
  chef.pos.set(0, 0, 2.2);
  chef.facing = 0;
  chef.carrying = null;
  chef.chopping = null;
  chef.knife.visible = false;
  chef.actionCd = 0;
  setCarriedVisual();
  clearBoard();
  plateSt.plates.forEach((pl) => {
    if (pl && pl.mesh) {
      scene.remove(pl.mesh);
      pl.mesh = null;
    }
  });

  plateSt.plates = [null, null];
  refreshPlateCounterVisual();
  stoveSt.burners.forEach((b) => {
    b.item = null;
    b.done = false;
    b.prog = 0;
    b.burned = false;
    refreshBurnerVisual(b);
  });
  renderTicketRail();
  updateLivesHUD();
  updateScoreHUD();
  el("popups").innerHTML = "";
}
function startGame() {
  AudioSys.ensure();
  resetRun();
  G.state = "playing";
  showScreen(null);
  el("hud").classList.add("on");
  el("touchUI").classList.add("playing");
  showBanner("SHIFT START!");
}
function togglePause() {
  if (G.state === "playing") {
    G.state = "paused";
    el("pauseScore").textContent = fmt(G.score);
    showScreen("pauseScreen");
  } else if (G.state === "paused") {
    G.state = "playing";
    showScreen(null);
  }
}
function gameOver() {
  G.state = "over";
  const isBest = G.score > G.best;
  if (isBest) {
    G.best = G.score;
    localStorage.setItem("kr_best", String(G.best));
  }
  el("overScore").textContent = fmt(G.score);
  el("overOrders").textContent = G.served;
  el("overBest").textContent = fmt(G.best);
  el("newBest").classList.toggle("on", isBest);
  if (isBest) {
    AudioSys.newbest();
    confettiBurst(new THREE.Vector3(chef.pos.x, 1.6, chef.pos.z));
  }
  setTimeout(() => showScreen("overScreen"), isBest ? 500 : 250);
  el("hud").classList.remove("on");
  el("touchUI").classList.remove("playing");
}
function goHome() {
  G.state = "title";
  el("bestTitle").textContent = fmt(G.best);
  showScreen("titleScreen");
  el("hud").classList.remove("on");
  el("touchUI").classList.remove("playing");
}
function showScreen(id) {
  ["titleScreen", "pauseScreen", "overScreen"].forEach((s) =>
    el(s).classList.toggle("on", s === id),
  );
}
function showBanner(text) {
  const b = el("banner");
  b.textContent = text;
  b.classList.remove("show");
  void b.offsetWidth;
  b.classList.add("show");
}
el("playBtn").addEventListener("click", startGame);
el("againBtn").addEventListener("click", startGame);
el("resumeBtn").addEventListener("click", togglePause);
el("pauseBtn").addEventListener("click", togglePause);
el("pauseHomeBtn").addEventListener("click", goHome);
el("overHomeBtn").addEventListener("click", goHome);
el("bestTitle").textContent = fmt(G.best);

// ---------------- chef animation ----------------
function updateChef(dt, t) {
  // input vector
  let ix = 0,
    iz = 0;
  if (keys["KeyW"] || keys["ArrowUp"]) iz -= 1;
  if (keys["KeyS"] || keys["ArrowDown"]) iz += 1;
  if (keys["KeyA"] || keys["ArrowLeft"]) ix -= 1;
  if (keys["KeyD"] || keys["ArrowRight"]) ix += 1;
  if (joy.active) {
    ix += joy.dx;
    iz += joy.dz;
  }
  // click-to-move
  if (clickTarget) {
    const dx = clickTarget.x - chef.pos.x,
      dz = clickTarget.z - chef.pos.z;
    if (Math.hypot(dx, dz) > 0.25) {
      ix += dx;
      iz += dz;
    } else clickTarget = null;
  }
  const len = Math.hypot(ix, iz);
  chef.moving = len > 0.1 && G.state === "playing" && !chef.chopping;
  if (chef.moving) {
    ix /= Math.max(1, len);
    iz /= Math.max(1, len);
    // carrying anything (plate included) moves at FULL speed — no restriction
    const sp = chef.speed;
    let nx = chef.pos.x + ix * sp * dt,
      nz = chef.pos.z + iz * sp * dt;
    [nx, nz] = collide(nx, nz, 0.42);
    chef.pos.x = nx;
    chef.pos.z = nz;
    const targetFacing = Math.atan2(ix, iz);
    let df = targetFacing - chef.facing;
    while (df > Math.PI) df -= Math.PI * 2;
    while (df < -Math.PI) df += Math.PI * 2;
    chef.facing += df * Math.min(1, dt * 14);
    chef.walkPhase += dt * 11;
  } else {
    chef.walkPhase += dt * 2;
  }
  chef.root.position.set(chef.pos.x, 0, chef.pos.z);
  chef.root.rotation.y = chef.facing;

  // walk cycle
  const w = chef.walkPhase;
  const amp = chef.moving ? 0.7 : 0.04;
  chef.legL.rotation.x = Math.sin(w) * amp;
  chef.legR.rotation.x = Math.sin(w + Math.PI) * amp;
  chef.body.position.y = Math.abs(Math.sin(w)) * (chef.moving ? 0.07 : 0.02);
  // arms: ingredients ride in one hand (free swing); a plate is held in front but
  // still jogs along with the run instead of freezing the chef stiff
  const holdingPlate = chef.carrying && chef.carrying.kind === "plate";
  const carryPose = holdingPlate
    ? chef.moving
      ? 0.55
      : 1
    : chef.carrying
      ? 0.85
      : 0;
  // carrying: arms pitch forward and converge so both hands support the item
  const carryPitch = holdingPlate ? -1.28 : -0.75;
  const carryIn = holdingPlate ? 0.55 : 0.34;
  chef.armL.rotation.x = lerp(
    Math.sin(w + Math.PI) * amp * 0.8,
    carryPitch,
    carryPose,
  );
  chef.armR.rotation.x = lerp(Math.sin(w) * amp * 0.8, carryPitch, carryPose);
  chef.armL.rotation.z = lerp(0.14, carryIn, carryPose);
  chef.armR.rotation.z = lerp(-0.14, -carryIn, carryPose);
  // idle head/hat bob
  chef.headG.rotation.z = Math.sin(t * 1.8) * 0.04;
  chef.hatG.position.y = 0.17 + Math.sin(t * 2.2) * 0.012;
  // chopping
  if (chef.chopping) {
    const ct = chef.chopping.t;
    chef.armR.rotation.x = -1.6 + Math.abs(Math.sin(ct * 14)) * 0.9;
    chef.armR.rotation.z = -0.2;
  }
  // squash & stretch (squash pivots at the feet, not mid-air)
  chef.squash = Math.max(0, chef.squash - dt * 3.2);
  const s = chef.squash;
  chef.root.scale.set(1 + s * 0.55, 1 - s * 0.5, 1 + s * 0.55);
  // nope shake
  chef.bump = Math.max(0, chef.bump - dt * 5);
  chef.root.position.x += Math.sin(chef.bump * 38) * 0.09 * chef.bump;
  chef.actionCd = Math.max(0, chef.actionCd - dt);
  // carried item gentle bob
  chef.carry.position.y =
    0.94 +
    Math.sin(t * 4) * 0.02 +
    (chef.moving ? Math.abs(Math.sin(w)) * 0.04 : 0);
}

// ---------------- chopping / cooking updates ----------------
let chopParticleT = 0,
  steamT = 0;
function updateStations(dt, t) {
  // chopping progress
  if (chef.chopping && boardItem) {
    chef.chopping.t += dt;
    chopParticleT -= dt;
    if (chef.chopping.t % 0.28 < dt) AudioSys.chop();
    if (chopParticleT <= 0) {
      chopParticleT = 0.22;
      const col =
        boardItem.type === "tomato"
          ? 0xe8354a
          : boardItem.type === "lettuce"
            ? 0x38b96a
            : 0xffc93a;
      spawnParticles(new THREE.Vector3(chopSt.x, 1.35, chopSt.z), {
        n: 4,
        colors: [col, 0xfff3cf],
        spread: 1.6,
        up: 1.3,
        size: 0.8,
      });
    }
    if (chef.chopping.t >= CHOP_TIME) {
      chef.chopping = null;
      chef.knife.visible = false;
      boardItem.state = "chopped";
      updateBoardVisual();
      AudioSys.chopDone();
      chefSquash(0.25);
      spawnParticles(new THREE.Vector3(chopSt.x, 1.35, chopSt.z), {
        n: 10,
        colors: [0x38b96a, 0xfff3cf],
        up: 1.6,
      });
    }
  }
  // stove cooking
  let anyCooking = false;
  stoveSt.burners.forEach((b) => {
    if (!b.item) {
      b.ring.material.emissiveIntensity = lerp(
        b.ring.material.emissiveIntensity,
        0,
        dt * 6,
      );
      return;
    }
    b.prog += dt;
    if (!b.done) {
      anyCooking = true;
      b.ring.material.emissiveIntensity = 0.9 + Math.sin(t * 9) * 0.25;
      if (b.prog >= COOK_TIME) {
        b.done = true;
        AudioSys.ding();
        spawnParticles(stationTopPos(stoveSt), {
          n: 8,
          colors: [0xffd93b, 0xfff3cf],
          up: 1.6,
        });
        refreshBurnerVisual(b);
      }
    } else {
      b.ring.material.emissiveIntensity = lerp(
        b.ring.material.emissiveIntensity,
        0.25,
        dt * 4,
      );
      if (b.prog >= BURN_TIME && !b.burned) {
        b.burned = true;
        spawnParticles(stationTopPos(stoveSt), {
          n: 12,
          colors: [0x4a4038, 0x777777],
          up: 1.2,
        });
        AudioSys.fail();
      }
      if (b.burned && Math.random() < dt * 3) {
        spawnSteam(
          new THREE.Vector3(stoveSt.x + b.ring.position.x, 1.6, stoveSt.z),
        );
      }
    }
    // steam while cooking
    if (anyCooking || b.done) {
      steamT -= dt;
      if (steamT <= 0) {
        steamT = 0.3;
        spawnSteam(
          new THREE.Vector3(stoveSt.x + b.ring.position.x, 1.55, stoveSt.z),
        );
      }
    }
  });
  // stove warm glow light when active
  stoveSt.light.intensity = lerp(
    stoveSt.light.intensity,
    anyCooking ? 0.9 : nearestValid() === stoveSt ? 0.55 : 0,
    dt * 5,
  );

  // utensil swing
  swingers.forEach((u) => {
    u.rotation.x = Math.sin(t * 0.9 + u.userData.swingPhase) * 0.08;
  });
  // bell scale relax
  serveSt.bell.scale.lerp(new THREE.Vector3(1, 1, 1), dt * 6);
}

// which station would be valid right now (for glow)
function nearestValid() {
  const s = nearestStation();
  if (!s) return null;
  const c = chef.carrying;
  if (s.ing) return !c ? s : null;
  switch (s.id) {
    case "chop":
      if (!c && boardItem) return s;
      if (c && c.kind === "plate" && boardItem && boardItem.state === "chopped")
        return s;
      if (c && c.kind === "ing" && !boardItem) {
        const info = Object.values(COMP_INFO).find((i) => i.base === c.type);
        if (c.state === "raw" && info && info.need === "chop") return s;
      }
      return null;
    case "stove":
      if (
        c &&
        c.kind === "ing" &&
        c.type === "patty" &&
        c.state === "raw" &&
        stoveSt.burners.some((b) => !b.item)
      )
        return s;
      if (!c && stoveSt.burners.some((b) => b.item && (b.done || b.burned)))
        return s;
      if (
        c &&
        c.kind === "plate" &&
        stoveSt.burners.some((b) => b.item && b.done)
      )
        return s;
      return null;
    case "stack":
      return !c ? s : null;
    case "plate": {
      if (
        c &&
        c.kind === "ing" &&
        plateSt.plates.some((p) => p === null) &&
        plateReadyFor(c)
      )
        return s;
      if (
        c &&
        c.kind === "plate" &&
        c.comps.length > 0 &&
        plateSt.plates.some((p) => p === null)
      )
        return s;
      if (
        plateSt.plates.some((p) => p && p.comps.length > 0) &&
        (c ? c.kind === "plate" && c.comps.length === 0 : true)
      )
        return s;
      return null;
    }
    case "serve":
      return c && c.kind === "plate" && c.comps.length > 0 ? s : null;
    case "trash":
      return c ? s : null;
  }
  return null;
}
function updateGlows(dt, t) {
  const near = nearestStation();
  const valid = nearestValid();
  stations.forEach((s) => {
    let target = 0;
    if (s === valid) target = 0.34 + Math.sin(t * 6) * 0.1;
    else if (s === near) target = 0.12;
    s.glow.material.opacity = lerp(s.glow.material.opacity, target, dt * 10);
    if (s.light && s !== stoveSt)
      s.light.intensity = lerp(
        s.light.intensity,
        s === valid ? 0.7 : 0,
        dt * 8,
      );
  });
}

// ---------------- difficulty banners ----------------
let lastTier = 0;
function checkBanners() {
  const d = difficulty();
  if (d.tierMax > lastTier) {
    lastTier = d.tierMax;
    showBanner(
      pick(["GETTING BUSY!", "RUSH HOUR!", "HOT TICKETS!", "FULL HOUSE!"]),
    );
  }
}

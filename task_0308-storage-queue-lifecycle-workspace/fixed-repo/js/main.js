// ---------------- main loop ----------------
const clock = new THREE.Clock();
let titleOrbit = 0;
function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  if (G.state === "playing") {
    G.elapsed += dt;
    // ticket spawning
    G.spawnTimer -= dt;
    if (G.spawnTimer <= 0) {
      const d = difficulty();
      if (G.tickets.length === 0) {
        spawnTicket();
        G.spawnTimer = Math.min(3, d.spawnInterval * 0.4);
      } else {
        spawnTicket();
        G.spawnTimer = d.spawnInterval * rand(0.85, 1.15);
      }
    }
    updateTickets(dt);
    if (G.state !== "playing") {
      render(dt, t);
      return;
    } // game over triggered inside
    updateChef(dt, t);
    updateStations(dt, t);
    updateGlows(dt, t);
    checkBanners();
    updateScoreHUD();
  } else {
    // gentle idle animation on title / pause / over
    chef.body.position.y = Math.sin(t * 2) * 0.02;
    chef.headG.rotation.z = Math.sin(t * 1.8) * 0.04;
    if (G.state === "title") {
      chef.facing += (Math.sin(t * 0.4) * 0.5 - chef.facing) * dt * 2;
      chef.root.rotation.y = chef.facing;
    }
    updateStations(dt * 0.0, t); // still swing utensils etc with dt 0 effects? keep steam off
    swingers.forEach((u) => {
      u.rotation.x = Math.sin(t * 0.9 + u.userData.swingPhase) * 0.08;
    });
  }
  updateParticles(dt);
  render(dt, t);
}
function render(dt, t) {
  // camera: slight follow + shake
  const followX = G.state === "playing" ? chef.pos.x * 0.14 : 0;
  const followZ = G.state === "playing" ? chef.pos.z * 0.1 : 0;
  camera.position.x = lerp(camera.position.x, followX, dt * 3);
  camera.position.z = lerp(camera.position.z, 9.8 + followZ, dt * 3);
  shakeAmt = Math.max(0, shakeAmt - dt * 1.8);
  const sx = (Math.random() - 0.5) * shakeAmt * 0.5,
    sy = (Math.random() - 0.5) * shakeAmt * 0.4;
  camera.position.y = 13.2 + sy;
  camera.lookAt(followX + sx, 0, 0.7 + followZ);
  renderer.render(scene, camera);
}

// ---------------- boot ----------------
window.__KR = {
  G,
  chef,
  stations,
  spawnTicket,
  updateTickets,
  chopSt,
  stoveSt,
  plateSt,
  serveSt,
  stackSt,
  trashSt,
  tryAction,
  startGame,
  setCarriedVisual,
  get boardItem() {
    return boardItem;
  },
  scene,
  camera,
};
updateLivesHUD();
updateScoreHUD();
chef.root.position.set(0, 0, 2.2);
loop();

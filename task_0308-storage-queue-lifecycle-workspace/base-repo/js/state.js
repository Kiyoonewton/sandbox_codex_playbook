// ---------------- game state ----------------
const G={
  state:'title',       // title | playing | paused | over
  score:0, lives:3, served:0, mistakes:0,
  best:parseInt(localStorage.getItem('kr_best')||'0',10),
  elapsed:0, spawnTimer:0, tickets:[], ticketSeq:0,
  rngTick:0
};

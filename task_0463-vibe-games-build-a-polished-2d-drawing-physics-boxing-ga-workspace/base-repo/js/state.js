/* ============================================
   DOODLE PUNCH — State Management
   Infinite levels, game state machine, UI
   ============================================ */
const ST = { TITLE: 'title', DRAW: 'draw', PUNCH: 'punch', WIN: 'win', LOSE: 'lose', PAUSE: 'pause', VICTORY: 'victory' };

const GameState = {
  state: ST.TITLE,
  lvl: 1,
  maxLvl: +(localStorage.getItem('dpMax') || '1'),
  t: 0,
  lastTS: 0,
  shakeT: 0, shakeI: 0,
  planks: [],
  blueB: null, redB: null,
  rawPath: [], smoothPath: [], isDrawing: false,
  punchT: 0,
  currentHint: '',
  runLen: 0,
  resumeLvl: 0,

  loadLevel(n) {
    this.lvl = n;
    this.runLen++;
    this.resumeLvl = Math.max(this.resumeLvl, n);
    const data = LevelGen.generate(n);
    this.planks = data.planks.map(p => ({ ...p, baseX: p.x, baseY: p.y }));
    this.blueB = { ...data.blue };
    this.redB = { ...data.red };
    this.currentHint = data.hint;
    this.rawPath = [];
    this.smoothPath = [];
    this.punchT = 0;
    this.isDrawing = false;
    Particles.clear();
    this.state = ST.DRAW;
    this.syncHud();
  },

  badgeReserve() {
    const digits = String(Math.max(this.lvl, this.maxLvl)).length;
    return 84 + digits * 18 + (this.runLen > 1 ? 26 : 0);
  },

  syncHud() {
    const hb = document.getElementById('hudButtons');
    if (!hb) return;
    const reserve = this.badgeReserve();
    hb.style.right = (12 - reserve) + 'px';
    hb.style.top = (12 + (this.runLen > 1 ? 8 : 0)) + 'px';
  },

  commitBest() {
    const reached = this.runLen > 1 ? this.lvl - 1 : this.lvl;
    if (reached > this.maxLvl) {
      this.maxLvl = reached;
      localStorage.setItem('dpMax', this.maxLvl);
    }
    this.syncHud();
  },

  hideOvs() {
    ['pauseOverlay', 'levelCompleteOverlay', 'failOverlay', 'victoryOverlay']
      .forEach(id => document.getElementById(id).classList.add('hidden'));
  },

  start() {
    Audio.init();
    this.lvl = +(localStorage.getItem('dpMax') || '1');
    this.resumeLvl = 0;
    document.getElementById('titleScreen').classList.add('hidden');
    document.getElementById('hudButtons').classList.remove('hidden');
    this.loadLevel(this.lvl);
  },

  retry() {
    Audio.init();
    this.hideOvs();
    document.getElementById('hudButtons').classList.remove('hidden');
    this.loadLevel(Math.max(this.resumeLvl, this.lvl));
  },

  goToLevel1() {
    Audio.init();
    this.hideOvs();
    document.getElementById('hudButtons').classList.remove('hidden');
    this.lvl = 1;
    this.loadLevel(1);
  },

  next() {
    Audio.init();
    this.hideOvs();
    const from = Math.max(this.resumeLvl, this.lvl);
    this.loadLevel(from + 1);
    this.commitBest();
  },

  home() {
    this.hideOvs();
    document.getElementById('hudButtons').classList.add('hidden');
    document.getElementById('titleScreen').classList.remove('hidden');
    this.state = ST.TITLE;
    this.planks = [];
    this.blueB = null;
    this.redB = null;
    this.rawPath = [];
    this.smoothPath = [];
    Particles.clear();
  },

  pause() {
    Audio.init();
    if (this.state === ST.PAUSE) {
      this.state = ST.DRAW;
      this.hideOvs();
      document.getElementById('hudButtons').classList.remove('hidden');
    } else if (this.state === ST.DRAW || this.state === ST.PUNCH) {
      this.state = ST.PAUSE;
      this.hideOvs();
      document.getElementById('pauseOverlay').classList.remove('hidden');
    }
  },

  blocked(x, y, kind) {
    this.state = ST.LOSE;
    Audio.play('block');
    this.shakeT = 0.3;
    this.shakeI = 8;
    Particles.spawn(x, y, kind === 'miss' ? K.red : K.wood, 12, 3);
    const ft = document.getElementById('failText');
    ft.textContent = kind === 'miss' ? 'MISS!' : 'BLOCKED!';
    ft.style.color = kind === 'miss' ? K.red : K.wood;
    document.getElementById('failSub').textContent = kind === 'miss'
      ? 'Almost — try a different path!'
      : 'Back to Level 1 — one clean run!';
    this.resumeLvl = Math.max(this.resumeLvl, this.lvl);
    this.punchT = 1;
    this.syncHud();
    setTimeout(() => {
      if (this.state === ST.LOSE) {
        document.getElementById('failOverlay').classList.remove('hidden');
      }
    }, 520);
  },

  launch() {
    if (this.rawPath.length < 2) return;
    this.smoothPath = PathSys.smooth(this.rawPath);
    // STRICT: check entire drawn path vs current plank positions
    const pre = Collide.pathHitsAnyPlank(this.smoothPath, this.planks, this.t, W, H);
    if (pre.hit) {
      const last = this.rawPath[this.rawPath.length - 1];
      this.blocked(last.x, last.y, 'plank');
      return;
    }
    this.state = ST.PUNCH;
    this.punchT = 0;
    this.isDrawing = false;
    Audio.play('whoosh');
  },

  punchDone() {
    const end = PathSys.point(this.smoothPath, 1);
    if (Collide.gloveHitsRed(end.x, end.y, this.redB, SC)) {
      // WIN this level!
      this.state = ST.WIN;
      this.commitBest();
      Audio.play('hit');
      Audio.play('ding');
      this.shakeT = 0.4;
      this.shakeI = 12;
      Particles.spawn(this.redB.x * W, this.redB.y * H, K.yellow, 22, 5);
      Particles.spawn(this.redB.x * W, this.redB.y * H, K.blue, 16, 4);
      setTimeout(() => {
        if (this.state !== ST.WIN) return;
        document.getElementById('lcText').textContent = 'LEVEL ' + Math.max(this.resumeLvl, this.lvl) + ' CLEAR!';
        document.getElementById('levelCompleteOverlay').classList.remove('hidden');
        const btn = document.getElementById('btnNext');
        btn.textContent = 'NEXT LEVEL →';
        btn.onclick = () => this.next();
      }, 650);
    } else {
      this.blocked(end.x, end.y, 'miss');
    }
  }
};

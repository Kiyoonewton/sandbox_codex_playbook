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

  loadLevel(n) {
    this.lvl = n;
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
    window.RouteFeedback?.reset();
  },

  hideOvs() {
    ['pauseOverlay', 'levelCompleteOverlay', 'failOverlay', 'victoryOverlay']
      .forEach(id => document.getElementById(id).classList.add('hidden'));
  },

  start() {
    Audio.init();
    this.lvl = +(localStorage.getItem('dpMax') || '1');
    document.getElementById('titleScreen').classList.add('hidden');
    document.getElementById('hudButtons').classList.remove('hidden');
    window.RouteFeedback?.show();
    this.loadLevel(this.lvl);
  },

  retry() {
    Audio.init();
    this.hideOvs();
    document.getElementById('hudButtons').classList.remove('hidden');
    window.RouteFeedback?.show();
    this.loadLevel(this.lvl);
  },

  goToLevel1() {
    Audio.init();
    this.hideOvs();
    document.getElementById('hudButtons').classList.remove('hidden');
    window.RouteFeedback?.show();
    this.lvl = 1;
    this.loadLevel(1);
  },

  next() {
    Audio.init();
    this.hideOvs();
    window.RouteFeedback?.show();
    this.lvl++;
    if (this.lvl > this.maxLvl) {
      this.maxLvl = this.lvl;
      localStorage.setItem('dpMax', this.maxLvl);
    }
    this.loadLevel(this.lvl);
  },

  home() {
    this.hideOvs();
    document.getElementById('hudButtons').classList.add('hidden');
    window.RouteFeedback?.hide();
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

  launch() {
    if (this.rawPath.length < 2) return;
    this.smoothPath = PathSys.smooth(this.rawPath);
    // STRICT: check entire drawn path vs current plank positions
    const pre = Collide.pathHitsAnyPlank(this.smoothPath, this.planks, this.t, W, H);
    if (pre.hit) {
      this.state = ST.LOSE;
      Audio.play('block');
      this.shakeT = 0.3;
      this.shakeI = 8;
      Particles.spawn(
        this.rawPath[this.rawPath.length - 1].x,
        this.rawPath[this.rawPath.length - 1].y,
        K.wood, 12, 3
      );
      document.getElementById('failText').textContent = 'BLOCKED!';
      document.getElementById('failText').style.color = K.wood;
      document.getElementById('failSub').textContent = 'Back to Level 1 — one clean run!';
      setTimeout(() => {
        if (this.state === ST.LOSE) {
          document.getElementById('failOverlay').classList.remove('hidden');
        }
      }, 550);
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
      if (this.lvl >= this.maxLvl) {
        this.maxLvl = this.lvl;
        localStorage.setItem('dpMax', this.maxLvl);
      }
      Audio.play('hit');
      Audio.play('ding');
      this.shakeT = 0.4;
      this.shakeI = 12;
      Particles.spawn(this.redB.x * W, this.redB.y * H, K.yellow, 22, 5);
      Particles.spawn(this.redB.x * W, this.redB.y * H, K.blue, 16, 4);
      setTimeout(() => {
        if (this.state !== ST.WIN) return;
        document.getElementById('lcText').textContent = 'LEVEL ' + this.lvl + ' CLEAR!';
        document.getElementById('levelCompleteOverlay').classList.remove('hidden');
        const btn = document.getElementById('btnNext');
        btn.textContent = 'NEXT LEVEL →';
        btn.onclick = () => this.next();
      }, 650);
    } else {
      this.state = ST.LOSE;
      Audio.play('block');
      this.shakeT = 0.3;
      this.shakeI = 8;
      document.getElementById('failText').textContent = 'MISS!';
      document.getElementById('failText').style.color = K.red;
      document.getElementById('failSub').textContent = 'Almost — try a different path!';
      setTimeout(() => {
        if (this.state === ST.LOSE) {
          document.getElementById('failOverlay').classList.remove('hidden');
        }
      }, 550);
    }
  }
};

// ============================================================
// Environment Effects (Particles, Rain, Mist)
// ============================================================

export function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = Math.random() * 0.2 + 0.05;
      this.opacity = Math.random() * 0.3 + 0.1;
      this.type = Math.random() > 0.85 ? 'pollen' : Math.random() > 0.7 ? 'dust' : 'leaf';
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;
      if (this.y > h + 10 || this.x < -10 || this.x > w + 10) this.reset();
      if (this.y > h + 10) { this.y = -10; this.x = Math.random() * w; }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      if (this.type === 'pollen') {
        ctx.fillStyle = '#C8875F';
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === 'leaf') {
        ctx.fillStyle = '#1A8B6A';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 2, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#C8D4C0';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

export function initRain() {
  const rain = document.getElementById('env-rain');
  if (!rain) return;

  for (let i = 0; i < 40; i++) {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    drop.style.left = Math.random() * 100 + '%';
    drop.style.height = Math.random() * 80 + 40 + 'px';
    drop.style.animationDuration = (Math.random() * 1 + 1) + 's';
    drop.style.animationDelay = Math.random() * 3 + 's';
    rain.appendChild(drop);
  }

  function toggleRain() {
    rain.classList.add('active');
    setTimeout(() => rain.classList.remove('active'), 4000 + Math.random() * 6000);
    setTimeout(toggleRain, 15000 + Math.random() * 20000);
  }
  setTimeout(toggleRain, 3000);
}

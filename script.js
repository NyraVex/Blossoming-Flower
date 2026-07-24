onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);
};

onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);

  initSparkleCursor();
};

function initSparkleCursor() {
  const canvas = document.getElementById('sparkle-canvas');
  const cursorEl = document.getElementById('cursor');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let cw = 0, ch = 0;

  function resizeCanvas() {
    cw = window.innerWidth;
    ch = window.innerHeight;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);


  const sparkles = [];

  function spawnSparkles(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.5;
      sparkles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        life: 1,
        decay: Math.random() * 0.025 + 0.018,
        size: Math.random() * 5 + 2,
        hue: Math.floor(Math.random() * 80) + 250,
      });
    }
  }

  function drawSparkles() {
    ctx.clearRect(0, 0, cw, ch);

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];

      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.06;
      s.life -= s.decay;

      if (s.life <= 0) { sparkles.splice(i, 1); continue; }

      const radius = Math.max(0, s.size * s.life);
      if (radius === 0) { sparkles.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = Math.max(0, s.life);
      ctx.fillStyle = `hsl(${s.hue}, 100%, 78%)`;
      ctx.shadowColor = `hsl(${s.hue}, 100%, 70%)`;
      ctx.shadowBlur = radius * 3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function loop() {
    drawSparkles();
    requestAnimationFrame(loop);
  }
  loop();


  let lastX = -999, lastY = -999;

  function onMouseMove(e) {
    const x = e.clientX;
    const y = e.clientY;

    if (cursorEl) {
      cursorEl.style.left = x + 'px';
      cursorEl.style.top = y + 'px';
    }

    const dx = x - lastX, dy = y - lastY;
    if (dx * dx + dy * dy > 4) {
      spawnSparkles(x, y, 4);
      lastX = x; lastY = y;
    }
  }

  document.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('click', (e) => spawnSparkles(e.clientX, e.clientY, 18));
}
/* ============================================
   SAFEEK S · PORTFOLIO INTERACTIONS
   ============================================ */

// ---------- Year in footer ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Typewriter ----------
const roles = [
  'Senior Software Engineer',
  'Backend Architect',
  'Distributed Systems Engineer',
  'Real-Time Platform Builder',
  'Golang Specialist',
];

const typeEl = document.getElementById('typewriter');
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    typeEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typeEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 85);
}
typeLoop();

// ---------- Animated stat counters ----------
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const tick = () => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        return;
      }
      el.textContent = current;
      requestAnimationFrame(tick);
    };
    tick();
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach((el) => statObserver.observe(el));

// ---------- Reveal on scroll ----------
document.querySelectorAll(
  '.section, .project-card, .skill-card, .timeline-item, .contact-link'
).forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ============================================
// THEME SYSTEM
// ============================================
const body = document.body;
const themeBtns = document.querySelectorAll('.theme-btn');

// Default theme is aquarium. Switcher UI is hidden, but you can still change
// it by editing this default, or by opening DevTools and running:
//   localStorage.setItem('safeek-theme', 'space'); location.reload();
// Valid values: cyberpunk | space | glass | terminal | aquarium
let currentTheme = localStorage.getItem('safeek-theme') || 'aquarium';

function applyTheme(theme) {
  currentTheme = theme;
  body.dataset.theme = theme;
  localStorage.setItem('safeek-theme', theme);
  themeBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.setTheme === theme);
  });
  resetCanvasScene();
}

themeBtns.forEach((btn) => {
  btn.addEventListener('click', () => applyTheme(btn.dataset.setTheme));
});

// ============================================
// MOBILE HAMBURGER MENU
// ============================================
(function hamburger() {
  const toggle = document.querySelector('.nav-toggle');
  const list = document.querySelector('.nav-links');
  if (!toggle || !list) return;

  const setOpen = (open) => {
    toggle.classList.toggle('open', open);
    list.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setOpen(!list.classList.contains('open'));
  });

  // Close when a link is tapped
  list.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && list.classList.contains('open')) setOpen(false);
  });

  // Close if viewport grows back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && list.classList.contains('open')) setOpen(false);
  });
})();

// ============================================
// CANVAS BACKGROUND (theme-aware)
// ============================================
const canvas = document.getElementById('grid-bg');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let stars = [];
let orbs = [];
let rain = [];
let fish = [], bubbles = [], clouds = [], seaweed = [];
let mouseX = 0, mouseY = 0;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => {
  resize();
  resetCanvasScene();
});

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function resetCanvasScene() {
  particles = [];
  stars = [];
  orbs = [];
  rain = [];
  fish = [];
  bubbles = [];
  clouds = [];
  seaweed = [];

  if (currentTheme === 'cyberpunk') {
    const count = Math.min(60, Math.floor((width * height) / 30000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.4,
        hue: Math.random() > 0.5 ? 180 : 300,
      });
    }
  } else if (currentTheme === 'space') {
    const count = Math.min(220, Math.floor((width * height) / 8000));
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.05,
        driftY: (Math.random() - 0.5) * 0.05,
      });
    }
  } else if (currentTheme === 'glass') {
    const count = 8;
    for (let i = 0; i < count; i++) {
      orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 160 + 120,
        hue: [280, 310, 200, 260][i % 4],
      });
    }
  } else if (currentTheme === 'terminal') {
    const cols = Math.floor(width / 14);
    for (let i = 0; i < cols; i++) {
      rain.push({
        x: i * 14,
        y: Math.random() * -height,
        speed: Math.random() * 3 + 2,
        length: Math.floor(Math.random() * 20 + 5),
        chars: [],
      });
    }
  } else if (currentTheme === 'aquarium') {
    // clouds just below the fixed header (~80px), floating in the sky band
    const HEADER_OFFSET = 90;
    const cloudCount = 3;
    for (let i = 0; i < cloudCount; i++) {
      clouds.push({
        x: Math.random() * width,
        y: HEADER_OFFSET + Math.random() * 70,
        r: Math.random() * 30 + 40,
        vx: Math.random() * 0.15 + 0.05,
        alpha: Math.random() * 0.25 + 0.35,
      });
    }
    // seaweed anchored at bottom, various heights
    const seaweedCount = Math.max(6, Math.floor(width / 180));
    const seaweedColors = ['#065f46', '#047857', '#059669', '#10b981', '#065f46'];
    for (let i = 0; i < seaweedCount; i++) {
      const strands = 3 + Math.floor(Math.random() * 3);
      seaweed.push({
        x: (i / seaweedCount) * width + (Math.random() - 0.5) * 60,
        height: Math.random() * 140 + 80,
        color: seaweedColors[Math.floor(Math.random() * seaweedColors.length)],
        thickness: Math.random() * 3 + 2.5,
        phase: Math.random() * Math.PI * 2,
        swayAmount: Math.random() * 8 + 6,
        speed: Math.random() * 0.015 + 0.008,
        segments: strands,
      });
    }
    // fish swimming at various depths
    const fishCount = Math.min(8, Math.floor(width / 220));
    const fishColors = ['#fdba74', '#f97316', '#fbbf24', '#7dd3fc', '#a5f3fc', '#fca5a5'];
    for (let i = 0; i < fishCount; i++) {
      const dir = Math.random() > 0.5 ? 1 : -1;
      fish.push({
        x: Math.random() * width,
        y: height * 0.25 + Math.random() * height * 0.6,
        size: Math.random() * 8 + 8,
        speed: (Math.random() * 0.4 + 0.3) * dir,
        dir,
        color: fishColors[Math.floor(Math.random() * fishColors.length)],
        wiggle: Math.random() * Math.PI * 2,
      });
    }
    // bubbles rising
    for (let i = 0; i < 20; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: height + Math.random() * height,
        r: Math.random() * 3 + 1.5,
        speed: Math.random() * 0.8 + 0.5,
        drift: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.3,
      });
    }
  }
}

// ---------- draw functions per theme ----------
function drawCyberpunk() {
  const gridSize = 60;
  const offsetX = (mouseX - width / 2) * 0.02;
  const offsetY = (mouseY - height / 2) * 0.02;

  ctx.strokeStyle = 'rgba(0, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  for (let x = (offsetX % gridSize); x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = (offsetY % gridSize); y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, 0.7)`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `hsl(${p.hue}, 100%, 60%)`;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

let starT = 0;
function drawSpace() {
  starT += 0.016;
  const px = (mouseX - width / 2) * 0.015;
  const py = (mouseY - height / 2) * 0.015;

  stars.forEach((s) => {
    s.x += s.driftX;
    s.y += s.driftY;
    if (s.x < 0) s.x = width;
    if (s.x > width) s.x = 0;
    if (s.y < 0) s.y = height;
    if (s.y > height) s.y = 0;

    const twinkle = 0.5 + 0.5 * Math.sin(starT + s.twinkleOffset);
    const alpha = s.alpha * twinkle;

    ctx.beginPath();
    ctx.arc(s.x + px, s.y + py, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 230, 255, ${alpha})`;
    ctx.shadowBlur = s.r > 1 ? 4 : 0;
    ctx.shadowColor = 'rgba(168, 85, 247, 0.6)';
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Occasional shooting star
  if (Math.random() < 0.003) {
    const sx = Math.random() * width;
    const sy = Math.random() * height * 0.4;
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + 60, sy + 30);
    ctx.stroke();
  }
}

function drawGlass() {
  ctx.filter = 'blur(80px)';
  orbs.forEach((o) => {
    o.x += o.vx;
    o.y += o.vy;
    if (o.x < -o.r) o.x = width + o.r;
    if (o.x > width + o.r) o.x = -o.r;
    if (o.y < -o.r) o.y = height + o.r;
    if (o.y > height + o.r) o.y = -o.r;

    const grd = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
    grd.addColorStop(0, `hsla(${o.hue}, 80%, 60%, 0.5)`);
    grd.addColorStop(1, `hsla(${o.hue}, 80%, 60%, 0)`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.filter = 'none';
}

const rainChars = '01アカサタナハマヤラワ<>{}[]=+*#$%&/@!?';
function drawTerminal() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, width, height);
  ctx.font = '14px VT323, monospace';

  rain.forEach((col) => {
    for (let i = 0; i < col.length; i++) {
      const y = col.y - i * 16;
      if (y < 0 || y > height) continue;
      const char = rainChars[Math.floor(Math.random() * rainChars.length)];
      const alpha = 1 - i / col.length;
      ctx.fillStyle = i === 0
        ? `rgba(220, 255, 220, ${alpha})`
        : `rgba(0, 255, 0, ${alpha * 0.7})`;
      ctx.fillText(char, col.x, y);
    }
    col.y += col.speed;
    if (col.y - col.length * 16 > height) {
      col.y = Math.random() * -100;
      col.speed = Math.random() * 3 + 2;
    }
  });
}

let aquaT = 0;
function drawAquarium() {
  aquaT += 0.016;

  // Sun rays from top
  const rayGrad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
  rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = rayGrad;
  ctx.fillRect(0, 0, width, height * 0.5);

  // Seaweed swaying at the bottom (draw first so fish appear in front)
  seaweed.forEach((w) => {
    const segments = 12;
    ctx.strokeStyle = w.color;
    ctx.lineWidth = w.thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(w.x, height);
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const y = height - w.height * t;
      const sway = Math.sin(aquaT * w.speed * 60 + w.phase + t * 3) * w.swayAmount * t;
      ctx.lineTo(w.x + sway, y);
    }
    ctx.stroke();

    // A few leaf blades along the strand
    for (let leaf = 1; leaf < 4; leaf++) {
      const t = leaf / 4;
      const y = height - w.height * t;
      const sway = Math.sin(aquaT * w.speed * 60 + w.phase + t * 3) * w.swayAmount * t;
      const side = leaf % 2 === 0 ? 1 : -1;
      ctx.beginPath();
      ctx.ellipse(
        w.x + sway + side * 8,
        y,
        6, 3,
        side * 0.5 + Math.sin(aquaT + w.phase) * 0.2,
        0, Math.PI * 2
      );
      ctx.fillStyle = w.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  });

  // Clouds (soft white puffs)
  clouds.forEach((c) => {
    c.x += c.vx;
    if (c.x - c.r * 2 > width) c.x = -c.r * 2;
    ctx.fillStyle = `rgba(255, 255, 255, ${c.alpha})`;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.arc(c.x + c.r * 0.85, c.y + 4, c.r * 0.8, 0, Math.PI * 2);
    ctx.arc(c.x - c.r * 0.75, c.y + 6, c.r * 0.7, 0, Math.PI * 2);
    ctx.arc(c.x + c.r * 0.3, c.y - c.r * 0.5, c.r * 0.65, 0, Math.PI * 2);
    ctx.fill();
  });

  // Fish
  fish.forEach((f) => {
    f.x += f.speed;
    f.wiggle += 0.08;
    const wobble = Math.sin(f.wiggle) * 1.5;

    // wrap
    if (f.dir === 1 && f.x - f.size * 2 > width) f.x = -f.size * 2;
    if (f.dir === -1 && f.x + f.size * 2 < 0) f.x = width + f.size * 2;

    ctx.save();
    ctx.translate(f.x, f.y + wobble);
    if (f.dir === -1) ctx.scale(-1, 1);

    // Body
    ctx.fillStyle = f.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, f.size, f.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-f.size * 0.9, 0);
    ctx.lineTo(-f.size * 1.5, -f.size * 0.5);
    ctx.lineTo(-f.size * 1.5, f.size * 0.5);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = '#082f49';
    ctx.beginPath();
    ctx.arc(f.size * 0.45, -f.size * 0.12, f.size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(f.size * 0.48, -f.size * 0.14, f.size * 0.04, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });

  // Bubbles
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  bubbles.forEach((b) => {
    b.y -= b.speed;
    b.x += b.drift;
    if (b.y + b.r < 0) {
      b.y = height + Math.random() * 40;
      b.x = Math.random() * width;
    }
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.3})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 255, 255, ${b.alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    // little highlight
    ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.9})`;
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.4, b.y - b.r * 0.4, b.r * 0.25, 0, Math.PI * 2);
    ctx.fill();
  });
}

function animate() {
  if (currentTheme !== 'terminal') {
    ctx.clearRect(0, 0, width, height);
  }
  switch (currentTheme) {
    case 'space': drawSpace(); break;
    case 'glass': drawGlass(); break;
    case 'terminal': drawTerminal(); break;
    case 'aquarium': drawAquarium(); break;
    case 'cyberpunk':
    default: drawCyberpunk(); break;
  }
  requestAnimationFrame(animate);
}

// Kick off
applyTheme(currentTheme);
animate();

// ---------- Smooth nav highlight + brand smile tilt on scroll ----------
const navLinks = document.querySelectorAll('.nav-links a');
const sections = Array.from(document.querySelectorAll('section[id]'));
const navBrand = document.querySelector('.nav-brand');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 150;
  let active = sections[0]?.id;
  sections.forEach((s) => {
    if (s.offsetTop <= scrollY) active = s.id;
  });
  navLinks.forEach((link) => {
    link.style.color = link.getAttribute('href') === `#${active}` ? 'var(--neon-cyan)' : '';
    link.style.textShadow = link.getAttribute('href') === `#${active}` ? 'var(--glow-cyan)' : '';
  });

  // Brand smile tilts to horizontal once we've scrolled past the top
  if (navBrand) {
    navBrand.classList.toggle('scrolled', window.scrollY > 30);
  }
});

// ============================================
// ABOUT — Ask-me-about pills
// ============================================
(function askme() {
  const answers = {
    ocpp: "The protocol EV chargers speak. I've built OCPP log management systems, OCPP-over-WebSockets communication with hundreds of stations, and shipped the Auto-Charging workflow on top of it.",
    golang: "My primary tool for 7+ years. gRPC, Redis, MongoDB, event-driven microservices — plus the muscle memory to debug production incidents at 3 a.m.",
    realtime: "Redis Pub/Sub, MQTT, WebSockets. Most 'API' problems turn out to be messaging problems in disguise. Timing is the interesting part.",
    ev: "Three years deep. Magenta's fleet, JioBP's operator control plane. The joy: it's software that moves physical things.",
    distributed: "Rearchitecting per-site services into a shared multi-tenant model at Truxel. Coordinating hundreds of OCPP charge points through Redis Pub/Sub across service instances at JioBP. gRPC service-to-service at Swiggy. Different scales, same class of problem — keeping many stateful clients in sync without stepping on each other.",
    incidents: "Zero-downtime deploys, prod triage, root-cause chasing. The unglamorous part that decides whether your users trust you.",
  };
  const pills = document.querySelectorAll('.pill[data-topic]');
  const answerEl = document.getElementById('askme-answer');
  if (!pills.length || !answerEl) return;

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      const key = pill.dataset.topic;
      answerEl.classList.add('fade');
      setTimeout(() => {
        answerEl.innerHTML = `<p>${answers[key] || ''}</p>`;
        answerEl.classList.remove('fade');
      }, 200);
    });
  });
})();

// ============================================
// ABOUT — Journey timeline
// ============================================
(function journey() {
  const chapters = [
    { title: '2017 – 2022 · OntoBorn Technologies',
      body: "First job out of college. A services shop in Coimbatore, so I ended up on whichever client needed hands — a Golang gateway at Swiggy, an online exam platform for Ohio State University, a poultry-farm SaaS. Five and a half years of shipping across very different codebases." },
    { title: '2023 – 2024 · Magenta Mobility (Bengaluru)',
      body: "First EV project. Built charge point management services in Go and MongoDB, plus an OCPP log system to track what the chargers were actually doing on the wire. Also shipped the Charge Grid dashboard in React. Almost two years." },
    { title: '2024 – 2026 · JioBP via Tata Elxsi',
      body: "About a year and a half designing the operator control plane for one of India's largest EV charging networks — remote actions, Auto-Charging, OCPP over WebSockets. Owned UAT / QA / prod servers and CI/CD. Redis caching + Pub/Sub cut OCPP message-handling latency by ~40%." },
    { title: '2026 · Truxel Reflex (Sweden, freelance)',
      body: "Went freelance in May. Currently on a Python grid stabilization platform for a Swedish energy team — rearchitecting the service topology from per-site dedicated services to shared multi-tenant. Three services per site was fine at pilot, painful at scale." },
  ];
  const dots = document.querySelectorAll('.journey-dot[data-chapter]');
  const chapterEl = document.getElementById('journey-chapter');
  if (!dots.length || !chapterEl) return;

  function render(idx) {
    dots.forEach((d) => d.classList.toggle('active', +d.dataset.chapter === idx));
    chapterEl.classList.add('fade');
    setTimeout(() => {
      const c = chapters[idx];
      chapterEl.innerHTML = `<h4 class="chapter-title">${c.title}</h4><p class="chapter-body">${c.body}</p>`;
      chapterEl.classList.remove('fade');
    }, 200);
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => render(+dot.dataset.chapter));
  });
  render(3); // default to latest
})();

// ============================================
// Touch → mouse bridge so oneko can follow a finger on mobile
// ============================================
(function bridgeTouch() {
  const dispatch = (t) => {
    if (!t) return;
    window.dispatchEvent(new MouseEvent('mousemove', {
      clientX: t.clientX,
      clientY: t.clientY,
      bubbles: true,
    }));
  };
  window.addEventListener('touchstart', (e) => dispatch(e.touches[0]), { passive: true });
  window.addEventListener('touchmove', (e) => dispatch(e.touches[0]), { passive: true });
})();

// ============================================
// RESUME MODAL
// ============================================
const resumeModal = document.getElementById('resume-modal');

function openResume() {
  if (!resumeModal) return;
  resumeModal.classList.add('open');
  resumeModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('resume-open');
  const closeBtn = resumeModal.querySelector('.resume-modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeResume() {
  if (!resumeModal) return;
  resumeModal.classList.remove('open');
  resumeModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('resume-open');
}

document.querySelectorAll('[data-open-resume]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openResume();
  });
});

document.querySelectorAll('[data-close-resume]').forEach((el) => {
  el.addEventListener('click', closeResume);
});

// ---------- Easter egg: press 'g' to flash ----------
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && resumeModal?.classList.contains('open')) {
    closeResume();
    return;
  }
  if (e.key.toLowerCase() === 'g') {
    document.body.style.filter = 'hue-rotate(60deg) brightness(1.1)';
    setTimeout(() => {
      document.body.style.filter = '';
    }, 400);
  }
  // Number keys 1-5 also switch themes
  const themeMap = { '1': 'cyberpunk', '2': 'space', '3': 'glass', '4': 'terminal', '5': 'aquarium' };
  if (themeMap[e.key]) applyTheme(themeMap[e.key]);
});

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight) * 100;
  document.getElementById('progress-bar').style.width = scrolled + '%';
});

// ============================================================
// HERO CANVAS ANIMATION (packet flow)
// ============================================================
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, packets;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function initPackets() {
    packets = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2.5 + 0.8,
      color: Math.random() > 0.6 ? '#00FFC6' : Math.random() > 0.5 ? '#4DA3FF' : '#8B5CF6'
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    packets.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });
    for (let i = 0; i < packets.length; i++) {
      for (let j = i + 1; j < packets.length; j++) {
        const dx = packets[i].x - packets[j].x;
        const dy = packets[i].y - packets[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(packets[i].x, packets[i].y);
          ctx.lineTo(packets[j].x, packets[j].y);
          ctx.strokeStyle = `rgba(0,255,198,${(1 - dist / 110) * 0.15})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    packets.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', ',0.55)').replace('rgb', 'rgba').replace('#', 'rgba(').replace('rgba(', 'rgba(').replace('00FFC6,', '0,255,198,').replace('4DA3FF,', '77,163,255,').replace('8B5CF6,', '139,92,246,');
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize(); initPackets(); draw();
  window.addEventListener('resize', () => { resize(); initPackets(); });
})();

// ============================================================
// ANIMATED COUNTERS
// ============================================================
function animateCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 80;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounters(); heroObserver.disconnect(); } });
}, { threshold: 0.3 });
const heroSection = document.getElementById('hero');
if (heroSection) heroObserver.observe(heroSection);

// ============================================================
// SCROLLSPY
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navItems.forEach(n => {
    n.classList.toggle('active', n.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ============================================================
// SIDEBAR MOBILE
// ============================================================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg || '✓ Copied!';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ============================================================
// COPY CODE BLOCK
// ============================================================
function copyCode(btn) {
  const terminal = btn.closest('.terminal');
  let text = '';
  if (terminal) {
    const body = terminal.querySelector('.terminal-body');
    if (body) text = body.innerText.trim();
  }
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✓ copied';
    showToast('✓ Copied to clipboard');
    setTimeout(() => btn.textContent = 'copy', 1800);
  }).catch(() => {
    btn.textContent = '✓ copied';
    showToast('✓ Copied!');
    setTimeout(() => btn.textContent = 'copy', 1800);
  });
}

// ============================================================
// TABS
// ============================================================
function switchTab(btn, panelId) {
  const tabList = btn.closest('.tab-list');
  const tabsEl = btn.closest('.tabs');
  tabList.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  tabsEl.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

// ============================================================
// ACCORDION
// ============================================================
function toggleAccordion(header) {
  const body = header.nextElementSibling;
  const isOpen = header.classList.contains('open');
  header.classList.toggle('open', !isOpen);
  body.classList.toggle('open', !isOpen);
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// EVENT LISTENERS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  if (menuToggleBtn) menuToggleBtn.addEventListener('click', toggleSidebar);

  const overlay = document.getElementById('overlay');
  if (overlay) overlay.addEventListener('click', closeSidebar);

  document.querySelectorAll('.nav-item').forEach(el => el.addEventListener('click', closeSidebar));

  document.querySelectorAll('[data-scroll-target]').forEach(btn => {
    btn.addEventListener('click', function () { scrollTo(this.dataset.scrollTarget); });
  });

  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', function () { switchTab(this, this.dataset.tab); });
  });

  document.querySelectorAll('.accordion-header').forEach(el => {
    el.addEventListener('click', function () { toggleAccordion(this); });
  });

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function () { copyCode(this); });
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});

// ============================================================
// KEYBOARD SHORTCUT HINT
// ============================================================
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === '/') {
    showToast('⌨️ Ctrl+C = Stop capture | -w = Write pcap | -r = Read pcap');
  }
});



/* ----------------------------------------
   ACCORDION
   ---------------------------------------- */
function toggleAccordion(header) {
  const body = header.nextElementSibling;
  const isOpen = header.classList.contains('open');
  header.classList.toggle('open', !isOpen);
  body.classList.toggle('open', !isOpen);
}

function expandAll() {
  document.querySelectorAll('.accordion-header').forEach(h => {
    h.classList.add('open');
    h.nextElementSibling.classList.add('open');
  });
}

function collapseAll() {
  document.querySelectorAll('.accordion-header').forEach(h => {
    h.classList.remove('open');
    h.nextElementSibling.classList.remove('open');
  });
}

/* ----------------------------------------
   SIDEBAR NAV SECTIONS
   ---------------------------------------- */
function toggleNavSection(toggle) {
  toggle.classList.toggle('open');
  const sub = toggle.nextElementSibling;
  if (sub) sub.classList.toggle('open');
}

function setActive(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}

/* ----------------------------------------
   SIDEBAR TOGGLE (mobile)
   ---------------------------------------- */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

/* ----------------------------------------
   PROGRESS BAR
   ---------------------------------------- */
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  document.getElementById('progress-bar').style.width = pct + '%';
});

// ============================================================
// HERO CANVAS ANIMATION
// ============================================================
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, nodes, animId;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function initNodes() {
    nodes = Array.from({ length: 55 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 1
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,255,198,${(1 - dist / 120) * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,255,198,0.5)';
      ctx.fill();
    });
    animId = requestAnimationFrame(draw);
  }

  resize(); initNodes(); draw();
  window.addEventListener('resize', () => { resize(); initNodes(); });
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

/* ----------------------------------------
   ACTIVE NAV ON SCROLL
   ---------------------------------------- */
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('#sidebar .nav-item');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 80) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

/* ----------------------------------------
   COPY BUTTONS (code blocks)
   ---------------------------------------- */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const pre = btn.closest('.code-block').querySelector('.code-content');
    const text = pre ? pre.innerText : '';
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.textContent;
      btn.textContent = '✓ Copied';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 1800);
    });
  });
});

/* ----------------------------------------
   CLOSE SIDEBAR ON OUTSIDE CLICK (mobile)
   ---------------------------------------- */
// Replaced by overlay click.

/* ----------------------------------------
   OS TABS
   ---------------------------------------- */
function switchOSTab(btn, tabId) {
  const tabs = btn.closest('.os-tabs');
  tabs.querySelectorAll('.os-tab-btn').forEach(b => b.classList.remove('active'));
  tabs.querySelectorAll('.os-tab-content').forEach(c => c.style.display = 'none');
  btn.classList.add('active');
  tabs.querySelector('#tab-' + tabId).style.display = 'block';
}

/* ----------------------------------------
   COPY CODE (standalone code blocks)
   ---------------------------------------- */
function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('.code-content');
  const text = pre ? pre.innerText : '';
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ Copied';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 1800);
  });
}

console.log('%c[GHIDRA-RE] Reference Guide v1.0 COMPLETE. §01-10 All sections loaded.', 'color:#00ff88;font-family:monospace;font-weight:bold;');

/* ----------------------------------------
   EVENT LISTENERS (Added during refactor)
   ---------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  if (menuToggleBtn) menuToggleBtn.addEventListener('click', toggleSidebar);

  const overlay = document.getElementById('overlay');
  if (overlay) overlay.addEventListener('click', closeSidebar);


  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', function (e) {
      setActive(this);
      closeSidebar();
    });
  });

  document.querySelectorAll('.nav-section-toggle').forEach(el => {
    el.addEventListener('click', function () { toggleNavSection(this); });
  });

  document.querySelectorAll('.accordion-header').forEach(el => {
    el.addEventListener('click', function () { toggleAccordion(this); });
  });

  document.querySelectorAll('.copy-btn').forEach(el => {
    el.addEventListener('click', function () { copyCode(this); });
  });

  document.querySelectorAll('.os-tab-btn').forEach(el => {
    el.addEventListener('click', function () {
      const os = this.getAttribute('data-os');
      if (os) switchOSTab(this, os);
    });
  });

  document.querySelectorAll('[data-scroll-target]').forEach(btn => {
    btn.addEventListener('click', function () {
      const el = document.getElementById(this.dataset.scrollTarget);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });
});

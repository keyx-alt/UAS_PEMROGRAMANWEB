// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight) * 100;
  document.getElementById('progress-bar').style.width = scrolled + '%';
});

// ============================================================
// HERO CANVAS ANIMATION (Network scan / spider web pattern)
// ============================================================
(function() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, nodes, animId;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function initNodes() {
    nodes = Array.from({length: 55}, () => ({
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
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,255,198,${(1 - dist/120) * 0.18})`;
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

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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
// SMOOTH SCROLL
// ============================================================
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  });
});

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
// COPY FILTER
// ============================================================
function copyFilter(el, text) {
  navigator.clipboard.writeText(text).then(() => {
    el.textContent = '✓ copied';
    showToast('✓ Filter copied: ' + text);
    setTimeout(() => el.textContent = '📋 copy', 1800);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    el.textContent = '✓ copied';
    showToast('✓ Filter copied!');
    setTimeout(() => el.textContent = '📋 copy', 1800);
  });
}

// ============================================================
// COPY CODE BLOCK
// ============================================================
function copyCode(btn) {
  let text = '';
  const terminal = btn.closest('.terminal');
  if (terminal) {
    const body = terminal.querySelector('.terminal-body');
    if (body) {
      text = body.innerText.replace(/^[►$>C:\\] /gm, '').trim();
    }
  } else {
    const block = btn.parentElement;
    text = block.innerText.replace(/^copy\n/, '').replace(/copy$/, '').trim();
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
  const tabsEl  = btn.closest('.tabs');
  tabList.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  tabsEl.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

// ============================================================
// ACCORDION
// ============================================================
function toggleAccordion(btn) {
  const body = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  btn.classList.toggle('open', !isOpen);
  body.classList.toggle('open', !isOpen);
}

// ============================================================
// FILTER SEARCH (Alert/Vuln search)
// ============================================================
function searchFilters(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.filter-card').forEach(card => {
    const kw = (card.dataset.keywords || '') + ' ' + card.innerText.toLowerCase();
    card.classList.toggle('hidden', q.length > 0 && !kw.includes(q));
  });
}

// ============================================================
// KEYBOARD SHORTCUTS HINT
// ============================================================
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === '/') {
    showToast('⌨️ Ctrl+/ = Shortcut info | ZAP Proxy: localhost:8080');
  }
});

// ============================================================
// EVENT LISTENERS (Extracted from inline events)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', toggleSidebar);
  }

  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', closeSidebar);
  });

  document.querySelectorAll('[data-scroll-target]').forEach(btn => {
    btn.addEventListener('click', function() {
      scrollTo(this.dataset.scrollTarget);
    });
  });

  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', function() {
      switchTab(this, this.dataset.tab);
    });
  });

  document.querySelectorAll('.accordion-btn').forEach(el => {
    el.addEventListener('click', function() {
      toggleAccordion(this);
    });
  });

  const searchInput = document.getElementById('filterSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      searchFilters(this.value);
    });
  }

  document.querySelectorAll('.filter-copy').forEach(btn => {
    btn.addEventListener('click', function() {
      copyFilter(this, this.dataset.filter);
    });
  });

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      copyCode(this);
    });
  });
});

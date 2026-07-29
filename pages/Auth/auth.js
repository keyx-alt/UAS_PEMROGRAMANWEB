/*
 * auth.js — VeloraSec Auth Logic
 * Scope: login.html, register.html only
 * Note: redirect setelah auth menuju index.html (SPA dashboard)
 */

/* ── Utilities ── */

function togglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const isHidden = inp.type === 'password';
  inp.type = isHidden ? 'text' : 'password';
  btn.querySelector('i').className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
}

function showAuthMsg(containerId, type, text) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const colors = { error: 'var(--danger)', success: 'var(--success)', info: 'var(--secondary)' };
  const icons  = { error: 'fa-circle-xmark', success: 'fa-circle-check', info: 'fa-circle-info' };
  el.style.display = 'flex';
  el.innerHTML = `
    <div class="box box-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'}" style="width:100%;font-size:12px">
      <i class="fas ${icons[type]} box-icon" style="color:${colors[type]}"></i>
      <span>${text}</span>
    </div>`;
}

/* ── Login ── */

function handleLogin() {
  const email = document.getElementById('login-email')?.value.trim();
  const pw    = document.getElementById('login-pw')?.value;

  if (!email || !pw) {
    showAuthMsg('login-msg', 'error', 'Email and password are required.'); return;
  }
  if (!email.includes('@')) {
    showAuthMsg('login-msg', 'error', 'Enter a valid email address.'); return;
  }

  // Simulate async auth (UI demo)
  showAuthMsg('login-msg', 'info', 'Authenticating...');
  setTimeout(() => {
    showAuthMsg('login-msg', 'success', 'Login successful! Redirecting to dashboard...');
    setTimeout(() => { window.location.href = '../index.html#dashboard'; }, 1200);
  }, 900);
}

/* ── Register ── */

function updatePwStrength(val) {
  const bar   = document.getElementById('pw-strength-bar');
  const label = document.getElementById('pw-strength-label');
  if (!bar || !label) return;

  let score = 0;
  if (val.length >= 8)           score++;
  if (val.length >= 12)          score++;
  if (/[A-Z]/.test(val))         score++;
  if (/[0-9]/.test(val))         score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { w: '0%',   bg: 'transparent',       txt: '' },
    { w: '25%',  bg: 'var(--danger)',      txt: 'WEAK' },
    { w: '50%',  bg: 'var(--warn)',        txt: 'FAIR' },
    { w: '75%',  bg: 'var(--secondary)',   txt: 'GOOD' },
    { w: '90%',  bg: 'var(--success)',     txt: 'STRONG' },
    { w: '100%', bg: 'var(--primary)',     txt: 'EXCELLENT' },
  ];
  const lvl = levels[Math.min(score, 5)];
  bar.style.width      = lvl.w;
  bar.style.background = lvl.bg;
  label.textContent    = lvl.txt ? `STRENGTH: ${lvl.txt}` : '';
  label.style.color    = lvl.bg;
}

function handleRegister() {
  const username = document.getElementById('reg-username')?.value.trim();
  const email    = document.getElementById('reg-email')?.value.trim();
  const pw       = document.getElementById('reg-pw')?.value;
  const pw2      = document.getElementById('reg-pw2')?.value;
  const tos      = document.getElementById('reg-tos')?.checked;

  if (!username || !email || !pw || !pw2) {
    showAuthMsg('reg-msg', 'error', 'All fields are required.'); return;
  }
  if (username.length < 3) {
    showAuthMsg('reg-msg', 'error', 'Username must be at least 3 characters.'); return;
  }
  if (!email.includes('@')) {
    showAuthMsg('reg-msg', 'error', 'Enter a valid email address.'); return;
  }
  if (pw.length < 8) {
    showAuthMsg('reg-msg', 'error', 'Password must be at least 8 characters.'); return;
  }
  if (pw !== pw2) {
    showAuthMsg('reg-msg', 'error', 'Passwords do not match.'); return;
  }
  if (!tos) {
    showAuthMsg('reg-msg', 'error', 'You must agree to the ethical use policy.'); return;
  }

  showAuthMsg('reg-msg', 'info', 'Creating your account...');
  setTimeout(() => {
    showAuthMsg('reg-msg', 'success', `Welcome, <strong>${username}</strong>! Account created. Redirecting to login...`);
    setTimeout(() => { window.location.href = 'login.html'; }, 1400);
  }, 900);
}
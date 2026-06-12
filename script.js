// =======================================================
// script.js — Portfolio Bhramadya Naffos
// Versi 2.0 — rAF optimized, Dark Mode, Modal, Timeline
// =======================================================

// --- 1. REVEAL ON SCROLL ---
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  },
  { root: null, rootMargin: "0px", threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// --- 2. DARK MODE TOGGLE ---
// Logika: class 'dark-mode' di <html> mengontrol semua warna via CSS variables.
// Section gelap (Showcase, Footer) tidak disentuh CSS dark mode sama sekali.
const darkToggle = document.getElementById("darkModeToggle");
const htmlEl = document.documentElement;
const sunIcon = "☀";
const moonIcon = "☽";

function applyTheme(isDark) {
  if (isDark) {
    htmlEl.classList.add("dark-mode");
    if (darkToggle)
      darkToggle.querySelector(".theme-toggle-thumb").textContent = moonIcon;
  } else {
    htmlEl.classList.remove("dark-mode");
    if (darkToggle)
      darkToggle.querySelector(".theme-toggle-thumb").textContent = sunIcon;
  }
}

// Load preferensi: 1) localStorage, 2) preferensi OS
const savedTheme = localStorage.getItem("bhram-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme === "dark" || (!savedTheme && prefersDark));

if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    const nowDark = !htmlEl.classList.contains("dark-mode");
    applyTheme(nowDark);
    localStorage.setItem("bhram-theme", nowDark ? "dark" : "light");
  });
}

// --- 3. CUSTOM CURSOR (Project Cards) ---
// Menggunakan requestAnimationFrame + lerp untuk gerakan smooth — fix Safari lag.
const cursor = document.getElementById("project-cursor");
const projectCards = document.querySelectorAll(".project-card");
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice && cursor) {
  let cursorTargetX = 0,
    cursorTargetY = 0;
  let cursorCurrentX = 0,
    cursorCurrentY = 0;
  let cursorRafId = null;

  // Loop animasi dengan lerp — berjalan di compositor thread lewat transform3d
  function animateCursor() {
    const LERP = 0.12;
    cursorCurrentX += (cursorTargetX - cursorCurrentX) * LERP;
    cursorCurrentY += (cursorTargetY - cursorCurrentY) * LERP;
    cursor.style.transform = `translate3d(${cursorCurrentX}px, ${cursorCurrentY}px, 0) translate(-50%, -50%)`;
    cursorRafId = requestAnimationFrame(animateCursor);
  }

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1";
      if (!cursorRafId) cursorRafId = requestAnimationFrame(animateCursor);
    });
    card.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
      if (cursorRafId) {
        cancelAnimationFrame(cursorRafId);
        cursorRafId = null;
      }
    });
    card.addEventListener("mousemove", (e) => {
      cursorTargetX = e.clientX;
      cursorTargetY = e.clientY;
    });
  });

  cursor.style.transform = "translate3d(0,0,0) translate(-50%, -50%)";
}

// --- 4. MAGNETIC BUTTONS (rAF throttled — fix Safari lag) ---
if (!isTouchDevice) {
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.style.willChange = "transform";
    let rafPending = false;
    let targetX = 0,
      targetY = 0;

    function applyMagnetic() {
      btn.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      rafPending = false;
    }

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      targetX = (e.clientX - rect.left - rect.width / 2) * 0.3;
      targetY = (e.clientY - rect.top - rect.height / 2) * 0.3;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(applyMagnetic);
      }
    });

    btn.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
      requestAnimationFrame(() => {
        btn.style.transform = "translate3d(0,0,0)";
        setTimeout(() => {
          btn.style.willChange = "auto";
        }, 300);
      });
    });

    btn.addEventListener("mouseenter", () => {
      btn.style.willChange = "transform";
    });
  });
}

// --- 5. PROJECT MODAL ---
// Data tiap proyek. Tambah/edit di sini untuk proyek baru.
const projectData = {
  arsada: {
    title: "ARSADA",
    subtitle: "Aplikasi Reservasi Sarana & Aset",
    type: "Web App",
    description:
      "Sistem informasi manajemen fasilitas sekolah MAN 2 Kota Madiun. Memungkinkan guru dan staf untuk memesan ruangan dan aset sekolah secara digital — menggantikan proses manual yang lambat dan rawan konflik jadwal. Dibangun dengan UI yang bersih dan alur yang intuitif agar mudah digunakan oleh semua kalangan.",
    stack: ["HTML/CSS", "Tailwind", "PHP", "Laravel", "Filament"],
    url: "#",
    hasUrl: false,
    image: "arsada.jpg", // Ditambahkan properti gambar
  },
  moobar: {
    title: "MOOBAR Fresh Milk",
    subtitle: "Landing Page UMKM",
    type: "Landing Page",
    description:
      'Landing page promosi untuk UMKM susu segar lokal. Fokus pada tipografi tebal, layout yang bersih, dan call-to-action yang mendorong konversi digital. Representasi nyata prinsip "software should empower people" — kali ini untuk pelaku UMKM.',
    stack: ["HTML/CSS", "Tailwind CSS", "JavaScript", "BootStrap"],
    url: "#",
    hasUrl: false,
    image: "moobar1.jpg", // Ditambahkan properti gambar
  },
  laporcuan: {
    // Ditambahkan data proyek baru: LaporCuan
    title: "LaporCuan Bot",
    subtitle: "Telegram Bot (@LaporDuit_bot)",
    type: "Telegram Bot",
    description:
      "Bot Telegram pencatat keuangan serverless. Menghubungkan interaksi chat pengguna langsung dengan Google Sheets menggunakan Google Apps Script (GAS). Dirancang dengan pendekatan zero-friction UX agar pengguna bisa mencatat pengeluaran semudah membalas chat.",
    stack: ["Apps Script", "Telegram API", "Google Sheets"],
    url: "https://t.me/LaporDuit_bot",
    hasUrl: true,
    image: "botte.jpg", // Jangan lupa siapkan gambar ini di foldermu
  },
  placeholder2: {
    title: "Proyek Segera",
    subtitle: "Coming Soon",
    type: "Upcoming",
    description: "Proyek berikutnya sedang dalam pengerjaan. Pantau terus!",
    stack: [],
    url: "#",
    hasUrl: false,
    image: "", // Kosong, maka akan memunculkan placeholder ikon
  },
};

const modalOverlay = document.getElementById("projectModalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalType = document.getElementById("modalType");
const modalDescription = document.getElementById("modalDescription");
const modalStack = document.getElementById("modalStack");
const modalVisitBtn = document.getElementById("modalVisitBtn");
const modalCloseBtn = document.getElementById("modalCloseBtn");

// Buka modal dengan data proyek yang dipilih
function openModal(projectKey) {
  const data = projectData[projectKey];
  if (!data || !modalOverlay) return;

  modalTitle.textContent = data.title;
  modalSubtitle.textContent = data.subtitle;
  modalType.textContent = data.type;
  modalDescription.textContent = data.description;

  // Handle Image / Screenshot
  const modalImg = document.getElementById("modalImage");
  const modalPlaceholder = document.getElementById("modalPlaceholder");

  if (modalImg && modalPlaceholder) {
    if (data.image && data.image !== "") {
      modalImg.src = data.image;
      modalImg.classList.remove("hidden");
      modalPlaceholder.classList.add("hidden");
    } else {
      modalImg.src = "";
      modalImg.classList.add("hidden");
      modalPlaceholder.classList.remove("hidden");
    }
  }

  // Render stack tags
  modalStack.innerHTML = data.stack
    .map((s) => `<span class="experience-tag">${s}</span>`)
    .join("");

  // Tampilkan/sembunyikan tombol kunjungi
  if (data.hasUrl && data.url !== "#") {
    modalVisitBtn.href = data.url;
    modalVisitBtn.style.display = "inline-flex";
  } else {
    modalVisitBtn.style.display = "none";
  }

  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scroll saat modal terbuka
}

// Tutup modal
function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// Event listeners modal
if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);

// Klik overlay luar = tutup
if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

// Tekan Escape = tutup
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Pasang event klik ke tiap kartu proyek
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.dataset.project;
    if (key) openModal(key);
  });
  // Ubah cursor default saat bisa diklik
  card.style.cursor = "pointer";
});

// --- 6. FORM SUBMISSION — Google Apps Script + Google Sheets ---
// Ganti URL di bawah dengan URL Web App GAS kamu
const scriptURL =
  "https://script.google.com/macros/s/AKfycbxl_dWOGiYUCEvGi7kCrJQvDaunSohRtnD5BYPn1aNzWlAfTCG68RKGUjqq1ha_4HcALg/exec";

const form = document.forms["contactForm"];
const btnSubmit = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // --- Cek Honeypot Anti-Spam ---
    if (form.elements["_honeypot"].value) {
      console.warn("Bot detected!");
      form.reset();
      return;
    }

    // --- State Loading ---
    btnSubmit.innerHTML =
      'Mengirim... <i class="ph-bold ph-spinner animate-spin"></i>';
    btnSubmit.disabled = true;
    btnSubmit.classList.add("opacity-80");
    formStatus.classList.add("hidden");

    // --- Konversi FormData → URLSearchParams ---
    // GAS lebih stabil membaca format ini lewat e.parameter
    const formData = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      params.append(key, value);
    }

    // --- Kirim ke GAS ---
    fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    })
      .then((res) => {
        // GAS kadang return bukan JSON murni, jadi parse manual
        return res.text().then((text) => {
          try {
            return JSON.parse(text);
          } catch {
            // Kalau tidak bisa di-parse, anggap sukses
            // (GAS redirect kadang bikin response jadi HTML)
            return { status: "success" };
          }
        });
      })
      .then((data) => {
        if (data.status === "success") {
          formStatus.className =
            "torn-paper p-3 font-type text-sm text-center text-green-700 block mt-4";
          formStatus.innerHTML =
            "> SUCCESS: Pesan berhasil terkirim. Terima kasih!";
          form.reset();
        } else {
          throw new Error(data.message || "Terjadi kesalahan.");
        }
      })
      .catch((err) => {
        console.error("Form error:", err.message);
        formStatus.className =
          "torn-paper p-3 font-type text-sm text-center text-red-700 block mt-4";
        formStatus.innerHTML =
          "> ERROR: Gagal mengirim. Coba lagi atau hubungi langsung via email.";
      })
      .finally(() => {
        btnSubmit.innerHTML =
          'Kirim Pesan <i class="ph-bold ph-arrow-right"></i>';
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-80");
        btnSubmit.style.transform = "translate3d(0,0,0)";
      });
  });
}

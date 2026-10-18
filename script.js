"use strict";

// ======================================
// BM DIGITAL — FONCTIONNALITÉS DU SITE
// ======================================

const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");
const themeToggle = document.getElementById("theme-toggle");
const profilePhoto = document.getElementById("profile-photo");
const photoFallback = document.getElementById("photo-fallback");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const yearElement = document.getElementById("year");

// 1. Année automatique dans le pied de page
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// 2. Menu mobile
function closeMenu() {
  navigation.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Ouvrir le menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fermer le menu" : "Ouvrir le menu"
  );
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Fermer le menu avec la touche Échap
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// Fermer le menu lorsqu'on revient à un grand écran
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

// 3. Mode clair / mode sombre
function setTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle("dark", isDark);

  themeToggle.textContent = isDark ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Activer le mode clair" : "Activer le mode sombre"
  );

  document.documentElement.style.colorScheme =
    isDark ? "dark" : "light";

  try {
    localStorage.setItem("bm-digital-theme", theme);
  } catch (error) {
    // Le site reste utilisable même si le stockage est indisponible.
  }
}

// Charger le thème enregistré, ou utiliser le thème clair
let savedTheme = "light";

try {
  savedTheme = localStorage.getItem("bm-digital-theme") || "light";
} catch (error) {
  savedTheme = "light";
}

setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
});

// 4. Photo de profil : afficher un remplacement si elle manque
function showPhotoFallback() {
  profilePhoto.hidden = true;
  photoFallback.hidden = false;
}

profilePhoto.addEventListener("error", showPhotoFallback);

profilePhoto.addEventListener("load", () => {
  profilePhoto.hidden = false;
  photoFallback.hidden = true;
});

// Si la photo est déjà chargée depuis le cache
if (profilePhoto.complete) {
  if (profilePhoto.naturalWidth === 0) {
    showPhotoFallback();
  } else {
    profilePhoto.hidden = false;
    photoFallback.hidden = true;
  }
}

// 5. Navigation : surligner la section consultée
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isCurrent =
            link.getAttribute("href") === "#" + entry.target.id;

          link.classList.toggle("active", isCurrent);

          if (isCurrent) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    {
      rootMargin: "-25% 0px -60% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// 6. Formulaire de contact
// Le formulaire ouvre le logiciel de messagerie de l'utilisateur.
// Il ne transmet pas de données à un serveur.

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    return;
  }

  // IMPORTANT : remplace cette adresse par ton adresse réelle.
  const destination = "tonadresse@email.com";

  if (destination === "tonadresse@email.com") {
    formStatus.textContent =
      "Configure d'abord ton adresse e-mail dans le fichier script.js.";
    return;
  }

  const formData = new FormData(contactForm);

  const name = String(formData.get("name") || "").trim();
  const senderEmail = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const emailSubject = encodeURIComponent(
    "[Portfolio BM Digital] " + subject
  );

  const emailBody = encodeURIComponent(
    "Bonjour BM Digital,\n\n" +
    message +
    "\n\n---\n" +
    "Nom : " + name + "\n" +
    "E-mail du visiteur : " + senderEmail
  );

  const mailtoLink =
    "mailto:" + destination +
    "?subject=" + emailSubject +
    "&body=" + emailBody;

  formStatus.textContent =
    "Ouverture de ton application de messagerie...";

  window.location.href = mailtoLink;
});
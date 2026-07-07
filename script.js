const translations = {
  pl: {
    menu: "MENU",
    catering: "CATERING",
    map: "ZNAJDŹ NAS",
    contact: "KONTAKT",
    metaDescription: "Paloma: bistro w Pawilonie Tańca."
  },
  en: {
    menu: "MENU",
    catering: "CATERING",
    map: "FIND US",
    contact: "CONTACT",
    metaDescription: "Paloma: Bistro at the Pavilion of Dance."
  }
};

const defaultLanguage = "pl";
const storageKey = "paloma-language";

function getSavedLanguage() {
  const savedLanguage = window.localStorage.getItem(storageKey);

  if (savedLanguage === "pl" || savedLanguage === "en") {
    return savedLanguage;
  }

  return defaultLanguage;
}

function setLanguage(language) {
  const selectedLanguage = translations[language] ? language : defaultLanguage;

  document.documentElement.lang = selectedLanguage;
  window.localStorage.setItem(storageKey, selectedLanguage);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const translationKey = element.getAttribute("data-i18n");

    if (translations[selectedLanguage][translationKey]) {
      element.textContent = translations[selectedLanguage][translationKey];
    }
  });

  const metaDescription = document.querySelector('meta[name="description"]');

  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      translations[selectedLanguage].metaDescription
    );
  }

  document.querySelectorAll("[data-lang-switch]").forEach((button) => {
    const buttonLanguage = button.getAttribute("data-lang-switch");
    const isActive = buttonLanguage === selectedLanguage;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function setupLanguageSwitcher() {
  document.querySelectorAll("[data-lang-switch]").forEach((button) => {
    button.addEventListener("click", () => {
      const language = button.getAttribute("data-lang-switch");
      setLanguage(language);
    });
  });

  setLanguage(getSavedLanguage());
}

function setupBackgroundPoster() {
  const video = document.getElementById("background-video");

  if (!video) {
    return;
  }

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    video.poster = "assets/background/paloma-background-mobile-poster.webp";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupLanguageSwitcher();
  setupBackgroundPoster();
});
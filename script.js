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

function setupBackgroundVideo() {
  const video = document.getElementById("background-video");

  if (!video) {
    return;
  }

  const mediaQuery = window.matchMedia("(max-width: 768px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function loadCorrectVideo() {
    const isMobile = mediaQuery.matches;
    const mode = isMobile ? "mobile" : "desktop";

    if (video.dataset.currentMode === mode) {
      return;
    }

    video.dataset.currentMode = mode;

    const poster = isMobile
      ? video.dataset.mobilePoster
      : video.dataset.desktopPoster;

    const webm = isMobile
      ? video.dataset.mobileWebm
      : video.dataset.desktopWebm;

    const mp4 = isMobile
      ? video.dataset.mobileMp4
      : video.dataset.desktopMp4;

    video.pause();
    video.innerHTML = "";
    video.poster = poster;

    if (reducedMotionQuery.matches) {
      video.removeAttribute("src");
      video.load();
      return;
    }

    const webmSource = document.createElement("source");
    webmSource.src = webm;
    webmSource.type = "video/webm";

    const mp4Source = document.createElement("source");
    mp4Source.src = mp4;
    mp4Source.type = "video/mp4";

    video.appendChild(webmSource);
    video.appendChild(mp4Source);

    video.preload = "metadata";
    video.load();

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If autoplay fails, the CSS poster fallback remains visible.
      });
    }
  }

  loadCorrectVideo();

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", loadCorrectVideo);
  } else {
    mediaQuery.addListener(loadCorrectVideo);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupLanguageSwitcher();
  setupBackgroundVideo();
});
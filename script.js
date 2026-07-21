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
  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  function stopDesktopVideo() {
    video.pause();
    video.removeAttribute("src");
    video.replaceChildren();
    video.removeAttribute("data-loaded");
    video.load();
  }

  function playDesktopVideo() {
    if (
      mediaQuery.matches ||
      document.hidden ||
      reducedMotionQuery.matches
    ) {
      return;
    }

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // The desktop poster remains visible if playback is unavailable.
      });
    }
  }

  function loadDesktopVideo() {
    if (mediaQuery.matches || reducedMotionQuery.matches) {
      stopDesktopVideo();
      return;
    }

    if (video.dataset.loaded === "true") {
      playDesktopVideo();
      return;
    }

    const mp4Source = document.createElement("source");
    mp4Source.src = video.dataset.desktopMp4;
    mp4Source.type = "video/mp4";

    const webmSource = document.createElement("source");
    webmSource.src = video.dataset.desktopWebm;
    webmSource.type = "video/webm";

    video.replaceChildren(mp4Source, webmSource);
    video.poster = video.dataset.desktopPoster;
    video.preload = "metadata";
    video.dataset.loaded = "true";

    video.load();

    video.addEventListener("canplay", playDesktopVideo, {
      once: true
    });

    playDesktopVideo();
  }

  loadDesktopVideo();

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", loadDesktopVideo);
    reducedMotionQuery.addEventListener("change", loadDesktopVideo);
  } else {
    mediaQuery.addListener(loadDesktopVideo);
    reducedMotionQuery.addListener(loadDesktopVideo);
  }

  function resumeDesktopVideo() {
    if (mediaQuery.matches || reducedMotionQuery.matches) {
      return;
    }

    window.requestAnimationFrame(playDesktopVideo);
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      resumeDesktopVideo();
    }
  });

  window.addEventListener("pageshow", resumeDesktopVideo);
  window.addEventListener("focus", resumeDesktopVideo);
}

document.addEventListener("DOMContentLoaded", () => {
  setupLanguageSwitcher();
  setupBackgroundVideo();
});
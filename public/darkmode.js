function detectDarkMode() {
  if (!globalThis.localStorage) {
    return;
  }

  if (
    globalThis.localStorage.darkmode === "true" ||
    (!("darkmode" in globalThis.localStorage) &&
      globalThis.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    globalThis.document.documentElement.classList.add("dark");
  } else {
    globalThis.document.documentElement.classList.remove("dark");
  }
}

detectDarkMode();

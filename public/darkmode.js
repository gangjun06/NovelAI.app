function detectDarkMode() {
  if (!globalThis.localStorage) {
    return;
  }

  let theme = globalThis.localStorage.theme ?? "system";
  theme = theme.replace(/"/g, "");

  if (
    theme === "dark" ||
    (theme === "system" &&
      globalThis.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    globalThis.document.documentElement.classList.add("dark");
  } else {
    globalThis.document.documentElement.classList.remove("dark");
  }
}

detectDarkMode();

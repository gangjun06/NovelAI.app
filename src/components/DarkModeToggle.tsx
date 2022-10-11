import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Button } from "./Button";

export const darkModeAtom = atomWithStorage("darkmode", false);
export const darkModeToggleAtom = atom(
  (get) => get(darkModeAtom),
  (get, set) => {
    set(darkModeAtom, (p) => {
      if (globalThis.localStorage) {
        if (p) globalThis.document.documentElement.classList.remove("dark");
        else globalThis.document.documentElement.classList.add("dark");
      }
      return !p;
    });
  }
);

export const DarkModeToggle = () => {
  const [isDark, toggle] = useAtom(darkModeToggleAtom);
  return (
    <Button onClick={() => toggle()} compact>
      다크 모드 {isDark ? "ON" : "OFF"}
    </Button>
  );
};

import classNames from "classnames";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const darkModeAtom = atomWithStorage("darkmode", false);

export const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  return (
    <div
      onClick={() => setDarkMode((p) => !p)}
      className="flex justify-center items-center my-2 select-none"
    >
      <div
        className={classNames(
          "border border-gray-300 px-2 py-0.5 rounded-md cursor-pointer",
          darkMode ? "bg-zinc-800" : "bg-white"
        )}
      >
        다크 모드 {darkMode ? "ON" : "OFF"}
      </div>
    </div>
  );
};

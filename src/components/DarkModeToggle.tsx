import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const darkModeAtom = atomWithStorage("darkmode", false);

export const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  return (
    <div
      onClick={() => setDarkMode((p) => !p)}
      className="flex justify-center items-center my-2 select-none"
    >
      <div className="border border-gray-300 px-2 py-0.5 rounded-md cursor-pointer bg-white dark:bg-zinc-800">
        다크 모드 {darkMode ? "ON" : "OFF"}
      </div>
    </div>
  );
};

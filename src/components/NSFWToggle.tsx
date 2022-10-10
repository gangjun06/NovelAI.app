import classNames from "classnames";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { darkModeAtom } from "./DarkModeToggle";

export const showNSFWAtom = atomWithStorage("nsfw-on", false);

export const NSFWToggle = () => {
  const [showNSFW, setShowNSFW] = useAtom(showNSFWAtom);
  const darkMode = useAtomValue(darkModeAtom);
  return (
    <div
      onClick={() => setShowNSFW((p) => !p)}
      className="flex justify-center items-center my-2 select-none"
    >
      <div
        className={classNames(
          "border border-gray-300 px-2 py-0.5 rounded-md cursor-pointer",
          darkMode ? "bg-zinc-800" : "bg-white"
        )}
      >
        NSFW {showNSFW ? "ON" : "OFF"}
      </div>
    </div>
  );
};

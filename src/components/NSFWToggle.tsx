import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const showNSFWAtom = atomWithStorage("nsfw-on", false);

export const NSFWToggle = () => {
  const [showNSFW, setShowNSFW] = useAtom(showNSFWAtom);
  return (
    <div
      onClick={() => setShowNSFW((p) => !p)}
      className="flex w-full justify-center items-center my-2 select-none"
    >
      <div className="border border-gray-300 px-2 py-0.5 bg-white rounded-md cursor-pointer">
        NSFW {showNSFW ? "ON" : "OFF"}
      </div>
    </div>
  );
};

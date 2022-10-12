import { useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Button } from "./Base";

export const showNSFWAtom = atomWithStorage("nsfw-on", false);

export const NSFWToggle = () => {
  const [showNSFW, setShowNSFW] = useAtom(showNSFWAtom);
  return (
    <Button onClick={() => setShowNSFW((p) => !p)} compact>
      NSFW {showNSFW ? "ON" : "OFF"}
    </Button>
  );
};

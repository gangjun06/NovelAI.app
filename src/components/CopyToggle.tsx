import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Button } from "./Button";

export const copyAtom = atomWithStorage("allow-copy", false);

export const CopyToggle = () => {
  const [allowCopy, setAllowCopy] = useAtom(copyAtom);
  return (
    <Button onClick={() => setAllowCopy((d) => !d)} compact>
      개별복사 {allowCopy ? "ON" : "OFF"}
    </Button>
  );
};

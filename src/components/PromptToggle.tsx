import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Button } from "./Button";

export const withUnderbarAtom = atomWithStorage("with-underbar", false);

export const WithUnderbarToggle = () => {
  const [withUnderbar, setWithUnderbar] = useAtom(withUnderbarAtom);
  return (
    <Button onClick={() => setWithUnderbar((d) => !d)} compact>
      공백 대신 언더바 {withUnderbar ? "ON" : "OFF"}
    </Button>
  );
};

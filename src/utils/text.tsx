import { info } from "console";

export const copyText = (text: string) => {
  navigator.clipboard.writeText(text);
};

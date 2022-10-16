export const replaceText = (text: string, underbar: boolean) => {
  return underbar ? text.replace(/ /g, "_") : text.replace(/_/g, " ");
};

export const copyText = (text: string) => {
  navigator.clipboard.writeText(text);
};

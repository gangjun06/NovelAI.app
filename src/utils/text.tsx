export const replaceText = (text: string, underbar: boolean) => {
  return underbar ? text.replace(/ /g, '_') : text.replace(/_/g, ' ')
}

export const copyText = (text: string) => {
  navigator.clipboard.writeText(text)
}

export const formatPriority = (
  text: string,
  priority: number,
  priorityText1: string,
  priorityText2: string,
) => `${priorityText1.repeat(priority)}${text}${priorityText2.repeat(priority)}`

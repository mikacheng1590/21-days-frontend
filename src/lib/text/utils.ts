export const trimText = (text: string) => {
  return text.trim()
}

export const slugifyText = (text: string) => {
  return trimText(text).toLowerCase().replace(/ /g, '-')
}
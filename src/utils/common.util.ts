export const line = (str: string) => str
  .replace(/\n/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

export const getRound2 = (n: number) => {
  return Math.round(n * 100) / 100;
}

export const copy = (str: string) => {
  const input = document.createElement('textarea')
  document.body.appendChild(input)
  input.value = str
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
}

export const downloadTxt = (name: string, content: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const a = document.createElement('a')
  const blobUrl = URL.createObjectURL(blob)
  a.href = blobUrl
  a.download = name
  a.click()
  URL.revokeObjectURL(blobUrl)
}

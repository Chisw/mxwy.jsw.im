export const line = (str: string) => str
  .replace(/\n/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

export const getRound2 = (n: number) => {
  return Math.round(n * 100) / 100;
}

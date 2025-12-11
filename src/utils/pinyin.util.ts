export const getInjectedPinyinList = (pinyin: string, text: string) => {
  const pinyinList = pinyin.split(' ')

  text
    .split('')
    .reduce((a, b, i) => {
      if (/(，|。|：|；|？)/.test(b)) {
        a.push(i)
      }
      return a
    }, [] as number[])
    .forEach((i) => {
      pinyinList.splice(i, 0, '')
    })

  return pinyinList
}

import type { ISection, ISentence } from './../type/common.type'
import { getFinalPinyin, getInjectedPinyinList } from './book.util'
import { getFormatDateTime } from './time.util'

export const printSentenceList = (sentenceList: ISentence[], sectionForm: ISection, sandhi: boolean) => {
  const chars = sentenceList
    .map((s, index) => {
      const isInRange = index + 1 >= sectionForm.from && index + 1 <= sectionForm.to
      if (!isInRange) return ''

      const { text, pinyin } = s
      const pinyinList = getInjectedPinyinList(pinyin, text)
      const count = text.length
      const rest = count % 10
      const max = count + (rest ? (10 - rest) : 0)
      const chars = text.padEnd(max, ' ').split('')

      return `
        <div
          class="flex flex-wrap -mb-px text-center border-t border-l border-r border-green-300"
          style="page-break-inside: avoid; break-inside: avoid;"
        >
          ${chars.map((char, i) => `
            <div class="w-1/10 border-r border-b border-green-300">
              <div class="mxwy-print-pinyin flex-center-center h-10 border-b border-green-300">
                <span class="text-[1.8rem] font-pinyin text-[#bbb] translate-y-[-12%] align-middle">
                  ${getFinalPinyin(pinyinList[i] || '', sandhi)}
                </span>
              </div>
              <div class="mxwy-print-character flex-center-center w-full aspect-square">
                <span class="text-[3.6rem] font-kai text-[#bbb] leading-0">${char}</span>
              </div>
            </div>  
          `).join('')}
        </div>
      `
    })
    .join('')

  document.getElementById('mxwy-print-page')!.innerHTML = `
    ${chars}
    <div class="flex justify-between mt-4 text-xs opacity-40">
      <code>
        https://mxwy.jsw.im
      </code>
      <code>
        ${getFormatDateTime(new Date())}
      </code>
    </div>
  `

  window.print()
}

import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/paraiso-dark.css'

export const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    }
  })
)

const copyIcon =
  '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M703.351467 895.249067a63.8976 63.8976 0 0 1-63.965867 63.829333H127.931733a63.8976 63.8976 0 0 1-63.965866-63.829333V384.273067c0-35.293867 28.672-63.829333 63.965866-63.829334h63.8976v-63.8976h-63.8976A127.7952 127.7952 0 0 0 0 384.341333v510.976a127.658667 127.658667 0 0 0 127.863467 127.726934h511.3856a127.658667 127.658667 0 0 0 127.863466-127.658667v-63.8976h-63.8976v63.829333z m191.761066-894.293334H383.658667a127.7952 127.7952 0 0 0-127.863467 127.7952V639.658667c0 70.519467 57.207467 127.658667 127.863467 127.658666h511.522133c70.656 0 127.7952-57.207467 127.7952-127.658666V128.750933A127.7952 127.7952 0 0 0 895.112533 1.024z m63.965867 638.7712a63.829333 63.829333 0 0 1-63.8976 63.829334H383.658667a63.8976 63.8976 0 0 1-63.8976-63.829334V128.750933c0-35.2256 28.672-63.829333 63.8976-63.829333h511.522133c35.293867 0 63.8976 28.603733 63.8976 63.829333v510.976z"></path></svg>'

marked.use({
  renderer: {
    code({ text, lang, escaped }) {
      const langString = (lang || '').match(/^\S*/)?.[0] || 'text'
      const code = text.replace(/\n$/, '') + '\n'

      const codeId = Math.floor(Math.random() * 100000000)

      const codeHeader = `<div class="flex items-center text-white bg-black/30 absolute top-0 right-0 uppercase font-bold text-xs rounded-bl-md px-2 py-1">
        <span>${langString}</span> | <i class="el-icon cursor-pointer" onclick="copyBtnClick(${codeId})">${copyIcon}</i>
        </div>`

      return (
        '<pre class="bg-teal-950 shadow-xl text-sm relative overflow-hidden max-w-full rounded p-4">' +
        codeHeader +
        '<code id="' +
        codeId +
        '" class="text-gray-200  language-' +
        escape(langString) +
        '">' +
        (escaped ? code : escape(code, true)) +
        '</code></pre>\n'
      )
    }
  }
})

window.copyBtnClick = function (codeId) {
  const codeText = document.getElementById(codeId).innerText
  navigator.clipboard.writeText(codeText)
}

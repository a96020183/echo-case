import { useState } from 'react'

// 新手導覽：只教「怎麼操作」，不劇透任何破綻。可跳過。
const STEPS = [
  {
    emoji: '📰',
    title: '你是社群小編',
    body: '網路上瘋傳的東西，不一定是真的。你的工作只有一件事：在轉發前，先查清楚。',
  },
  {
    emoji: '🔍',
    title: '看到圖，就放大它',
    body: '點任何圖片可以放大檢查。假圖常常在細節露餡——時間對不對、有沒有修改過的痕跡。放大才看得到。',
  },
  {
    emoji: '👤',
    title: '覺得誰可疑，點他名字',
    body: '點帳號名字能查它的底細：什麼時候註冊、發過什麼。臨時開的空帳號，講的話要打折。',
  },
  {
    emoji: '🧭',
    title: '還能搜尋、比對',
    body: '底部有「搜尋」可以查資料，「證據板」可以把線索排在一起找矛盾。多用它們。',
  },
  {
    emoji: '🚩',
    title: '目標：抓出破綻',
    body: '每識破一個假消息，右上角「已抓破綻」就 +1。抓越多，你越不會被騙。準備好了嗎？',
  },
]

export default function Tutorial({ onFinish }) {
  const [i, setI] = useState(0)
  const step = STEPS[i]
  const last = i === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/85 sm:items-center sm:p-4">
      <div className="w-full max-w-sm animate-fadeup rounded-t-3xl border border-line bg-black p-6 text-center sm:rounded-3xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#333] sm:hidden" />

        <div className="text-5xl">{step.emoji}</div>
        <h3 className="mt-3 text-xl font-black">{step.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-white/80">{step.body}</p>

        {/* 進度點 */}
        <div className="mt-5 flex justify-center gap-1.5">
          {STEPS.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-5 bg-white' : 'w-1.5 bg-[#444]'}`}
            />
          ))}
        </div>

        <button
          onClick={() => (last ? onFinish() : setI((v) => v + 1))}
          className="mt-5 w-full rounded-full bg-white py-3 font-bold text-black transition hover:bg-white/90"
        >
          {last ? '開始調查' : '下一步'}
        </button>
        {!last && (
          <button onClick={onFinish} className="mt-2 w-full py-1 text-xs text-mute hover:text-white">
            我懂了，直接開始
          </button>
        )}
      </div>
    </div>
  )
}

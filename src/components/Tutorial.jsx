import { useState } from 'react'

// 新手練習：親手做一題（1 練習 + 正式 6 題）。
// 用跟劇情無關的中性例子，手把手帶玩家：點圖 → 放大 → 找破綻 → 恍然大悟。
export default function Tutorial({ onFinish }) {
  const [phase, setPhase] = useState('brief') // brief → zoom → done

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/85 sm:items-center sm:p-4">
      <div className="w-full max-w-sm animate-fadeup rounded-t-3xl border border-line bg-black p-5 sm:rounded-3xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#333] sm:hidden" />

        <div className="mb-1 flex items-center justify-between">
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white/80">練習題 · 開始前先試一次</span>
          {phase !== 'done' && (
            <button onClick={onFinish} className="text-xs text-mute hover:text-white">跳過</button>
          )}
        </div>

        {/* 教練提示 */}
        <div className="mb-3 rounded-2xl bg-[#181818] p-3 text-sm leading-relaxed text-white/90">
          {phase === 'brief' && (
            <>👋 網路上有人說「今天下紅色的雨」，還附了照片瘋傳。是真的嗎？<b className="text-white"> 點下面那張圖，放大看看。</b></>
          )}
          {phase === 'zoom' && (
            <>🔍 放大了！仔細看照片，有沒有哪裡不對勁？<b className="text-white"> 覺得可疑的地方，點一下。</b></>
          )}
          {phase === 'done' && (
            <>🎯 你抓到了！照片角落的日期是 <b className="text-warn">2019 年</b>——這是好幾年前的舊照，根本不是「今天」。<br />這就是事實查核：<b className="text-white">多看一眼細節，就不會被騙。</b>正式遊戲裡藏了 <b className="text-white">10 個破綻</b>，越後面越難、還有<b className="text-brand"> 👑 魔王級</b>的——<b className="text-white">一般人找不齊，你能抓到幾個？</b></>
          )}
        </div>

        {/* 練習用的貼文 / 放大圖 */}
        {phase === 'brief' && (
          <div className="rounded-2xl border border-[#1a1a1a] p-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full text-base" style={{ background: 'linear-gradient(135deg,#3a3a3a,#1c1c1c)' }}>😱</span>
              <div className="text-sm">
                <div className="font-semibold">轉貼王</div>
                <div className="text-[11px] text-mute">剛剛</div>
              </div>
            </div>
            <p className="mt-2 text-[15px] leading-snug">【瘋傳】台北今天下起紅色的雨，是不是要地震了？！大家快轉發🙏</p>
            <button onClick={() => setPhase('zoom')} className="mt-2 block w-full cursor-zoom">
              <SampleSky />
              <span className="mt-1 inline-block rounded-full border border-[#333] px-2.5 py-1 text-xs text-white/70">🔍 點我放大</span>
            </button>
          </div>
        )}

        {(phase === 'zoom' || phase === 'done') && (
          <div className="rounded-2xl border border-[#1a1a1a] p-3">
            <div className="relative">
              <SampleSky big revealed={phase === 'done'} />
              {phase === 'zoom' && (
                <button
                  onClick={() => setPhase('done')}
                  className="absolute bottom-1.5 right-1.5 h-6 w-24 animate-pulse rounded ring-2 ring-warn/80 hover:bg-warn/20"
                  title="這裡怪怪的？"
                />
              )}
            </div>
          </div>
        )}

        <button
          onClick={phase === 'done' ? onFinish : undefined}
          disabled={phase !== 'done'}
          className={`mt-4 w-full rounded-full py-3 font-bold transition ${
            phase === 'done' ? 'bg-white text-black hover:bg-white/90' : 'cursor-not-allowed bg-white/15 text-white/40'
          }`}
        >
          {phase === 'done' ? '我學會了，開始' : '照著上面的提示做做看'}
        </button>
      </div>
    </div>
  )
}

// 練習用的「紅雨」照片，右下角有 2019 日期浮水印（破綻）
function SampleSky({ big, revealed }) {
  return (
    <div className={`relative overflow-hidden rounded-lg border border-black/40 ${big ? 'h-48' : 'h-32'}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#7a1f1f] via-[#a83232] to-[#2a1414]" />
      {/* 建物剪影 */}
      <svg viewBox="0 0 300 120" className="absolute bottom-0 h-1/2 w-full" preserveAspectRatio="none">
        <polygon points="0,120 0,70 30,70 30,50 60,50 60,80 100,80 100,40 140,40 140,75 190,75 190,55 240,55 240,85 300,85 300,120" fill="#1a0d0d" />
      </svg>
      {/* 日期浮水印（破綻） */}
      <div className={`absolute bottom-1 right-1.5 font-mono text-[11px] ${revealed ? 'rounded bg-danger/30 px-1 text-white ring-2 ring-danger' : 'text-white/70'}`}>
        2019/07/20
      </div>
    </div>
  )
}

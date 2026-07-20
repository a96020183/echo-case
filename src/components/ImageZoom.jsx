import { useState } from 'react'
import FakeShot from './FakeShot.jsx'

// 放大鏡：
//  - method 'zoom'    → 圖中破綻位置出現可點擊高亮，點了揭露
//  - method 'reverse' → 提供「以圖搜圖」反查來源
export default function ImageZoom({ ev, alreadyFound, onFind, onClose }) {
  const [revealed, setRevealed] = useState(alreadyFound)
  const clue = ev.clue
  const method = clue?.method

  const reveal = () => {
    setRevealed(true)
    if (!alreadyFound) onFind?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md animate-pop rounded-2xl border border-line bg-panel p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-white/80">🔍 放大檢查</span>
          <button onClick={onClose} className="text-mute hover:text-white">✕</button>
        </div>

        {/* FakeShot 自己畫破綻高亮，位置保證對齊 */}
        <FakeShot
          shot={ev.shot}
          audio={ev.audio}
          inspect={method === 'zoom'}
          revealed={revealed && method === 'zoom'}
          onInspect={reveal}
        />

        {/* 反查來源按鈕 */}
        {method === 'reverse' && !revealed && (
          <button
            onClick={reveal}
            className="mt-3 w-full rounded-lg border border-accent/50 bg-accent/10 py-2 text-sm font-semibold text-accent hover:bg-accent/20"
          >
            ♻️ 以圖搜圖（反查來源）
          </button>
        )}

        {/* 說明 / 結果 */}
        {!revealed ? (
          <p className="mt-3 text-xs text-mute">{clue?.hint || '仔細看看有沒有不對勁的地方。'}</p>
        ) : (
          <div className="mt-3 animate-fadeup rounded-lg border border-danger/40 bg-danger/10 p-3">
            <p className="text-sm font-bold text-danger">🚩 抓到破綻！</p>
            <p className="mt-1 text-sm text-white/90">{clue.found}</p>
            {clue.reverseResult && (
              <div className="mt-2 rounded border border-line bg-panel2 p-2 text-xs">
                <div className="mb-2 font-semibold text-white/90">以圖搜圖：找到 1 筆相同圖片</div>
                {/* 視覺比對：兩張一模一樣 */}
                <div className="flex items-stretch gap-2">
                  <div className="flex-1">
                    <MiniAlley label="你手上的「當晚」圖" tag="今天" tagClass="bg-danger/30 text-danger" />
                  </div>
                  <div className="flex items-center text-lg text-warn">=</div>
                  <div className="flex-1">
                    <MiniAlley label={clue.reverseResult.source} tag="2020" tagClass="bg-warn/30 text-warn" />
                  </div>
                </div>
                <div className="mt-2 text-mute">{clue.reverseResult.title}</div>
                <div className="mt-1 font-semibold text-warn">{clue.reverseResult.note}</div>
              </div>
            )}
            <p className="mt-2 text-xs text-mute">{clue.truth}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// 反查比對用的小縮圖：與「當晚後門畫面」同一張巷弄圖
function MiniAlley({ label, tag, tagClass }) {
  return (
    <div>
      <div className="relative flex h-16 items-center justify-center overflow-hidden rounded border border-black/40 bg-gradient-to-b from-[#1a2230] to-[#05070c]">
        <span className="text-2xl opacity-70">🌃</span>
        <span className={`absolute right-1 top-1 rounded px-1 text-[9px] font-bold ${tagClass}`}>{tag}</span>
      </div>
      <div className="mt-1 truncate text-[10px] text-mute">{label}</div>
    </div>
  )
}

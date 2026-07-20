import { useState } from 'react'
import FakeShot from './FakeShot.jsx'
import ImageZoom from './ImageZoom.jsx'
import { useGame } from '../game/GameContext.jsx'

// 通用貼文/私訊卡片。有圖/錄音的可放大查破綻。
export default function PostCard({ ev, onOpenAccount }) {
  const { findClue, isClueFound } = useGame()
  const [zoom, setZoom] = useState(false)
  const hasMedia = ev.shot || ev.audio
  const clueFound = ev.clue ? isClueFound(ev.clue.id) : false

  return (
    <div className="rounded-xl border border-line bg-panel2 p-3 animate-fadeup">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-panel text-lg">{ev.avatar}</div>
        <div className="min-w-0 flex-1">
          <button
            onClick={() => onOpenAccount?.(ev)}
            className="truncate text-sm font-semibold text-white hover:text-accent"
          >
            {ev.author}
          </button>
          <div className="text-[11px] text-mute">{ev.at} · {ev.time}</div>
        </div>
        {clueFound && <span className="rounded bg-danger/20 px-1.5 py-0.5 text-[10px] font-bold text-danger">已存疑</span>}
      </div>

      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/90">{ev.body}</p>

      {hasMedia && (
        <div className="mt-2">
          <div className="cursor-zoom" onClick={() => setZoom(true)}>
            <FakeShot shot={ev.shot} audio={ev.audio} small />
          </div>
          <button
            onClick={() => setZoom(true)}
            className="mt-2 inline-flex items-center gap-1 rounded-lg border border-line bg-panel px-2.5 py-1 text-xs text-white/80 hover:border-accent hover:text-accent"
          >
            🔍 放大檢查
          </button>
        </div>
      )}

      {(ev.likes != null) && (
        <div className="mt-2 flex gap-4 text-[11px] text-mute">
          <span>👍 {ev.likes?.toLocaleString?.() ?? ev.likes}</span>
          <span>🔁 {ev.shares?.toLocaleString?.() ?? ev.shares}</span>
        </div>
      )}

      {zoom && (
        <ImageZoom
          ev={ev}
          alreadyFound={clueFound}
          onFind={() => findClue(ev.clue.id, ev.id)}
          onClose={() => setZoom(false)}
        />
      )}
    </div>
  )
}

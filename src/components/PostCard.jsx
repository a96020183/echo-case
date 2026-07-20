import { useState } from 'react'
import FakeShot from './FakeShot.jsx'
import ImageZoom from './ImageZoom.jsx'
import { useGame } from '../game/GameContext.jsx'

// variant: 'thread'（Threads 風動態） | 'dm'（私訊對話風）
export default function PostCard({ ev, onOpenAccount, variant = 'thread' }) {
  const { findClue, isClueFound } = useGame()
  const [zoom, setZoom] = useState(false)
  const hasMedia = ev.shot || ev.audio
  const clueFound = ev.clue ? isClueFound(ev.clue.id) : false

  const Media = hasMedia && (
    <div className="mt-2">
      <div className="cursor-zoom" onClick={() => setZoom(true)}>
        <FakeShot shot={ev.shot} audio={ev.audio} />
      </div>
      <button
        onClick={() => setZoom(true)}
        className="mt-2 inline-flex items-center gap-1 rounded-full border border-line bg-panel px-2.5 py-1 text-xs text-white/80 hover:border-accent hover:text-accent"
      >
        🔍 放大檢查
      </button>
    </div>
  )

  const ZoomModal = zoom && (
    <ImageZoom
      ev={ev}
      alreadyFound={clueFound}
      onFind={() => findClue(ev.clue.id, ev.id)}
      onClose={() => setZoom(false)}
    />
  )

  // 私訊對話風
  if (variant === 'dm') {
    return (
      <div className="animate-fadeup">
        <button onClick={() => onOpenAccount?.(ev)} className="mb-1 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-panel2 text-base">{ev.avatar}</span>
          <span className="text-xs font-semibold text-white/80">{ev.author}</span>
          <span className="text-[10px] text-mute">{ev.at}</span>
        </button>
        <div className="ml-9 max-w-[85%] rounded-2xl rounded-tl-sm bg-panel2 p-3">
          <p className="whitespace-pre-line text-sm leading-relaxed text-white/90">{ev.body}</p>
          {Media}
          <div className="mt-1 text-right text-[10px] text-mute">{ev.time}</div>
        </div>
        {clueFound && <div className="ml-9 mt-1 text-[11px] font-semibold text-danger">🚩 你已標記此訊息存疑</div>}
        {ZoomModal}
      </div>
    )
  }

  // Threads 風動態
  return (
    <article className="flex gap-3 border-b border-[#262626] py-3 animate-fadeup">
      <button onClick={() => onOpenAccount?.(ev)} className="shrink-0">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-panel2 text-lg">{ev.avatar}</span>
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 text-sm">
          <button onClick={() => onOpenAccount?.(ev)} className="font-semibold text-white hover:underline">
            {ev.at?.replace('@', '') || ev.author}
          </button>
          {ev.official && <VerifiedBadge />}
          <span className="text-mute">· {ev.time}</span>
          {clueFound && (
            <span className="ml-auto rounded-full bg-danger/20 px-2 py-0.5 text-[10px] font-bold text-danger">已存疑</span>
          )}
        </div>

        <p className="mt-0.5 whitespace-pre-line text-sm leading-relaxed text-white/95">{ev.body}</p>

        {Media}

        {/* Threads 動作列 */}
        <div className="mt-2 flex items-center gap-5 text-mute">
          <Action icon={<HeartIcon />} label={ev.likes} />
          <Action icon={<ReplyIcon />} label={ev.shares != null ? Math.round(ev.shares / 3) : null} />
          <Action icon={<RepostIcon />} label={ev.shares} />
          <Action icon={<SendIcon />} />
        </div>
      </div>
      {ZoomModal}
    </article>
  )
}

function Action({ icon, label }) {
  return (
    <button className="flex items-center gap-1 text-xs transition hover:text-white/90">
      {icon}
      {label != null && <span>{label?.toLocaleString?.() ?? label}</span>}
    </button>
  )
}

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-brand" fill="currentColor" aria-label="已驗證">
      <path d="M12 2l2.4 1.8 3-.2 1 2.8 2.6 1.6-1 2.9 1 2.9-2.6 1.6-1 2.8-3-.2L12 22l-2.4-1.8-3 .2-1-2.8L3 16.2l1-2.9-1-2.9 2.6-1.6 1-2.8 3 .2L12 2zm-1.2 12.8l4.9-4.9-1.3-1.3-3.6 3.6-1.6-1.6L7.9 12l2.9 2.8z" />
    </svg>
  )
}

// 線條風圖示（Threads 感）
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.5 12 20 12 20z" strokeLinejoin="round" />
    </svg>
  )
}
function ReplyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" strokeLinejoin="round" />
    </svg>
  )
}
function RepostIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 8l3-3 3 3M7 5v9a2 2 0 0 0 2 2h6M20 16l-3 3-3-3M17 19v-9a2 2 0 0 0-2-2H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 3L11 14M22 3l-7 18-4-7-7-4 18-7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

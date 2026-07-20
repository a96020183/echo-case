import { useState } from 'react'
import FakeShot from './FakeShot.jsx'
import ImageZoom from './ImageZoom.jsx'
import { useGame } from '../game/GameContext.jsx'

// variant: 'thread'（Threads 貼文，力求擬真） | 'dm'（私訊對話）
export default function PostCard({ ev, onOpenAccount, variant = 'thread' }) {
  const { findClue, isClueFound } = useGame()
  const [zoom, setZoom] = useState(false)
  const [liked, setLiked] = useState(false)
  const hasMedia = ev.shot || ev.audio
  const clueFound = ev.clue ? isClueFound(ev.clue.id) : false
  const name = ev.at?.replace('@', '') || ev.author

  const Media = hasMedia && (
    <div className="mt-2">
      <div className="cursor-zoom overflow-hidden rounded-2xl border border-[#2e2e2e]" onClick={() => setZoom(true)}>
        <FakeShot shot={ev.shot} audio={ev.audio} />
      </div>
      <button
        onClick={() => setZoom(true)}
        className="mt-2 inline-flex items-center gap-1 rounded-full border border-[#333] px-2.5 py-1 text-xs text-white/70 hover:border-white/50 hover:text-white"
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
          <Avatar ev={ev} size="h-7 w-7" text="text-base" />
          <span className="text-xs font-semibold text-white/80">{ev.author}</span>
          <span className="text-[10px] text-mute">{ev.at}</span>
        </button>
        <div className="ml-9 max-w-[85%] rounded-2xl rounded-tl-sm bg-[#1e1e1e] p-3">
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-white">{ev.body}</p>
          {Media}
          <div className="mt-1 text-right text-[10px] text-mute">{ev.time}</div>
        </div>
        {clueFound && <div className="ml-9 mt-1 text-[11px] font-semibold text-danger">🚩 你已標記此訊息存疑</div>}
        {ZoomModal}
      </div>
    )
  }

  // Threads 貼文
  const likeBase = ev.likes || 0
  return (
    <article className="flex gap-3 border-b border-[#1a1a1a] px-1 py-3 animate-fadeup">
      <button onClick={() => onOpenAccount?.(ev)} className="shrink-0">
        <Avatar ev={ev} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <button onClick={() => onOpenAccount?.(ev)} className="text-[15px] font-semibold text-white hover:underline">
            {name}
          </button>
          {ev.official && <VerifiedBadge />}
          <span className="ml-1 text-[15px] text-mute">{ev.time}</span>
          <button className="ml-auto text-mute hover:text-white" aria-label="更多">
            <DotsIcon />
          </button>
        </div>

        <p className="mt-0.5 whitespace-pre-line text-[15px] leading-[1.45] text-white">{ev.body}</p>

        {Media}

        {/* Threads 動作列 */}
        <div className="-ml-2 mt-2 flex items-center text-white">
          <ActionBtn onClick={() => setLiked((v) => !v)} active={liked}>
            <HeartIcon filled={liked} />
          </ActionBtn>
          <ActionBtn><ReplyIcon /></ActionBtn>
          <ActionBtn><RepostIcon /></ActionBtn>
          <ActionBtn><SendIcon /></ActionBtn>
        </div>

        {/* 讚數 / 回覆數 meta */}
        <div className="mt-1 text-[13px] text-mute">
          {ev.shares != null && <span>{Math.round(ev.shares / 3).toLocaleString()} 則回覆</span>}
          {ev.shares != null && (ev.likes != null) && <span> · </span>}
          {ev.likes != null && <span>{(likeBase + (liked ? 1 : 0)).toLocaleString()} 個讚</span>}
          {clueFound && <span className="ml-2 font-semibold text-danger">· 🚩 已存疑</span>}
        </div>
      </div>
      {ZoomModal}
    </article>
  )
}

function Avatar({ ev, size = 'h-9 w-9', text = 'text-lg' }) {
  return (
    <span
      className={`grid ${size} place-items-center rounded-full ${text}`}
      style={{ background: 'linear-gradient(135deg,#3a3a3a,#1c1c1c)' }}
    >
      {ev.avatar}
    </span>
  )
}

function ActionBtn({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full p-2 transition hover:bg-white/10 ${active ? 'text-danger' : 'text-white'}`}
    >
      {children}
    </button>
  )
}

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px] text-brand" fill="currentColor" aria-label="已驗證">
      <path d="M12 2l2.4 1.8 3-.2 1 2.8 2.6 1.6-1 2.9 1 2.9-2.6 1.6-1 2.8-3-.2L12 22l-2.4-1.8-3 .2-1-2.8L3 16.2l1-2.9-1-2.9 2.6-1.6 1-2.8 3 .2L12 2zm-1.2 12.8l4.9-4.9-1.3-1.3-3.6 3.6-1.6-1.6L7.9 12l2.9 2.8z" />
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  )
}
function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9">
      <path d="M12 20.3l-1.4-1.3C5.4 14.3 2 11.2 2 7.6 2 5 4 3 6.5 3c1.5 0 3 .7 3.9 1.9L12 6.3l1.6-1.4C14.5 3.7 16 3 17.5 3 20 3 22 5 22 7.6c0 3.6-3.4 6.7-8.6 11.4L12 20.3z" strokeLinejoin="round" />
    </svg>
  )
}
function ReplyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M20.5 11.3c0 4.3-3.8 7.7-8.5 7.7-1 0-2-.2-2.9-.5L4 20l1.4-4.2C4.5 14.5 4 12.9 4 11.3 4 7 7.8 3.6 12.5 3.6S20.5 7 20.5 11.3z" strokeLinejoin="round" />
    </svg>
  )
}
function RepostIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M17 2.5L20.5 6 17 9.5M20 6H8a4 4 0 0 0-4 4v1M7 21.5L3.5 18 7 14.5M4 18h12a4 4 0 0 0 4-4v-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M22 3L2 10l7 3 3 7 10-17z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

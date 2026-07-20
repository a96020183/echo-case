import { useGame } from '../game/GameContext.jsx'

// 查帳號：顯示註冊日、貼文數、歷史。若此帳號藏 account 類破綻，查看即揭露。
export default function AccountModal({ ev, onClose }) {
  const { findClue, markAccountChecked, isClueFound } = useGame()
  const acc = ev.account || {}
  const isAccountClue = ev.clue?.method === 'account'
  const found = isAccountClue ? isClueFound(ev.clue.id) : false

  const handleReveal = () => {
    markAccountChecked(ev.id)
    if (isAccountClue && !found) findClue(ev.clue.id, ev.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm animate-pop rounded-2xl border border-line bg-panel p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-white/80">👤 帳號資訊</span>
          <button onClick={onClose} className="text-mute hover:text-white">✕</button>
        </div>

        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-panel2 text-2xl">{ev.avatar}</div>
          <div>
            <div className="font-bold text-white">{ev.author}</div>
            <div className="text-xs text-mute">{ev.at}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="註冊" value={acc.created || '不明'} warn={/前|當天/.test(acc.created || '')} />
          <Stat label="貼文" value={acc.posts ?? '—'} warn={acc.posts != null && acc.posts <= 3} />
          <Stat label="追蹤" value={acc.followers ?? '—'} />
        </div>
        {acc.note && <p className="mt-3 text-xs text-mute">{acc.note}</p>}

        {isAccountClue && !found && (
          <button
            onClick={handleReveal}
            className="mt-4 w-full rounded-lg border border-warn/50 bg-warn/10 py-2 text-sm font-semibold text-warn hover:bg-warn/20"
          >
            這個帳號可信嗎？仔細看看
          </button>
        )}

        {isAccountClue && found && (
          <div className="mt-4 animate-fadeup rounded-lg border border-danger/40 bg-danger/10 p-3">
            <p className="text-sm font-bold text-danger">🚩 抓到破綻！</p>
            <p className="mt-1 text-sm text-white/90">{ev.clue.found}</p>
            <p className="mt-2 text-xs text-mute">{ev.clue.truth}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, warn }) {
  return (
    <div className={`rounded-lg border p-2 ${warn ? 'border-warn/50 bg-warn/10' : 'border-line bg-panel2'}`}>
      <div className={`text-sm font-bold ${warn ? 'text-warn' : 'text-white'}`}>{value}</div>
      <div className="text-[10px] text-mute">{label}</div>
    </div>
  )
}

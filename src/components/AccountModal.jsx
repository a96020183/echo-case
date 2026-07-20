import { useGame } from '../game/GameContext.jsx'

// Threads 個人檔案風。查帳號註冊日/貼文/歷史；藏 account 破綻的帳號查看即揭露。
export default function AccountModal({ ev, onClose }) {
  const { findClue, markAccountChecked, isClueFound, isFollowing, toggleFollow } = useGame()
  const following = isFollowing(ev.at)
  const acc = ev.account || {}
  const isAccountClue = ev.clue?.method === 'account'
  const found = isAccountClue ? isClueFound(ev.clue.id) : false

  const handleReveal = () => {
    markAccountChecked(ev.id)
    if (isAccountClue && !found) findClue(ev.clue.id, ev.id)
  }

  const suspicious = /前|當天/.test(acc.created || '') || (acc.posts != null && acc.posts <= 3)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-sm animate-fadeup rounded-t-3xl border border-line bg-black p-5 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 抓握條 */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#333] sm:hidden" />

        {/* 檔案頭 */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold">{ev.author}</span>
              {ev.official && <VerifiedBadge />}
            </div>
            <div className="text-sm text-mute">{ev.at}</div>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-full bg-panel2 text-3xl">{ev.avatar}</div>
        </div>

        {acc.note && <p className="mt-3 text-sm text-white/90">{acc.note}</p>}

        <div className="mt-3 flex items-center gap-4 text-sm text-mute">
          <span>
            <b className={`${/前|當天/.test(acc.created || '') ? 'text-danger' : 'text-white'}`}>{acc.created || '註冊日不明'}</b> 加入
          </span>
          <span>·</span>
          <span>
            <b className={`${acc.posts != null && acc.posts <= 3 ? 'text-danger' : 'text-white'}`}>{acc.posts ?? '—'}</b> 則貼文
          </span>
          <span>·</span>
          <span><b className="text-white">{acc.followers ?? '—'}</b> 粉絲</span>
        </div>

        {/* Threads 藥丸鈕 */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => toggleFollow(ev.at)}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
              following ? 'border border-line text-white/80 hover:border-white/50' : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            {following ? '追蹤中 ✓' : '追蹤'}
          </button>
          <button onClick={onClose} className="flex-1 rounded-xl border border-line py-2 text-sm font-semibold text-white">
            關閉
          </button>
        </div>

        {isAccountClue && !found && (
          <button
            onClick={handleReveal}
            className={`mt-3 w-full rounded-xl border py-2 text-sm font-semibold ${
              suspicious ? 'border-warn/50 bg-warn/10 text-warn' : 'border-line text-white/80'
            }`}
          >
            這個帳號可信嗎？仔細看看
          </button>
        )}

        {isAccountClue && found && (
          <div className="mt-3 animate-fadeup rounded-xl border border-danger/40 bg-danger/10 p-3">
            <p className="text-sm font-bold text-danger">🚩 抓到破綻！</p>
            <p className="mt-1 text-sm text-white/90">{ev.clue.found}</p>
            <p className="mt-2 text-xs text-mute">{ev.clue.truth}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand" fill="currentColor" aria-label="已驗證">
      <path d="M12 2l2.4 1.8 3-.2 1 2.8 2.6 1.6-1 2.9 1 2.9-2.6 1.6-1 2.8-3-.2L12 22l-2.4-1.8-3 .2-1-2.8L3 16.2l1-2.9-1-2.9 2.6-1.6 1-2.8 3 .2L12 2zm-1.2 12.8l4.9-4.9-1.3-1.3-3.6 3.6-1.6-1.6L7.9 12l2.9 2.8z" />
    </svg>
  )
}

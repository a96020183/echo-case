import { useState } from 'react'
import { search } from '../../game/data/content.js'
import { useGame } from '../../game/GameContext.jsx'
import AccountModal from '../AccountModal.jsx'

// 假搜尋引擎 + 帳號反查。輸入關鍵字比對 search 表；查到關鍵資訊會 unlock。
export default function BrowserApp({ items }) {
  const { unlockSearch } = useGame()
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)
  const [account, setAccount] = useState(null)

  // 這一幕出現、可查帳號的對象
  const accounts = items.filter((e) => e.account)

  const run = () => {
    const key = q.trim().toLowerCase()
    const matched = search[key] || search[q.trim()] || null
    setResults(matched)
    if (matched) matched.forEach((r) => r.unlocks && unlockSearch(r.unlocks))
  }

  return (
    <div className="space-y-3">
      <div className="sticky top-0 z-10 -mx-3 mb-1 flex items-center justify-center border-b border-line bg-black/95 px-3 py-2 backdrop-blur">
        <span className="text-base font-bold">搜尋</span>
      </div>

      {/* Threads 風搜尋列（藥丸） */}
      <div className="flex items-center gap-2 rounded-full bg-panel2 px-4 py-2.5">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-mute" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="搜尋（試試「阿聲」「Lisa」「阿聲 病史」）"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-mute"
        />
        {q && (
          <button onClick={run} className="text-xs font-semibold text-brand">
            搜尋
          </button>
        )}
      </div>

      {results === null && (
        <p className="px-1 text-xs text-mute">輸入關鍵字查資料。查證消息來源，是抓假訊息的第一步。</p>
      )}
      {results && results.length === 0 && <p className="text-sm text-mute">查無結果。</p>}
      {results?.map((r, i) => (
        <div
          key={i}
          className={`rounded-xl border p-3 ${r.key ? 'border-ok/40 bg-ok/5' : 'border-line bg-panel2'}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-accent">{r.title}</span>
            {r.fake && <span className="rounded bg-danger/20 px-1.5 py-0.5 text-[10px] text-danger">內容農場</span>}
            {r.key && <span className="rounded bg-ok/20 px-1.5 py-0.5 text-[10px] text-ok">可信來源</span>}
          </div>
          <p className="mt-1 text-xs text-white/80">{r.snippet}</p>
        </div>
      ))}

      {accounts.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-semibold text-mute">可查證的帳號</div>
          {accounts.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setAccount(ev)}
              className="mb-2 flex w-full items-center gap-2 rounded-xl border border-line bg-panel2 p-2 text-left hover:border-accent"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-panel text-lg">{ev.avatar}</span>
              <span className="text-sm">
                <span className="font-semibold text-white">{ev.author}</span>
                <span className="block text-[11px] text-mute">{ev.at} · 點擊查帳號底細</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {account && <AccountModal ev={account} onClose={() => setAccount(null)} />}
    </div>
  )
}

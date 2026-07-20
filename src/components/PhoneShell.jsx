import { useState } from 'react'
import FeedApp from './apps/FeedApp.jsx'
import MessagesApp from './apps/MessagesApp.jsx'
import BrowserApp from './apps/BrowserApp.jsx'
import EvidenceApp from './apps/EvidenceApp.jsx'
import { useGame } from '../game/GameContext.jsx'

const APPS = [
  { key: 'feed', icon: '🌊', label: '動態' },
  { key: 'messages', icon: '✉️', label: '私訊' },
  { key: 'browser', icon: '🌐', label: '搜尋' },
  { key: 'evidence', icon: '🧭', label: '證據板' },
]

export default function PhoneShell({ items, hint }) {
  const { state } = useGame()
  const [active, setActive] = useState('feed')

  // 各 app 是否有本幕內容（顯示紅點）
  const has = {
    feed: items.some((e) => e.app === 'feed'),
    messages: items.some((e) => e.app === 'messages'),
    browser: true,
    evidence: state.actIndex >= 4,
  }

  return (
    <div className="mx-auto w-full max-w-[380px]">
      {/* 手機外框 */}
      <div className="relative rounded-[2.2rem] border-[6px] border-[#2a2f3a] bg-ink shadow-2xl">
        {/* 瀏海 */}
        <div className="absolute left-1/2 top-0 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-[#2a2f3a]" />
        {/* 狀態列 */}
        <div className="flex items-center justify-between px-5 pt-2.5 text-[11px] text-white/70">
          <span className="font-mono">21:0{Math.min(9, state.actIndex + 1)}</span>
          <span>📶 🔋</span>
        </div>

        {/* 內容區 */}
        <div className="no-scrollbar h-[520px] overflow-y-auto px-3 pb-3 pt-2">
          {active === 'feed' && <FeedApp items={items} />}
          {active === 'messages' && <MessagesApp items={items} />}
          {active === 'browser' && <BrowserApp items={items} />}
          {active === 'evidence' && <EvidenceApp items={items} />}
        </div>

        {/* App dock */}
        <div className="flex items-center justify-around border-t border-line bg-panel/80 px-2 py-2">
          {APPS.map((a) => (
            <button
              key={a.key}
              onClick={() => setActive(a.key)}
              className={`relative flex flex-col items-center rounded-lg px-3 py-1 text-[10px] transition ${
                active === a.key ? 'text-accent' : 'text-mute hover:text-white'
              }`}
            >
              <span className="text-lg">{a.icon}</span>
              {a.label}
              {has[a.key] && active !== a.key && (
                <span className="absolute right-1.5 top-0.5 h-2 w-2 rounded-full bg-danger" />
              )}
            </button>
          ))}
        </div>
      </div>

      {hint && <p className="mt-3 text-center text-xs text-mute">{hint}</p>}
    </div>
  )
}

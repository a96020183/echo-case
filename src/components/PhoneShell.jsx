import { useState } from 'react'
import FeedApp from './apps/FeedApp.jsx'
import MessagesApp from './apps/MessagesApp.jsx'
import BrowserApp from './apps/BrowserApp.jsx'
import EvidenceApp from './apps/EvidenceApp.jsx'
import { useGame } from '../game/GameContext.jsx'

const APPS = [
  { key: 'feed', label: '動態', Icon: HomeIcon },
  { key: 'browser', label: '搜尋', Icon: SearchIcon },
  { key: 'messages', label: '私訊', Icon: DMIcon },
  { key: 'evidence', label: '證據板', Icon: PinIcon },
]

export default function PhoneShell({ items, hint }) {
  const { state } = useGame()
  const [active, setActive] = useState('feed')

  const has = {
    feed: items.some((e) => e.app === 'feed'),
    messages: items.some((e) => e.app === 'messages'),
    browser: false,
    evidence: state.actIndex >= 4,
  }

  return (
    <div className="mx-auto w-full max-w-[380px]">
      <div className="relative overflow-hidden rounded-[2.4rem] border-[7px] border-[#1a1a1a] bg-black shadow-2xl">
        {/* 狀態列 */}
        <div className="flex items-center justify-between bg-black px-6 pt-2.5 text-[11px] font-semibold text-white">
          <span className="font-mono">21:0{Math.min(9, state.actIndex + 1)}</span>
          <span className="text-[10px]">📶 🔋</span>
        </div>

        {/* Threads 頂欄 logo（僅動態頁，擬真） */}
        {active === 'feed' && (
          <div className="flex items-center justify-center bg-black pb-1 pt-1">
            <ThreadsLogo />
          </div>
        )}

        {/* 內容區 */}
        <div className="no-scrollbar h-[500px] overflow-y-auto bg-black px-3 pb-3">
          {active === 'feed' && <FeedApp items={items} />}
          {active === 'messages' && <MessagesApp items={items} />}
          {active === 'browser' && <BrowserApp items={items} />}
          {active === 'evidence' && <EvidenceApp items={items} />}
        </div>

        {/* Threads 底部導覽 */}
        <div className="flex items-center justify-around border-t border-line bg-black px-2 py-2.5">
          {APPS.map(({ key, label, Icon }) => {
            const on = active === key
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                aria-label={label}
                className={`relative rounded-lg px-4 py-1.5 transition ${on ? 'text-white' : 'text-[#4d4d4d] hover:text-[#888]'}`}
              >
                <Icon filled={on} />
                {has[key] && !on && <span className="absolute right-2.5 top-1 h-2 w-2 rounded-full bg-danger" />}
              </button>
            )
          })}
        </div>
      </div>

      {hint && <p className="mt-3 text-center text-xs text-mute">{hint}</p>}
    </div>
  )
}

// 近似 Threads 的 @ 標誌
function ThreadsLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="currentColor">
      <path d="M12.5 2C7.4 2 4 5.4 4 11.9c0 6.7 3.5 10.1 8.6 10.1 2.6 0 4.6-.9 6-2.5l-1.7-1.4c-1 1.1-2.4 1.7-4.2 1.7-3.7 0-6-2.5-6-7.9 0-5.2 2.2-7.5 6-7.5 3.5 0 5.5 2 5.7 5.4-.5-1-1.7-2.2-3.9-2.2-2.6 0-4.4 1.8-4.4 4.2 0 2.3 1.7 4 4.1 4 2 0 3.4-1.1 4-2.6.5 1.4.6 3.1.2 4.6l2 .5c.8-2.9.5-8.9-1-11.4C18 3.2 15.6 2 12.5 2zm.3 9.9c-1.2 0-2-.7-2-1.9s.9-2 2.1-2 2 .8 2 2-.9 1.9-2.1 1.9z" />
    </svg>
  )
}

function HomeIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3V10.5z" strokeLinejoin="round" />
    </svg>
  )
}
function SearchIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={filled ? 2.4 : 1.8}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  )
}
function DMIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M22 3L2 10l7 3 3 7 10-17z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
function PinIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.2" fill={filled ? '#000' : 'none'} />
    </svg>
  )
}

import { useState } from 'react'
import { useGame } from '../../game/GameContext.jsx'

// 證據板 / 時間軸：把線索攤開，交叉比對找矛盾。
export default function EvidenceApp({ items }) {
  const { state, findClue, isClueFound } = useGame()
  const [compared, setCompared] = useState(false)

  // 時間軸事實：程式從證據與已知指控組出
  const facts = []
  const alibi = items.find((e) => e.id === 'ev_lisa_alibi')
  const hasAccusation = state.verified.includes('ev_dm_receipt') || state.cluesFound.includes('c_receipt_ps')

  // 指控方說法（來自匿名爆料）
  facts.push({
    who: '匿名爆料',
    time: '19:30',
    place: '攝影棚（指控 Lisa 在場下毒）',
    tone: 'accuse',
  })
  if (alibi) {
    facts.push({
      who: 'Lisa 不在場證明',
      time: alibi.timelineFact.time,
      place: alibi.timelineFact.place,
      tone: 'alibi',
    })
  }

  const canCompare = !!alibi
  const conflictClueFound = isClueFound('c_alibi_conflict')

  const compare = () => {
    setCompared(true)
    if (alibi && !conflictClueFound) findClue('c_alibi_conflict', 'ev_lisa_alibi')
  }

  return (
    <div className="space-y-3">
      <div className="sticky top-0 z-10 -mx-3 mb-1 border-b border-line bg-panel/95 px-3 py-2 backdrop-blur">
        <span className="font-bold">🧭 證據板</span>
      </div>

      <p className="text-xs text-mute">把線索放上時間軸，看看有沒有互相矛盾的地方。</p>

      <div className="relative space-y-2 border-l-2 border-line pl-4">
        {facts.map((f, i) => (
          <div key={i} className="relative">
            <span
              className={`absolute -left-[22px] top-1 h-3 w-3 rounded-full ${
                f.tone === 'alibi' ? 'bg-ok' : 'bg-danger'
              }`}
            />
            <div className="rounded-xl border border-line bg-panel2 p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{f.who}</span>
                <span className="font-mono text-xs text-accent">{f.time}</span>
              </div>
              <div className="text-xs text-mute">{f.place}</div>
            </div>
          </div>
        ))}
      </div>

      {!canCompare && (
        <div className="rounded-xl border border-dashed border-line p-4 text-center text-xs text-mute">
          線索還不夠。先去動態看看 Lisa 有沒有回應。
        </div>
      )}

      {canCompare && !compared && !conflictClueFound && (
        <button
          onClick={compare}
          className="w-full rounded-lg border border-warn/50 bg-warn/10 py-2 text-sm font-semibold text-warn hover:bg-warn/20"
        >
          🧭 交叉比對這兩條時間線
        </button>
      )}

      {(compared || conflictClueFound) && (
        <div className="animate-fadeup rounded-lg border border-danger/40 bg-danger/10 p-3">
          <p className="text-sm font-bold text-danger">🚩 抓到矛盾！</p>
          <p className="mt-1 text-sm text-white/90">
            爆料說 Lisa 19:30 在攝影棚，但她同時段有高雄的高鐵票與打卡——兩者不可能同時成立。
          </p>
          <p className="mt-2 text-xs text-mute">Lisa 有明確不在場證明，指控她的時間線根本不成立。</p>
        </div>
      )}
    </div>
  )
}

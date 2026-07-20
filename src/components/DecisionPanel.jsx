import { useState } from 'react'
import { useGame } from '../game/GameContext.jsx'

// 發文/決策：選項有「衝動(impulse)」與「查證(cautious)」之分，影響流量與結局。
export default function DecisionPanel({ act, onClose }) {
  const { decide } = useGame()
  const [picked, setPicked] = useState(null)

  const choose = (opt) => setPicked(opt)
  const confirm = () => {
    decide(act.id, picked)
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 sm:items-center sm:p-4">
      <div className="w-full max-w-md animate-fadeup rounded-t-3xl border border-line bg-black p-5 sm:rounded-3xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#333] sm:hidden" />
        <div className="text-xs font-semibold text-mute">第 {act.no} 幕 · 決策</div>
        <h3 className="mt-1 text-lg font-bold">{act.decision.prompt}</h3>

        {!picked ? (
          <div className="mt-4 space-y-2">
            {act.decision.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => choose(opt)}
                className="flex w-full items-center justify-between rounded-xl border border-line bg-panel2 p-3 text-left text-sm hover:border-accent"
              >
                <span className="pr-2 text-white/90">{opt.label}</span>
                <span className={`shrink-0 font-mono text-xs ${opt.followerDelta >= 1000 ? 'text-warn' : 'text-mute'}`}>
                  {opt.followerDelta > 0 ? `+${opt.followerDelta.toLocaleString()}` : '±0'}
                </span>
              </button>
            ))}
            <p className="pt-1 text-center text-[11px] text-mute">右邊數字是預估流量增幅。流量誘人，但真相未必在那邊。</p>
          </div>
        ) : (
          <div className="mt-4 animate-fadeup">
            <div
              className={`rounded-xl border p-3 ${
                picked.tone === 'impulse' ? 'border-warn/40 bg-warn/10' : 'border-ok/40 bg-ok/10'
              }`}
            >
              <div className="text-sm font-semibold text-white/90">{picked.label}</div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className={picked.followerDelta >= 1000 ? 'text-warn font-bold' : 'text-mute'}>
                  追蹤 {picked.followerDelta > 0 ? `+${picked.followerDelta.toLocaleString()}` : '±0'}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/80">{picked.feedback}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setPicked(null)}
                className="flex-1 rounded-lg border border-line py-2 text-sm text-mute hover:text-white"
              >
                ← 重新考慮
              </button>
              <button
                onClick={confirm}
                className="flex-1 rounded-full bg-white py-2 text-sm font-bold text-black hover:bg-white/90"
              >
                確定，下一步
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

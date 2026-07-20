import { useState } from 'react'
import { useGame } from '../game/GameContext.jsx'

// 發文/決策。三種選項：
//   impulse 衝動（高流量、扣公信力；明知造假加重）
//   expose  揭穿（需查到本幕破綻才出現；中流量、加公信力）
//   cautious 保守（低流量、小加公信力）
export default function DecisionPanel({ act, clueKnown, onClose }) {
  const { decide } = useGame()
  const [picked, setPicked] = useState(null)

  // 沒查到破綻就不顯示「揭穿」選項
  const options = act.decision.options.filter((o) => !o.requiresClue || clueKnown)

  const confirm = () => {
    decide(act.id, picked, clueKnown)
    onClose?.()
  }

  const toneMeta = {
    impulse: { tag: '衝動', tagClass: 'bg-danger/20 text-danger' },
    expose: { tag: '揭穿', tagClass: 'bg-ok/20 text-ok' },
    cautious: { tag: '保守', tagClass: 'bg-white/10 text-white/70' },
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 sm:items-center sm:p-4">
      <div className="w-full max-w-md animate-fadeup rounded-t-3xl border border-line bg-black p-5 sm:rounded-3xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#333] sm:hidden" />
        <div className="text-xs font-semibold text-mute">第 {act.no} 幕 · 決策</div>
        <h3 className="mt-1 text-lg font-bold">{act.decision.prompt}</h3>

        {!picked ? (
          <div className="mt-4 space-y-2">
            {options.map((opt) => {
              const m = toneMeta[opt.tone] || toneMeta.cautious
              return (
                <button
                  key={opt.id}
                  onClick={() => setPicked(opt)}
                  className={`w-full rounded-2xl border p-3 text-left text-sm hover:border-white/40 ${
                    opt.tone === 'expose' ? 'border-ok/40 bg-ok/5' : 'border-line bg-[#141414]'
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${m.tagClass}`}>{m.tag}</span>
                    <Deltas opt={opt} />
                  </div>
                  <span className="text-white/90">{opt.label}</span>
                </button>
              )
            })}
            {clueKnown ? (
              <p className="pt-1 text-center text-[11px] text-ok">你查到了本幕破綻，解鎖了「揭穿」——公信力最高的選擇。</p>
            ) : (
              <p className="pt-1 text-center text-[11px] text-mute">流量誘人，但真相未必在那邊。查到破綻能解鎖更好的選擇。</p>
            )}
          </div>
        ) : (
          <div className="mt-4 animate-fadeup">
            <div
              className={`rounded-2xl border p-3 ${
                picked.tone === 'impulse'
                  ? 'border-danger/40 bg-danger/10'
                  : picked.tone === 'expose'
                    ? 'border-ok/40 bg-ok/10'
                    : 'border-white/15 bg-[#141414]'
              }`}
            >
              <div className="text-sm font-semibold text-white/90">{picked.label}</div>
              <div className="mt-2"><Deltas opt={picked} big knew={picked.tone === 'impulse' && clueKnown} /></div>
              <p className="mt-2 text-sm text-white/80">
                {picked.tone === 'impulse' && clueKnown && picked.knewText ? picked.knewText : picked.feedback}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setPicked(null)}
                className="flex-1 rounded-full border border-line py-2 text-sm text-mute hover:text-white"
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

// 顯示流量 / 公信力雙變化
function Deltas({ opt, big, knew }) {
  const f = opt.followerDelta || 0
  let t = opt.trustDelta || 0
  if (knew) t -= 8
  const size = big ? 'text-sm' : 'text-xs'
  return (
    <div className={`flex items-center gap-3 font-mono ${size}`}>
      <span className={f >= 3000 ? 'font-bold text-warn' : 'text-white/70'}>
        追蹤 {f > 0 ? `+${f.toLocaleString()}` : '±0'}
      </span>
      <span className={t > 0 ? 'text-ok' : t < 0 ? 'text-danger' : 'text-mute'}>
        公信力 {t > 0 ? `+${t}` : t}
        {knew && <span className="text-danger">（明知造假 −8）</span>}
      </span>
    </div>
  )
}

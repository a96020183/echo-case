import { socialActions } from '../game/data/content.js'

// 後果畫面：選了非「查證」的動作後，秀出痛苦的結果
export default function ConsequencePanel({ actionKey, consequence, act, onContinue }) {
  const action = socialActions[actionKey]
  const fDelta = consequence.followerDelta || 0
  const tDelta = consequence.trustDelta || 0

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/95 sm:items-center sm:p-4">
      <div className="w-full max-w-md animate-fadeup rounded-t-3xl border border-line bg-black p-5 sm:rounded-3xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#333] sm:hidden" />

        {/* 你做了什麼 */}
        <div className="mb-3 flex items-center gap-2 text-sm">
          <span className="text-xl">{action.icon}</span>
          <span className="font-semibold text-white/80">你選擇了：{action.label}</span>
        </div>

        {/* 標題 + 內文 */}
        <div className="rounded-2xl border border-danger/30 bg-danger/5 p-4">
          <h3 className="text-lg font-black text-danger">{consequence.headline}</h3>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/85">{consequence.body}</p>
          {consequence.victim && (
            <div className="mt-3 rounded-xl border border-danger/20 bg-black/40 p-3 text-[13px] text-danger/90">
              ⚠️ {consequence.victim}
            </div>
          )}
        </div>

        {/* 數據 */}
        <div className="mt-3 flex items-center gap-4 rounded-xl bg-panel2/60 px-4 py-2 text-sm font-mono">
          <span className={fDelta > 0 ? 'text-warn' : fDelta < 0 ? 'text-danger' : 'text-mute'}>
            追蹤 {fDelta > 0 ? `+${fDelta.toLocaleString()}` : fDelta < 0 ? fDelta.toLocaleString() : '±0'}
          </span>
          <span className={tDelta > 0 ? 'text-ok' : tDelta < 0 ? 'text-danger' : 'text-mute'}>
            公信力 {tDelta > 0 ? `+${tDelta}` : tDelta}
          </span>
        </div>

        {/* tag */}
        <div className="mt-3 text-center">
          <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[13px] font-semibold text-white/70">
            {consequence.tag}
          </span>
        </div>

        {/* 你本來可以…… */}
        <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-3 text-center text-sm text-accent/90">
          你本來可以「先查證再說」——看看真相到底是什麼。
        </div>

        <button
          onClick={onContinue}
          className="mt-4 w-full rounded-full bg-white py-3 font-bold text-black hover:bg-white/90 active:scale-[0.99]"
        >
          繼續 → 第 {(act.no || 0) + 1} 幕
        </button>
      </div>
    </div>
  )
}

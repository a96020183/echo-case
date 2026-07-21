import { socialActions } from '../game/data/content.js'

// 鎖定模式：每幕開頭強制選一個社群動作
// 只有「🔍 先查證再說」會進入偵探模式，其他直接跳後果
const ACTION_ORDER = ['share_criticize', 'like', 'reply_oppose', 'nothing', 'verify']

export default function SocialActionPanel({ act, onChoose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/90 sm:items-center sm:p-4">
      <div className="w-full max-w-md animate-fadeup rounded-t-3xl border border-line bg-black p-5 sm:rounded-3xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#333] sm:hidden" />

        {/* 鎖定提示 */}
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-full bg-danger/20 px-2 py-0.5 text-[10px] font-bold text-danger">🔒 鎖定模式</span>
          <span className="text-[11px] text-mute">第 {act.no} 幕</span>
        </div>

        <h3 className="text-lg font-black leading-tight">你看到了這些消息。<br />你的第一反應是？</h3>
        <p className="mt-2 text-sm text-white/60">這一步決定了後面的走向。選了就不能改。</p>

        <div className="mt-4 space-y-2">
          {ACTION_ORDER.map((key) => {
            const a = socialActions[key]
            const isVerify = key === 'verify'
            return (
              <button
                key={key}
                onClick={() => onChoose(key)}
                className={`w-full rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
                  isVerify
                    ? 'border-accent/50 bg-accent/5 hover:bg-accent/15'
                    : 'border-line bg-[#141414] hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{a.icon}</span>
                  <div>
                    <div className={`text-sm font-bold ${isVerify ? 'text-accent' : 'text-white/90'}`}>{a.label}</div>
                    <div className="text-[12px] text-white/50">{a.desc}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <p className="mt-3 text-center text-[11px] text-mute">
          大部分人會在 3 秒內做出反應——你呢？
        </p>
      </div>
    </div>
  )
}

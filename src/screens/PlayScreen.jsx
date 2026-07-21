import { useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '../game/GameContext.jsx'
import { acts, evidence as EV } from '../game/data/content.js'
import PhoneShell from '../components/PhoneShell.jsx'
import DecisionPanel from '../components/DecisionPanel.jsx'
import SocialActionPanel from '../components/SocialActionPanel.jsx'
import ConsequencePanel from '../components/ConsequencePanel.jsx'
import Tutorial from '../components/Tutorial.jsx'

export default function PlayScreen() {
  const { state, act, cluesFoundCount, advertisedTotal, nonBossFoundCount, bossFound, isHard, maxMisses, finishTutorial, chooseSocialAction, advanceFromConsequence } = useGame()
  const [showBrief, setShowBrief] = useState(true)
  const [showDecision, setShowDecision] = useState(false)
  const [toast, setToast] = useState(null)
  const prevClues = useRef(cluesFoundCount)
  const prevBoss = useRef(bossFound)

  // 換幕時重開簡報
  useEffect(() => {
    setShowBrief(true)
    setShowDecision(false)
  }, [state.actIndex])

  // 找到新破綻 → 冒出提示（魔王另給驚喜提示）
  useEffect(() => {
    if (cluesFoundCount > prevClues.current) {
      const justBoss = bossFound && !prevBoss.current
      setToast(justBoss ? '👑 等等……不是只有 9 個嗎？你發現了藏起來的第 10 個！' : '🚩 抓到一個破綻！查核紀錄 +1')
      const t = setTimeout(() => setToast(null), justBoss ? 3600 : 2200)
      prevClues.current = cluesFoundCount
      prevBoss.current = bossFound
      return () => clearTimeout(t)
    }
    prevClues.current = cluesFoundCount
    prevBoss.current = bossFound
  }, [cluesFoundCount, bossFound])

  // 目前為止累積的證據
  const items = useMemo(() => {
    const ids = new Set()
    for (let i = 0; i <= state.actIndex; i++) acts[i]?.evidenceIds?.forEach((id) => ids.add(id))
    return [...ids].map((id) => EV[id]).filter(Boolean)
  }, [state.actIndex])

  const showTutorial = state.actIndex === 0 && !state.tutorialDone

  return (
    <div className="w-full max-w-5xl animate-fadeup">
      {/* 頂部狀態 */}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-line bg-panel px-4 py-3">
        <div>
          <div className="text-xs text-mute">回聲事件 · 第 {act.no}/5 幕</div>
          <div className="font-bold">{act.title}</div>
        </div>
        <div className="flex items-center gap-3 text-right sm:gap-4">
          <div>
            <div className="text-[10px] text-mute sm:text-xs">追蹤數</div>
            <div className="font-mono text-sm font-bold text-white sm:text-base">{state.followers.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[10px] text-mute sm:text-xs">公信力</div>
            <div className={`font-mono text-sm font-bold sm:text-base ${trustColor(state.trust)}`}>{state.trust}%</div>
          </div>
          <div>
            <div className="text-[10px] text-mute sm:text-xs">已抓破綻</div>
            <div className="font-mono text-sm font-bold text-warn sm:text-base">
              {nonBossFoundCount}/{advertisedTotal}
              {bossFound && <span className="ml-0.5 text-brand">+1👑</span>}
            </div>
          </div>
          {isHard && (
            <div>
              <div className="text-[10px] text-mute sm:text-xs">誤判</div>
              <div className={`font-mono text-sm font-bold sm:text-base ${state.misses >= 2 ? 'text-danger' : 'text-white'}`}>
                {state.misses}/{maxMisses}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 公信力 vs 流量 說明條 */}
      <div className="-mt-2 mb-4 flex items-center gap-2 px-1 text-[11px] text-mute">
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel2">
          <span
            className={`block h-full rounded-full transition-all duration-500 ${trustBar(state.trust)}`}
            style={{ width: `${state.trust}%` }}
          />
        </span>
        <span>公信力越高，你的話越有人信</span>
      </div>

      <div className={`grid gap-4 md:grid-cols-[1fr_auto] ${state.phase !== 'detective' ? 'hidden' : ''}`}>
        {/* 左：本幕情境 + 內心 OS */}
        <div className="order-2 space-y-4 md:order-1">
          <div className="rounded-2xl border border-line bg-panel p-4">
            <div className="text-xs font-semibold text-mute">現在的狀況</div>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-white/85">{act.briefing}</p>
          </div>

          {act.instinct && (
            <div className="rounded-2xl border-l-4 border-accent/60 bg-panel2/60 py-3 pl-4 pr-3">
              <div className="text-[11px] font-semibold text-mute">你心裡閃過一個念頭</div>
              <p className="mt-1 text-sm italic leading-relaxed text-white/90">「{act.instinct}」</p>
            </div>
          )}

          <button
            onClick={() => setShowDecision(true)}
            className="w-full rounded-full bg-white py-3 font-bold text-black transition hover:bg-white/90 active:scale-[0.99]"
          >
            我想好了，做決定
          </button>
          <p className="text-center text-xs text-mute">
            不急著決定。先在右邊的手機裡查清楚，抓到的破綻越多，你越不會被騙。
          </p>
        </div>

        {/* 右：假手機 */}
        <div className="order-1 md:order-2">
          <PhoneShell items={items} hint={isHard ? '沒有提示。覺得哪則可疑就「標記可疑」，再指出問題在哪——但別亂喊，誤判 3 次出局。' : act.tip} />
        </div>
      </div>

      {/* 新手導覽（第一幕、只教操作） */}
      {showTutorial && <Tutorial onFinish={finishTutorial} />}

      {/* 簡報 modal（導覽結束後才顯示） */}
      {showBrief && !showTutorial && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-4" onClick={() => setShowBrief(false)}>
          <div
            className="w-full max-w-md animate-fadeup rounded-t-3xl border border-line bg-black p-5 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#333] sm:hidden" />
            <div className="text-xs font-semibold text-mute">第 {act.no} 幕</div>
            <h3 className="mt-1 text-xl font-black">{act.title}</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/85">{act.briefing}</p>
            {act.instinct && (
              <div className="mt-4 rounded-xl border-l-4 border-accent/60 bg-panel2/60 py-3 pl-4 pr-3 text-sm">
                <span className="text-[11px] font-semibold text-mute">你心裡閃過一個念頭</span>
                <p className="mt-1 italic text-white/90">「{act.instinct}」</p>
              </div>
            )}
            <button
              onClick={() => setShowBrief(false)}
              className="mt-4 w-full rounded-full bg-white py-2.5 font-bold text-black hover:bg-white/90"
            >
              開始調查
            </button>
          </div>
        </div>
      )}

      {/* ── 鎖定模式：社群動作選擇（phase === social 且尚未選） ── */}
      {state.phase === 'social' && !state.socialChoice && !showBrief && !showTutorial && (
        <SocialActionPanel act={act} onChoose={chooseSocialAction} />
      )}

      {/* ── 後果畫面（選了非 verify 的動作） ── */}
      {state.phase === 'social' && state.socialChoice && state.socialChoice !== 'verify' && (
        <ConsequencePanel
          actionKey={state.socialChoice}
          consequence={act.socialConsequences?.[state.socialChoice] || {}}
          act={act}
          onContinue={advanceFromConsequence}
        />
      )}

      {/* 決策 modal（偵探模式結尾才出現） */}
      {showDecision && (
        <DecisionPanel
          act={act}
          clueKnown={act.clueId ? state.cluesFound.includes(act.clueId) : false}
          onClose={() => setShowDecision(false)}
        />
      )}

      {/* 破綻 toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-pop rounded-full border border-danger/50 bg-danger/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
          {toast}
        </div>
      )}
    </div>
  )
}

function trustColor(t) {
  if (t >= 60) return 'text-ok'
  if (t >= 35) return 'text-warn'
  return 'text-danger'
}
function trustBar(t) {
  if (t >= 60) return 'bg-ok'
  if (t >= 35) return 'bg-warn'
  return 'bg-danger'
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '../game/GameContext.jsx'
import { acts, evidence as EV } from '../game/data/content.js'
import PhoneShell from '../components/PhoneShell.jsx'
import DecisionPanel from '../components/DecisionPanel.jsx'
import Tutorial from '../components/Tutorial.jsx'

export default function PlayScreen() {
  const { state, act, cluesFoundCount, totalClues, finishTutorial } = useGame()
  const [showBrief, setShowBrief] = useState(true)
  const [showDecision, setShowDecision] = useState(false)
  const [toast, setToast] = useState(null)
  const prevClues = useRef(cluesFoundCount)

  // 換幕時重開簡報
  useEffect(() => {
    setShowBrief(true)
    setShowDecision(false)
  }, [state.actIndex])

  // 找到新破綻 → 冒出提示
  useEffect(() => {
    if (cluesFoundCount > prevClues.current) {
      setToast('🚩 抓到一個破綻！查核紀錄 +1')
      const t = setTimeout(() => setToast(null), 2200)
      prevClues.current = cluesFoundCount
      return () => clearTimeout(t)
    }
    prevClues.current = cluesFoundCount
  }, [cluesFoundCount])

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
        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="text-xs text-mute">追蹤數</div>
            <div className="font-mono font-bold text-accent">{state.followers.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-mute">已抓破綻</div>
            <div className="font-mono font-bold text-danger">
              {cluesFoundCount}/{totalClues}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
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
          <PhoneShell items={items} hint={act.tip} />
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

      {/* 決策 modal */}
      {showDecision && <DecisionPanel act={act} onClose={() => setShowDecision(false)} />}

      {/* 破綻 toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-pop rounded-full border border-danger/50 bg-danger/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
          {toast}
        </div>
      )}
    </div>
  )
}

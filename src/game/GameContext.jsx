import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { acts, evidence, you, ending, START_TRUST } from './data/content.js'
import { recordPlay } from './stats.js'

const GameCtx = createContext(null)

export function useGame() {
  const ctx = useContext(GameCtx)
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>')
  return ctx
}

const START = {
  screen: 'intro', // 'intro' | 'playing' | 'ending'
  tutorialDone: false,
  actIndex: 0,
  followers: you.startFollowers,
  trust: START_TRUST, // 公信力 0–100
  cluesFound: [], // clue id 陣列
  verified: [], // evidence id：玩家「查核過」的
  reversed: [], // 已反查的 evidence id
  accountsChecked: [], // 已查帳號的 evidence id
  searchUnlocks: [], // 例如 'health'
  followed: [], // 已追蹤的帳號 at
  choices: {}, // { actId: optionId }
  impulseCount: 0,
  cautiousCount: 0,
  exposeCount: 0, // 揭穿次數
  recorded: false, // 是否已寫入數據牆
}

export function GameProvider({ children }) {
  const [s, setS] = useState(START)

  const start = useCallback(() => setS((p) => ({ ...p, screen: 'playing', actIndex: 0 })), [])
  const restart = useCallback(() => setS(START), [])
  const finishTutorial = useCallback(() => setS((p) => ({ ...p, tutorialDone: true })), [])

  // 找到破綻（查核成功）
  const findClue = useCallback((clueId, evidenceId) => {
    setS((p) => {
      if (!clueId || p.cluesFound.includes(clueId)) return p
      return {
        ...p,
        cluesFound: [...p.cluesFound, clueId],
        verified: evidenceId && !p.verified.includes(evidenceId) ? [...p.verified, evidenceId] : p.verified,
      }
    })
  }, [])

  const markReversed = useCallback((evId) => {
    setS((p) => (p.reversed.includes(evId) ? p : { ...p, reversed: [...p.reversed, evId] }))
  }, [])

  const markAccountChecked = useCallback((evId) => {
    setS((p) => (p.accountsChecked.includes(evId) ? p : { ...p, accountsChecked: [...p.accountsChecked, evId] }))
  }, [])

  const unlockSearch = useCallback((key) => {
    if (!key) return
    setS((p) => (p.searchUnlocks.includes(key) ? p : { ...p, searchUnlocks: [...p.searchUnlocks, key] }))
  }, [])

  const toggleFollow = useCallback((at) => {
    if (!at) return
    setS((p) => ({
      ...p,
      followed: p.followed.includes(at) ? p.followed.filter((a) => a !== at) : [...p.followed, at],
    }))
  }, [])

  // 做決策 → 記錄、加流量/公信力、進下一幕
  //   clueKnown：做決定當下是否已查到本幕破綻（明知造假仍發 → 加重扣公信力）
  const decide = useCallback((actId, option, clueKnown = false) => {
    setS((p) => {
      const nextIndex = p.actIndex + 1
      const goEnding = acts[nextIndex]?.isEnding

      let trustDelta = option.trustDelta || 0
      // 明知造假仍衝動發文：額外扣公信力
      if (option.tone === 'impulse' && clueKnown) trustDelta -= 8

      const next = {
        ...p,
        choices: { ...p.choices, [actId]: option.id },
        followers: Math.max(0, p.followers + (option.followerDelta || 0)),
        trust: Math.max(0, Math.min(100, p.trust + trustDelta)),
        impulseCount: option.tone === 'impulse' ? p.impulseCount + 1 : p.impulseCount,
        cautiousCount: option.tone === 'cautious' ? p.cautiousCount + 1 : p.cautiousCount,
        exposeCount: option.tone === 'expose' ? p.exposeCount + 1 : p.exposeCount,
        actIndex: nextIndex,
        screen: goEnding ? 'ending' : p.screen,
      }

      // 進結局時把這局寫入數據牆（只寫一次）
      if (goEnding && !p.recorded) {
        recordPlay({
          cluesFound: next.cluesFound,
          impulseCount: next.impulseCount,
          exposeCount: next.exposeCount,
          totalClues: ending.clueOrder.length,
        })
        next.recorded = true
      }
      return next
    })
  }, [])

  const value = useMemo(() => {
    const act = acts[s.actIndex] || acts[0]
    const totalClues = ending.clueOrder.length // 真實總數（10，含魔王）
    // 魔王破綻：不計入對外公開的數字。對外一律說「9 個」。
    const bossIds = Object.values(evidence)
      .filter((e) => e.clue?.boss)
      .map((e) => e.clue.id)
    const advertisedTotal = totalClues - bossIds.length // 9
    const nonBossFoundCount = s.cluesFound.filter((id) => !bossIds.includes(id)).length
    const bossFound = s.cluesFound.some((id) => bossIds.includes(id))
    return {
      state: s,
      act,
      totalClues, // 真實 10
      advertisedTotal, // 對外 9
      nonBossFoundCount, // 對外找到數 /9
      bossFound, // 是否找到魔王
      bossIds,
      cluesFoundCount: s.cluesFound.length,
      isVerified: (evId) => s.verified.includes(evId),
      isClueFound: (clueId) => s.cluesFound.includes(clueId),
      isReversed: (evId) => s.reversed.includes(evId),
      isAccountChecked: (evId) => s.accountsChecked.includes(evId),
      isFollowing: (at) => s.followed.includes(at),
      start,
      restart,
      finishTutorial,
      findClue,
      markReversed,
      markAccountChecked,
      unlockSearch,
      toggleFollow,
      decide,
      evidence,
    }
  }, [s, start, restart, finishTutorial, findClue, markReversed, markAccountChecked, unlockSearch, toggleFollow, decide])

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>
}

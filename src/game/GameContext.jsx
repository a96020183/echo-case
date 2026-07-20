import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { acts, evidence, you, ending } from './data/content.js'

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
  cluesFound: [], // clue id 陣列
  verified: [], // evidence id：玩家「查核過」的
  reversed: [], // 已反查的 evidence id
  accountsChecked: [], // 已查帳號的 evidence id
  searchUnlocks: [], // 例如 'health'
  choices: {}, // { actId: optionId }
  impulseCount: 0,
  cautiousCount: 0,
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

  // 做決策 → 記錄、加流量、進下一幕
  const decide = useCallback((actId, option) => {
    setS((p) => {
      const nextIndex = p.actIndex + 1
      const isLastPlayable = nextIndex >= acts.length - 1 // act6 是結局
      return {
        ...p,
        choices: { ...p.choices, [actId]: option.id },
        followers: Math.max(0, p.followers + (option.followerDelta || 0)),
        impulseCount: option.tone === 'impulse' ? p.impulseCount + 1 : p.impulseCount,
        cautiousCount: option.tone === 'cautious' ? p.cautiousCount + 1 : p.cautiousCount,
        actIndex: nextIndex,
        screen: acts[nextIndex]?.isEnding ? 'ending' : p.screen,
      }
    })
  }, [])

  const value = useMemo(() => {
    const act = acts[s.actIndex] || acts[0]
    const totalClues = ending.clueOrder.length
    return {
      state: s,
      act,
      totalClues,
      cluesFoundCount: s.cluesFound.length,
      isVerified: (evId) => s.verified.includes(evId),
      isClueFound: (clueId) => s.cluesFound.includes(clueId),
      isReversed: (evId) => s.reversed.includes(evId),
      isAccountChecked: (evId) => s.accountsChecked.includes(evId),
      start,
      restart,
      finishTutorial,
      findClue,
      markReversed,
      markAccountChecked,
      unlockSearch,
      decide,
      evidence,
    }
  }, [s, start, restart, finishTutorial, findClue, markReversed, markAccountChecked, unlockSearch, decide])

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>
}

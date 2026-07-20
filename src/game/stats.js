// 展場數據牆：把每一局的結果累積到 localStorage，模擬「所有玩家」的行為統計。
// 之後要接真後端，只要換掉 load/record 兩個函式即可。

const KEY = 'echo_case_stats_v1'

const EMPTY = {
  plays: 0,
  cluesFoundTotal: 0, // 所有玩家找到的破綻總數
  clueMax: 0, // plays * 6
  clueFoundByAct: {}, // { clueId: 次數 }
  exposeCount: 0, // 揭穿次數（所有幕加總）
  impulseCount: 0, // 衝動發文次數
  decisionMax: 0, // plays * 5
}

export function loadStats() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    return { ...EMPTY, ...JSON.parse(raw) }
  } catch {
    return { ...EMPTY }
  }
}

// 一局結束時呼叫，把這局結果累加
export function recordPlay({ cluesFound = [], impulseCount = 0, exposeCount = 0, totalClues = 6 }) {
  const s = loadStats()
  s.plays += 1
  s.cluesFoundTotal += cluesFound.length
  s.clueMax += totalClues
  s.decisionMax += 5
  s.impulseCount += impulseCount
  s.exposeCount += exposeCount
  cluesFound.forEach((cid) => {
    s.clueFoundByAct[cid] = (s.clueFoundByAct[cid] || 0) + 1
  })
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
  return s
}

// 換算成好讀的百分比指標
export function deriveInsights(s) {
  if (!s || s.plays === 0) return null
  const clueRate = s.clueMax ? Math.round((s.cluesFoundTotal / s.clueMax) * 100) : 0
  const impulseRate = s.decisionMax ? Math.round((s.impulseCount / s.decisionMax) * 100) : 0
  const exposeRate = s.decisionMax ? Math.round((s.exposeCount / s.decisionMax) * 100) : 0
  return { plays: s.plays, clueRate, impulseRate, exposeRate, clueFoundByAct: s.clueFoundByAct }
}

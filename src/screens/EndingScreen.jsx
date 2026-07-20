import { useMemo } from 'react'
import { useGame } from '../game/GameContext.jsx'
import { evidence, ending, skills, you } from '../game/data/content.js'

// 把 clue id 對應到它的內容與技巧
function buildClueLookup() {
  const map = {}
  Object.values(evidence).forEach((ev) => {
    if (ev.clue) map[ev.clue.id] = { ...ev.clue, evAuthor: ev.author }
  })
  return map
}

// 簡易 **粗體** 解析
function RichText({ text }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <span key={i} className="block">
          {line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
            seg.startsWith('**') && seg.endsWith('**') ? (
              <strong key={j} className="text-white">{seg.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{seg}</span>
            )
          )}
        </span>
      ))}
    </>
  )
}

export default function EndingScreen() {
  const { state, restart, totalClues } = useGame()
  const lookup = useMemo(buildClueLookup, [])

  const found = state.cluesFound
  const foundCount = found.length
  const missed = totalClues - foundCount

  // 後座力數據
  const impulse = state.impulseCount
  const accusedInnocent = state.choices.act5 === 'a5_lisa' || state.choices.act5 === 'a5_partner'
  const accusedLisa = state.choices.act2 === 'a2_impulse' || state.choices.act5 === 'a5_lisa'
  const reach = impulse * 40000 // 每次衝動發文的觸及推估
  const beatPct = Math.min(96, Math.round((foundCount / totalClues) * 90) + 4)

  const rankLabel =
    foundCount === totalClues ? '事實查核大師' : foundCount >= 4 ? '清醒的旁觀者' : foundCount >= 2 ? '半信半疑者' : '被帶風向的人'

  return (
    <div className="w-full max-w-2xl animate-fadeup space-y-5 py-6">
      <div className="text-center">
        <div className="text-5xl">🕯️</div>
        <h1 className="mt-2 text-2xl font-black">真相</h1>
      </div>

      {/* 真相 */}
      <div className="rounded-2xl border border-line bg-panel p-5 text-sm leading-relaxed text-white/85">
        <RichText text={ending.truth} />
      </div>

      {/* 你的表現 */}
      <div className="rounded-2xl border border-brand/40 bg-brand/5 p-5 text-center">
        <div className="text-xs text-mute">你的查核表現</div>
        <div className="mt-1 text-3xl font-black text-accent">
          {foundCount}/{totalClues}
        </div>
        <div className="text-sm text-white/80">個破綻被你抓到</div>
        <div className="mt-2 inline-block rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-sm font-bold text-accent">
          稱號：{rankLabel}
        </div>
        <p className="mt-2 text-xs text-mute">你比 {beatPct}% 的玩家更能識破假消息。</p>
      </div>

      {/* 逐條回放 */}
      <div className="rounded-2xl border border-line bg-panel p-5">
        <h3 className="font-bold">🔁 回放：這些都是假的</h3>
        <p className="mt-1 text-xs text-mute">🟢 = 你當時查到了　🔴 = 查得到但你沒查</p>
        <div className="mt-3 space-y-2">
          {ending.clueOrder.map((cid) => {
            const clue = lookup[cid]
            const got = found.includes(cid)
            const sk = skills[clue.skill]
            return (
              <div
                key={cid}
                className={`rounded-xl border p-3 ${got ? 'border-ok/40 bg-ok/5' : 'border-danger/40 bg-danger/5'}`}
              >
                <div className="flex items-center gap-2">
                  <span>{got ? '🟢' : '🔴'}</span>
                  <span className="text-sm font-semibold text-white">
                    {sk?.icon} {sk?.name}
                  </span>
                  <span className="ml-auto text-[11px] text-mute">來源：{clue.evAuthor}</span>
                </div>
                <p className="mt-1 text-sm text-white/85">{clue.truth}</p>
                {!got && <p className="mt-1 text-xs text-danger">你當時沒查——{clue.found}</p>}
              </div>
            )
          })}
        </div>
      </div>

      {/* 後座力 */}
      <div className="rounded-2xl border border-warn/30 bg-warn/5 p-5">
        <h3 className="font-bold text-warn">⚠️ 你的貼文造成了什麼</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 text-center">
          <Stat n={impulse} unit="次" label="未查證就發文" warn />
          <Stat n={reach.toLocaleString()} unit="人" label="被你的貼文觸及" warn={reach > 0} />
          <Stat n={accusedLisa ? '有' : '沒有'} unit="" label="公開指控過 Lisa" warn={accusedLisa} />
          <Stat n={state.followers.toLocaleString()} unit="" label="最終追蹤數" />
        </div>
        {accusedInnocent && (
          <p className="mt-3 rounded-lg bg-danger/10 p-2 text-xs text-danger">
            你在最終裁決指控了一個無辜的人。真實世界裡，這樣的一則貼文足以毀掉一個人。
          </p>
        )}
        {impulse === 0 && (
          <p className="mt-3 rounded-lg bg-ok/10 p-2 text-xs text-ok">
            你全程沒有未查證就發文。在一個人人搶快的環境裡，這非常難得。
          </p>
        )}
      </div>

      {/* 技巧卡 */}
      <div className="rounded-2xl border border-line bg-panel p-5">
        <h3 className="font-bold">🎴 帶走這張「事實查核」技巧卡</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {Object.values(skills).map((sk) => (
            <div key={sk.key} className="rounded-xl border border-line bg-panel2 p-3">
              <div className="text-sm font-bold">
                {sk.icon} {sk.name}
              </div>
              <p className="mt-1 text-xs text-mute">{sk.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 一句話 */}
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 text-center">
        <p className="text-sm text-white/90">
          資訊不難查，是我們太急著下結論。
          <br />
          下次在按下轉發前，先停三秒——問一句「這是真的嗎？」
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={restart}
          className="flex-1 rounded-xl bg-brand py-3 font-bold text-white hover:brightness-110"
        >
          再玩一次（這次找齊所有破綻）
        </button>
        <button
          onClick={() => {
            const txt = `我在《回聲事件》抓到 ${foundCount}/${totalClues} 個假消息破綻，稱號「${rankLabel}」。你能識破幾個？`
            if (navigator.share) navigator.share({ title: '回聲事件', text: txt }).catch(() => {})
            else {
              navigator.clipboard?.writeText(txt)
              alert('成績已複製，貼給朋友挑戰看看！')
            }
          }}
          className="flex-1 rounded-xl border border-line py-3 font-bold text-white/85 hover:border-accent"
        >
          分享成績，挑戰朋友
        </button>
      </div>
      <p className="text-center text-[11px] text-mute">
        {you.handle}｜《回聲事件》為 DFT 競賽原型，人物與事件皆為虛構。
      </p>
    </div>
  )
}

function Stat({ n, unit, label, warn }) {
  return (
    <div className={`rounded-xl border p-3 ${warn ? 'border-warn/40 bg-warn/10' : 'border-line bg-panel2'}`}>
      <div className={`text-xl font-black ${warn ? 'text-warn' : 'text-white'}`}>
        {n}
        <span className="text-xs font-normal text-mute"> {unit}</span>
      </div>
      <div className="mt-0.5 text-[11px] text-mute">{label}</div>
    </div>
  )
}

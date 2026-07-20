import { useGame } from '../game/GameContext.jsx'

// 困難模式：誤判 3 次 → 出局。主題：亂喊「假的」、冤枉無辜，也是一種亂源。
export default function GameOverScreen() {
  const { state, restart, maxMisses } = useGame()

  return (
    <div className="w-full max-w-lg animate-fadeup py-10 text-center">
      <div className="text-6xl">💥</div>
      <h1 className="mt-3 text-2xl font-black text-danger">你出局了</h1>

      <div className="mt-5 rounded-2xl border border-danger/40 bg-danger/10 p-5 text-left text-sm leading-relaxed text-white/85">
        <p>
          你太快把矛頭指向別人——一次又一次喊「這是假的」，卻冤枉了沒問題的人。
        </p>
        <p className="mt-2">
          {maxMisses} 次誤判之後，被你錯誤指控的人聯合出面，你的粉專被檢舉、被提告、被迫關閉。
        </p>
        <p className="mt-3 border-t border-danger/20 pt-3 text-white/90">
          查證的相反，不只是「照單全信」——
          <b className="text-white">見人就喊假、未審先判，同樣是一種亂源。</b>
          懷疑要有根據，指控要有證據。
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-panel2 p-3 text-xs text-mute">
        誤判次數：{state.misses}/{maxMisses}　·　困難模式
      </div>

      <button
        onClick={restart}
        className="mt-6 w-full rounded-full bg-white py-3 font-bold text-black hover:bg-white/90"
      >
        重新開始
      </button>
      <p className="mt-3 text-xs text-mute">提示：懷疑一則消息前，先問「我有什麼根據？」再動手查。</p>
    </div>
  )
}

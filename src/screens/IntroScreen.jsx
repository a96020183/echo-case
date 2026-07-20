import { useGame } from '../game/GameContext.jsx'
import { you } from '../game/data/content.js'

export default function IntroScreen() {
  const { start } = useGame()
  return (
    <div className="max-w-lg w-full animate-fadeup text-center">
      <div className="text-6xl mb-4">📡</div>
      <h1 className="text-3xl font-black tracking-tight">
        回聲事件 <span className="text-mute font-medium text-xl">The Echo Case</span>
      </h1>
      <p className="mt-4 text-white/85 leading-relaxed">
        一個人死了。全網都說是「有人害的」。
        <br />
        你握著證據，也握著十萬人的目光。
      </p>

      <div className="mt-6 rounded-2xl border border-line bg-panel p-5 text-left text-[15px] leading-relaxed text-white/85">
        <p>
          你可以跟著大家一起罵——<span className="text-warn">流量會很漂亮</span>。
        </p>
        <p className="mt-2">
          或者，你可以停三秒，問一句：<span className="text-accent font-semibold">這，是真的嗎？</span>
        </p>
        <p className="mt-3 border-t border-line pt-3 text-sm text-mute">
          問題是——把「證據」一份份塞給你的那個人，
          正在盯著你會不會上鉤。
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-panel2 p-3 text-left text-xs text-mute">
        你是粉專「{you.handle}」小編（{you.startFollowers.toLocaleString()} 追蹤）。
        這裡沒有教學、沒有箭頭。破綻藏在細節裡，就像真的假消息一樣。
        <span className="text-white/80"> 你，抓得到幾個？</span>
      </div>

      <button
        onClick={start}
        className="mt-6 w-full rounded-xl bg-brand py-3 font-bold text-white transition hover:brightness-110 active:scale-[0.99]"
      >
        進入現場 →
      </button>
      <p className="mt-3 text-xs text-mute">約 20–30 分鐘。準備好，別太快相信任何東西。</p>
    </div>
  )
}

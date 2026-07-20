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

      <div className="mt-4 rounded-xl border border-line bg-panel2 p-4 text-left text-sm leading-relaxed text-white/75">
        你是粉專「{you.handle}」小編（{you.startFollowers.toLocaleString()} 追蹤）。
        這裡沒有教學、沒有箭頭，破綻藏在細節裡，就像真的假消息一樣。
        <span className="mt-1 block text-base font-bold text-white">全場藏了 9 個破綻——你，抓得到幾個？</span>
      </div>

      {/* 難度選擇 */}
      <p className="mt-6 text-sm font-semibold text-accent">👉 推薦先玩「困難」——兩種難度劇本一樣，先玩簡單會被劇透。</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => start('hard')}
          className="rounded-2xl border border-brand/50 bg-brand/10 p-4 text-left transition hover:border-brand active:scale-[0.99]"
        >
          <div className="flex items-center gap-2 text-base font-black text-white">🔥 困難 <span className="rounded-full bg-brand/30 px-2 py-0.5 text-[10px] text-brand">推薦</span></div>
          <p className="mt-1 text-xs leading-relaxed text-white/75">
            沒有任何提示按鈕。你要自己判斷哪則「可疑」，再指出問題在哪。
            <b className="text-warn">誤判 3 次就出局。</b>
          </p>
        </button>
        <button
          onClick={() => start('easy')}
          className="rounded-2xl border border-line bg-panel2 p-4 text-left transition hover:border-white/40 active:scale-[0.99]"
        >
          <div className="text-base font-black text-white">🌱 簡單</div>
          <p className="mt-1 text-xs leading-relaxed text-white/75">
            有問題的東西會出現「放大／查證」按鈕，跟著點就好。適合第一次或想輕鬆玩。
          </p>
        </button>
      </div>
      <p className="mt-3 text-xs text-mute">約 20–30 分鐘。準備好，別太快相信任何東西。</p>
    </div>
  )
}

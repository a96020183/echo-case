// 程式繪製的「假截圖」：直播畫面、收據、巷弄舊圖、錄音波形。
// 破綻(破 綻)畫在裡面。inspect=true 時，破綻位置會出現可點擊高亮，
// 點了 → onInspect()；revealed=true 時破綻用紅框標出。位置與特徵共用同組定位，保證對齊。
export default function FakeShot({ shot, audio, inspect = false, revealed = false, onInspect, noHint = false }) {
  if (audio) return <Waveform audio={audio} inspect={inspect} revealed={revealed} onInspect={onInspect} noHint={noHint} />
  if (!shot) return null

  const base = 'relative w-full overflow-hidden rounded-lg border border-black/40'
  const h = 'h-64'

  // 可點擊高亮 / 已揭露紅框（共用），用 className 定位以對齊特徵
  // noHint（困難模式）：不顯示 hover 高亮，玩家得自己找位置
  const Marker = ({ className }) =>
    revealed ? (
      <div className={`absolute z-10 rounded ring-2 ring-danger bg-danger/20 ${className}`} />
    ) : inspect ? (
      <button
        onClick={onInspect}
        className={`absolute z-10 rounded ${noHint ? '' : 'ring-2 ring-warn/0 transition hover:ring-warn hover:bg-warn/15'} ${className}`}
        title={noHint ? '' : '這裡看起來怪怪的？'}
      />
    ) : null

  if (shot.scene === 'studio') {
    return (
      <div className={`${base} ${h} bg-gradient-to-b from-[#3b2a4d] via-[#241a30] to-[#0d1017]`}>
        {/* 主播剪影 */}
        <svg viewBox="0 0 200 160" className="absolute bottom-0 left-1/2 h-[78%] -translate-x-1/2" preserveAspectRatio="xMidYMax meet">
          <defs>
            <radialGradient id="spot" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#5a4a6a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="60" rx="90" ry="70" fill="url(#spot)" />
          {/* 頭 + 肩 */}
          <circle cx="100" cy="58" r="26" fill="#1c222c" />
          <path d="M52 160 C52 120 68 100 100 100 C132 100 148 120 148 160 Z" fill="#1c222c" />
          {/* 麥克風 */}
          <rect x="70" y="86" width="10" height="26" rx="5" fill="#3a3f48" />
          <rect x="72" y="112" width="6" height="20" fill="#2a2e36" />
        </svg>

        {/* LIVE 徽章 */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
        </div>
        {/* 觀看數 */}
        <div className="absolute left-14 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white/90">👁 12.4K</div>
        {/* 時間戳（破綻） */}
        <div className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-mono text-white/90">
          {shot.timestampText}
        </div>
        <Marker className="right-1.5 top-1.5 h-6 w-16" />

        {/* 飄心 */}
        <div className="absolute bottom-14 right-3 flex flex-col items-center gap-1 text-danger">
          <span className="animate-pulse text-sm opacity-90">❤</span>
          <span className="text-xs opacity-70">❤</span>
          <span className="text-[10px] opacity-50">❤</span>
        </div>

        {/* 頻道名 */}
        <div className="absolute bottom-8 left-2 text-xs font-semibold text-white/90 drop-shadow">{shot.caption}</div>

        {/* 底部留言列 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
          <div className="truncate text-[10px] text-white/70">
            <b className="text-white/90">觀眾_h23</b> 阿聲怎麼了？！有人快叫救護車
          </div>
        </div>
      </div>
    )
  }

  if (shot.receiptItem) {
    return (
      <div className={`${base} ${h} bg-[#f4f1e8] text-[#222]`}>
        <div className="relative p-4 font-mono text-[12px] leading-relaxed">
          <div className="text-center font-bold">＊＊藥局 收據＊＊</div>
          <div className="mt-2 border-t border-dashed border-[#999]" />
          <div className="relative mt-2 flex justify-between">
            {shot.psRegion ? (
              // 被 P 過的品項：色塊、字色、字體都和收據不搭，還有一點歪斜與接縫陰影
              <span
                className="-rotate-[1.5deg] bg-[#dccfa8] px-1 font-sans text-[#111] shadow-[1px_1px_0_rgba(0,0,0,0.35)]"
                style={{ letterSpacing: '0.5px' }}
              >
                毒鼠磷 錠 x2
              </span>
            ) : (
              <span>{shot.receiptItem}</span>
            )}
            <span>{shot.receiptTotal}</span>
            {/* 破綻高亮：品項那行 */}
            <Marker className="-inset-x-1 -inset-y-1" />
          </div>
          <div className="mt-1 flex justify-between text-[#666]">
            <span>日期</span>
            <span>{shot.receiptDate}</span>
          </div>
          <div className="mt-2 border-t border-dashed border-[#999]" />
          <div className="mt-2 text-center text-[10px] text-[#888]">謝謝惠顧</div>
        </div>
      </div>
    )
  }

  if (shot.scene === 'ticket') {
    return (
      <div className={`${base} ${h} bg-[#eef2f7] text-[#1a2230]`}>
        <div className="p-3">
          {/* 高鐵票 */}
          <div className="rounded-lg border-2 border-[#e35205] bg-white p-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#e35205]">
              <span>🚄 高鐵 THSR</span>
              <span>標準車廂</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-center">
                <div className="text-lg font-black">{shot.from}</div>
              </div>
              <div className="text-xl text-[#e35205]">→</div>
              <div className="text-center">
                <div className="text-lg font-black">{shot.to}</div>
              </div>
            </div>
            <div className="mt-1 text-center text-[11px] font-mono text-[#555]">{shot.depart}</div>
          </div>
          {/* 飯店打卡 */}
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#dbe6f0] px-3 py-2 text-[12px]">
            <span>📍</span>
            <span className="font-semibold">{shot.checkin}</span>
          </div>
        </div>
      </div>
    )
  }

  if (shot.scene === 'alley') {
    return (
      <div className={`${base} ${h} bg-gradient-to-b from-[#12161f] via-[#0a0d13] to-[#05070c]`}>
        {/* 巷弄場景：牆、地、路燈光暈、人影 */}
        <svg viewBox="0 0 300 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="lamp" cx="78%" cy="12%" r="45%">
              <stop offset="0%" stopColor="#f4d58d" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f4d58d" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* 兩側牆 */}
          <polygon points="0,0 90,40 90,200 0,200" fill="#141922" />
          <polygon points="300,0 210,40 210,200 300,200" fill="#10141c" />
          {/* 地面 */}
          <polygon points="90,200 90,60 210,60 210,200" fill="#0b0e14" />
          {/* 路燈光暈 */}
          <rect x="0" y="0" width="300" height="200" fill="url(#lamp)" />
          {/* 門 */}
          <rect x="130" y="80" width="40" height="70" rx="2" fill="#1c222c" />
          {/* 人影 */}
          <ellipse cx="150" cy="176" rx="16" ry="4" fill="#000" opacity="0.5" />
          <circle cx="150" cy="120" r="9" fill="#05060a" />
          <path d="M138 176 C138 150 143 132 150 132 C157 132 162 150 162 176 Z" fill="#05060a" />
        </svg>

        {/* CCTV 時間戳 */}
        <div className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-mono text-[#7CFC00]/80">
          REC ● 23:41:07
        </div>
        <div className="absolute bottom-8 left-2 text-[11px] text-white/60">{shot.caption}</div>
        {shot.watermark && (
          <div className="absolute bottom-2 right-2 font-mono text-[10px] text-white/40">{shot.watermark}</div>
        )}
      </div>
    )
  }

  return <div className={`${base} ${h} bg-panel2`} />
}

function Waveform({ audio, inspect, revealed, onInspect, noHint = false }) {
  const bars = 48
  return (
    <div className="rounded-lg border border-black/40 bg-[#0f1520] p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-white/70">
        <span>🎧 {audio.label}</span>
        <span className="font-mono">{audio.duration}</span>
      </div>
      <div className="relative flex h-16 items-end gap-[2px]">
        {Array.from({ length: bars }).map((_, i) => {
          const spliceZone = audio.spliced && i > bars * 0.42 && i < bars * 0.5
          const height = spliceZone
            ? 6
            : 10 + Math.abs(Math.sin(i * 0.7) * 40) + (i > bars * 0.5 ? 8 : 0)
          return (
            <div
              key={i}
              className={spliceZone ? 'bg-warn/70' : 'bg-accent/60'}
              style={{ width: `${100 / bars}%`, height: `${height}px` }}
            />
          )
        })}
        {/* 破綻：波形中段剪接處（約 42%~50%） */}
        {revealed ? (
          <div className="absolute z-10 rounded ring-2 ring-danger bg-danger/20" style={{ left: '42%', width: '8%', top: 0, bottom: 0 }} />
        ) : inspect ? (
          <button
            onClick={onInspect}
            className={`absolute z-10 rounded ${noHint ? '' : 'ring-2 ring-warn/0 transition hover:ring-warn hover:bg-warn/15'}`}
            style={{ left: '42%', width: '8%', top: 0, bottom: 0 }}
            title={noHint ? '' : '這段波形怪怪的？'}
          />
        ) : null}
      </div>
    </div>
  )
}

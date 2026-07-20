// 程式繪製的「假截圖」：直播畫面、收據、巷弄舊圖、錄音波形。
// 破綻(破 綻)畫在裡面。inspect=true 時，破綻位置會出現可點擊高亮，
// 點了 → onInspect()；revealed=true 時破綻用紅框標出。位置與特徵共用同組定位，保證對齊。
export default function FakeShot({ shot, audio, inspect = false, revealed = false, onInspect }) {
  if (audio) return <Waveform audio={audio} inspect={inspect} revealed={revealed} onInspect={onInspect} />
  if (!shot) return null

  const base = 'relative w-full overflow-hidden rounded-lg border border-black/40'
  const h = 'h-64'

  // 可點擊高亮 / 已揭露紅框（共用），用 className 定位以對齊特徵
  const Marker = ({ className }) =>
    revealed ? (
      <div className={`absolute z-10 rounded ring-2 ring-danger bg-danger/20 ${className}`} />
    ) : inspect ? (
      <button
        onClick={onInspect}
        className={`absolute z-10 rounded ring-2 ring-warn/0 transition hover:ring-warn hover:bg-warn/15 ${className}`}
        title="這裡看起來怪怪的？"
      />
    ) : null

  if (shot.scene === 'studio') {
    return (
      <div className={`${base} ${h} bg-gradient-to-br from-[#2a1a3a] to-[#101820]`}>
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white">
          ● LIVE
        </div>
        <div className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-mono text-white/90">
          {shot.timestampText}
        </div>
        {/* 破綻：時間戳，與上面 right-2 top-2 同位置 */}
        <Marker className="right-1.5 top-1.5 h-6 w-16" />
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="text-5xl opacity-80">🎙️</div>
            <div className="mt-2 text-xs text-white/60">{shot.caption}</div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent" />
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
      <div className={`${base} ${h} bg-gradient-to-b from-[#1a2230] to-[#05070c]`}>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="text-4xl opacity-70">🌃</div>
            <div className="mt-2 text-xs text-white/50">{shot.caption}</div>
          </div>
        </div>
        {shot.watermark && (
          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/40">{shot.watermark}</div>
        )}
      </div>
    )
  }

  return <div className={`${base} ${h} bg-panel2`} />
}

function Waveform({ audio, inspect, revealed, onInspect }) {
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
            className="absolute z-10 rounded ring-2 ring-warn/0 transition hover:ring-warn hover:bg-warn/15"
            style={{ left: '42%', width: '8%', top: 0, bottom: 0 }}
            title="這段波形怪怪的？"
          />
        ) : null}
      </div>
    </div>
  )
}

# 《回聲事件》交接文件（HANDOFF）

給「換電腦後的自己」或新的 AI 對話看的完整脈絡。讀完這份 + DESIGN.md 就能無縫接手。
（本對話透過 ACP 進行，聊天記錄無法可靠搬移到新電腦；這份文件就是可靠的替代——把整個 repo clone 下來、讀這份即可掌握全部。）

---

## 1. 這是什麼

**《回聲事件》The Echo Case** — DFT 競賽用的「邊玩邊學事實查核」網頁 ARG。
玩家扮演社群小編「觀點日報」，調查網紅「瘋瘋」猝死事件；全網瘋傳是「有人下毒」，
但所有「證據」都是有心人餵的假料。玩家要動手查證、抓出破綻。

- 技術：React + Vite + Tailwind，純前端，部署 Vercel（push 自動上線）。
- Repo：GitHub `a96020183/echo-case`。
- 本機：`C:\Users\user1\KIRO\echo-case`，`npm run dev`（Windows 用 cmd 較穩）。

## 2. 核心設計（改動前先懂）

- **邊玩邊學**：查核＝玩法本身，不是說教。技巧名稱只在結局技巧卡出現。
- **資料驅動**：所有劇本、貼文、破綻、搜尋結果都在 `src/game/data/content.js`，組員改文案不動 code。
- **假截圖用程式繪製**（`FakeShot.jsx`），不用圖檔素材：直播畫面、收據、CCTV 巷弄、高鐵票、錄音波形。
- **UI 力求「就是 Threads」**：純黑、圓頭像、藍勾、線條圖示、貼文細線分隔、底部導覽。

## 3. 十個破綻（clueOrder，含魔王）

對外一律說「**9 個**」，但其實有 **10 個**——第 10 個是魔王，遊戲不告訴你，要自己發現。
這是全劇的 meta 訊息：**連遊戲/權威給你的數字，你都該查證**。

| 破綻 id | 技巧/機制 | 位置 | 備註 |
|---------|-----------|------|------|
| c_time_mismatch | 看時間戳(放大) | 直播截圖 | |
| c_witness_fake | 查帳號 | 目擊者 Amy | |
| c_receipt_ps | 放大 | 買毒收據 | 被 P |
| c_audio_splice | 放大 | 爭吵錄音 | 波形剪接 |
| c_reverse_old | 以圖搜圖 | 後門圖 | 2020 舊圖 |
| c_health_search | 搜尋 | 搜「瘋瘋 病史」 | 有心臟宿疾 |
| c_rival_boast | 推理(insight) | 熱點日報貼文 | 太早有「獨家」 |
| c_tipster_sock | 查帳號 | 匿名爆料者 | 事件前一天註冊 |
| c_alibi_conflict | 交叉比對(時間軸) | Lisa 不在場證明 | 證據板比對 |
| **c_rival_knew** | 推理(insight) | 熱點日報貼文 | **👑魔王**：Lisa 自清前就斷言不是她 |

真相：瘋瘋是心臟宿疾猝死，沒人下毒。所有假料出自 @hot_daily_scoop（熱點日報）＝搶流量的同業小編，也就是匿名爆料者 @truth_teller_x 的真身。

## 4. 系統

- **公信力(trust)**：起始 60。發假消息扣、揭穿加。明知造假仍發額外 −8。結局稱號結合「抓破綻數 + 公信力」。
- **決策**：每幕發文有 衝動/揭穿/保守 三類。查到本幕破綻才解鎖「揭穿」正解（requiresClue）。
- **難度（intro 選擇，推薦先玩困難，兩難度劇本相同）**：
  - **簡單 easy**：有問題的東西直接給「放大檢查／這則怪怪的」按鈕。
  - **困難 hard**：每則只有「🚩 標記可疑」；標錯（沒問題卻標、或圖點錯地方）＝誤判，**誤判 3 次出局**（GameOverScreen）。困難模式圖片破綻不 hover 提示（`noHint`）。
- **結局分歧**：🏆揭穿真相 / 🕵️識破但手不乾淨 / 🌫️平庸收場 / 💀身敗名裂（沒看穿黑手＋低公信力/指控無辜）。
- **展場數據牆**：`src/game/stats.js` 用 localStorage 累積所有玩家行為（破綻識破率、衝動率、揭穿率、各破綻識破%），結局呈現。之後要接後端只改 stats.js。
- **現實查核工具**：結局列 MyGoPen、Cofacts、台灣事實查核中心、Google 圖片反搜（真實可點）。
- **新手練習**：intro 進場後一題親手練習（紅雨舊照，教放大找破綻），可跳過。

## 5. 檔案地圖

- `src/game/data/content.js` — 劇本/證據/破綻/搜尋/結局/skills/START_TRUST/extraClues（全部內容）
- `src/game/GameContext.jsx` — 狀態（mode/misses/trust/cluesFound/followed…）、decide/findClue/addMiss/toggleFollow
- `src/game/stats.js` — 數據牆 localStorage
- `src/screens/` — IntroScreen(難度選擇) / PlayScreen / EndingScreen / GameOverScreen
- `src/components/` — PhoneShell、PostCard（easy/hard 分支）、ImageZoom（hard 誤判）、AccountModal、DecisionPanel、Tutorial、FakeShot、apps/(Feed/Messages/Browser/Evidence)

## 6. 待辦 / 可改進（來自 review）

- 探索感可再加紅鯡魚/選擇性證據。
- 展場數據牆可接真後端。
- 更多結局分歧文案、音效。
- 帳號檢查在困難模式仍偏「有 clue 才有揭露鈕」，可改成任何帳號都能檢舉、錯則誤判（目前為避免不公未做）。

## 7. 怎麼繼續

- 改內容：編 `content.js` → `git push` → 自動上線。
- 新破綻：在 evidence 加一則帶 clue 的證據 + 加進 act.evidenceIds + 加進 ending.clueOrder（若是魔王加 `boss:true`，不要放進「對外 9」的宣傳）。
- 難度平衡：trustDelta、followerDelta、MAX_MISSES（GameContext）。

## 8. 最近更新（2026-07-20）

擴充到 10 破綻（含魔王 c_rival_knew）、對外只說 9、加難度雙模式（簡單/困難＋誤判3次出局）、
公信力系統、揭穿正解、反轉伏筆（熱點日報）、現實查核工具、展場數據牆、新手練習題、Threads 擬真 UI、
網紅改名「瘋瘋」、結局分歧（含身敗名裂）。

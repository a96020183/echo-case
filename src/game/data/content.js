// ============================================================
// 《回聲事件》全劇本資料（集中管理，組員只改這裡，不用動 code）
//   - acts[]      六幕流程：情境、可查證的證據、發文決策
//   - evidence{}  每則「證據」的內容與藏在裡面的破綻(clue)
//   - search{}    假搜尋引擎的關鍵字結果
//   假截圖用程式繪製，破綻(破 綻)以 clue 描述，放大/搜尋/反查/查帳號才會現形
// ============================================================

// 查核技巧（也是每一幕教的能力）
export const skills = {
  timestamp: { key: 'timestamp', icon: '🕐', name: '看時間戳', desc: '對照發文時間與事件時間，先後對不上就是假的。' },
  zoom: { key: 'zoom', icon: '🔍', name: '放大檢查', desc: '把圖放大看細節：合成邊緣、被改過的數字、倒影穿幫。' },
  reverse: { key: 'reverse', icon: '♻️', name: '反查來源', desc: '以圖搜圖，看看這張「現場圖」是不是舊聞舊圖被拿來重用。' },
  account: { key: 'account', icon: '👤', name: '查帳號', desc: '看爆料帳號的註冊日與歷史，臨時小號可信度低。' },
  timeline: { key: 'timeline', icon: '🧭', name: '交叉比對', desc: '把多條資訊放上時間軸，看有沒有互相矛盾。' },
  search: { key: 'search', icon: '🌐', name: '查資料', desc: '主動搜尋當事人背景，很多真相其實一搜就有。' },
  motive: { key: 'motive', icon: '🎯', name: '問誰得利', desc: '想想「這件事誰獲利、誰太早知情」，動機常指向真正的操縱者。' },
}

// 你（玩家）扮演的粉專
export const you = {
  handle: '觀點日報',
  at: '@viewpoint_daily',
  startFollowers: 30500,
}

// ------------------------------------------------------------
// 證據庫：evidence[id]
//   clue: 這則證據藏的破綻。method 決定要用哪個機制才找得到。
//   verified 後會記錄「玩家查核過」
// ------------------------------------------------------------
export const evidence = {
  // 第一幕
  ev_live_shot: {
    id: 'ev_live_shot',
    type: 'image',
    app: 'feed',
    author: '直播剪輯站',
    at: '@clip_zone',
    avatar: '📺',
    time: '19:32',
    body: '【震驚】瘋瘋直播到一半突然倒下！現場畫面流出⚠️',
    likes: 12800,
    shares: 4300,
    // 程式繪製的假截圖
    shot: {
      caption: 'LIVE · 瘋瘋的頻道',
      timestampText: '18:47', // 破綻：比事件（19:30 倒下）還早
      scene: 'studio',
    },
    clue: {
      id: 'c_time_mismatch',
      skill: 'timestamp',
      method: 'zoom',
      hotspot: { x: 72, y: 6, w: 26, h: 12 }, // 右上角時間戳
      hint: '截圖右上角有個時間…',
      found: '截圖時間顯示 18:47，但瘋瘋是 19:30 才倒下的。',
      truth: '這張「現場截圖」拍攝時間比事件還早 43 分鐘——是事件前的畫面被拿來冒充現場。',
    },
  },
  ev_witness_story: {
    id: 'ev_witness_story',
    type: 'post',
    app: 'feed',
    author: '現場目擊者_Amy',
    at: '@amy_here',
    avatar: '🙋',
    time: '19:40',
    body: '我剛好在攝影棚附近！看到有人神色慌張跑出來，一定有內情… #瘋瘋 #內幕',
    likes: 8900,
    shares: 3100,
    account: {
      created: '事件當天',
      posts: 0,
      followers: 4,
      note: '這個帳號在事件當天才建立，過去沒有任何貼文。',
    },
    clue: {
      id: 'c_witness_fake',
      skill: 'account',
      method: 'account',
      hint: '這個「目擊者」帳號怪怪的…',
      found: '帳號 @amy_here 註冊於事件當天，之前 0 貼文。',
      truth: '所謂「目擊者」是當天才開的空帳號，沒有任何歷史，可信度極低。',
    },
  },
  // 同業競爭者（反轉伏筆，無破綻）
  ev_rival_1: {
    id: 'ev_rival_1',
    type: 'post',
    app: 'feed',
    author: '熱點日報',
    at: '@hot_daily_scoop',
    avatar: '🗞️',
    time: '19:45',
    body: '大家在瞎猜喔？我手上有你們都沒有的東西，時候到了自然放。先追蹤起來 😏 #獨家在後頭',
    likes: 5200,
    shares: 1800,
    clue: {
      id: 'c_rival_boast',
      skill: 'motive',
      method: 'insight',
      hint: '這個同業說「手上有獨家」…',
      found: '事件才爆發 15 分鐘，熱點日報就聲稱「手上有你們沒有的東西」。',
      truth: '事件剛發生，他哪來的「獨家料」？除非那些料是他自己準備好的。這是第一個可疑點。',
    },
  },

  // 第二幕
  ev_dm_receipt: {
    id: 'ev_dm_receipt',
    type: 'image',
    app: 'messages',
    author: '匿名爆料者',
    at: '@truth_teller_x',
    avatar: '🕵️',
    time: '20:10',
    body: '我有 Lisa 買下毒藥物的收據，她早有預謀。幫我散出去，讓大家知道真相。',
    shot: {
      caption: '藥局收據',
      receiptItem: '□□□錠 x2',
      receiptTotal: '$480',
      receiptDate: '2023/11/02',
      psRegion: true, // 破綻：金額/品項被 PS
    },
    clue: {
      id: 'c_receipt_ps',
      skill: 'zoom',
      method: 'zoom',
      hotspot: { x: 8, y: 52, w: 60, h: 16 }, // 品項那行
      hint: '收據上的品項那行，邊緣好像怪怪的…',
      found: '放大後可見品項文字邊緣有明顯合成痕跡、底色不連續。',
      truth: '收據被 P 過——原本的品項被塗改成「毒藥」字樣，是偽造的。',
    },
  },
  ev_argue_audio: {
    id: 'ev_argue_audio',
    type: 'audio',
    app: 'messages',
    author: '匿名爆料者',
    at: '@truth_teller_x',
    avatar: '🕵️',
    time: '20:12',
    body: '這是瘋瘋和 Lisa 上週吵架的錄音，你聽聽。',
    audio: {
      label: '爭吵錄音_final.mp3',
      duration: '0:37',
      spliced: true, // 破綻：波形有剪接
    },
    clue: {
      id: 'c_audio_splice',
      skill: 'zoom',
      method: 'zoom',
      hotspot: { x: 40, y: 30, w: 20, h: 40 }, // 波形中段
      hint: '把錄音波形放大看中段…',
      found: '波形在中段有一個突兀的斷點，前後音量與底噪完全不同。',
      truth: '這段錄音被剪接過，兩句話是從不同錄音拼起來的，語意被竄改。',
    },
  },

  // 第三幕
  ev_new_scene: {
    id: 'ev_new_scene',
    type: 'image',
    app: 'feed',
    author: '爆料公社_轉',
    at: '@leak_share',
    avatar: '📢',
    time: '21:05',
    body: '#快訊 疑似瘋瘋合夥人當晚出現在攝影棚後門！這才是關鍵人物？',
    likes: 15600,
    shares: 7200,
    shot: {
      caption: '「當晚」後門畫面',
      scene: 'alley',
      watermark: 'NightNews 2020',
    },
    clue: {
      id: 'c_reverse_old',
      skill: 'reverse',
      method: 'reverse',
      hint: '這張「當晚」的圖，來源查得到嗎？',
      found: '反查發現同一張圖出現在 2020 年一則舊新聞，與本次事件無關。',
      truth: '這張「當晚後門畫面」其實是三年前別則新聞的舊圖，被拿來製造假的反轉。',
      reverseResult: {
        source: 'NightNews · 2020-08-14',
        title: '某巷弄治安事件現場',
        note: '與「瘋瘋事件」無關，時間早三年。',
      },
    },
  },
  ev_rival_2: {
    id: 'ev_rival_2',
    type: 'post',
    app: 'feed',
    author: '熱點日報',
    at: '@hot_daily_scoop',
    avatar: '🗞️',
    time: '21:10',
    body: '早說了吧，重點根本不是 Lisa。有些小編就是愛跟風蹭流量，蠢。（我沒說是誰喔😏）我的爆料，你們早晚會看到。',
    likes: 8800,
    shares: 3400,
    clue: {
      id: 'c_rival_knew',
      skill: 'motive',
      method: 'insight',
      boss: true,
      hint: '他說「重點不是 Lisa」的時間，會不會太早了？',
      found: '熱點日報在 21:10 就斷言「不是 Lisa」——但 Lisa 的不在場證明 21:30 才公開。',
      truth: '【魔王破綻】他怎麼會在 Lisa 自清之前，就知道兇手不是她？除非他從頭就知道全部是假的——因為造假的人，就是他。這是整起事件的破口。',
    },
  },

  // 第四幕
  ev_tipster_profile: {
    id: 'ev_tipster_profile',
    type: 'account',
    app: 'browser',
    author: '匿名爆料者',
    at: '@truth_teller_x',
    avatar: '🕵️',
    account: {
      created: '事件前 1 天',
      posts: 3,
      followers: 12,
      note: '全部貼文都在爆料本案',
    },
    clue: {
      id: 'c_tipster_sock',
      skill: 'account',
      method: 'account',
      hint: '一直餵你料的這個帳號，本身可信嗎？',
      found: '@truth_teller_x 註冊於事件前一天，只有 3 則貼文、全在帶風向。',
      truth: '餵你所有「證據」的爆料者，是一個為本事件量身開的分身帳號。',
    },
  },

  // 第五幕（交叉比對用；真相相關）
  ev_lisa_alibi: {
    id: 'ev_lisa_alibi',
    type: 'post',
    app: 'feed',
    author: 'Lisa（前經紀人）',
    at: '@lisa_official',
    avatar: '💁‍♀️',
    official: true,
    time: '21:30',
    body: '事發當晚我人在高雄出差，附上高鐵票與飯店打卡。我沒有做任何事，請停止傷害。',
    likes: 3200,
    shares: 900,
    shot: {
      scene: 'ticket',
      from: '台北',
      to: '左營（高雄）',
      depart: '當晚 17:24 發車',
      checkin: '高雄某飯店 · 19:12 打卡',
    },
    timelineFact: { time: '19:30', place: '高雄（高鐵票+打卡）' },
    clue: {
      id: 'c_alibi_conflict',
      skill: 'timeline',
      method: 'timeline',
      hint: '把 Lisa 的位置和「爆料」放上時間軸比一比。',
      found: '爆料說 Lisa 在攝影棚，但她同時段有高雄的高鐵與打卡紀錄，兩者矛盾。',
      truth: 'Lisa 有明確不在場證明，指控她的時間線根本不成立。',
    },
  },
}

// ------------------------------------------------------------
// 六幕
// ------------------------------------------------------------
export const acts = [
  {
    id: 'act1',
    no: 1,
    title: '爆發',
    teach: 'timestamp',
    clueId: 'c_time_mismatch',
    notification: { app: 'feed', text: '網紅「瘋瘋」直播中突然倒下，全網瘋傳！' },
    briefing:
      '晚上 19:30，人氣網紅「瘋瘋」直播到一半突然倒地、畫面斷訊。全網炸鍋。\n你是粉專「觀點日報」的小編——手最快的人最有流量。先看看現在流傳的東西，再決定要不要發文。',
    instinct: '等等……這張「現場截圖」，真的是剛剛拍的嗎？',
    evidenceIds: ['ev_live_shot', 'ev_witness_story', 'ev_rival_1'],
    tip: '圖片都能點開放大 🔍——馬腳常常藏在你懶得看的細節裡。',
    decision: {
      prompt: '事件剛爆，你要怎麼發第一篇？',
      options: [
        { id: 'a1_impulse', label: '搶快！標題下「瘋瘋疑遭人加害，現場流出」', tone: 'impulse', followerDelta: 1800, trustDelta: -18,
          feedback: '流量暴衝，但你散播了沒查證的「現場截圖」。',
          knewText: '你明明放大過、知道那張圖時間對不上，還是為了流量發了出去。' },
        { id: 'a1_expose', label: '揭穿：「這張『現場圖』時間對不上，是舊畫面，別亂傳」', tone: 'expose', requiresClue: true, followerDelta: 900, trustDelta: 15,
          feedback: '你用事實幫大家踩了煞車。讀者開始信任你的判斷。' },
        { id: 'a1_cautious', label: '先寫「消息待查證，呼籲勿傳未證實畫面」', tone: 'cautious', followerDelta: 120, trustDelta: 5,
          feedback: '追蹤只微增，但你沒有散播未查證的內容。' },
      ],
    },
  },
  {
    id: 'act2',
    no: 2,
    title: '指向',
    teach: 'zoom',
    clueId: 'c_receipt_ps',
    notification: { app: 'messages', text: '有人私訊你「獨家證據」…' },
    briefing:
      '一個匿名帳號私訊你，塞來「Lisa 買毒收據」和「爭吵錄音」，說前經紀人 Lisa 早有預謀。\n全網開始出征 Lisa。跟風發文會爆量——但這些「證據」放大看，經得起檢查嗎？',
    instinct: '證據好像很充足……但一個陌生人特地塞這麼齊全的料給我，會不會太剛好了？',
    evidenceIds: ['ev_dm_receipt', 'ev_argue_audio'],
    tip: '收據、錄音波形都能放大 🔍。P 過的圖、剪過的音，邊緣會露餡。',
    decision: {
      prompt: '全網都在罵 Lisa，你跟不跟？',
      options: [
        { id: 'a2_impulse', label: '跟！發「鐵證曝光：Lisa 早有預謀」', tone: 'impulse', followerDelta: 5200, trustDelta: -25,
          feedback: '流量爆炸！但你把一個無辜的人推上了火刑台。',
          knewText: '你已經看出收據是 P 的，卻還是發了「鐵證」——這比不知情更糟。' },
        { id: 'a2_expose', label: '揭穿：「這張收據是合成的，別被帶風向出征 Lisa」', tone: 'expose', requiresClue: true, followerDelta: 1500, trustDelta: 18,
          feedback: '在全網喊打時你逆風查證，這一篇讓很多人冷靜下來。' },
        { id: 'a2_cautious', label: '發「證據有疑點，尚待查證」', tone: 'cautious', followerDelta: 300, trustDelta: 6,
          feedback: '你頂住了風向，沒有指控無辜的人。' },
      ],
    },
  },
  {
    id: 'act3',
    no: 3,
    title: '反轉',
    teach: 'reverse',
    clueId: 'c_reverse_old',
    notification: { app: 'feed', text: '風向突變！新證據指向另一個人…' },
    briefing:
      'Lisa 出面反駁。緊接著「新證據」冒出：一張「當晚後門畫面」指向瘋瘋的合夥人，輿論瞬間掉頭。\n反轉來得太快——這張新圖，來源查得到嗎？',
    instinct: '反轉來得也太快了……這張「當晚」的照片，我怎麼好像在哪看過？',
    evidenceIds: ['ev_new_scene', 'ev_rival_2'],
    tip: '在放大檢視裡，可疑的圖能「以圖搜圖」，看它到底從哪來。',
    decision: {
      prompt: '風向轉了，你要跟著轉去罵合夥人嗎？',
      options: [
        { id: 'a3_impulse', label: '跟！「驚天反轉：真兇是合夥人」', tone: 'impulse', followerDelta: 6100, trustDelta: -22,
          feedback: '+6100！可是你連反轉的那張圖都沒查來源，就又指控了下一個人。',
          knewText: '你已經反查出那是舊圖，卻還是跟著反轉帶風向。' },
        { id: 'a3_expose', label: '揭穿：「這張『當晚圖』是 2020 年舊圖，反轉是假的」', tone: 'expose', requiresClue: true, followerDelta: 1800, trustDelta: 20,
          feedback: '你沒被反轉牽著走，還戳破了它。這需要定力。' },
        { id: 'a3_cautious', label: '先按住，不跟這波反轉', tone: 'cautious', followerDelta: 200, trustDelta: 5,
          feedback: '新資訊出現時，你選擇先查證，而不是馬上掉頭。' },
      ],
    },
  },
  {
    id: 'act4',
    no: 4,
    title: '深挖',
    teach: 'account',
    clueId: 'c_tipster_sock',
    notification: { app: 'browser', text: '到底是誰一直在餵料？' },
    briefing:
      '你開始起疑：從頭到尾餵你「證據」的那個匿名帳號，到底是誰？\n點進去查查它的底細。',
    instinct: '從頭到尾都是這個帳號在餵我料……它自己，可信嗎？',
    evidenceIds: ['ev_tipster_profile'],
    tip: '在搜尋裡點開帳號，看它註冊多久、發過什麼。臨時開的號要小心。',
    decision: {
      prompt: '查完爆料帳號，你的判斷是？',
      options: [
        { id: 'a4_expose', label: '公開示警：「爆料帳號是事件前一天開的分身，別信」', tone: 'expose', requiresClue: true, followerDelta: 1200, trustDelta: 18,
          feedback: '你把矛頭轉向真正的問題：消息源本身就不可信。' },
        { id: 'a4_cautious', label: '心裡存疑，先不採用它的料', tone: 'cautious', followerDelta: 300, trustDelta: 6,
          feedback: '你沒有全盤採信一個來路不明的帳號。' },
        { id: 'a4_trust', label: '管他的，有料就是好料，繼續發', tone: 'impulse', followerDelta: 3000, trustDelta: -20,
          feedback: '+3000，但你把一個假帳號的話當成了真相。',
          knewText: '你已經查出它是分身帳號，卻還是拿它的料衝流量。' },
      ],
    },
  },
  {
    id: 'act5',
    no: 5,
    title: '裁決',
    teach: 'timeline',
    clueId: 'c_alibi_conflict',
    notification: { app: 'evidence', text: '把所有線索攤開，做最後判斷。' },
    briefing:
      '媒體開始引用你的貼文，你的每個字都在放大。\n把手上所有線索放上時間軸，交叉比對，然後下最終定論：這到底是誰的責任？',
    instinct: '每個人的說法都擺出來……時間對得上嗎？到底誰在說謊？',
    evidenceIds: ['ev_lisa_alibi'],
    tip: '打開「證據板」把線索排上時間軸，兜不攏的地方會自己跳出來。',
    decision: {
      prompt: '最終定論：這起事件，你要向大眾說什麼？',
      options: [
        { id: 'a5_expose', label: '公布真相：「時間軸矛盾，Lisa 有不在場證明，這是被操縱的獵巫」', tone: 'expose', requiresClue: true, followerDelta: 1500, trustDelta: 22,
          feedback: '你把整起帶風向攤在陽光下。這才是媒體該做的事。' },
        { id: 'a5_nobody', label: '沒有足夠證據指控任何人，呼籲等官方調查', tone: 'cautious', followerDelta: 500, trustDelta: 12,
          feedback: '在所有人都在站邊時，你選擇了「我不知道，先查證」。' },
        { id: 'a5_lisa', label: '定罪 Lisa', tone: 'impulse', followerDelta: 2000, trustDelta: -25,
          feedback: '你指控了一個有不在場證明的人。',
          knewText: '你已經看出時間軸矛盾，卻還是定罪了 Lisa。' },
        { id: 'a5_partner', label: '定罪合夥人', tone: 'impulse', followerDelta: 2000, trustDelta: -20,
          feedback: '你採信了一張三年前的舊圖。' },
      ],
    },
  },
  {
    id: 'act6',
    no: 6,
    title: '真相',
    teach: 'motive',
    notification: { app: 'feed', text: '官方調查結果公布…' },
    briefing: '', // 真相在結局畫面呈現
    evidenceIds: [],
    isEnding: true,
  },
]

// ------------------------------------------------------------
// 假搜尋引擎：關鍵字 → 結果
// ------------------------------------------------------------
export const search = {
  'lisa': [
    { title: 'Lisa 是誰？瘋瘋前經紀人背景整理', snippet: '曾任瘋瘋經紀人，去年約滿離職…', fake: false },
    { title: '【爆】Lisa 早有預謀？網友肉搜中', snippet: '匿名爆料指出…（消息未經證實）', fake: true },
  ],
  '瘋瘋': [
    { title: '網紅瘋瘋個人資料 / 頻道', snippet: '訂閱破百萬的實況主，曾公開提及有心臟舊疾。', fake: false, key: true },
    { title: '瘋瘋猝死內幕大公開', snippet: '標題聳動的內容農場文…', fake: true },
  ],
  '瘋瘋 病史': [
    { title: '瘋瘋兩年前直播提到「心臟不太好」片段', snippet: '本人曾說醫生提醒要注意心律…', fake: false, key: true, unlocks: 'health', clueId: 'c_health_search' },
  ],
  '心臟': [
    { title: '瘋瘋曾自述心臟舊疾', snippet: '過往直播與訪談紀錄。', fake: false, key: true, unlocks: 'health', clueId: 'c_health_search' },
  ],
  '病史': [
    { title: '瘋瘋曾自述心臟舊疾', snippet: '過往直播與訪談紀錄，醫生提醒注意心律。', fake: false, key: true, unlocks: 'health', clueId: 'c_health_search' },
  ],
  'truth_teller_x': [
    { title: '@truth_teller_x 帳號資訊', snippet: '註冊於事件前一天，貼文極少。', fake: false, key: true },
  ],
}

// 結局：真相與回放設定
export const ending = {
  truth:
    '三天後官方調查結果公布：瘋瘋是**心臟舊疾發作猝死，沒有人下毒、沒有人加害**。\n' +
    '所有「證據」——現場截圖、買毒收據、爭吵錄音、後門畫面——全是同一個匿名帳號 @truth_teller_x 偽造的。\n' +
    '而這個帳號的真身，就是那個全程在旁邊酸你、說「我手上有獨家」的同業小編 **@hot_daily_scoop（熱點日報）**。他一邊餵你假料、一邊看你上鉤。他賭的，就是「大家看到聳動的東西不會查證」。',
  clueOrder: [
    'c_time_mismatch',
    'c_witness_fake',
    'c_receipt_ps',
    'c_audio_splice',
    'c_reverse_old',
    'c_health_search',
    'c_rival_boast',
    'c_tipster_sock',
    'c_alibi_conflict',
    'c_rival_knew',
  ],
  // 帶回現實的查核工具（台灣）
  realTools: [
    { name: 'MyGoPen 麥擱騙', desc: 'LINE 上把可疑訊息貼給它，幫你查是不是假消息。', url: 'https://www.mygopen.com/' },
    { name: 'Cofacts 真的假的', desc: '開源的協作查核，查訊息、看網友與查核回應。', url: 'https://cofacts.tw/' },
    { name: '台灣事實查核中心', desc: '獨立的事實查核組織，查政治、健康、社會謠言。', url: 'https://tfc-taiwan.org.tw/' },
    { name: 'Google 圖片反搜', desc: '把可疑照片丟進去，看它是不是舊圖被重用。', url: 'https://images.google.com/' },
  ],
}

// 不在證據卡上的破綻（例如搜尋型），供結局回放對照
export const extraClues = {
  c_health_search: {
    id: 'c_health_search',
    skill: 'search',
    method: 'search',
    evAuthor: '搜尋結果',
    found: '搜尋「瘋瘋 病史」發現他兩年前就自述有心臟舊疾。',
    truth: '瘋瘋本來就有心臟宿疾——「被下毒」的前提從一開始就站不住腳。一搜就有，但很少人會去搜。',
  },
}

// 公信力起始值（0–100）
export const START_TRUST = 60

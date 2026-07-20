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
  motive: { key: 'motive', icon: '🎯', name: '問誰得利', desc: '想想「這件事誰獲利」，動機常指向真正的操縱者。' },
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
    body: '【震驚】阿聲直播到一半突然倒下！現場畫面流出⚠️',
    likes: 12800,
    shares: 4300,
    // 程式繪製的假截圖
    shot: {
      caption: 'LIVE · 阿聲的頻道',
      timestampText: '18:47', // 破綻：比事件（19:30 倒下）還早
      scene: 'studio',
    },
    clue: {
      id: 'c_time_mismatch',
      skill: 'timestamp',
      method: 'zoom',
      hotspot: { x: 72, y: 6, w: 26, h: 12 }, // 右上角時間戳
      hint: '截圖右上角有個時間…',
      found: '截圖時間顯示 18:47，但阿聲是 19:30 才倒下的。',
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
    body: '我剛好在攝影棚附近！看到有人神色慌張跑出來，一定有內情… #阿聲 #內幕',
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
    body: '這是阿聲和 Lisa 上週吵架的錄音，你聽聽。',
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
    body: '#快訊 疑似阿聲合夥人當晚出現在攝影棚後門！這才是關鍵人物？',
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
        note: '與「阿聲事件」無關，時間早三年。',
      },
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
    notification: { app: 'feed', text: '網紅「阿聲」直播中突然倒下，全網瘋傳！' },
    briefing:
      '晚上 19:30，人氣網紅「阿聲」直播到一半突然倒地、畫面斷訊。全網炸鍋。\n你是粉專「觀點日報」的小編——手最快的人最有流量。先看看現在流傳的東西，再決定要不要發文。',
    instinct: '等等……這張「現場截圖」，真的是剛剛拍的嗎？',
    evidenceIds: ['ev_live_shot', 'ev_witness_story'],
    tip: '圖片都能點開放大 🔍——馬腳常常藏在你懶得看的細節裡。',
    decision: {
      prompt: '事件剛爆，你要怎麼發第一篇？',
      options: [
        { id: 'a1_impulse', label: '搶快！標題下「阿聲疑遭人加害，現場流出」', tone: 'impulse', followerDelta: 1800,
          feedback: '流量暴衝 +1800！但你用的「現場截圖」你查過了嗎？' },
        { id: 'a1_cautious', label: '先寫「消息待查證，呼籲勿傳未證實畫面」', tone: 'cautious', followerDelta: 120,
          feedback: '追蹤只 +120，但你沒有散播未查證的內容。' },
        { id: 'a1_hold', label: '先不發，繼續查', tone: 'cautious', followerDelta: 0,
          feedback: '你按住了手。流量沒動，但你爭取到查證的時間。' },
      ],
    },
  },
  {
    id: 'act2',
    no: 2,
    title: '指向',
    teach: 'zoom',
    notification: { app: 'messages', text: '有人私訊你「獨家證據」…' },
    briefing:
      '一個匿名帳號私訊你，塞來「Lisa 買毒收據」和「爭吵錄音」，說前經紀人 Lisa 早有預謀。\n全網開始出征 Lisa。跟風發文會爆量——但這些「證據」放大看，經得起檢查嗎？',
    instinct: '證據好像很充足……但一個陌生人特地塞這麼齊全的料給我，會不會太剛好了？',
    evidenceIds: ['ev_dm_receipt', 'ev_argue_audio'],
    tip: '收據、錄音波形都能放大 🔍。P 過的圖、剪過的音，邊緣會露餡。',
    decision: {
      prompt: '全網都在罵 Lisa，你跟不跟？',
      options: [
        { id: 'a2_impulse', label: '跟！發「鐵證曝光：Lisa 早有預謀」', tone: 'impulse', followerDelta: 5200,
          feedback: '流量爆炸 +5200！但那張收據、那段錄音是真的嗎？' },
        { id: 'a2_cautious', label: '發「證據有疑點，尚待查證」', tone: 'cautious', followerDelta: 300,
          feedback: '你頂住了風向。追蹤只微增，但你沒有指控無辜的人。' },
      ],
    },
  },
  {
    id: 'act3',
    no: 3,
    title: '反轉',
    teach: 'reverse',
    notification: { app: 'feed', text: '風向突變！新證據指向另一個人…' },
    briefing:
      'Lisa 出面反駁。緊接著「新證據」冒出：一張「當晚後門畫面」指向阿聲的合夥人，輿論瞬間掉頭。\n反轉來得太快——這張新圖，來源查得到嗎？',
    instinct: '反轉來得也太快了……這張「當晚」的照片，我怎麼好像在哪看過？',
    evidenceIds: ['ev_new_scene'],
    tip: '在放大檢視裡，可疑的圖能「以圖搜圖」，看它到底從哪來。',
    decision: {
      prompt: '風向轉了，你要跟著轉去罵合夥人嗎？',
      options: [
        { id: 'a3_impulse', label: '跟！「驚天反轉：真兇是合夥人」', tone: 'impulse', followerDelta: 6100,
          feedback: '+6100！可是你連反轉的那張圖都沒查來源…' },
        { id: 'a3_cautious', label: '先反查那張圖再說', tone: 'cautious', followerDelta: 200,
          feedback: '你沒有被反轉牽著走。新資訊出現時，你選擇先查證。' },
      ],
    },
  },
  {
    id: 'act4',
    no: 4,
    title: '深挖',
    teach: 'account',
    notification: { app: 'browser', text: '到底是誰一直在餵料？' },
    briefing:
      '你開始起疑：從頭到尾餵你「證據」的那個匿名帳號，到底是誰？\n點進去查查它的底細。',
    instinct: '從頭到尾都是這個帳號在餵我料……它自己，可信嗎？',
    evidenceIds: ['ev_tipster_profile'],
    tip: '在搜尋裡點開帳號，看它註冊多久、發過什麼。臨時開的號要小心。',
    decision: {
      prompt: '查完爆料帳號，你的判斷是？',
      options: [
        { id: 'a4_sock', label: '這是個為本案量身開的分身帳號', tone: 'cautious', followerDelta: 400,
          feedback: '你抓到了：消息源本身就不可信。' },
        { id: 'a4_trust', label: '管他的，有料就是好料，繼續發', tone: 'impulse', followerDelta: 3000,
          feedback: '+3000，但你把一個假帳號的話當成了真相。' },
      ],
    },
  },
  {
    id: 'act5',
    no: 5,
    title: '裁決',
    teach: 'timeline',
    notification: { app: 'evidence', text: '把所有線索攤開，做最後判斷。' },
    briefing:
      '媒體開始引用你的貼文，你的每個字都在放大。\n把手上所有線索放上時間軸，交叉比對，然後下最終定論：這到底是誰的責任？',
    instinct: '每個人的說法都擺出來……時間對得上嗎？到底誰在說謊？',
    evidenceIds: ['ev_lisa_alibi'],
    tip: '打開「證據板」把線索排上時間軸，兜不攏的地方會自己跳出來。',
    decision: {
      prompt: '最終定論：這起事件，你要向大眾說什麼？',
      options: [
        { id: 'a5_lisa', label: '定罪 Lisa', tone: 'impulse', followerDelta: 2000,
          feedback: '你指控了一個有不在場證明的人。' },
        { id: 'a5_partner', label: '定罪合夥人', tone: 'impulse', followerDelta: 2000,
          feedback: '你採信了一張三年前的舊圖。' },
        { id: 'a5_nobody', label: '沒有足夠證據指控任何人，呼籲等官方調查', tone: 'cautious', followerDelta: 500,
          feedback: '在所有人都在站邊時，你選擇了「我不知道，先查證」。' },
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
    { title: 'Lisa 是誰？阿聲前經紀人背景整理', snippet: '曾任阿聲經紀人，去年約滿離職…', fake: false },
    { title: '【爆】Lisa 早有預謀？網友肉搜中', snippet: '匿名爆料指出…（消息未經證實）', fake: true },
  ],
  '阿聲': [
    { title: '網紅阿聲個人資料 / 頻道', snippet: '訂閱破百萬的實況主，曾公開提及有心臟舊疾。', fake: false, key: true },
    { title: '阿聲猝死內幕大公開', snippet: '標題聳動的內容農場文…', fake: true },
  ],
  '阿聲 病史': [
    { title: '阿聲兩年前直播提到「心臟不太好」片段', snippet: '本人曾說醫生提醒要注意心律…', fake: false, key: true, unlocks: 'health' },
  ],
  '心臟': [
    { title: '阿聲曾自述心臟舊疾', snippet: '過往直播與訪談紀錄。', fake: false, key: true, unlocks: 'health' },
  ],
  'truth_teller_x': [
    { title: '@truth_teller_x 帳號資訊', snippet: '註冊於事件前一天，貼文極少。', fake: false, key: true },
  ],
}

// 結局：真相與回放設定
export const ending = {
  truth:
    '三天後官方調查結果公布：阿聲是**心臟舊疾發作猝死，沒有人下毒、沒有人加害**。\n' +
    '所有「證據」——現場截圖、買毒收據、爭吵錄音、後門畫面——全是同一個匿名帳號 @truth_teller_x 偽造的。\n' +
    '而這個帳號，其實是另一個跟你搶流量的小編。他賭的，就是「大家看到聳動的東西不會查證」。',
  clueOrder: [
    'c_time_mismatch',
    'c_receipt_ps',
    'c_audio_splice',
    'c_reverse_old',
    'c_tipster_sock',
    'c_alibi_conflict',
  ],
}

/* 全廣東話口語劇本。改呢個檔就得，唔使改引擎。
   步驟類型：{who,face,text} | {choice:[{text,next,ic,s}]} | {goto:'scene'} |
             {flag:'x'} | {item:'item_r1c1'} | {end:true}
   who: rabbit/bear/lobster/cat/pig… 或 'narrator'（旁白）／'piano'（主角心聲）
   face: 'face'（普通）／'happy'（開心）   {name} = 玩家名
   選項可以加 ic（sprite key）＋ s（縮放）畫圖代替文字 */
window.SCRIPT = {
  defaultName: '傻肥',

  speakers: {
    rabbit: { name: '兔仔朋友', face: 'rabbit_idle', happy: 'rabbit_happy' },
    bear: { name: '熊師傅', face: 'bear_idle', happy: 'bear_happy' },
    lobster: { name: '龍蝦師傅', face: 'lobster_idle', happy: 'lobster_happy' },
    cat: { name: '綠貓 barista', face: 'cat_idle', happy: 'cat_happy' },
    pig: { name: '傻豬', face: 'pig_idle', happy: 'pig_happy' },
    pig2: { name: '傻豬', face: 'pigb_face_r1c1', happy: 'pigb_face_r2c3', party: 'pigb_face_r3c3' },
    penguin: { name: '企鵝侍應', face: 'penguin_idle', happy: 'penguin_happy' },
    piano: { name: '我', face: 'pianow_face_r1c1', happy: 'pianow_face_r1c4' },
    narrator: { name: '', face: null },
  },

  scenes: {
    /* ---------------- Act 1：兔仔 ---------------- */
    rabbit_act1: [
      { who: 'rabbit', face: 'face', text: '{name}！{name}！今日係妳生日喎～' },
      { who: 'rabbit', face: 'happy', text: '生日快樂呀！妳想點過今日？' },
      { choice: [
        { text: '🍝 我想食啲好嘅', next: 'rb_food' },
        { text: '🎁 我想收禮物', next: 'rb_gift' },
        { text: '😳 我…唔知呀', next: 'rb_dunno' },
      ] },
    ],
    rb_food: [
      { who: 'rabbit', face: 'happy', text: '識食喎！咁一於去食好西～' },
      { goto: 'rb_quest' },
    ],
    rb_gift: [
      { who: 'rabbit', face: 'happy', text: '哈哈，咁妳要乖乖等到今晚喎～' },
      { goto: 'rb_quest' },
    ],
    rb_dunno: [
      { who: 'rabbit', face: 'face', text: '唔緊要，慢慢諗。' },
      { who: 'rabbit', face: 'happy', text: '我哋一齊去搵答案啦！' },
      { goto: 'rb_quest' },
    ],
    rb_quest: [
      { who: 'rabbit', face: 'face', text: '咁我哋去搵「妳最想要嘅嘢」啦！' },
      { who: 'rabbit', face: 'happy', text: '聽講要集齊 3 個心願碎片先得㗎～' },
      { flag: 'quest_started' },
      { who: 'narrator', text: '〔任務開始：收集 3 個心願碎片〕' },
      { who: 'rabbit', face: 'happy', text: '街上三間舖：意粉店、海鮮餐廳、Cafe，行入去搵師傅啦！' },
      { end: true },
    ],
    rabbit_again: [
      { who: 'rabbit', face: 'happy', text: '碎片就喺三間舖度～ 加油呀{name}！' },
      { end: true },
    ],
    rabbit_all_done: [
      { who: 'rabbit', face: 'happy', text: '三個碎片都齊啦！' },
      { who: 'rabbit', face: 'face', text: '今晚有個地方等妳… 天黑之前記得行去生日會場呀。' },
      { flag: 'act2_done' },
      { who: 'narrator', text: '〔下一步：生日會場（Act 3）〕' },
      { end: true },
    ],

    /* ---------------- Act 2-1：意粉店 熊師傅 ---------------- */
    bear_act2: [
      { who: 'bear', face: 'happy', text: '歡迎歡迎！{name} 今日生日喎～' },
      { who: 'bear', face: 'face', text: '卡邦尼？識貨喎！要唔要多啲芝士？' },
      { choice: [
        { text: '🧀 多啲芝士！', next: 'bear_cheese' },
        { text: '🍝 唔使，原味最好', next: 'bear_plain' },
        { text: '😋 可唔可以偷食一啖先？', next: 'bear_sneak' },
      ] },
    ],
    bear_cheese: [
      { who: 'bear', face: 'happy', text: '好！洒到成碟都係芝士～' },
      { goto: 'bear_ask' },
    ],
    bear_plain: [
      { who: 'bear', face: 'happy', text: '識食！原味先食到意粉本身嘅香。' },
      { goto: 'bear_ask' },
    ],
    bear_sneak: [
      { who: 'bear', face: 'happy', text: '哈哈，偷食得！不過要留返個肚今晚喎。' },
      { goto: 'bear_ask' },
    ],
    bear_ask: [
      { who: 'bear', face: 'face', text: '不過…煮嘢之前想問妳一句。' },
      { who: 'bear', face: 'face', text: '如果今日可以揀一份禮物，妳最想要咩呢？' },
      { choice: [
        { text: '想有人陪我食餐好嘅', next: 'bear_a1' },
        { text: '想要一份驚喜', next: 'bear_a2' },
        { text: '想有人記得今日', next: 'bear_a3' },
      ] },
    ],
    bear_a1: [
      { who: 'bear', face: 'happy', text: '嗯，有人陪，食咩都香。我記住咗。' },
      { goto: 'bear_give' },
    ],
    bear_a2: [
      { who: 'bear', face: 'happy', text: '驚喜…最緊要係冇預計過嘅一刻。記住咗。' },
      { goto: 'bear_give' },
    ],
    bear_a3: [
      { who: 'bear', face: 'happy', text: '記得今日嘅人，已經喺度喇。' },
      { goto: 'bear_give' },
    ],
    bear_give: [
      { who: 'bear', face: 'happy', text: '呢個係妳嘅心願碎片①，拎住先！' },
      { who: 'narrator', text: '〔拎到：卡邦尼意粉〕' },
      { item: 'item_r1c1' },
      { tally: '①卡邦尼意粉' },
      { flag: 'bear_done' },
      { end: true },
    ],
    bear_done: [
      { who: 'bear', face: 'happy', text: '妳嘅卡邦尼我記住咗，今晚食得開心啲！' },
      { end: true },
    ],

    /* ---------------- Act 2-2：海鮮餐廳 龍蝦師傅（夾龍蝦小遊戲）---------------- */
    lobster_act2: [
      { who: 'lobster', face: 'happy', text: '嘩！今日生日喎～ 嚟玩個小遊戲！' },
      { who: 'lobster', face: 'face', text: '喺個缸度，夾走最大隻龍蝦。睇妳眼光！' },
      { who: 'narrator', text: '〔揀最大隻嘅龍蝦〕' },
      { choice: [
        { ic: 'item_r1c2', s: 1.45, text: '呢隻！（大）', next: 'lob_big' },
        { ic: 'item_r1c2', s: 1.0, text: '呢隻（中）', next: 'lob_mid' },
        { ic: 'item_r1c2', s: 0.62, text: '呢隻（細）', next: 'lob_small' },
      ] },
    ],
    lob_big: [
      { who: 'lobster', face: 'happy', text: '嘩！好眼光！呢隻最肥美，芝士焗一流！' },
      { goto: 'lob_ask' },
    ],
    lob_mid: [
      { who: 'lobster', face: 'face', text: '唔…中規中矩啦，不過我都焗得好食嘅。' },
      { goto: 'lob_ask' },
    ],
    lob_small: [
      { who: 'lobster', face: 'happy', text: '哈哈，細隻都有細隻嘅可愛，一樣咁甜。' },
      { goto: 'lob_ask' },
    ],
    lob_ask: [
      { who: 'lobster', face: 'face', text: '講開又講… 如果今日可以揀一份禮物，妳最想要咩呢？' },
      { choice: [
        { text: '想食一餐好嘅', next: 'lob_a1' },
        { text: '想有人陪我', next: 'lob_a2' },
        { text: '想收到一個卡夾', next: 'lob_a3' },
      ] },
    ],
    lob_a1: [
      { who: 'lobster', face: 'happy', text: '食得開心，日子就記得。' },
      { goto: 'lob_give' },
    ],
    lob_a2: [
      { who: 'lobster', face: 'happy', text: '有人陪，龍蝦都甜啲。' },
      { goto: 'lob_give' },
    ],
    lob_a3: [
      { who: 'lobster', face: 'happy', text: '卡夾？實用喎，袋住啲細細嘅回憶。' },
      { goto: 'lob_give' },
    ],
    lob_give: [
      { who: 'lobster', face: 'happy', text: '呢個係心願碎片②，拎住先！' },
      { who: 'narrator', text: '〔拎到：芝士龍蝦〕' },
      { item: 'item_r1c2' },
      { tally: '②芝士龍蝦' },
      { flag: 'lobster_done' },
      { end: true },
    ],
    lobster_done: [
      { who: 'lobster', face: 'happy', text: '芝士龍蝦，我記住咗，今晚見！' },
      { end: true },
    ],

    /* ---------------- Act 2-3：Cafe 綠貓 barista ---------------- */
    cat_act2: [
      { who: 'cat', face: 'face', text: '歡迎～ 今日生日嘅小姐飲咩？' },
      { who: 'cat', face: 'face', text: '抹茶 latte，甜度幫妳揀：少甜／正常／超甜？' },
      { choice: [
        { text: '少甜', next: 'cat_light' },
        { text: '正常', next: 'cat_norm' },
        { text: '超甜！', next: 'cat_sweet' },
      ] },
    ],
    cat_light: [
      { who: 'cat', face: 'face', text: '少甜…抹茶嘅苦香最出。' },
      { goto: 'cat_ask' },
    ],
    cat_norm: [
      { who: 'cat', face: 'happy', text: '正常甜度，最穩陣嘅選擇。' },
      { goto: 'cat_ask' },
    ],
    cat_sweet: [
      { who: 'cat', face: 'happy', text: '超甜！好啦，今日生日妳話事～' },
      { goto: 'cat_ask' },
    ],
    cat_ask: [
      { who: 'cat', face: 'face', text: '沖緊嘅時候，想問妳一句…' },
      { who: 'cat', face: 'face', text: '如果今日可以揀一份禮物，妳最想要咩呢？' },
      { choice: [
        { text: '想放鬆一日', next: 'cat_a1' },
        { text: '想同重要嘅人一齊', next: 'cat_a2' },
        { text: '想…有人明白我', next: 'cat_a3' },
      ] },
    ],
    cat_a1: [
      { who: 'cat', face: 'happy', text: '放鬆…有時最奢侈嘅禮物。' },
      { goto: 'cat_give' },
    ],
    cat_a2: [
      { who: 'cat', face: 'happy', text: '重要嘅人，會準時出現嘅。' },
      { goto: 'cat_give' },
    ],
    cat_a3: [
      { who: 'cat', face: 'face', text: '明白…有時一杯熱嘅都已經夠。' },
      { goto: 'cat_give' },
    ],
    cat_give: [
      { who: 'cat', face: 'happy', text: '呢個係心願碎片③，小心熱呀～' },
      { who: 'narrator', text: '〔拎到：抹茶 latte〕' },
      { item: 'item_r1c3' },
      { tally: '③抹茶 latte' },
      { flag: 'cat_done' },
      { who: 'narrator', text: '〔三個心願碎片，齊喇〕' },
      { who: 'cat', face: 'face', text: '出面天色開始暗…去搵兔仔朋友啦，佢好似等緊妳。' },
      { end: true },
    ],
    cat_done: [
      { who: 'cat', face: 'happy', text: '抹茶 latte 我記住咗，想飲隨時嚟。' },
      { end: true },
    ],

    /* ---------------- Act 3：籬笆 → 夢境 → 生日會 ---------------- */
    fence_early: [
      { who: 'narrator', text: '籬笆後面好黑…而家仲未係時候。' },
      { who: 'narrator', text: '〔先集齊 3 個心願碎片〕' },
      { end: true },
    ],
    fence_later: [
      { who: 'narrator', text: '夜晚嘅籬笆，靜到聽到自己心跳。' },
      { end: true },
    ],
    act3_intro: [
      { who: 'narrator', text: '跳過籬笆之後，成條村都靜晒。' },
      { who: 'narrator', text: '…連兔仔朋友都開始打呵欠。' },
      { who: 'rabbit', face: 'face', text: 'Zzz… 生日快樂… Zzz…' },
      { who: 'narrator', text: '眼皮愈嚟愈重，星星好似落咗落嚟咁。' },
      { room: 'dream' },
      { who: 'narrator', text: '前面有個熟悉嘅身影。' },
      { end: true },
    ],
    pig_act3: [
      { who: 'pig', face: 'happy', text: '{name}，三個心願碎片都齊喇。' },
      { who: 'pig', face: 'face', text: '不過呢…我仲有樣嘢想知。' },
      { choice: [
        { text: '🍰 你今晚準備咗咩？', next: 'pig_a1' },
        { text: '🎁 有冇禮物？（笑）', next: 'pig_a2' },
        { text: '😌 我淨係想坐低唞下', next: 'pig_a3' },
      ] },
    ],
    pig_a1: [
      { who: 'pig', face: 'happy', text: '有蛋糕。三層嘅。' },
      { who: 'pig', face: 'happy', text: '蠟燭我試吹過…吹唔熄。' },
      { goto: 'pig_party' },
    ],
    pig_a2: [
      { who: 'pig', face: 'happy', text: '有。但要行到會場先拆得。' },
      { goto: 'pig_party' },
    ],
    pig_a3: [
      { who: 'pig', face: 'happy', text: '咁就啱喇。我留咗個位畀妳。' },
      { goto: 'pig_party' },
    ],
    pig_party: [
      { who: 'pig', face: 'happy', text: '行啦，今晚仲有自助餐。' },
      { who: 'pig', face: 'face', text: '{name}，以後每年今日…我都會記得。' },
      { flag: 'pig_done' },
      { room: 'party' },
      { end: true },
    ],
    party_end: [
      { celebrate: true },
      { who: 'penguin', face: 'happy', text: '歡迎嚟到生日會！蛋糕、自助餐、禮物都準備好～' },
      { who: 'pig2', face: 'happy', text: '{name}，我哋等妳好耐喇。' },
      { cutin: 'bg_cake' },
      { pose: 'pianob_r1c3' },
      { who: 'narrator', text: '〔三層蛋糕上面，三支蠟燭微微咁搖。〕' },
      { who: 'narrator', text: '〔閉上眼，許個願。〕' },
      { pose: 'pianob_r1c4' },
      { who: 'narrator', text: '〔呼——蠟燭熄晒，大家拍手。〕' },
      { who: 'penguin', face: 'face', text: '最緊要係…拆禮物！' },
      { pose: 'pianob_r1c2' },
      { show: 'PR_r1c2', s: 3.4 },
      { who: 'narrator', text: '〔打開粉紅色嘅禮物盒…〕' },
      { pose: 'pianob_r1c1' },
      { show: 'PR_r1c3', s: 3.4 },
      { who: 'narrator', text: '…係一個卡夾，夾住一張細細嘅卡。' },
      { who: 'narrator', text: '卡上面寫住：「今晚仲有自助餐。生日快樂。」' },
      { who: 'pig2', face: 'party', text: '生日快樂，{name}。' },
      { who: 'piano', face: 'face', text: '…傻豬。多謝你。' },
      { show: null },
      { pose: null },
      { flag: 'act3_done' },
      { credits: true },
      { end: true },
    ],
  },
};

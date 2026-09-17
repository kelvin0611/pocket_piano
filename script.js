/* 全廣東話口語劇本。改呢個檔就得，唔使改引擎。
   步驟類型：{who,face,text} | {choice:[{text,next,ic,s}]} | {goto:'scene'} |
             {flag:'x'} | {item:'item_r1c1'} | {tally:'…'} | {guess:true} |
             {merge:true}（鍵盤合體動畫）| {end:true}
   who: rabbit/bear/lobster/cat/pig… 或 'narrator'（旁白）／'piano'（主角心聲）
        friend_andy / friend_nichole / friend_kafai / friend_hiulam / friend_lulu / friend_waichun
   face: 'face'（普通）／'happy'（開心）   {name} = 玩家名

   ⚠️ 設計原則（2026-09-15 改版）：
   三塊碎片＝日向①＋貼紙②＋鍵帽③，合埋＝一副客製鍵盤（排球少年主題）。
   所有提示要「間接」——唔可以講明「鍵盤」兩個字，要佢自己拼返出嚟。 */
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
    /* 朋友（一齊去大鵬所城）——冇頭像，只有名 */
    friend_andy:    { name: 'andy',    face: null },
    friend_nichole: { name: 'nichole', face: null },
    friend_kafai:   { name: 'kafai',   face: null },
    friend_hiulam:  { name: 'hiulam',  face: null },
    friend_lulu:    { name: 'lulu',    face: null },
    friend_waichun: { name: 'waichun', face: null },
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
      { who: 'rabbit', face: 'face', text: '有人偷偷準備咗一份嘢畀妳…砌足成個月嗰種。' },
      { who: 'rabbit', face: 'happy', text: '佢將啲線索拆成 3 塊碎片，散咗喺街上面。' },
      { who: 'rabbit', face: 'happy', text: '三塊合埋一齊，就會知係咩。集齊佢啦！' },
      { flag: 'quest_started' },
      { who: 'narrator', text: '〔任務開始：收集 3 塊碎片〕' },
      { who: 'rabbit', face: 'happy', text: '街上三間舖：意粉店、海鮮餐廳、Cafe，行入去搵師傅啦！' },
      { end: true },
    ],
    rabbit_again: [
      { who: 'rabbit', face: 'happy', text: '碎片就喺三間舖度～ 加油呀{name}！' },
      { end: true },
    ],
    rabbit_all_done: [
      { who: 'rabbit', face: 'happy', text: '三塊碎片都齊啦！' },
      { who: 'rabbit', face: 'face', text: '而家去搵傻豬 —— 佢負責砌埋一齊。' },
      { who: 'rabbit', face: 'happy', text: '天黑之前，行去最底嘅籬笆啦。' },
      { flag: 'act2_done' },
      { who: 'narrator', text: '〔下一步：籬笆後面（Act 3）〕' },
      { end: true },
    ],

    /* ---------------- Act 2-1：意粉店 熊師傅 → 碎片② 貼紙 ---------------- */
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
      { who: 'bear', face: 'face', text: '講開又講… 我啲外賣盒上面貼滿貼紙。' },
      { who: 'bear', face: 'face', text: '有啲人會偷偷撕一兩張走，話要儲。' },
      { choice: [
        { text: '我都想儲！', next: 'bear_a1' },
        { text: '貼紙有咩好儲？', next: 'bear_a2' },
        { text: '…撕走嘅係你？', next: 'bear_a3' },
      ] },
    ],
    bear_a1: [
      { who: 'bear', face: 'happy', text: '哈哈，咁妳揀一張啦。' },
      { goto: 'bear_give' },
    ],
    bear_a2: [
      { who: 'bear', face: 'happy', text: '因為貼上去之後，件嘢就變成「你嘅」。' },
      { goto: 'bear_give' },
    ],
    bear_a3: [
      { who: 'bear', face: 'happy', text: '唔係我。不過有人儲咗成疊，話要一次過用。' },
      { goto: 'bear_give' },
    ],
    bear_give: [
      { who: 'bear', face: 'happy', text: '呢塊係碎片②：一張貼紙。' },
      { who: 'bear', face: 'face', text: '有人話，最後會貼喺一件日日都用嘅嘢上面。' },
      { who: 'narrator', text: '〔拎到碎片②：排球少年貼紙〕' },
      { item: 'hint_sticker' },
      { tally: '貼紙' },
      { flag: 'bear_done' },
      { end: true },
    ],
    bear_done: [
      { who: 'bear', face: 'happy', text: '貼紙好好袋住佢，今晚用得着。' },
      { end: true },
    ],

    /* ---------------- Act 2-2：海鮮餐廳 龍蝦師傅 → 碎片③ 鍵帽 ---------------- */
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
      { who: 'lobster', face: 'face', text: '妳睇我呢個冰櫃…' },
      { who: 'lobster', face: 'face', text: '啲冰一粒一粒咁排，每一粒都可以自己揀位。' },
      { who: 'lobster', face: 'happy', text: '有啲嘢都係咁㗎 —— 一件一件砌出嚟，全世界只出一個。' },
      { choice: [
        { text: '砌出嚟嘅？', next: 'lob_a1' },
        { text: '咁用起上嚟會唔會响？', next: 'lob_a2' },
        { text: '會唔會好貴？', next: 'lob_a3' },
      ] },
    ],
    lob_a1: [
      { who: 'lobster', face: 'happy', text: '唔係買返嚟倒出嚟㗎。係一件一件揀、一件一件裝。' },
      { goto: 'lob_give' },
    ],
    lob_a2: [
      { who: 'lobster', face: 'happy', text: '會。『啪、啪、啪』咁响。有啲人專登為咗嗰聲去砌。' },
      { goto: 'lob_give' },
    ],
    lob_a3: [
      { who: 'lobster', face: 'happy', text: '貴唔貴睇你揀咩。最貴嘅係…有人肯為你逐件逐件砌。' },
      { goto: 'lob_give' },
    ],
    lob_give: [
      { who: 'lobster', face: 'happy', text: '呢塊係碎片③：一粒殼。' },
      { who: 'lobster', face: 'face', text: '唔係比妳食嘅…係比妳手指㩒嘅。' },
      { who: 'narrator', text: '〔拎到碎片③：一粒鍵帽〕' },
      { item: 'hint_keycap' },
      { tally: '鍵帽' },
      { flag: 'lobster_done' },
      { end: true },
    ],
    lobster_done: [
      { who: 'lobster', face: 'happy', text: '嗰粒「殼」袋好佢，今晚好有用。' },
      { end: true },
    ],

    /* ---------------- Act 2-3：Cafe 綠貓 → 碎片① 日向 ---------------- */
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
      { who: 'cat', face: 'face', text: '我琴晚發咗個夢…' },
      { who: 'cat', face: 'face', text: '見到隻黑色嘅大鳥，飛過一張好高嘅網。' },
      { who: 'cat', face: 'happy', text: '網下面有個著 10 號嘅細粒仔，跳得好高，高到我想問佢識唔識落地。' },
      { choice: [
        { text: '10 號…排球？', next: 'cat_a1' },
        { text: '你發夢都咁識嘢？', next: 'cat_a2' },
        { text: '我想要返嗰個夢。', next: 'cat_a3' },
      ] },
    ],
    cat_a1: [
      { who: 'cat', face: 'happy', text: '排球？唔知喎。我淨係知佢成日同一個 9 號仔一齊。' },
      { goto: 'cat_give' },
    ],
    cat_a2: [
      { who: 'cat', face: 'happy', text: '我日日睇住啲客，睇得多就會夢到啦。' },
      { goto: 'cat_give' },
    ],
    cat_a3: [
      { who: 'cat', face: 'happy', text: '夢我唔可以賣畀妳…不過有樣嘢可以。' },
      { goto: 'cat_give' },
    ],
    cat_give: [
      { who: 'cat', face: 'happy', text: '呢塊係碎片①：一件 10 號嘅衫。' },
      { who: 'cat', face: 'face', text: '細細件，啱啱好放得落一粒方塊上面。' },
      { who: 'narrator', text: '〔拎到碎片①：10 號球衣〕' },
      { item: 'hint_jersey' },
      { tally: '10 號球衣' },
      { flag: 'cat_done' },
      { who: 'narrator', text: '〔三塊碎片，齊喇〕' },
      { who: 'cat', face: 'face', text: '出面天色開始暗…去搵傻豬啦，佢喺籬笆後面等妳。' },
      { end: true },
    ],
    cat_done: [
      { who: 'cat', face: 'happy', text: '三塊都齊就好喇，今晚會好難忘。' },
      { end: true },
    ],

    /* ---------------- 橋段：朋友嘅口風 ---------------- */
    friends_chat: [
      { who: 'narrator', text: '〔手機震咗幾下 —— 個群組炸咗。〕' },
      { who: 'friend_andy',    text: '我淨係知件事唔關食物事。' },
      { who: 'friend_nichole', text: '我偷偷摸過…有啲硬淨，但唔係石頭。' },
      { who: 'friend_kafai',   text: '有人話為咗揀色，試咗好多次。' },
      { who: 'friend_hiulam',  text: '成日半夜喺房度「啪、啪、啪」…唔好諗歪呀，佢係喺房。' },
      { who: 'friend_lulu',    text: '佢話要帶得出街都得㗎。' },
      { who: 'friend_waichun', text: '我唔知係咩，但我知佢好緊張呢份嘢。' },
      { who: 'piano', face: 'face', text: '（…點解我覺得我係知道嘅？）' },
      { end: true },
    ],

    /* ---------------- Act 3：籬笆 → 夢境合體 → 生日會 ---------------- */
    fence_early: [
      { who: 'narrator', text: '籬笆後面好黑…而家仲未係時候。' },
      { who: 'narrator', text: '〔先集齊 3 塊碎片〕' },
      { end: true },
    ],
    fence_later: [
      { who: 'narrator', text: '夜晚嘅籬笆，靜到聽到自己心跳。' },
      { end: true },
    ],
    act3_intro: [
      { who: 'narrator', text: '籬笆後面，暗得只剩一點光。' },
      { room: 'dream' },
      { who: 'narrator', text: '前面有個熟悉嘅身影。' },
      { end: true },
    ],

    /* 傻豬：合體 + 開估 */
    pig_act3: [
      { who: 'pig', face: 'happy', text: '{name}，三塊碎片都齊喇。' },
      { who: 'pig', face: 'face', text: '未砌之前…我想問妳一句。' },
      { who: 'pig', face: 'face', text: '妳估下，呢三塊嘢砌埋一齊，會變成咩？' },
      { guess: true },                                  /* ← 跳出輸入框 → send 去男朋友 WhatsApp */
      { who: 'pig', face: 'happy', text: '（收到。我幫妳記住咗。）' },
      { who: 'pig', face: 'happy', text: '好啦…睇住。' },
      { merge: true },                                  /* ← 鍵盤合體動畫（開估） */
      { who: 'pig', face: 'happy', text: '呢副嘢，係一件一件砌返嚟嘅。' },
      { who: 'pig', face: 'face', text: '{name}，以後每年今日…我都會記得。' },
      { flag: 'pig_done' },
      { room: 'party' },
      { end: true },
    ],

    /* ---------------- Act 3：生日會 ---------------- */
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
      { who: 'narrator', text: '…係啱啱嗰副嘢。真係好靚。' },
      { who: 'narrator', text: '（我等咗好耐嘅，就係呢一下嘅表情。）' },
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

/* 傻肥嘅生日 · Mary Land — map + walking engine (v0.1)
   Canvas 2D, assets from ../assets via data.js (window.SPR / window.BG).
   ?dir=right&frames=90   fixed-step replay for headless screenshots
   ?x=11&y=17             spawn tile
   ?debug=1               collision overlay, d toggles */
(() => {
  const T = 48, VW = 540, VH = 960, COLS = 24, ROWS = 30;
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // ---------------------------------------------------------------- sprites
  const keys = Object.keys(window.SPR);
  const img = {};
  const bgImg = {};
  let loaded = 0;
  const total = keys.length + Object.keys(window.BG || {}).length;
  const tick = () => { if (++loaded >= total) start(); };
  keys.forEach(k => {
    const im = new Image();
    im.onload = im.onerror = tick;
    im.src = 'assets/' + window.SPR[k].f;
    img[k] = im;
  });
  Object.keys(window.BG || {}).forEach(k => {
    const im = new Image();
    im.onload = im.onerror = tick;
    im.src = 'assets/' + window.BG[k].f;
    bgImg[k] = im;
  });

  // ground code -> tile sprite (rot in degrees CW)
  const G = {
    '.': null,                       // grass, chosen per-cell below
    f: ['T1_r2c3'],
    h: ['T1_r3c2'], v: ['T1_r3c1'], x: ['T1_r3c4'],
    '4': ['T1_r3c3', 0], '5': ['T1_r3c3', 90], '6': ['T1_r3c3', 180], '7': ['T1_r3c3', 270],
    s: ['T1_r4c2'], b: ['T3_r4c4'],
  };
  const GRASS = ['T1_r1c1', 'T1_r1c2', 'T1_r1c3'];   // T1_r1c4 is the dark slate tile - keep it out

  const GROUND = [
    '........................',
    '........................',
    '........................',
    '........................',
    '...........vv...........',
    '...........vv...........',
    '...........vv...........',
    '...........vv...........',
    '...........vv...........',
    '...........vv...........',
    '...........vv...........',
    '...........vv...........',
    '...b....b..vv.b....b....',
    '...b....b..vv.b....b....',
    '..hhhhhhhhhxxhhhhhhhhh..',
    '..hhhhhhhhhxxhhhhhhhhh..',
    '...........vv...........',
    '.......ssssvvssss.......',
    '.......ssssvvssss.......',
    '.......ssssvvssss.......',
    '...........vv...........',
    '...........vv...........',
    '...........vv.....ffff..',
    '...........vv.....ffff..',
    '...........vv.....ffff..',
    '...........vv...........',
    '...........vv...........',
    '...........vv...........',
    '........................',
    '........................',
  ];

  // ---------------------------------------------------------------- objects
  const solid = [], objByCell = [], trig = [];
  for (let y = 0; y < ROWS; y++) {
    solid.push(new Array(COLS).fill(0));
    objByCell.push(new Array(COLS).fill(null));
  }
  function put(x, y, sk, o = {}) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
    if (!objByCell[y][x]) objByCell[y][x] = [];
    if (o.draw !== false) objByCell[y][x].push({ sk, rot: o.rot || 0 });
    if (o.solid) solid[y][x] = 1;
    if (o.trigger) trig.push(Object.assign({ x, y }, o.trigger));
  }
  function tree(x, y, top = 'T2_r1c1') {
    put(x, y - 1, top);                       // canopy
    put(x, y, 'T2_r1c3', { solid: 1 });       // trunk
  }
  const WALL = 'T3_r1c2';
  function house(x0, y0, doorCol, opt = {}) {
    for (let i = 0; i < 4; i++) put(x0 + i, y0, WALL, { draw: true });          // backing
    for (let i = 0; i < 4; i++) put(x0 + i, y0, i % 2 ? 'T3_r2c2' : 'T3_r2c1', { solid: 1 });
    for (let i = 0; i < 4; i++) put(x0 + i, y0 + 1, WALL, { solid: 1 });
    for (let i = 0; i < 4; i++) put(x0 + i, y0 + 2, WALL, { solid: 1 });
    put(doorCol, y0 + 1, 'T3_r3c2');                                             // awning over the door
    put(x0 + (doorCol - x0 === 0 ? 3 : 0), y0 + 1, opt.sign || 'T3_r4c1');      // hanging shop sign
    put(doorCol, y0 + 2, 'T3_r2c3', { trigger: { type: 'door', id: opt.id, label: opt.label } });
    const winCol = x0 + (doorCol - x0 < 2 ? 3 : 1);
    put(winCol, y0 + 1, 'T3_r2c4');
    put(winCol, y0 + 2, 'T3_r4c2');                                              // window flower box
  }

  // village border: trees top/bottom, hedge left/right
  for (let x = 0; x < COLS; x++) { tree(x, 1); put(x, 0, 'T2_r1c1'); tree(x, 29); put(x, 28, 'T2_r1c2'); }
  for (let y = 2; y <= 27; y++) { put(1, y, 'T4_r4c3', { solid: 1 }); put(22, y, 'T4_r4c3', { solid: 1 }); }
  for (let x = 2; x <= 21; x++) { put(x, 2, 'T4_r4c3', { solid: 1 }); put(x, 27, 'T4_r4c3', { solid: 1 }); }

  house(2, 9, 3, { id: 'home', label: '屋企', sign: 'SG_r1c4' });
  house(7, 9, 8, { id: 'seafood', label: '海鮮餐廳', sign: 'SG_r1c2' });
  house(13, 9, 14, { id: 'pasta', label: '意粉店', sign: 'SG_r1c1' });
  house(18, 9, 19, { id: 'cafe', label: 'Cafe', sign: 'SG_r1c3' });

  // yard props
  const props = [
    [10, 12, 'T4_r1c3', 1], [15, 12, 'T4_r1c3', 1],          // lamp posts
    [13, 12, 'T4_r4c4', 1], [16, 12, 'T4_r2c4', 1],          // barrel, bread crate
    [18, 13, 'T4_r2c3', 1],                                   // bicycle
    [20, 13, 'T4_r3c1', 1], [20, 12, 'T4_r3c2', 1],           // cafe table + parasol
    [4, 12, 'T2_r4c4', 1], [10, 13, 'T2_r4c3', 1],            // mailbox, signpost
    [9, 16, 'T4_r4c1', 1],                                    // arrow sign at the crossroads
    [9, 19, 'T4_r2c2', 1],                                    // fountain
    [9, 18, 'T4_r1c4', 1], [14, 18, 'T4_r1c4', 1],            // benches
    [8, 17, 'T4_r1c3', 1], [15, 17, 'T4_r1c3', 1],
    [17, 18, 'T4_r3c3', 1], [19, 20, 'T4_r3c4', 1],           // cat on fence, chicken
    [2, 17, 'T2_r2c1', 1], [21, 24, 'T2_r2c1', 1],            // bushes
    [3, 4, 'T2_r1c4', 1], [20, 4, 'T2_r1c4', 1],
    [6, 4, 'T4_r1c1', 1], [17, 4, 'T4_r1c1', 1],              // balloons
    [5, 12, 'SG_r2c2', 1], [21, 12, 'SG_r2c2', 1],             // 紅燈籠
    [16, 21, 'SG_r2c4', 0], [18, 21, 'SG_r2c4', 0],            // 旗串（花圃邊）
    [2, 22, 'T2_r2c1', 1], [21, 13, 'T2_r1c4', 1],
  ];
  props.forEach(p => put(p[0], p[1], p[2], { solid: p[3] }));

  // pond (water solid, stepping stones cross it) + garden fence
  for (let y = 22; y <= 25; y++) for (let x = 3; x <= 8; x++)
    put(x, y, (x === 3 || y === 22) ? 'T2_r3c4' : (x === 8 || y === 25 ? 'T2_r3c2' : 'T2_r3c3'), { solid: 1 });
  put(5, 24, 'T2_r4c2', {}); put(7, 23, 'T2_r4c2', {});       // stepping stones (walkable)
  for (let x = 17; x <= 21; x++) put(x, 21, 'T2_r2c2', { solid: 1 });
  for (let x = 10; x <= 13; x++) put(x, 26, 'T2_r2c2', { solid: 1 });   // 南面籬笆（Act 3 觸發點）

  // NPC for Act 1 (stand-in for the rabbit friend)
  const NPC = [{ id: 'rabbit', sk: 'rabbit_r1c1', x: 12, y: 11, name: '兔仔朋友',
                 scene: 'rabbit_act1', sceneDone: 'rabbit_again' }];
  NPC.forEach(n => {
    solid[n.y][n.x] = 1;
    if (!objByCell[n.y][n.x]) objByCell[n.y][n.x] = [];
    objByCell[n.y][n.x].push({ sk: n.sk, rot: 0 });
  });

  // ---------------------------------------------------------------- rooms (Act 2 室內)
  //  單屏幕房間：背景圖（1080×1935 → 540×960）＋ 一個 NPC ＋ 下面嘅走動區
  const ROOMS = {
    pasta: { name: '意粉店', bg: 'bg_pasta', zoom: { x: 14, y: 11, k: 1.95 },
             npc: { id: 'bear', sk: 'bear_r1c1', x: 246, y: 636, scene: 'bear_act2', done: 'bear_done' } },
    seafood: { name: '海鮮餐廳', bg: 'bg_seafood', zoom: { x: 8, y: 11, k: 1.95 },
               npc: { id: 'lobster', sk: 'lobster_r1c1', x: 300, y: 636, scene: 'lobster_act2', done: 'lobster_done' } },
    cafe: { name: 'Cafe', bg: 'bg_cafe', zoom: { x: 19, y: 11, k: 1.95 },
            npc: { id: 'cat', sk: 'cat_r1c1', x: 286, y: 644, scene: 'cat_act2', done: 'cat_done' } },
    dream: { name: '夢境', bg: 'bg_dream', auto: true, card: null, sub: null,
             npc: { id: 'pig', sk: 'pig_r1c1', x: 270, y: 556, scene: 'pig_act3', done: 'pig_done' } },
    party: { name: '生日會場', bg: 'bg_town', auto: true, card: '第三幕・生日會', sub: '所城嘅燈籠亮起',
             npc: { id: 'penguin', sk: 'penguin_r1c1', x: 158, y: 700, scene: 'party_end', done: 'act3_done' },
             extra: [{ sk: 'pigb_r1c1', x: 392, y: 706 }] },
  };
  const DOORSTEP = {};                      // 村口邊格會入舖頭
  const DOOR_COL = { pasta: 14, seafood: 8, cafe: 19 };
  Object.keys(DOOR_COL).forEach(id => { DOORSTEP[DOOR_COL[id] + ',12'] = id; });
  const HOME_COL = 3;
  const W = { kind: 'village', room: null, flash: 0.5 };

  function enterRoom(id) {
    const r = ROOMS[id];
    if (!r) return;
    transition(() => {
      W.kind = 'room'; W.room = r; W.id = id; W.flash = 0;
      if (id === 'dream' || id === 'party') NIGHT.a = 0;      // 入夢／會場就唔再蓋夜晚插畫
      P.x = VW / 2; P.y = 800; P.dir = 'up'; P.t = 0;
      document.body.classList.add('in-room');
      beep(1046, 0.07);
    }, {
      color: '#000000',                       // 入舖頭：全黑淡接
      card: r.card || (r.zoom ? r.name : null),
      sub: r.sub || (r.zoom ? '' : null),
      zoom: r.zoom || null,
      thenAt: r.zoom ? 'in' : 'hold',
      out: r.card ? 0.6 : 0.42,
      hold: r.card ? 1.15 : (r.zoom ? 1.25 : 0.3),
      inn: r.card ? 0.6 : 0.5,
    });
  }
  function exitRoom() {
    const col = DOOR_COL[W.id] || 14;
    transition(() => {
      W.kind = 'village'; W.room = null; W.flash = 0;
      document.body.classList.remove('in-room');
      P.x = col * T + 24; P.y = 14 * T + 30; P.dir = 'down'; P.t = 0;
      DOOR_LOCK = 0.8;                       // 出咗嚟即刻反彈返入去嘅問題
      beep(523, 0.07);
    }, { color: '#000000', out: 0.35, hold: 0.28, inn: 0.45 });   // 出舖頭：全黑
  }
  let DOOR_LOCK = 0;
  const ROOM_BOUND = { x0: 76, x1: 464, y0: 596, y1: 826 };

  // ---------------------------------------------------------------- player
  const P = { x: 11 * T + 24, y: 17 * T + 46, dir: 'up', moving: false, t: 0, speed: 205 };
  let IDLE_T = 0;
  const IDLE = { down: 'pianow_r1c1', up: 'pianow_r2c1', left: 'pianow_r3c1', right: 'pianow_r4c1' };
  const WALK = {
    down: ['pianow_r1c2', 'pianow_r1c3', 'pianow_r1c4'],   // 行路 3 格
    up: ['pianow_r2c2', 'pianow_r2c3', 'pianow_r2c4'],
    left: ['pianow_r3c2', 'pianow_r3c3'], right: ['pianow_r4c2', 'pianow_r4c3'],
  };

  // ---------------------------------------------------------------- input
  const order = [];
  const held = { up: 0, down: 0, left: 0, right: 0 };
  const KEYMAP = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right',
  };
  function press(dir, on) {
    if (on === !!held[dir]) return;
    held[dir] = on ? 1 : 0;
    if (on && MENU.open) {                     // menu: ←→ pick, ↑↓ scroll
      if (dir === 'left' || dir === 'up') return menuMove(-1);
      if (dir === 'right' || dir === 'down') return menuMove(1);
    }
    if (on && DLG.on && DLG.choice) {          // dpad = move the choice cursor
      if (dir === 'up') { DLG.sel = (DLG.sel + DLG.choice.length - 1) % DLG.choice.length; return; }
      if (dir === 'down') { DLG.sel = (DLG.sel + 1) % DLG.choice.length; return; }
    }
    const i = order.indexOf(dir);
    if (on) { if (i < 0) order.push(dir); } else if (i >= 0) order.splice(i, 1);
  }

  // A button / tap: talk to whoever is in front, or advance the dialogue
  function frontTile() {
    const d = P.dir;
    const cx = Math.floor(P.x / T), cy = Math.floor((P.y - 6) / T);
    return { x: cx + (d === 'left' ? -1 : d === 'right' ? 1 : 0),
             y: cy + (d === 'up' ? -1 : d === 'down' ? 1 : 0) };
  }
  function npcScene(npc) {
    if (!STATE.flags.quest_started) return npc.scene;
    if (npc.id === 'rabbit' && STATE.items.length >= 3) return 'rabbit_all_done';
    return npc.sceneDone || npc.scene;
  }
  let PENDING_A = false;
  function pressA() {
    if (TRANS.on && TRANS.wait) { TRANS.go = true; beep(1318, 0.08); return; }   // 封面：撳 A 開始
    if (CONFIRM.on) return doReset();
    if (TITLE.on) {
      if (TRANS.on) { PENDING_A = true; return; }   // 轉場未完：記住，完咗即刻處理
      return titleAdvance();
    }
    if (MERGE.on) return;                                        // 合體動畫唔可以跳過
    if (CAST.on) { CAST.on = false; openGiftUI('msg'); return; }
    if (PHOTO.on) { PHOTO.on = false; CAST.on = true; CAST.t = 0; CAST.a = 0; return; }
    if (CREDITS.on) { CREDITS.on = false; PHOTO.on = true; PHOTO.t = 0; return; }
    if (MENU.open) return menuSelect();
    if (DLG.on) return advance();
    if (W.kind === 'room') {                    // 室內：同房入面嘅 NPC 傾偈
      const n0 = W.room.npc;
      const dNpc = Math.hypot(P.x - n0.x, P.y - n0.y);
      const ex = (W.room.extra || [])
        .map(e => ({ e, d: Math.hypot(P.x - e.x, P.y - e.y) }))
        .filter(o => o.d < 130 && o.d < dNpc)    // 要行到好近傻豬，而且比企鵝更近
        .sort((a, b) => a.d - b.d)[0];
      if (ex && monkeyPop(ex.e)) return;         // 彩蛋：豬爆變獼猴
      const n = n0;
      if (Math.hypot(P.x - n.x, P.y - n.y) < 190) {
        const doneKey = STATE.flags[n.done] && SC.scenes[n.done] ? n.done : n.scene;
        startScene(doneKey);
      }
      return;
    }
    const t = frontTile();
    const npc = NPC.find(n => n.x === t.x && n.y === t.y);
    if (npc) startScene(npcScene(npc));
  }
  document.getElementById('bA').addEventListener('pointerdown', e => { e.preventDefault(); pressA(); });
  document.getElementById('bB').addEventListener('pointerdown', e => {
    e.preventDefault();
    if (CONFIRM.on) { CONFIRM.on = false; beep(523, 0.06); return; }
    if (MENU.open) return menuClose();
    if (DLG.on) return;                        // during dialogue B does nothing
    menuToggle();
  });
  canvas.addEventListener('pointerdown', e => {
    if (TITLE.on) return titleAdvance();
    if (!DLG.on) return;
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * VW, y = (e.clientY - r.top) / r.height * VH;
    if (DLG.choice) {
      for (let i = 0; i < DLG.choice.length; i++) {
        const ry = CH.y + 22 + i * 46;
        if (x > CH.x && x < CH.x + CH.w && y > ry - 6 && y < ry + 40) { DLG.sel = i; return pick(i); }
      }
      return;
    }
    advance();
  });
  function inField(e) {                       // 打字中：唔好搶 a／b／方向鍵
    const t = e.target;
    return !!(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable));
  }
  addEventListener('keydown', e => {
    if (inField(e)) return;
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'z' || e.key === 'Z') { pressA(); e.preventDefault(); }
  });
  addEventListener('keydown', e => { if (inField(e)) return; const k = KEYMAP[e.key]; if (k) { press(k, 1); e.preventDefault(); } });
  addEventListener('keyup', e => { if (inField(e)) return; const k = KEYMAP[e.key]; if (k) press(k, 0); });
  // 畫布點一下：封面／對白／字幕＝撳 A（行路時唔會誤觸）
  const cvEl = document.querySelector('canvas');
  if (cvEl) cvEl.addEventListener('pointerdown', e => {
    if (TRANS.on && TRANS.wait) { e.preventDefault(); return pressA(); }
    if (TITLE.on || DLG.on || CREDITS.on || PHOTO.on || CAST.on) { e.preventDefault(); pressA(); }
  });

  // ---------------------------------------------------------------- 搖桿操控
  const ALL_DIRS = ['up', 'down', 'left', 'right'];
  const stickEl = document.getElementById('stick');
  const knobEl = document.getElementById('knob');
  if (stickEl && knobEl) {
    let sid = null, scx = 0, scy = 0, toScreen = 1, cur = null;
    function stickClear() {
      if (cur !== null) { ALL_DIRS.forEach(d => press(d, 0)); cur = null; }
      knobEl.style.transform = 'translate(0px,0px)';
      knobEl.classList.remove('pressed');
    }
    function stickMove(cx, cy) {
      let dx = cx - scx, dy = cy - scy;
      const dist = Math.hypot(dx, dy) || 0;
      const maxR = 220 * toScreen * 0.30, dead = 220 * toScreen * 0.075;
      if (dist > maxR) { dx = dx / dist * maxR; dy = dy / dist * maxR; }
      const inv = 1 / toScreen;
      knobEl.style.transform = 'translate(' + (dx * inv).toFixed(1) + 'px,' + (dy * inv).toFixed(1) + 'px)';
      let d = null;
      if (dist > dead) d = Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      if (d !== cur) { ALL_DIRS.forEach(x => press(x, 0)); if (d) press(d, 1); cur = d; }
    }
    stickEl.addEventListener('pointerdown', e => {
      e.preventDefault();
      sid = e.pointerId;
      try { stickEl.setPointerCapture(e.pointerId); } catch (err) {}
      const r = stickEl.getBoundingClientRect();
      toScreen = r.width / 220;
      scx = r.left + r.width / 2; scy = r.top + r.height / 2;
      knobEl.classList.add('pressed');
      stickMove(e.clientX, e.clientY);
    });
    stickEl.addEventListener('pointermove', e => { if (sid === e.pointerId) { e.preventDefault(); stickMove(e.clientX, e.clientY); } });
    const stickEnd = e => { if (sid === null || (e && e.pointerId !== undefined && e.pointerId !== sid)) return; sid = null; stickClear(); };
    stickEl.addEventListener('pointerup', stickEnd);
    stickEl.addEventListener('pointercancel', stickEnd);
    stickEl.addEventListener('lostpointercapture', stickEnd);
    addEventListener('blur', stickClear);
  }

  // ---------------------------------------------------------------- collision
  function blocked(x, y) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return true;
    return !!solid[y][x];
  }
  function canStand(px, py) {
    const box = [[px - 11, py - 9], [px + 11, py - 9], [px - 11, py - 1], [px + 11, py - 1]];
    return box.every(([bx, by]) => !blocked(Math.floor(bx / T), Math.floor(by / T)));
  }

  // ---------------------------------------------------------------- dialogue
  const SC = window.SCRIPT;
  const SAVE = 'bday_save_v1';
  const STATE = { name: SC.defaultName, flags: {}, items: [] };
  try { Object.assign(STATE, JSON.parse(localStorage.getItem(SAVE) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(SAVE, JSON.stringify(STATE)); } catch (e) {} };

  const BOX = { x: 26, y: 600, w: 488, h: 190 };
  const CH = { w: 340, h: 174, x: BOX.x + BOX.w - 346, y: BOX.y - 186 };
  const DLG = { on: false, scene: '', i: -1, who: null, faceKey: null, speaker: '', text: '',
                chars: [], n: 0, done: true, choice: null, sel: 0, t: 0, show: null, showS: 4.2 };

  const sub = t => (t || '').replace(/\{name\}/g, STATE.name);
  const spk = id => SC.speakers[id] || { name: id, face: null };
  const FONT = px => px + 'px "PingFang HK","PingFang TC","Microsoft JhengHei",sans-serif';

  function startScene(key) {
    if (!SC.scenes[key]) return;
    DLG.anim = 0;
    DLG.on = true; DLG.scene = key; DLG.i = -1; DLG.t = 0;
    document.body.classList.add('in-dlg');
    nextStep();
  }
  function endScene() {
    DLG.on = false; DLG.choice = null; DLG.show = null; P.pose = null;
    document.body.classList.remove('in-dlg');
  }
  function nextStep() {
    DLG.choice = null;
    DLG.i++;
    const sc = SC.scenes[DLG.scene];
    if (!sc || DLG.i >= sc.length) return endScene();
    const st = sc[DLG.i];
    if (st.goto) { DLG.scene = st.goto; DLG.i = -1; return nextStep(); }
    if (st.flag) { STATE.flags[st.flag] = 1; save(); return nextStep(); }
    if (st.item) { STATE.items.push(st.item); save(); return nextStep(); }
    if (st.room) { enterRoom(st.room); return nextStep(); }
    if (st.pose !== undefined) { P.pose = st.pose; return nextStep(); }
    if (st.show !== undefined) { DLG.show = st.show; DLG.showS = st.s || 4.2; return nextStep(); }
    if (st.night !== undefined) { NIGHT.a = st.night; return nextStep(); }
    if (st.tally) {
      transition(null, { color: '#1B1420', card: '碎片 ' + STATE.items.length + '／3',
                         sub: st.tally, out: 0.35, hold: 1.25, inn: 0.5 });
      return nextStep();
    }
    if (st.cutin) { CUTIN.on = true; CUTIN.key = st.cutin; CUTIN.t = 0; beep(1318, 0.08); return nextStep(); }
    if (st.celebrate) { CELEB.on = !!st.celebrate; if (st.celebrate) { for (let i = 0; i < 4; i++) celebPuff(); } return nextStep(); }
    if (st.credits) { CREDITS.on = true; CREDITS.t = 0; CREDITS.a = 0; return nextStep(); }
    if (st.gift) { openGiftUI('msg'); return; }
    if (st.guess) { openGiftUI('guess'); return; }                 // 收估法：同禮物面板（唔行 nextStep，等玩家）
    if (st.merge) {                                                // 合體 → 鍵盤動畫（開估）
      MERGE.on = true; MERGE.t = 0; clackSeq(10, 0.13, 0.05); return;
    }
    if (st.choice) { DLG.choice = st.choice; DLG.sel = 0; DLG.done = true; return; }
    if (st.end) return endScene();
    DLG.who = st.who || 'narrator';
    const sp = spk(DLG.who);
    DLG.faceKey = sp[st.face] || sp.face || null;
    DLG.speaker = sp.name || '';
    DLG.chars = Array.from(sub(st.text));
    DLG.text = sub(st.text);
    DLG.n = 0; DLG.done = false;
    addLog(DLG.speaker, DLG.text);
    beep(784, 0.035);
  }
  function advance() {
    if (!DLG.on) return;
    if (MERGE.on || GUESS.open) return;
    if (DLG.choice) return pick(DLG.sel);
    if (!DLG.done) { DLG.n = DLG.chars.length; DLG.done = true; return; }
    nextStep();
  }
  function pick(i) {
    const c = DLG.choice && DLG.choice[i];
    if (!c) return;
    DLG.choice = null;
    if (c.next) { DLG.scene = c.next; DLG.i = -1; return nextStep(); }
    nextStep();
  }

  function nineSlice(key, x, y, w, h) {
    const s = window.SPR[key], im = img[key];
    if (!s || !im.complete || !im.naturalWidth) return;
    if (!s.slice) { ctx.drawImage(im, x, y, w, h); return; }
    const [l, t, r, b] = s.slice, sw = s.w, sh = s.h;
    const cw = sw - l - r, chh = sh - t - b;
    const dw = w - l - r, dh = h - t - b;
    ctx.drawImage(im, 0, 0, l, t, x, y, l, t);
    ctx.drawImage(im, sw - r, 0, r, t, x + w - r, y, r, t);
    ctx.drawImage(im, 0, sh - b, l, b, x, y + h - b, l, b);
    ctx.drawImage(im, sw - r, sh - b, r, b, x + w - r, y + h - b, r, b);
    ctx.drawImage(im, l, 0, cw, t, x + l, y, dw, t);
    ctx.drawImage(im, l, sh - b, cw, b, x + l, y + h - b, dw, b);
    ctx.drawImage(im, 0, t, l, chh, x, y + t, l, dh);
    ctx.drawImage(im, sw - r, t, r, chh, x + w - r, y + t, r, dh);
    ctx.drawImage(im, l, t, cw, chh, x + l, y + t, dw, dh);
  }
  function roundRect(x, y, w, h, r, fill, stroke, lw) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.lineWidth = lw || 3; ctx.strokeStyle = stroke; ctx.stroke(); }
  }
  function sprite(key, x, y, scale) {
    const s = window.SPR[key], im = img[key];
    if (!s || !im.complete || !im.naturalWidth) return false;
    const k = scale || 1;
    ctx.drawImage(im, x, y, s.w * k, s.h * k);
    return true;
  }

  function wrapChars(chars, maxW, px) {
    ctx.font = FONT(px);
    const lines = [];
    let cur = '', w = 0;
    for (const c of chars) {
      if (c === '\n') { lines.push(cur); cur = ''; w = 0; continue; }
      const cw = ctx.measureText(c).width;
      if (w + cw > maxW && cur) { lines.push(cur); cur = ''; w = 0; }
      cur += c; w += cw;
    }
    lines.push(cur);
    return lines;
  }

  function drawDialog() {
    DLG.anim = Math.min(1, (DLG.anim || 0) + 1 / 12);
    ctx.save();
    ctx.translate(0, (1 - DLG.anim) * 34);
    // 0. 大圖（禮物盒／卡夾）＋奶白圓牌底，令佢喺花俏背景上都睇得清
    if (DLG.show) {
      const sp0 = window.SPR[DLG.show], im0 = img[DLG.show];
      if (sp0 && im0 && im0.complete && im0.naturalWidth) {
        const k = DLG.showS || 4.2, bob = Math.sin(DLG.t * 3) * 6;
        const w = sp0.w * k, h = sp0.h * k;
        const cx0 = VW / 2, cy0 = 310 + bob + h / 2;
        ctx.beginPath(); ctx.arc(cx0, cy0, Math.max(w, h) / 2 + 26, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,246,250,0.94)'; ctx.fill();
        ctx.lineWidth = 6; ctx.strokeStyle = '#4A2E38'; ctx.stroke();
        ctx.drawImage(im0, cx0 - w / 2, cy0 - h / 2, w, h);
        if (Math.sin(DLG.t * 5) > 0) sprite('fx_r1c3', cx0 + w / 2 + 4, cy0 - h / 2 - 12, 1.2);
      }
    }
    // 1. speaker portrait floating above the box
    if (DLG.faceKey) {
      const fs2 = window.SPR[DLG.faceKey];
      sprite(DLG.faceKey, BOX.x + 8, BOX.y - 100, (fs2 && fs2.h > 100) ? 96 / fs2.h : 1);
    }
    // 2. the box (9-slice)
    nineSlice('dialog_box', BOX.x, BOX.y, BOX.w, BOX.h);
    // 3. name tag
    if (DLG.speaker) {
      ctx.font = FONT(19);
      const tw = ctx.measureText(DLG.speaker).width;
      roundRect(BOX.x + 116, BOX.y - 21, tw + 30, 38, 14, '#FBCFD6', '#4A2E38', 3);
      ctx.fillStyle = '#4A2E38';
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(DLG.speaker, BOX.x + 131, BOX.y - 1);
    }
    // 4. typewriter text
    if (DLG.text) {
      const px = 22, lh = 34, left = BOX.x + 66, maxW = BOX.w - 110;
      const lines = wrapChars(DLG.chars, maxW, px);
      let shown = Math.floor(DLG.n), acc = 0;
      ctx.font = FONT(px);
      ctx.fillStyle = DLG.who === 'narrator' ? '#7A5A6A' : '#4A2E38';
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      for (let i = 0; i < lines.length && i < 3; i++) {
        const take = Math.max(0, Math.min(lines[i].length, shown - acc));
        if (take > 0) ctx.fillText(lines[i].slice(0, take), left, BOX.y + 36 + i * lh);
        acc += lines[i].length;
      }
    }
    // 5. continue arrow
    if (DLG.done && !DLG.choice && Math.sin(DLG.t * 6) > -0.2) {
      const ax = BOX.x + BOX.w - 46, ay = BOX.y + BOX.h - 40;
      ctx.fillStyle = '#E39AB4'; ctx.beginPath();
      ctx.moveTo(ax, ay); ctx.lineTo(ax + 18, ay); ctx.lineTo(ax + 9, ay + 12); ctx.closePath(); ctx.fill();
    }
    // 6. choices
    if (DLG.choice) {
      nineSlice('dialog_box', CH.x, CH.y, CH.w, CH.h);
      ctx.font = FONT(20);
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      for (let i = 0; i < DLG.choice.length; i++) {
        const ry = CH.y + 22 + i * 46;
        if (i === DLG.sel) {
          roundRect(CH.x + 14, ry - 3, CH.w - 28, 40, 12, 'rgba(251,207,214,0.85)', null);
          sprite('fx_r1c1', CH.x + 18, ry - 4, 0.55);
        }
        const c = DLG.choice[i];
        let tx = CH.x + 58;
        if (c.ic) {                            // 選項可以係一張圖（例：夾龍蝦）
          const s = window.SPR[c.ic], im = img[c.ic];
          const k = c.s || 0.8;
          const w = s ? s.w * k : 0;
          if (im && im.complete) ctx.drawImage(im, tx - 8, ry + 8 - (s.h * k) / 2, w, s.h * k);
          tx += w + 6;
        }
        ctx.fillStyle = i === DLG.sel ? '#4A2E38' : '#6B4A58';
        if (c.text) ctx.fillText(c.text, tx, ry + 17);
      }
    }
    ctx.restore();
  }

  const SHOPS = [['pasta', 14, 'bear_done'], ['seafood', 8, 'lobster_done'], ['cafe', 19, 'cat_done']];
  function goal() {
    if (W.kind === 'room') {
      if (W.room.auto && !STATE.flags[W.room.npc.done]) return { txt: '行近佢 → 撳 A 傾偈' };
      return { txt: '行到最底 → 出返村口（或者 B→返村口）' };
    }
    if (!STATE.flags.quest_started) return { txt: '去搵兔仔朋友', tx: 12 * T + 24, ty: 11 * T };
    const n = STATE.items.length;
    if (n < 3) {
      const left = SHOPS.filter(sh => !STATE.flags[sh[2]]);
      const t = left[0] || SHOPS[0];
      return { txt: '去舖頭搵心願碎片 ' + n + '/3', tx: t[1] * T + 24, ty: 12 * T + 24 };
    }
    if (!STATE.flags.act2_done) return { txt: '返去搵兔仔朋友', tx: 12 * T + 24, ty: 11 * T };
    if (!STATE.flags.act3_seen) return { txt: '行去最底籬笆跳過去', tx: 11 * T + 24, ty: 26 * T };
    if (!STATE.flags.act3_done) return { txt: '第二幕・跟住傻豬行', tx: 270, ty: 556 };
    return { txt: '行去最底籬笆 → 返生日會場', tx: 11 * T + 24, ty: 26 * T };
  }
  function goVillage() {
    if (W.kind === 'room') return exitRoom();
    const col = 14;
    transition(() => { P.x = col * T + 24; P.y = 15 * T + 20; P.dir = 'down'; P.t = 0; DOOR_LOCK = 0.9; beep(523, 0.07); });
  }
  function drawGoalMark() {
    if (DLG.on || MENU.open || CUT.on || TRANS.on || CREDITS.on || TITLE.on) return;
    const g = goal();
    if (!g.tx) return;
    const x = (g.tx - CAM.x) * ZOOM, y = (g.ty - CAM.y) * ZOOM;
    const bob = Math.sin(performance.now() / 240) * 5;
    if (x > 40 && x < VW - 40 && y > 60 && y < VH - 60) {
      sprite('fx_r2c1', x - 13, y - 80 + bob, 1.1);
      ctx.font = FONT(15); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const w = ctx.measureText(g.txt).width + 22;
      roundRect(Math.max(8, Math.min(VW - w - 8, x - w / 2)), y - 118 + bob, w, 28, 10, 'rgba(74,46,56,0.8)', null, 0);
      ctx.fillStyle = '#FFF3F8'; ctx.fillText(g.txt, Math.max(8 + w / 2, Math.min(VW - 8 - w / 2, x)), y - 104 + bob);
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    } else {
      const cx = VW / 2, cy = VH / 2, ang = Math.atan2(y - cy, x - cx);
      const px = cx + Math.cos(ang) * (VW / 2 - 40), py = cy + Math.sin(ang) * (VH / 2 - 46);
      ctx.save(); ctx.translate(px, py); ctx.rotate(ang);
      const pu = Math.sin(performance.now() / 200) * 3;
      ctx.fillStyle = '#FFD44D'; ctx.strokeStyle = '#4A2E38'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(20 + pu, 0); ctx.lineTo(-10, -13); ctx.lineTo(-10, 13); ctx.closePath();
      ctx.fill(); ctx.stroke(); ctx.restore();
    }
  }
  function drawQuest() {
    if (MENU.open) return;
    const n = STATE.items.length;
    if (!STATE.flags.quest_started) {                 // 未開始：只顯示目標提示
      const g0 = goal();
      ctx.font = FONT(15); ctx.textBaseline = 'middle';
      const w0 = ctx.measureText(g0.txt).width + 26;
      roundRect(14, 100, w0, 32, 12, 'rgba(74,46,56,0.72)', null, 0);
      ctx.fillStyle = '#FFF3F8'; ctx.textAlign = 'left';
      ctx.fillText('▸ ' + g0.txt, 26, 116);
      ctx.textBaseline = 'top';
      return;
    }
    roundRect(14, 42, 190, 52, 14, 'rgba(255,243,248,0.92)', '#4A2E38', 3);
    ctx.font = FONT(17); ctx.fillStyle = '#4A2E38';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('心願碎片 ' + n + '/3', 26, 68);
    for (let i = 0; i < 3; i++) {
      const bx = 128 + i * 24;   // HUD 移落少少，避開頂部提示字
      if (STATE.items[i]) sprite(STATE.items[i], bx, 50, 0.75);
      else roundRect(bx + 4, 56, 16, 16, 5, null, '#C9A9B8', 2);
    }
    const g = goal();
    ctx.font = FONT(15);
    const w = ctx.measureText(g.txt).width + 26;
    roundRect(14, 100, w, 32, 12, 'rgba(74,46,56,0.72)', null, 0);
    ctx.fillStyle = '#FFF3F8'; ctx.textBaseline = 'middle';
    ctx.fillText('▸ ' + g.txt, 26, 116);
    ctx.textBaseline = 'top';
  }

  // ------------------------------------------------ tamagotchi-style shell UI
  //  3-button logic: A = 確認／對話　B = 開閂選單　十字鍵 ←→ = 揀 icon
  let AC = null, SHAKE = 0;
  const MERGE = { on: false, t: 0, clacked: false };
  const GUESS = { open: false, mode: 'guess' };
  const OPT = { sound: true, bgm: true };
  try { Object.assign(OPT, JSON.parse(localStorage.getItem('bday_opt') || '{}')); } catch (e) {}
  const optSave = () => { try { localStorage.setItem('bday_opt', JSON.stringify(OPT)); } catch (e) {} };
  function beep(f, dur, type, vol) {
    if (!OPT.sound) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = type || 'square'; o.frequency.value = f;
      g.gain.value = vol === undefined ? 0.045 : vol;
      o.connect(g); g.connect(AC.destination);
      o.start(); o.stop(AC.currentTime + (dur || 0.05));
    } catch (e) {}
  }

  // 機械鍵盤「啪」一聲 —— 提示用：唔寫出嚟，用聽
  function clack(when, vol) {
    if (!OPT.sound) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const t = AC.currentTime + (when || 0);
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(2600, t);
      o.frequency.exponentialRampToValueAtTime(820, t + 0.035);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol === undefined ? 0.05 : vol, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 0.055);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + 0.07);
      const o2 = AC.createOscillator(), g2 = AC.createGain();
      o2.type = 'triangle'; o2.frequency.setValueAtTime(170, t);
      g2.gain.setValueAtTime(0.045, t); g2.gain.exponentialRampToValueAtTime(0.0005, t + 0.09);
      o2.connect(g2); g2.connect(AC.destination); o2.start(t); o2.stop(t + 0.1);
    } catch (e) {}
  }
  function clackSeq(n, gap, vol) { for (let i = 0; i < n; i++) clack(i * (gap || 0.14), vol); }

  // ------------------------------------------------ 背景音樂（WebAudio 即場合成 chiptune，唔需要音檔）
  const NT = { C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
               C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
               C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
               C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, C6: 1046.50 };
  // 🎂 Happy Birthday to You（3/4 拍，music-box 感）；[音名, 拍數]
  const HB = [
    ['G4', .5], ['G4', .5], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
    ['G4', .5], ['G4', .5], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
    ['G4', .5], ['G4', .5], ['G5', 1], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2],
    ['F5', .5], ['F5', .5], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
  ];
  // 角色「外星話」：每個角色唔同音高，打字每 3 個字出一聲
  const VOICE = { rabbit: 1080, bear: 470, lobster: 640, cat: 830,
                  pig: 720, pig2: 720,                 // 傻豬兩個版本＝同一把聲
                  penguin: 920, piano: 780 };
  const VOICE_DEF = 700;                               // 未列明嘅角色用呢個（唔會變啞）
  let VOICE_N = 0;
  function voiceTick() {
    if (!DLG.on) { VOICE_N = 0; return; }
    const base = DLG.who === 'narrator' ? 0 : (VOICE[DLG.who] || VOICE_DEF);  // 旁白靜音
    const n = Math.floor(DLG.n || 0);
    if (n < VOICE_N) { VOICE_N = n; return; }    // 新句子
    if (!base || n <= VOICE_N) return;
    if (Math.floor(n / 3) !== Math.floor(VOICE_N / 3))
      beep(base * (0.90 + Math.random() * 0.22), 0.026, 'square', 0.032);
    VOICE_N = n;
  }
  const BGM = { playing: false, step: 0, next: 0, timer: null, master: null, eighth: 60 / 104 / 2, beat: 0.40, song: null };
  function bgmNote(freq, t, dur, type, vol) {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.014);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(BGM.master);
    o.start(t); o.stop(t + dur + 0.03);
  }
  function bgmSchedule() {
    if (!BGM.playing || !AC) return;
    if (!BGM.song) {                                        // 砌一次時間表
      const L = []; let t = 0;
      for (const [n, b] of HB) {
        const d = b * BGM.beat;
        L.push([NT[n], t, d * 0.88, 'square', 0.028]);                    // 主旋律
        L.push([NT[n] * 2, t, d * 0.5, 'sine', 0.009]);                    // 高八度鐘聲
        if (b >= 1) L.push([NT[n] / 2, t, d * 0.8, 'triangle', 0.016]);    // 低八度輕墊
        t += d;
      }
      BGM.song = { L: L, total: t + 2.4, i: 0, base: AC.currentTime + 0.15 };
    }
    const S = BGM.song;
    while (S.i < S.L.length && S.base + S.L[S.i][1] < AC.currentTime + 0.7) {
      const q = S.L[S.i];
      bgmNote(q[0], S.base + q[1], q[2], q[3], q[4]);
      S.i++;
    }
    if (S.i >= S.L.length && S.base + S.total < AC.currentTime + 0.7) { S.base += S.total; S.i = 0; }
  }
  function bgmStart() {
    if (!OPT.bgm || BGM.playing) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === 'suspended') AC.resume();
      if (!BGM.master) { BGM.master = AC.createGain(); BGM.master.gain.value = 0.85; BGM.master.connect(AC.destination); }
      BGM.playing = true; BGM.next = AC.currentTime + 0.1; BGM.step = 0; BGM.song = null;
      if (BGM.timer) clearInterval(BGM.timer);
      BGM.timer = setInterval(bgmSchedule, 60);
    } catch (err) {}
  }
  function bgmStop() {
    BGM.playing = false;
    if (BGM.timer) { clearInterval(BGM.timer); BGM.timer = null; }
  }
  const bgmFirst = () => { bgmStart(); document.removeEventListener('pointerdown', bgmFirst); document.removeEventListener('keydown', bgmFirst); };
  document.addEventListener('pointerdown', bgmFirst);
  document.addEventListener('keydown', bgmFirst);
  document.addEventListener('visibilitychange', () => { if (document.hidden) bgmStop(); else bgmStart(); });

  const ICONS = [
    { k: 'status', label: '心願', ico: 'fx_r1c1' },
    { k: 'bag', label: '道具', ico: 'item_r2c2' },
    { k: 'log', label: '記錄', ico: 'fx_r1c2' },
    { k: 'set', label: '設定', ico: 'fx_r1c3' },
    { k: 'exit', label: '去村口', ico: 'fx_r2c1', desc: '即刻返村口' },
  ];
  const MENU = { open: false, page: null, sel: 0, scroll: 0, setSel: 0 };
  const CONFIRM = { on: false, t: 0 };
  const PHOTO = { on: false, t: 0 };          // 結局大合照
  const CAST = { on: false, t: 0, a: 0 };     // 演員表（演員 飾 角色）慢慢滾
  function photoStep(dt) {
    if (!PHOTO.on) return;
    PHOTO.t += dt;
    if (PHOTO.t > 2.6) { PHOTO.on = false; CAST.on = true; CAST.t = 0; CAST.a = 0; }
  }
  function drawPhoto() {
    if (!PHOTO.on) return;
    const b = bgImg['bg_group'];
    ctx.fillStyle = '#1B1420'; ctx.fillRect(0, 0, VW, VH);
    const w = VW - 56, h = VH - 250, x = 28, y = 70;
    if (b && b.complete && b.naturalWidth) {
      const k = 1 + Math.min(0.05, PHOTO.t * 0.02);
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      const sc = Math.max(w / b.naturalWidth, h / b.naturalHeight) * k;
      const dw = b.naturalWidth * sc, dh = b.naturalHeight * sc;
      ctx.drawImage(b, VW / 2 - dw / 2, y + h / 2 - dh / 2, dw, dh);
      ctx.restore();
      ctx.lineWidth = 9; ctx.strokeStyle = '#FFF6FA'; ctx.strokeRect(x, y, w, h);
    } else {
      ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(255,246,250,0.5)'; ctx.strokeRect(x, y, w, h);
    }
    if (PHOTO.t < 0.4) {                                  // 快門閃光
      ctx.fillStyle = 'rgba(255,255,255,' + Math.max(0, 0.9 - PHOTO.t * 2.4).toFixed(2) + ')';
      ctx.fillRect(0, 0, VW, VH);
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = FONT(27); ctx.fillStyle = '#FBCFD6';
    ctx.fillText('生日快樂，' + STATE.name + ' ♥', VW / 2, VH - 130);
    if (Math.sin(PHOTO.t * 3) > 0) {
      ctx.font = FONT(16); ctx.fillStyle = 'rgba(251,207,214,0.7)';
      ctx.fillText('撳 A 睇演員表', VW / 2, VH - 70);
    }
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  }
  function castLines() {
    return [
      ['演員表', 20, '#FBCFD6'],
      ['', 0, ''],
      ['傻豬b', 26, '#FFF6FA'], ['飾　傻豬', 19, '#E39AB4'],
      ['Piano', 26, '#FFF6FA'], ['飾　傻肥（妳）', 19, '#E39AB4'],
      ['', 0, ''],
      ['兔仔朋友', 24, '#FFF6FA'], ['飾　兔仔朋友', 18, '#E39AB4'],
      ['熊師傅', 24, '#FFF6FA'], ['飾　熊師傅', 18, '#E39AB4'],
      ['龍蝦師傅', 24, '#FFF6FA'], ['飾　龍蝦師傅', 18, '#E39AB4'],
      ['綠貓 barista', 24, '#FFF6FA'], ['飾　綠貓 barista', 18, '#E39AB4'],
      ['企鵝侍應', 24, '#FFF6FA'], ['飾　企鵝侍應', 18, '#E39AB4'],
      ['', 0, ''],
      ['特別演出', 18, '#C9A9B8'], ['傻豬b（本人）', 24, '#FFF6FA'],
      ['', 0, ''],
      ['POCKET PIANO', 26, '#FBCFD6'],
    ];
  }
  function drawCast() {
    if (!CAST.on) return;
    ctx.save();
    CAST.a = Math.min(1, CAST.a + 0.02);
    ctx.globalAlpha = CAST.a;
    const b = bgImg['bg_group'];
    ctx.fillStyle = '#1B1420'; ctx.fillRect(0, 0, VW, VH);
    if (b && b.complete && b.naturalWidth) {
      const w = VW - 56, h = VH - 250, x = 28, y = 70;
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      const sc = Math.max(w / b.naturalWidth, h / b.naturalHeight);
      const dw = b.naturalWidth * sc, dh = b.naturalHeight * sc;
      ctx.drawImage(b, VW / 2 - dw / 2, y + h / 2 - dh / 2, dw, dh);
      ctx.restore();
      ctx.fillStyle = 'rgba(27,20,32,0.72)'; ctx.fillRect(x, y, w, h);
      ctx.lineWidth = 9; ctx.strokeStyle = '#FFF6FA'; ctx.strokeRect(x, y, w, h);
    }
    const L = castLines(), gap = 44;
    const y0 = VH + 40 - CAST.t * 46;                    // 慢慢滾
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < L.length; i++) {
      const y = y0 + i * gap;
      if (!L[i][0] || y < -40 || y > VH + 40) continue;
      ctx.font = FONT(L[i][1]); ctx.fillStyle = L[i][2];
      ctx.fillText(L[i][0], VW / 2, y);
    }
    const g1 = ctx.createLinearGradient(0, 0, 0, 120);
    g1.addColorStop(0, 'rgba(27,20,32,0.95)'); g1.addColorStop(1, 'rgba(27,20,32,0)');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, VW, 120);
    const g2 = ctx.createLinearGradient(0, VH - 120, 0, VH);
    g2.addColorStop(0, 'rgba(27,20,32,0)'); g2.addColorStop(1, 'rgba(27,20,32,0.95)');
    ctx.fillStyle = g2; ctx.fillRect(0, VH - 120, VW, 120);
    if (Math.sin(CAST.t * 3) > 0) {
      ctx.font = FONT(16); ctx.fillStyle = 'rgba(251,207,214,0.75)';
      ctx.fillText('撳 A 繼續', VW / 2, VH - 42);
    }
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.restore();
    if (y0 + L.length * gap < -30) { CAST.on = false; openGiftUI('msg'); }     // 滾完 → 問禮物
  }
  function castStep(dt) {
    if (!CAST.on) return;
    CAST.t += dt;
  }
  // 彩蛋：傻豬「爆」一下變獼猴（純視覺，靠 A 掣觸發，唔會講嘢）
  const MGAG = { on: false, t: 0, target: null, old: null, cool: 0 };
  const MONKEY_KEYS = ['monkey_r1c1', 'monkey_r3c3', 'monkey_r1c3', 'MK_r1c1'];
  function monkeyKey() { for (const k of MONKEY_KEYS) if (window.SPR[k]) return k; return null; }
  function monkeyPop(e) {
    const mk = monkeyKey();
    if (!mk || MGAG.on || MGAG.cool > 0) return false;
    MGAG.on = true; MGAG.t = 0; MGAG.target = e; MGAG.old = e.sk;
    e.sk = mk;
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      CELEB.parts.push({ sk: i % 2 ? 'FX2_r2c4' : 'FX2_r1c3',
                         x: e.x + Math.cos(a) * 46, y: e.y - 70 + Math.sin(a) * 34,
                         k: 0.55, t: 0, life: 0.9 });
    }
    beep(1318, 0.06); setTimeout(() => beep(1760, 0.06), 90);
    return true;
  }
  function monkeyStep(dt) {
    if (MGAG.cool > 0) MGAG.cool = Math.max(0, MGAG.cool - dt);
    if (!MGAG.on) return;
    MGAG.t += dt;
    if (MGAG.t > 1.5) {                       // 變返豬
      MGAG.on = false; MGAG.cool = 1.2;
      if (MGAG.target && MGAG.old) MGAG.target.sk = MGAG.old;
      MGAG.target = null; MGAG.old = null;
    }
  }
  function doReset() {                       // 清 save 由 Act 0 重新嚟過
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.indexOf('bday_') === 0 && k !== 'bday_opt') localStorage.removeItem(k);
      });
      localStorage.removeItem(SAVE);
    } catch (e) {}
    location.href = location.pathname;       // 順手清走測試 query 再重新載入
  }
  function drawConfirm() {
    if (!CONFIRM.on) return;
    ctx.fillStyle = 'rgba(27,20,32,0.62)'; ctx.fillRect(0, 0, VW, VH);
    const w = 430, h = 258, x = (VW - w) / 2, y = (VH - h) / 2 - 40;
    roundRect(x, y, w, h, 22, '#FFF6FA', '#4A2E38', 5);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.font = FONT(27); ctx.fillStyle = '#4A2E38';
    ctx.fillText('⚠ 重新開始？', VW / 2, y + 34);
    ctx.font = FONT(18); ctx.fillStyle = '#8A5E74';
    ctx.fillText('而家嘅進度、心願碎片、', VW / 2, y + 88);
    ctx.fillText('禮物訊息都會冇咗。', VW / 2, y + 116);
    ctx.font = FONT(21); ctx.fillStyle = '#4A2E38';
    ctx.fillText('A ＝ 重新嚟過', VW / 2, y + 166);
    ctx.fillText('B ＝ 唔好，返去', VW / 2, y + 202);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  }
  const LOG = [];
  const ICO = { y: 848, s: 36, gap: 3 };

  const addLog = (who, txt) => {
    LOG.push((who ? who + '：' : '') + txt);
    if (LOG.length > 14) LOG.shift();
  };
  function menuToggle() {
    if (DLG.on || TITLE.on || CONFIRM.on) return;
    MENU.open = !MENU.open; MENU.page = null; MENU.sel = 0; MENU.scroll = 0;
    document.body.classList.toggle('in-menu', MENU.open);
    beep(MENU.open ? 1046 : 523, 0.06);
  }
  function menuMove(d) {
    if (!MENU.open) return;
    if (MENU.page === 'log') { MENU.scroll = Math.max(0, MENU.scroll + d); return; }
    if (MENU.page === 'set') { MENU.setSel = ((MENU.setSel || 0) + (d > 0 ? 1 : -1) + 3) % 3; beep(880, 0.025); return; }
    if (MENU.page) return;
    MENU.sel = (MENU.sel + d + ICONS.length) % ICONS.length;
    beep(880, 0.025);
  }
  function menuSelect() {
    if (!MENU.open) { menuToggle(); return; }
    if (MENU.page) {
      if (MENU.page === 'set') {
        if ((MENU.setSel || 0) === 0) { OPT.sound = !OPT.sound; optSave(); beep(OPT.sound ? 1046 : 523, 0.06); return; }
        if ((MENU.setSel || 0) === 1) {
          OPT.bgm = !OPT.bgm; optSave();
          if (OPT.bgm) bgmStart(); else bgmStop();
          beep(OPT.bgm ? 1318 : 523, 0.07); return;
        }
        MENU.page = null; MENU.open = false; document.body.classList.remove('in-menu');
        CONFIRM.on = true; CONFIRM.t = 0; beep(523, 0.09); return;
      }
      if (MENU.page === 'exit') {
        MENU.page = null; MENU.open = false; document.body.classList.remove('in-menu');
        beep(1318, 0.08); return goVillage();
      }
      MENU.page = null; beep(523, 0.05); return;
    }
    MENU.page = ICONS[MENU.sel].k; MENU.scroll = 0; beep(1318, 0.06);
  }
  function menuClose() {
    if (!MENU.open) return;
    if (MENU.page) { MENU.page = null; beep(523, 0.05); return; }
    MENU.open = false; document.body.classList.remove('in-menu'); beep(523, 0.05);
  }

  function drawIconRow() {
    const n = ICONS.length, s = ICO.s, gap = ICO.gap;
    const w = n * s + (n - 1) * gap;
    const x0 = (VW - w) / 2;
    ctx.globalAlpha = MENU.open ? 1 : 0.62;
    roundRect(x0 - 10, ICO.y - 10, w + 20, s + 20, 16,
              'rgba(255,243,248,0.75)', '#4A2E38', 3);
    for (let i = 0; i < n; i++) {
      const x = x0 + i * (s + gap);
      if (i === MENU.sel && !MENU.page) {
        roundRect(x - 4, ICO.y - 4, s + 8, s + 8, 12, '#FBCFD6', '#4A2E38', 3);
      }
      sprite(ICONS[i].ico, x + 8, ICO.y + 8, 0.75);
    }
    ctx.globalAlpha = 1;
  }
  function drawLCD(x, y, w, h, title) {
    roundRect(x, y, w, h, 22, '#FFF6FA', '#4A2E38', 5);
    roundRect(x + 8, y + 8, w - 16, h - 16, 16, '#F4E7EE', null);
    for (let j = y + 16; j < y + h - 12; j += 9)         // LCD dot grid
      for (let i = x + 16; i < x + w - 12; i += 9) {
        ctx.fillStyle = 'rgba(196,112,143,0.16)';
        ctx.fillRect(i, j, 2, 2);
      }
    ctx.font = FONT(24); ctx.fillStyle = '#4A2E38';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(title, x + w / 2, y + 24);
    ctx.textAlign = 'left';
  }
  function drawMenu() {
    if (!MENU.open) return;
    const X = 40, Y = 150, W = VW - 80, H = 470;
    if (!MENU.page) {
      drawLCD(X, Y, W, H, '選單');
      ctx.font = FONT(22); ctx.textBaseline = 'middle';
      for (let i = 0; i < ICONS.length; i++) {
        const ry = Y + 110 + i * 78;
        const on = i === MENU.sel;
        if (on) roundRect(X + 60, ry - 30, W - 120, 62, 16, '#FBCFD6', '#4A2E38', 3);
        sprite(ICONS[i].ico, X + 84, ry - 22, 0.9);
        ctx.fillStyle = '#4A2E38';
        ctx.fillText(ICONS[i].label, X + 168, ry);
        ctx.fillStyle = '#A8859A'; ctx.font = FONT(17);
        const hint = { status: '睇心願進度', bag: '睇收集到嘅嘢', log: '睇對話記錄', set: '音效・音樂・重玩', exit: '即刻返村口' }[ICONS[i].k];
        ctx.fillText(hint, X + 250, ry);
        ctx.font = FONT(22);
      }
      ctx.font = FONT(16); ctx.fillStyle = '#A8859A';
      ctx.textAlign = 'center';
      ctx.fillText('←→ 揀　A 入　B 出', VW / 2, Y + H - 34);
      ctx.textAlign = 'left';
      return;
    }
    if (MENU.page === 'status') {
      drawLCD(X, Y, W, H, '心願碎片 ' + STATE.items.length + '/3');
      for (let i = 0; i < 3; i++) {
        const ry = Y + 110 + i * 78;
        const got = !!STATE.items[i];
        roundRect(X + 60, ry - 30, W - 120, 62, 16, got ? '#FBCFD6' : 'rgba(255,255,255,0.5)', '#4A2E38', 3);
        ctx.font = FONT(26); ctx.textBaseline = 'middle'; ctx.fillStyle = '#E8705F';
        ctx.fillText(got ? '♥' : '♡', X + 84, ry);
        sprite(got ? STATE.items[i] : 'fx_r1c4', X + 124, ry - 22, 0.85);
        ctx.font = FONT(20); ctx.fillStyle = got ? '#4A2E38' : '#A8859A';
        const nm = ['卡邦尼意粉', '芝士龍蝦', '抹茶 latte'][i];
        ctx.fillText(nm, X + 184, ry);
        if (!got) { ctx.font = FONT(16); ctx.fillStyle = '#A8859A'; ctx.fillText('未拎', X + W - 76, ry); }
      }
      ctx.font = FONT(17); ctx.fillStyle = '#7A5A6A'; ctx.textAlign = 'center';
      ctx.fillText('A／B 返去', VW / 2, Y + H - 34);
      ctx.textAlign = 'left';
      return;
    }
    if (MENU.page === 'bag') {
      drawLCD(X, Y, W, H, '道具袋');
      const items = ['item_r1c1', 'item_r1c2', 'item_r1c3', 'item_r1c4', 'item_r2c1', 'item_r2c2', 'item_r2c3', 'item_r2c4'];
      for (let i = 0; i < 8; i++) {
        const cx = X + 96 + (i % 4) * 96, cy = Y + 130 + Math.floor(i / 4) * 108;
        const got = STATE.items.indexOf(items[i]) >= 0;
        roundRect(cx - 38, cy - 38, 76, 76, 14, got ? '#FBCFD6' : 'rgba(255,255,255,0.45)', '#4A2E38', 3);
        sprite(got ? items[i] : 'fx_r1c4', cx - 24, cy - 26, 0.9);
      }
      ctx.font = FONT(17); ctx.fillStyle = '#7A5A6A'; ctx.textAlign = 'center';
      ctx.fillText('拎到 ' + STATE.items.length + ' / 8　A／B 返去', VW / 2, Y + H - 34);
      ctx.textAlign = 'left';
      return;
    }
    if (MENU.page === 'log') {
      drawLCD(X, Y, W, H, '對話記錄');
      const rows = LOG.slice(Math.max(0, LOG.length - 6 - MENU.scroll), Math.max(6, LOG.length - MENU.scroll));
      ctx.font = FONT(18);
      if (!rows.length) { ctx.fillStyle = '#A8859A'; ctx.fillText('（仲未有對話）', X + 70, Y + 120); }
      rows.forEach((t, i) => {
        const ry = Y + 96 + i * 56;
        ctx.fillStyle = '#4A2E38';
        const s = t.length > 20 ? t.slice(0, 20) + '…' : t;
        ctx.fillText(s, X + 70, ry);
      });
      ctx.font = FONT(16); ctx.fillStyle = '#A8859A'; ctx.textAlign = 'center';
      ctx.fillText('↑↓ 捲　A／B 返去', VW / 2, Y + H - 34);
      ctx.textAlign = 'left';
      return;
    }
    if (MENU.page === 'set') {
      drawLCD(X, Y, W, H, '設定');
      ctx.textBaseline = 'middle';
      const rows = [['♪ 音效', OPT.sound ? '開' : '閂'],
                    ['♫ 背景音樂', OPT.bgm ? '開' : '閂'],
                    ['↺ 重新開始', '全部由頭']];
      rows.forEach((r, i) => {
        const ry = Y + 118 + i * 64;
        const on = (MENU.setSel || 0) === i;
        roundRect(X + 46, ry - 31, W - 92, 62, 16, on ? '#FBCFD6' : 'rgba(74,46,56,0.06)',
                  on ? '#4A2E38' : 'rgba(74,46,56,0.25)', on ? 3 : 2);
        ctx.font = FONT(23); ctx.fillStyle = '#4A2E38'; ctx.textAlign = 'left';
        ctx.fillText(r[0], X + 76, ry);
        ctx.font = FONT(19); ctx.fillStyle = '#8A5E74';
        ctx.fillText(r[1], X + 268, ry);
      });
      ctx.font = FONT(17); ctx.fillStyle = '#7A5A6A'; ctx.textAlign = 'left';
      ctx.fillText('名：' + STATE.name + '　第 1 日', X + 76, Y + 336);
      ctx.font = FONT(16); ctx.textAlign = 'center'; ctx.fillStyle = '#7A5A6A';
      ctx.fillText('↑↓ 揀　A 入　B 返去', VW / 2, Y + H - 34);
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    }
  }

  // ---------------------------------------------------------------- 轉場引擎
  //  過場：淡出 → 中途做嘢（轉場／換場）→（可選）章節卡 → 淡入
  const NOTRANS = new URLSearchParams(location.search).has('notrans');
  const TRANS = { on: false, t: 0, phase: 'out', a: 0, out: 0.4, hold: 0.35, inn: 0.45,
                  color: '#1B1420', card: null, sub: null, then: null, zoom: null, thenAt: 'hold',
                  logo: false };
  function transition(then, o) {
    if (NOTRANS) { if (then) then(); return; }
    if (TRANS.on) { if (then) then(); return; }
    o = o || {};
    TRANS.on = true; TRANS.t = 0; TRANS.phase = 'out'; TRANS.a = 0; TRANS.then = then || null;
    TRANS.color = o.color || '#1B1420';
    TRANS.card = o.card || null; TRANS.sub = o.sub || null;
    TRANS.out = o.out !== undefined ? o.out : 0.45;
    TRANS.hold = o.hold !== undefined ? o.hold : 0.4;
    TRANS.inn = o.inn !== undefined ? o.inn : 0.5;
    TRANS.zoom = o.zoom || null;
    TRANS.logo = !!o.logo;
    TRANS.wait = !!o.wait; TRANS.go = false;
    document.body.classList.toggle('cover-wait', !!o.logo);   // 封面等撳 A：A 掣要保持撳得
    TRANS.thenAt = o.thenAt || 'hold';
    document.body.classList.add('in-trans');
  }
  function transStep(dt) {
    if (!TRANS.on) return;
    TRANS.t += dt;
    if (TRANS.phase === 'out') {
      TRANS.a = Math.min(1, TRANS.t / TRANS.out);
      if (TRANS.t >= TRANS.out) {
        TRANS.phase = 'hold'; TRANS.t = 0;
        if (TRANS.thenAt === 'hold' && TRANS.then) { const f = TRANS.then; TRANS.then = null; f(); }
      }
    } else if (TRANS.phase === 'hold') {
      TRANS.a = 1;
      if (TRANS.wait && !TRANS.go) return;               // 封面：等玩家撳 A 先走
      if (TRANS.t >= TRANS.hold) {
        TRANS.phase = 'in'; TRANS.t = 0;
        if (TRANS.thenAt === 'in' && TRANS.then) { const f = TRANS.then; TRANS.then = null; f(); }
      }
    } else {
      TRANS.a = Math.max(0, 1 - TRANS.t / TRANS.inn);
      if (TRANS.t > 6) TRANS.a = 0;                     // 保險：唔會卡死喺轉場
      if (TRANS.a <= 0) {
        TRANS.on = false; TRANS.card = null; TRANS.sub = null; TRANS.zoom = null;
        document.body.classList.remove('in-trans', 'cover-wait');
        if (PENDING_A) { PENDING_A = false; if (TITLE.on) titleAdvance(); }   // 補返嗰下 A
      }
    }
  }
  function cardInk(col) {                    // 淡底用深字、深底用粉字
    const m = /^#?([0-9a-f]{6})$/i.exec(col || '');
    if (!m) return { main: '#FBCFD6', sub: 'rgba(251,207,214,0.75)', line: 'rgba(251,207,214,0.5)' };
    const v = parseInt(m[1], 16), r = (v >> 16) & 255, g = (v >> 8) & 255, b = v & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 140
      ? { main: '#4A2E38', sub: 'rgba(74,46,56,0.75)', line: 'rgba(74,46,56,0.4)' }
      : { main: '#FBCFD6', sub: 'rgba(251,207,214,0.75)', line: 'rgba(251,207,214,0.5)' };
  }
  function drawTrans() {
    if (!TRANS.on) return;
    ctx.save();
    ctx.globalAlpha = TRANS.a;
    ctx.fillStyle = TRANS.color; ctx.fillRect(0, 0, VW, VH);
    if (TRANS.zoom && W.kind === 'village' && TRANS.phase !== 'in') {   // 舖頭招牌特寫
      const z = TRANS.zoom, k = z.k || 1.9;
      ctx.save();
      ctx.translate(VW / 2, VH / 2); ctx.scale(k, k); ctx.translate(-VW / 2, -VH / 2);
      const cx = Math.max(0, Math.min(COLS * T - VW, z.x * T + 24 - VW / 2));
      const cy = Math.max(0, Math.min(ROWS * T - VH, z.y * T + 24 - VH / 2));
      drawScene(cx, cy);
      ctx.restore();
      ctx.fillStyle = 'rgba(27,20,32,0.34)'; ctx.fillRect(0, 0, VW, VH);
    }
    if (TRANS.logo && TRANS.phase !== 'out') {          // 封面
      const bgc = bgImg['bg_cover'] || bgImg['bg_credits'];
      const hasCover = !!(bgImg['bg_cover'] && bgImg['bg_cover'].complete && bgImg['bg_cover'].naturalWidth);
      if (bgc && bgc.complete && bgc.naturalWidth) ctx.drawImage(bgc, 0, 0, VW, VH);
      const tt = performance.now() / 1000;
      const bob = Math.sin(tt * 2.1) * 6;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      // ① logo 背後柔光
      const gl = ctx.createRadialGradient(VW / 2, 296 + bob, 16, VW / 2, 296 + bob, 250);
      gl.addColorStop(0, 'rgba(255,214,228,0.42)');
      gl.addColorStop(0.5, 'rgba(227,154,180,0.18)');
      gl.addColorStop(1, 'rgba(227,154,180,0)');
      ctx.fillStyle = gl; ctx.fillRect(0, 0, VW, VH);
      // ② 閃星（上半部，一粒粒咁閃）
      for (let i = 0; i < 16; i++) {
        const sx = 34 + ((i * 137) % (VW - 60));
        const sy = 54 + ((i * 211) % 640);
        ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(tt * (0.9 + (i % 6) * 0.27) + i * 1.7));
        sprite(i % 3 === 0 ? 'FX2_r2c3' : 'FX2_r2c2', sx, sy, 0.28 + (i % 4) * 0.05);
      }
      ctx.globalAlpha = 1;
      // ③ 慢慢升起嘅心
      for (let i = 0; i < 9; i++) {
        const ph = (tt * 0.15 + i / 9) % 1;
        sprite(i % 2 ? 'FX2_r2c1' : 'FX2_r2c4',
               40 + i * 62 + Math.sin(tt * 0.8 + i) * 12, 960 - ph * 880, 0.42 + (i % 3) * 0.06);
      }
      // ④ LOGO（帶粉紅光暈）
      const s0 = window.SPR['logo'], im0 = img['logo'];
      if (s0 && im0 && im0.complete && im0.naturalWidth) {
        const k = 2.2;
        ctx.save();
        ctx.shadowColor = 'rgba(255,196,220,0.6)'; ctx.shadowBlur = 26;
        ctx.drawImage(im0, VW / 2 - s0.w * k / 2, 296 - s0.h * k / 2 + bob, s0.w * k, s0.h * k);
        ctx.restore();
      }
      ctx.font = FONT(22); ctx.fillStyle = 'rgba(255,232,240,0.92)';
      ctx.fillText('呈　獻', VW / 2, 428 + bob * 0.5);
      // ⑤ 日期牌
      roundRect(VW / 2 - 158, 472, 316, 66, 22, 'rgba(74,46,56,0.5)', null, 0);
      roundRect(VW / 2 - 150, 480, 300, 50, 16, 'rgba(255,246,250,0.96)', '#4A2E38', 3);
      ctx.font = FONT(21); ctx.fillStyle = '#4A2E38';
      ctx.fillText(TRANS.sub || '2026 · 9 · 19', VW / 2, 505);
      // ⑥ 主角企喺下面
      ctx.globalAlpha = 0.22; ctx.fillStyle = '#1B1420';
      ctx.beginPath(); ctx.ellipse(VW / 2, 872, 56, 11, 0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      if (!hasCover) sprite('pianow_r1c1', VW / 2, 806 + bob * 0.8, 2.5);    // 封面圖有主角就唔重複
      // ⑦ 撳 A 開始（閃）
      ctx.globalAlpha = 0.55 + 0.45 * Math.abs(Math.sin(tt * 2.8));
      ctx.font = FONT(17); ctx.fillStyle = '#FFF6FA';
      ctx.fillText('\u25b6  撳 A 開始', VW / 2, 902);
      ctx.globalAlpha = 1;
      // ⑧ 暗角
      const vg = ctx.createRadialGradient(VW / 2, VH / 2, VH * 0.3, VW / 2, VH / 2, VH * 0.74);
      vg.addColorStop(0, 'rgba(27,20,32,0)'); vg.addColorStop(1, 'rgba(27,20,32,0.5)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, VW, VH);
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    }
    if (TRANS.card && TRANS.phase !== 'out' && !TRANS.logo) {
      const ink = TRANS.zoom
        ? { main: '#FFF6FA', sub: 'rgba(255,246,250,0.8)', line: 'rgba(255,246,250,0.55)' }
        : cardInk(TRANS.color);
      ctx.globalAlpha = 1;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = FONT(31); ctx.fillStyle = ink.main;
      ctx.fillText(TRANS.card, VW / 2, VH / 2 - 12);
      if (TRANS.sub) {
        ctx.font = FONT(18); ctx.fillStyle = ink.sub;
        ctx.fillText(TRANS.sub, VW / 2, VH / 2 + 36);
      }
      ctx.strokeStyle = ink.line; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(VW / 2 - 110, VH / 2 + 70); ctx.lineTo(VW / 2 + 110, VH / 2 + 70); ctx.stroke();
      ctx.textAlign = 'left';
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- Act 0（蛋・命名）
  const TITLE = { on: false, phase: 'text', t: 0, line: 0, burst: 0 };
  const T_TEXT = ['每一日都會過去。', '但有一日，我永遠都想記住。'];
  function startTitle() {
    TITLE.on = true; TITLE.phase = 'text'; TITLE.t = 0; TITLE.line = 0; TITLE.burst = 0;
    document.body.classList.add('in-title');
  }
  function goName() {
    if (TITLE.phase === 'name') return;
    transition(() => {
      TITLE.phase = 'name'; TITLE.t = 0;
      document.body.classList.add('in-title-name');
      const el = document.getElementById('nameIn');
      setTimeout(() => { try { el && el.focus(); } catch (e) {} }, 120);
    }, { color: '#1B1420', out: 0.35, hold: 0.15, inn: 0.45 });
  }
  function setName(v) {
    STATE.name = (v || '').trim() || SC.defaultName;
    STATE.flags.started = 1;
    save();
  }
  function titleAdvance() {
    if (TITLE.phase === 'text') {
      const full = Array.from(T_TEXT[TITLE.line] || '').length;
      if (TITLE.t < full / 9) { TITLE.t = 99; return; }        // 先出齊字
      TITLE.line++; TITLE.t = 0;
      if (TITLE.line >= T_TEXT.length) { TITLE.phase = 'egg'; TITLE.t = 0; }
      return;
    }
    if (TITLE.phase === 'egg') {
      if (TITLE.t < 3.2) { TITLE.t = 3.2; return; }             // 跳去爆蛋
      if (TITLE.t < 4.4) { TITLE.t = 4.4; return; }
      TITLE.phase = 'white'; TITLE.t = 0; return;          // 爆完 → 全白
    }
    if (TITLE.phase === 'white') { goName(); return; }     // 撳 A 先入改名
    if (TITLE.phase === 'date') {
      beep(1318, 0.1);
      transition(() => {
        TITLE.on = false;
        document.body.classList.remove('in-title', 'in-title-name');
      }, { color: '#FFF6FA', card: '第一幕・Mary Land', sub: '用十字鍵行路，行去搵兔仔朋友',
           out: 0.6, hold: 1.35, inn: 0.7 });
    }
  }
  function titleStep(dt) {
    TITLE.t += dt;
    if (TITLE.phase === 'egg' && TITLE.t > 4.6) { TITLE.phase = 'white'; TITLE.t = 0; beep(1046, 0.12); }
  }
  const startBtn = document.getElementById('startBtn');
  if (startBtn) startBtn.addEventListener('click', () => {
    const _in = document.getElementById('nameIn');
    setName(_in.value);
    if (_in.blur) _in.blur();                       // 收鍵盤（手機）
    beep(1046, 0.09);
    transition(() => {
      document.body.classList.remove('in-title-name');
      TITLE.phase = 'date'; TITLE.t = 0;
    }, { color: '#FFF6FA', out: 0.35, hold: 0.2, inn: 0.5 });
  });
  const nameIn = document.getElementById('nameIn');
  if (nameIn) nameIn.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); startBtn.click(); }
  });

  function drawEggBody(cx, cy, w, h) {
    ctx.beginPath(); ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF6FA'; ctx.fill();
    ctx.lineWidth = 7; ctx.strokeStyle = '#4A2E38'; ctx.stroke();
    ctx.fillStyle = '#FBCFD6';
    [[-w * 0.18, -h * 0.16, w * 0.09], [w * 0.16, h * 0.04, w * 0.07], [-w * 0.04, h * 0.22, w * 0.06]]
      .forEach(([sx, sy, r]) => {
        ctx.beginPath(); ctx.ellipse(cx + sx, cy + sy, r, r * 1.1, 0, 0, Math.PI * 2); ctx.fill();
      });
  }
  function drawTitle() {
    const t = TITLE.t;
    // 背景
    const bg = TITLE.phase === 'text' ? (bgImg['bg_credits'] || bgImg['bg_title'])
                                      : (bgImg['bg_home'] || bgImg['bg_title']);
    ctx.fillStyle = '#2A1E28'; ctx.fillRect(0, 0, VW, VH);
    if (TITLE.phase === 'text' && bg && bg.complete) {
      ctx.globalAlpha = Math.min(1, t / 0.8);
      ctx.drawImage(bg, 0, 0, VW, VH);
      ctx.globalAlpha = 1;
    }
    if (TITLE.phase !== 'text' && bg && bg.complete) {
      ctx.globalAlpha = Math.min(1, t / 0.6 + (TITLE.phase === 'egg' ? 0.4 : 1));
      ctx.drawImage(bg, 0, 0, VW, VH);
      ctx.globalAlpha = 1;
    }
    if (TITLE.phase === 'text') {
      ctx.font = FONT(26); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FBCFD6';
      ctx.shadowColor = 'rgba(27,20,32,0.9)'; ctx.shadowBlur = 10;
      for (let i = 0; i <= TITLE.line && i < T_TEXT.length; i++) {
        const chars = Array.from(T_TEXT[i]);
        const shown = i < TITLE.line ? chars.length : Math.floor(Math.min(chars.length, t * 9));
        if (shown > 0) ctx.fillText(chars.slice(0, shown).join(''), VW / 2, 430 + i * 48);
      }
      if (Math.sin(TITLE.t * 4) > 0) {
        ctx.font = FONT(18); ctx.fillStyle = 'rgba(251,207,214,0.7)';
        ctx.fillText('撳 A 繼續', VW / 2, 620);
      }
      ctx.textAlign = 'left';
      return;
    }
    if (TITLE.phase === 'white') {                          // 爆蛋之後：全白，等撳 A
      ctx.fillStyle = '#FFFDFE'; ctx.fillRect(0, 0, VW, VH);
      const wt = performance.now() / 1000;
      if (wt % 1.6 > 0.5) {
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = FONT(17); ctx.fillStyle = 'rgba(74,46,56,0.5)';
        ctx.fillText('撳 A', VW / 2, 700);
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      }
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      return;
    }
    if (TITLE.phase === 'egg') {
      const cx = VW / 2, cy = 470, w = 210, h = 264;
      const burst = t > 3.2 ? Math.min(1, (t - 3.2) / 0.7) : 0;
      ctx.save();
      ctx.translate(cx, cy);
      const wob = burst ? 0 : Math.sin(t * 9) * 0.055;
      ctx.rotate(wob);
      if (!burst) {
        drawEggBody(0, 0, w, h);
        if (t > 1.3) {                                    // 裂紋
          const cp = Math.min(1, (t - 1.3) / 1.6);
          const pts = [[-w * 0.3, -h * 0.1], [-w * 0.1, -h * 0.02], [0, -h * 0.12], [w * 0.12, 0], [w * 0.3, -h * 0.06]];
          ctx.strokeStyle = '#4A2E38'; ctx.lineWidth = 5; ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);
          for (let i = 1; i < pts.length; i++) {
            const seg = cp * (pts.length - 1);
            if (i - 1 >= seg) break;
            const f = Math.min(1, seg - (i - 1));
            ctx.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f,
                       pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f);
          }
          ctx.stroke();
        }
      } else {
        const rise = burst;
        // 下蛋殼
        ctx.save(); ctx.beginPath(); ctx.rect(-w, 0, w * 2, h); ctx.clip();
        drawEggBody(0, 0, w, h); ctx.restore();
        // 上蛋殼飛起
        ctx.save(); ctx.translate(burst * 46, -burst * 92); ctx.rotate(burst * 0.55);
        ctx.beginPath(); ctx.rect(-w, -h, w * 2, h); ctx.clip();
        drawEggBody(0, 0, w, h); ctx.restore();
        // 主角彈出嚟
        const kick = Math.sin(Math.min(1, rise) * Math.PI) * 26;
        drawPlayerScaled(0, 46 - rise * 92 - kick, 2.4);
        if (rise > 0.35) {
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + t;
            const r = 40 + rise * 70;
            sprite('fx_r1c3', Math.cos(a) * r - 12, -20 + Math.sin(a) * r * 0.7 - 12, 0.7);
          }
        }
      }
      ctx.restore();
      if (burst > 0.98) { ctx.fillStyle = '#FFF6FA'; ctx.fillRect(0, 0, VW, VH); }
      return;
    }
    if (TITLE.phase === 'name') {
      // 奶白牌 + 深色字：唔會再被後面畫面食住
      roundRect((VW - 486) / 2, 336, 486, 116, 22, 'rgba(255,246,250,0.95)', '#4A2E38', 4);
      ctx.font = FONT(25); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#4A2E38';
      ctx.fillText('傻肥 嘅生日 · Mary Land', VW / 2, 372);
      ctx.font = FONT(16); ctx.fillStyle = '#8A5E74';
      ctx.fillText('（之後所有人都會咁叫妳）', VW / 2, 412);
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      return;
    }
    if (TITLE.phase === 'date') {
      const cw = 330, ch = 250, cx = (VW - cw) / 2, cy = 330;
      roundRect(cx, cy, cw, ch, 20, '#FFF6FA', '#4A2E38', 5);
      ctx.font = FONT(20); ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillStyle = '#4A2E38';
      ctx.fillText('2026 年 9 月', VW / 2, cy + 20);
      const days = ['日', '一', '二', '三', '四', '五', '六'];
      ctx.font = FONT(15);
      days.forEach((d, i) => {
        ctx.fillStyle = i === 0 ? '#E8705F' : '#7A5A6A';
        ctx.fillText(d, cx + 40 + i * 42, cy + 62);
      });
      // 2026-09-01 係星期二 → 19 號係星期六
      for (let d = 1; d <= 30; d++) {
        const idx = d - 1 + 2;                     // 9/1 = 星期二
        const col = idx % 7, row = Math.floor(idx / 7);
        const x = cx + 40 + col * 42, y = cy + 96 + row * 30;
        ctx.fillStyle = '#4A2E38';
        ctx.fillText(String(d), x, y);
        if (d === 19) {
          ctx.strokeStyle = '#E8705F'; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.arc(x, y + 9, 21, 0, Math.PI * 2); ctx.stroke();
        }
      }
      ctx.font = FONT(24); ctx.fillStyle = '#4A2E38';
      ctx.fillText('生日快樂，' + STATE.name + ' ♥', VW / 2, cy + ch + 62);
      if (Math.sin(TITLE.t * 4) > 0) {
        ctx.font = FONT(18); ctx.fillStyle = 'rgba(74,46,56,0.65)';
        ctx.fillText('撳 A 開始', VW / 2, cy + ch + 108);
      }
      ctx.textAlign = 'left';
    }
  }

  // ---------------------------------------------------------------- Act 3（籬笆・夢・生日會）
  const NIGHT = { a: 0 };
  const ZOOM = 2;                       // 村口視角拉近（Piano 大少少、視野窄啲）
  const CAM = { x: 0, y: 0 };
  const CELEB = { on: false, t: 0, parts: [] };
  const CUTIN = { on: false, key: null, t: 0, dur: 2.4 };
  function cutinStep(dt) { if (!CUTIN.on) return; CUTIN.t += dt; if (CUTIN.t > CUTIN.dur) CUTIN.on = false; }
  function drawCutin() {
    if (!CUTIN.on) return;
    const m = bgImg[CUTIN.key];
    if (!m || !m.complete || !m.naturalWidth) return;
    const a = Math.min(1, CUTIN.t / 0.45, (CUTIN.dur - CUTIN.t) / 0.6);
    ctx.globalAlpha = Math.max(0, a);
    ctx.drawImage(m, 0, 0, VW, VH);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(27,20,32,0.3)'; ctx.fillRect(0, 0, VW, VH);
  }
  function celebPuff() {
    const fx = ['FX2_r1c1', 'FX2_r1c2', 'FX2_r1c3', 'FX2_r1c4', 'FX2_r2c4'];
    const inCredit = CREDITS.on;
    const top = !inCredit || Math.random() < 0.5;
    CELEB.parts.push({ sk: fx[(Math.random() * fx.length) | 0], x: 70 + Math.random() * (VW - 140),
                       y: inCredit ? (top ? 52 + Math.random() * 120 : 816 + Math.random() * 110)
                                   : 120 + Math.random() * 380,
                       k: (inCredit ? 0.42 : 0.5) + Math.random() * (inCredit ? 0.45 : 0.7),
                       t: 0, life: 1.5 });
  }
  function celebStep(dt) {
    if (!CELEB.on) return;
    CELEB.t += dt;
    if (CELEB.t > 0.34) { CELEB.t = 0; celebPuff(); }
    CELEB.parts.forEach(p => { p.t += dt; });
    CELEB.parts = CELEB.parts.filter(p => p.t < p.life);
  }
  function drawCeleb() {
    if (!CELEB.parts.length) return;
    for (const p of CELEB.parts) {
      const a = 1 - p.t / p.life;
      ctx.globalAlpha = a;
      sprite(p.sk, p.x, p.y + p.t * -18, p.k * (0.7 + p.t * 0.9));
      ctx.globalAlpha = 1;
    }
  }
  const CREDITS = { on: false, t: 0, a: 0 };
  const CUT = { on: false, t: 0, phase: '' };
  const FENCE = { row: 26, x0: 10, x1: 13 };

  function act3Try() {
    if (STATE.flags.act3_done) {                 // 玩完之後：可以再入生日會場重睇結局
      transition(() => enterRoom('party'),
                 { color: '#000000', card: '生日會場', sub: '再玩一次都得', out: 0.5, hold: 1.0, inn: 0.6 });
      return;
    }
    if (STATE.flags.act3_seen) return startScene('fence_later');
    if (!STATE.flags.act2_done) return startScene('fence_early');
    if (!STATE.flags.friends_done) { STATE.flags.friends_done = 1; save(); return startScene('friends_chat'); }
    CUT.on = true; CUT.t = 0; CUT.phase = 'jump';
    STATE.flags.act3_seen = 1; save();
    P.dir = 'down'; P.moving = false; P.t = 0;
    beep(784, 0.06);
  }
  function cutStep(dt) {
    CUT.t += dt;
    if (CUT.phase === 'jump') {
      if (CUT.t > 1.3) {                            // 唔再天黑：直接入去見傻豬
        CUT.on = false;
        NIGHT.a = 0;
        transition(() => startScene('act3_intro'),
                   { color: '#000000', card: '第二幕・合體', sub: '去搵傻豬',
                     out: 0.6, hold: 1.1, inn: 0.6 });
      }
    }
  }
  function openGiftUI(mode) {
    GUESS.open = true; GUESS.mode = mode || 'msg';
    const q = document.querySelector('#giftui .q');
    const ta = document.getElementById('giftIn');
    const sb = document.getElementById('sendBtn');
    const sk = document.getElementById('giftSkip');
    if (GUESS.mode === 'guess') {
      if (q) q.textContent = '妳估下…三塊碎片砌埋會變成咩？';
      if (ta) ta.placeholder = '打你嘅估法（唔中都得，我想知）';
      if (sb) sb.textContent = '送出 ♥';
      if (sk) sk.textContent = '唔估住，等開估';
    } else {
      if (q) q.textContent = '有咩想同傻豬b講？';
      if (ta) ta.placeholder = '想講咩都得～（會直接 send 畀傻豬b）';
      if (sb) sb.textContent = 'Send 畀傻豬b ♥';
      if (sk) sk.textContent = '唔寫住，多謝你';
    }
    document.body.classList.add('in-gift');
    setTimeout(() => { try { ta && ta.focus(); } catch (e) {} }, 80);
  }
  function closeGiftUI(resume) {
    document.body.classList.remove('in-gift');
    const was = GUESS.open; GUESS.open = false;
    if (resume !== false && was) setTimeout(() => { if (DLG.on && !MERGE.on) nextStep(); }, 450);
  }
  function showGift() { openGiftUI('msg'); }
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) sendBtn.addEventListener('click', () => {
    const v = (document.getElementById('giftIn').value || '').trim() || '（未諗到，但係今日好開心）';
    const isGuess = GUESS.mode === 'guess';
    if (isGuess) { STATE.guess = v; } else { STATE.gift = v; }
    save();
    const _g = document.getElementById('giftIn'); if (_g && _g.blur) _g.blur();
    beep(1318, 0.09);
    closeGiftUI(true);
    location.href = 'https://wa.me/85265498648?text=' + encodeURIComponent((isGuess ? '佢估：' : '傻肥話：') + v);
  });
  const giftSkip = document.getElementById('giftSkip');
  if (giftSkip) giftSkip.addEventListener('click', () => {
    const _g2 = document.getElementById('giftIn'); if (_g2 && _g2.blur) _g2.blur();
    closeGiftUI(true);
    beep(523, 0.07);
  });
  const giftRestart = document.getElementById('giftRestart');       // 重新玩過
  if (giftRestart) giftRestart.addEventListener('click', () => {
    beep(523, 0.08);
    doReset();
  });

  // ---------------- 合體 → 鍵盤動畫（開估）----------------
  function fragIcon(kind, x, y, sc) {                       // 三塊碎片（程序繪圖，唔使圖檔）
    ctx.save(); ctx.translate(x, y); ctx.scale(sc || 1, sc || 1);
    if (kind === 'jersey') {                                // ① 10 號球衣
      roundRect(-19, -21, 38, 42, 6, '#E8705F', '#4A2E38', 3);
      roundRect(-30, -19, 11, 17, 4, '#E8705F', '#4A2E38', 3);
      roundRect(19, -19, 11, 17, 4, '#E8705F', '#4A2E38', 3);
      ctx.font = FONT(19); ctx.fillStyle = '#FFF6FA';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('10', 0, 2);
    } else if (kind === 'sticker') {                        // ② 貼紙（排球）
      roundRect(-21, -21, 42, 42, 9, '#FFF6FA', '#4A2E38', 3);
      ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#FBCFD6'; ctx.fill();
      ctx.strokeStyle = '#4A2E38'; ctx.lineWidth = 2.4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-12.5, 0); ctx.quadraticCurveTo(0, -9, 12.5, 0); ctx.stroke();
    } else {                                                // ③ 一粒方塊（唔講明）
      roundRect(-20, -20, 40, 34, 6, '#FFF3F8', '#4A2E38', 3);
      roundRect(-14, -16, 28, 19, 4, '#F3DCE6', null, 0);
    }
    ctx.restore();
  }
  function drawKeyboard(x, y, w, prog) {
    const h = w * 0.44;
    roundRect(x, y, w, h, 16, '#3A2530', '#4A2E38', 5);
    const rows = 4, cols = 12, pad = 16;
    const kw = (w - pad * 2) / cols, kh = (h - pad * 2) / rows;
    let n = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p = prog * rows * cols - n; n++;
        if (p <= 0) continue;
        if (r === 3 && c >= 3 && c <= 7) continue;           // 留位畀大鍵
        const sc2 = Math.min(1, p * 2.6), lift = (1 - sc2) * 14;
        const kx = x + pad + c * kw, ky = y + pad + r * kh;
        let col = '#FFF3F8', label = '';
        if (r === 0 && c === 6) { col = '#E8705F'; label = '10'; }
        if (r === 0 && c === 7) { col = '#2E2A3A'; label = '9'; }
        roundRect(kx + 1.5, ky + 1.5 + lift, kw - 3, kh - 4, 4, col, '#4A2E38', 2);
        if (label) {
          ctx.font = FONT(13); ctx.fillStyle = '#FFF6FA';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(label, kx + kw / 2, ky + kh / 2 + lift + 1);
        }
      }
    }
    if (prog > 0.55) {                                        // 大鍵 + 排球
      const bx = x + pad + 3 * kw, by = y + pad + 3 * kh, bw = kw * 5, bh = kh - 4;
      roundRect(bx + 1.5, by + 1.5, bw - 3, bh, 4, '#FBCFD6', '#4A2E38', 2);
      const r0 = Math.min(bh * 0.42, 10);
      ctx.beginPath(); ctx.arc(bx + bw / 2, by + bh / 2, r0, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF6FA'; ctx.fill();
      ctx.strokeStyle = '#4A2E38'; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx + bw / 2 - r0 * 0.9, by + bh / 2);
      ctx.quadraticCurveTo(bx + bw / 2, by + bh / 2 - r0 * 0.8, bx + bw / 2 + r0 * 0.9, by + bh / 2);
      ctx.stroke();
    }
  }
  function drawMerge() {
    const t = MERGE.t;
    ctx.save();
    ctx.fillStyle = '#1B1420'; ctx.fillRect(0, 0, VW, VH);
    const gl = ctx.createRadialGradient(VW / 2, 430, 30, VW / 2, 430, 340);
    gl.addColorStop(0, 'rgba(255,205,225,0.20)'); gl.addColorStop(1, 'rgba(255,205,225,0)');
    ctx.fillStyle = gl; ctx.fillRect(0, 0, VW, VH);
    const frags = ['jersey', 'sticker', 'key'];
    if (t < 1.35) {                                          // 三塊碎片飛入中心
      const k = Math.min(1, t / 1.05), ease = 1 - Math.pow(1 - k, 3);
      const from = [[110, 190], [VW - 110, 190], [VW / 2, 720]];
      for (let i = 0; i < 3; i++) {
        const fx = from[i][0] + (VW / 2 - from[i][0]) * ease;
        const fy = from[i][1] + (430 - from[i][1]) * ease;
        ctx.globalAlpha = Math.max(0, 1 - Math.max(0, k - 0.82) * 5);
        fragIcon(frags[i], fx, fy, 1.05 + (1 - ease) * 0.35);
      }
      ctx.globalAlpha = 1;
    }
    if (t >= 1.0) {
      if (t < 1.5) {                                          // 閃光
        ctx.fillStyle = 'rgba(255,255,255,' + (0.92 * (1 - (t - 1.0) / 0.5)).toFixed(2) + ')';
        ctx.fillRect(0, 0, VW, VH);
      }
      const prog = Math.max(0, Math.min(1, (t - 1.25) / 2.3));
      const kw = 470, kx = (VW - kw) / 2;
      const fade = Math.max(0, Math.min(1, (t - 3.4) / 0.9));       // 3.4s 後淡入真鍵盤圖
      ctx.globalAlpha = Math.min(1, (t - 1.0) / 0.35) * (1 - fade * 0.92);
      drawKeyboard(kx, 336, kw, prog);
      ctx.globalAlpha = 1;
      const kbImg = img['keyboard'], kbS = window.SPR['keyboard'];
      if (fade > 0 && kbImg && kbImg.complete && kbImg.naturalWidth && kbS) {
        const w2 = Math.min(VW - 24, kbS.w), h2 = kbS.h * (w2 / kbS.w);
        ctx.globalAlpha = fade;
        ctx.drawImage(kbImg, (VW - w2) / 2, 336 + (kw * 0.44 - h2) / 2, w2, h2);
        ctx.globalAlpha = 1;
      }
      if (t > 3.5) {                                          // 打字光左右掃
        const idx = Math.floor((t - 3.5) * 7) % 12;
        const cw2 = (kw - 32) / 12, ch2 = (kw * 0.44 - 32) / 4;
        ctx.globalAlpha = 0.30;
        roundRect(kx + 16 + idx * cw2 + 1.5, 336 + 16 + 3 * ch2 + 1.5, cw2 - 3, ch2 - 4, 4,
                  'rgba(255,255,255,0.75)', null, 0);
        ctx.globalAlpha = 1;
      }
      if (t > 4.1) {                                          // 開估文字
        ctx.globalAlpha = Math.min(1, (t - 4.1) / 0.6);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = FONT(29); ctx.fillStyle = '#FBCFD6';
        ctx.fillText('為你砌嘅 · 鍵盤', VW / 2, 646);
        ctx.font = FONT(18); ctx.fillStyle = 'rgba(255,232,240,0.88)';
        ctx.fillText('排球少年　10 ＋ 9', VW / 2, 688);
        ctx.font = FONT(15); ctx.fillStyle = 'rgba(201,169,184,0.92)';
        ctx.fillText('一粒一粒砌嘅，砌咗好多個夜晚', VW / 2, 726);
        ctx.globalAlpha = 1;
      }
    }
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.restore();
  }
  function mergeStep(dt) {
    if (!MERGE.on) return;
    if (MERGE.demo) return;
    MERGE.t += dt;
    if (MERGE.t > 4.3 && !MERGE.clacked) { MERGE.clacked = true; clackSeq(5, 0.12, 0.045); }
    if (MERGE.t > 6.4) {
      MERGE.on = false; MERGE.clacked = false;
      if (DLG.on) nextStep();                                 // 動畫完 → 繼續對白
    }
  }

  // ---------------- 電影式滾動字幕 ----------------
  function creditLines() {
    return [
      ['生日快樂，' + STATE.name + ' ♥', 30, '#FBCFD6'],
      ['2026 · 9 · 19', 17, '#E39AB4'],
      ['', 0, ''],
      ['主演', 15, '#C9A9B8'],
      ['Piano（妳）', 23, '#FFF6FA'],
      ['兔仔朋友', 23, '#FFF6FA'],
      ['熊師傅　龍蝦師傅', 23, '#FFF6FA'],
      ['綠貓 barista　企鵝侍應', 23, '#FFF6FA'],
      ['傻豬', 23, '#FFF6FA'],
      ['', 0, ''],
      ['製作', 15, '#C9A9B8'],
      ['傻豬b', 23, '#FFF6FA'],
      ['', 0, ''],
      ['POCKET PIANO', 28, '#FBCFD6'],
    ];
  }
  function drawCredits() {
    ctx.save();
    ctx.globalAlpha = CREDITS.a === undefined ? 1 : CREDITS.a;
    const cb = bgImg['bg_credits'];
    if (cb && cb.complete && cb.naturalWidth) ctx.drawImage(cb, 0, 0, VW, VH);
    ctx.fillStyle = 'rgba(27,20,32,0.60)'; ctx.fillRect(0, 0, VW, VH);
    const L = creditLines(), gap = 50;
    const y0 = VH + 60 - CREDITS.t * 52;                 // 慢慢滾上去
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < L.length; i++) {
      const y = y0 + i * gap;
      if (!L[i][0] || y < -40 || y > VH + 40) continue;
      ctx.font = FONT(L[i][1]); ctx.fillStyle = L[i][2];
      ctx.fillText(L[i][0], VW / 2, y);
    }
    const g1 = ctx.createLinearGradient(0, 0, 0, 130);
    g1.addColorStop(0, 'rgba(27,20,32,0.95)'); g1.addColorStop(1, 'rgba(27,20,32,0)');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, VW, 130);
    const g2 = ctx.createLinearGradient(0, VH - 130, 0, VH);
    g2.addColorStop(0, 'rgba(27,20,32,0)'); g2.addColorStop(1, 'rgba(27,20,32,0.95)');
    ctx.fillStyle = g2; ctx.fillRect(0, VH - 130, VW, 130);
    if (Math.sin(CREDITS.t * 3) > 0) {
      ctx.font = FONT(16); ctx.fillStyle = 'rgba(251,207,214,0.75)';
      ctx.fillText('撳 A 睇大合照', VW / 2, VH - 42);
    }
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.restore();
    if (y0 + L.length * gap < -30) { CREDITS.on = false; PHOTO.on = true; PHOTO.t = 0; }
  }

  // ---------------------------------------------------------------- step
  function step(dt) {
    if (SHAKE > 0) SHAKE = Math.max(0, SHAKE - dt);
    IDLE_T += dt;
    if (DOOR_LOCK > 0) DOOR_LOCK = Math.max(0, DOOR_LOCK - dt);
    if (TRANS.on) { transStep(dt); return; }
    if (TITLE.on) { titleStep(dt); return; }
    if (CREDITS.on) { CREDITS.t += dt; CREDITS.a = Math.min(1, (CREDITS.a || 0) + dt * 1.8); }
    celebStep(dt); cutinStep(dt); monkeyStep(dt);
    if (MENU.open) return;               // menu freezes the world (like the real device)
    if (CONFIRM.on) return;              // 確認框都 freeze
    if (document.body.classList.contains('in-gift')) return;   // 送禮物畫面：完全唔郁
    photoStep(dt); castStep(dt); mergeStep(dt);
    if (CUT.on) { cutStep(dt); return; }   // Act 3 過場（跳籬笆／天黑）
    if (DLG.on) {                       // dialogue freezes the player
      DLG.t += dt;
      if (!DLG.done && !DLG.choice) {
        DLG.n = Math.min(DLG.chars.length, DLG.n + dt / 0.022);   // ~45 chars/s
        voiceTick();                                               // 外星話音效
        if (DLG.n >= DLG.chars.length) DLG.done = true;
      }
      return;
    }
    let dir = 'up', vx = 0, vy = 0;
    if (order.length) {
      const d = order[order.length - 1];
      dir = d; P.dir = d;
      vx = (d === 'left' ? -1 : d === 'right' ? 1 : 0);
      vy = (d === 'up' ? -1 : d === 'down' ? 1 : 0);
      if (vx && vy) { vx *= 0.7071; vy *= 0.7071; }
    }
    const moving = !!(vx || vy);
    P.moving = moving;
    if (W.kind === 'room') {                 // 室內：單屏幕走動 ＋ 出口
      if (moving) {
        P.t += dt;
        let nx = P.x + vx * P.speed * dt, ny = P.y + vy * P.speed * dt;
        nx = Math.max(ROOM_BOUND.x0, Math.min(ROOM_BOUND.x1, nx));
        ny = Math.max(ROOM_BOUND.y0, Math.min(ROOM_BOUND.y1, ny));
        const n = W.room.npc, R = 74;
        if (Math.hypot(nx - n.x, ny - n.y) >= R) { P.x = nx; P.y = ny; }
        else if (Math.hypot(nx - n.x, P.y - n.y) >= R) P.x = nx;
        else if (Math.hypot(P.x - n.x, ny - n.y) >= R) P.y = ny;
        // 撞牆唔震（房內冇要用撞嘅嘢）
        if (P.y >= 812) exitRoom();
      } else P.t = 0;
      const nb = W.room.npc;
      if (W.room.auto && !STATE.flags[nb.done] && Math.hypot(P.x - nb.x, P.y - nb.y) < 145)
        startScene(nb.scene);
      return;
    }
    if (moving) {
      P.t += dt;
      IDLE_T += dt;
      const nx = P.x + vx * P.speed * dt, ny = P.y + vy * P.speed * dt;
      const okX = canStand(nx, P.y), okY = canStand(P.x, ny);
      if (okX) P.x = nx;
      if (okY) P.y = ny;
      const bX = vx !== 0 && !okX, bY = vy !== 0 && !okY;
      const bumped = (vx !== 0 && vy !== 0) ? (bX && bY) : (bX || bY);
      if (bumped) {                              // walked straight into something
        const t = { x: Math.floor(P.x / T) + (vx > 0 ? 1 : vx < 0 ? -1 : 0),
                    y: Math.floor((P.y - 6) / T) + (vy > 0 ? 1 : vy < 0 ? -1 : 0) };
        const npc = NPC.find(n => n.x === t.x && n.y === t.y);
        const isFence = t.y === FENCE.row && t.x >= FENCE.x0 && t.x <= FENCE.x1;
        // 「有用嘅嘢」＝可以傾偈嘅人／籬笆（去第二幕）／舖頭門口 → 先震
        const useful = !!DOORSTEP[t.x + ',' + t.y] || trig.some(g => g.x === t.x && g.y === t.y);
        if (npc) { SHAKE = 0.14; startScene(npcScene(npc)); }
        else if (isFence) { SHAKE = 0.14; act3Try(); }
        else if (useful) SHAKE = 0.14;
        // 其他（樹、草、圍欄、水）→ 唔震，唔想 distract
      }
      // 踏到舖頭門口嘅磚 → 入室內
      if (DOOR_LOCK <= 0) {
        const dt_ = DOORSTEP[Math.floor(P.x / T) + ',' + Math.floor((P.y - 6) / T)];
        if (dt_) enterRoom(dt_);
      }
    } else P.t = 0;
  }
  // ---------------------------------------------------------------- render
  function drawSprite(key, x, y, rot = 0, anchor = null) {
    const s = window.SPR[key], im = img[key];
    if (!s || !im || !im.complete || !im.naturalWidth) return;
    const a = anchor || s.a;
    let dx = x, dy = y;
    if (a === 'bottom') { dx = x; dy = y - s.h; }
    if (rot) {
      ctx.save();
      ctx.translate(dx + s.w / 2, dy + s.h / 2);
      ctx.rotate(rot * Math.PI / 180);
      ctx.drawImage(im, -s.w / 2, -s.h / 2, s.w, s.h);
      ctx.restore();
    } else ctx.drawImage(im, dx, dy, s.w, s.h);
  }

  function drawGround(camX, camY) {
    const x0 = Math.max(0, Math.floor(camX / T)), x1 = Math.min(COLS - 1, Math.ceil((camX + VW) / T));
    const y0 = Math.max(0, Math.floor(camY / T)), y1 = Math.min(ROWS - 1, Math.ceil((camY + VH) / T));
    for (let y = y0; y <= y1; y++) {
      const row = GROUND[y] || '';
      for (let x = x0; x <= x1; x++) {
        const ch = row[x] || '.';
        const px = x * T - camX, py = y * T - camY;
        // 1) always lay a grass base - some ground sprites (brick step, flower bed)
        //    are not full-bleed, so without this their transparent part shows black
        const gh = ((x * 374761393 + y * 668265263) ^ 0x5bf03635) >>> 0;   // 真 2D 雜湊
        const gk = GRASS[gh % GRASS.length];
        const gs = window.SPR[gk], gi = img[gk];
        if (gs && gi.complete) {
          if ((gh >> 5) & 1) {                                    // 一半左右鏡像 → 唔會見格仔
            ctx.save(); ctx.translate(px + gs.w, py); ctx.scale(-1, 1);
            ctx.drawImage(gi, 0, 0, gs.w, gs.h); ctx.restore();
          } else ctx.drawImage(gi, px, py, gs.w, gs.h);
        }
        if (ch === '.') continue;
        const g = G[ch];
        if (!g) continue;
        const key = g[0], rot = g[1] || 0;
        const s = window.SPR[key], im = img[key];
        if (!s || !im.complete) continue;
        if (rot) {
          ctx.save(); ctx.translate(px + T / 2, py + T / 2); ctx.rotate(rot * Math.PI / 180);
          ctx.drawImage(im, -s.w / 2, -s.h / 2, s.w, s.h); ctx.restore();
        } else ctx.drawImage(im, px, py, s.w, s.h);
      }
    }
  }

  function pickPlayerKey() {
    if (P.moving) {
      const f = WALK[P.dir];
      return f[Math.floor(P.t / 0.115) % f.length];
    }
    if (P.dir === 'down' && (IDLE_T % 4.2) > 4.02) return 'pianow_r1c4';    // idle 小動作
    return IDLE[P.dir];
  }
  function drawPlayer(sx, sy) {
    const jump = CUT.on && CUT.phase === 'jump';
    const key = jump ? 'pianob_r3c1'                                  // 跳起
                     : (P.pose && window.SPR[P.pose] ? P.pose : pickPlayerKey());
    const s = window.SPR[key];
    const hop = jump ? -Math.sin(Math.min(1, Math.max(0, (CUT.t - 0.25) / 1.0)) * Math.PI) * 54 : 0;
    const bob = (!jump && P.moving && WALK[P.dir].length === 1) ? ((Math.floor(P.t / 0.115) % 2) ? -2 : 0) : 0;
    drawSprite(key, sx - s.w / 2, sy + bob + hop);
  }

  // 單屏幕室內：背景圖 ＋ NPC ＋ 玩家 ＋ 底部出口
  const ROOM_SCALE = 2.2;                    // 室內背景嘅傢俬比例大，角色要放大先夾
  function drawPlayerScaled(sx, sy, k) {
    const key = pickPlayerKey();
    const s = window.SPR[key], im = img[key];
    if (!s || !im.complete) return;
    const bob = P.moving && WALK[P.dir].length === 1 ? ((Math.floor(P.t / 0.115) % 2) ? -3 : 0) : 0;
    ctx.drawImage(im, sx - s.w * k / 2, sy + bob - s.h * k, s.w * k, s.h * k);
  }
  function drawRoom() {
    const bg = bgImg[W.room.bg];
    if (bg && bg.complete && bg.naturalWidth) ctx.drawImage(bg, 0, 0, VW, VH);
    else { ctx.fillStyle = '#F6E9F0'; ctx.fillRect(0, 0, VW, VH); }
    const n = W.room.npc, k = ROOM_SCALE;
    const list = [{ y: n.y, k: 'npc' }, { y: P.y, k: 'player' }];
    (W.room.extra || []).forEach((e, i) => list.push({ y: e.y, k: 'extra', e }));
    list.sort((a, b) => a.y - b.y);
    for (const it of list) {
      if (it.k === 'npc') {
        const s = window.SPR[n.sk], im = img[n.sk];
        if (s && im.complete) ctx.drawImage(im, n.x - s.w * k / 2, n.y - s.h * k, s.w * k, s.h * k);
        if (STATE.flags.quest_started && Math.sin(DLG.t * 7 + performance.now() / 260) > 0)
          sprite('fx_r2c1', n.x - 8, n.y - 118, 1.1);
      } else if (it.k === 'extra') {
        const s2 = window.SPR[it.e.sk], im2 = img[it.e.sk];
        if (s2 && im2.complete) ctx.drawImage(im2, it.e.x - s2.w * k / 2, it.e.y - s2.h * k, s2.w * k, s2.h * k);
      } else drawPlayerScaled(P.x, P.y, k);
    }
    // room name tag + exit hint
    ctx.font = FONT(20); ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(74,46,56,0.85)';
    ctx.fillText(W.room.name, VW / 2, 16);
    const pu = Math.sin(performance.now() / 300) * 4;
    ctx.fillStyle = 'rgba(255,243,248,0.40)';
    ctx.fillRect(VW / 2 - 120, VH - 22, 240, 22);
    ctx.font = FONT(17); ctx.fillStyle = 'rgba(74,46,56,0.85)';
    ctx.fillText('▼ 行到最底就出去', VW / 2, VH - 52 + pu);
    ctx.textAlign = 'left';
  }

  function drawScene(camX, camY) {
    drawGround(camX, camY);
    const x0 = Math.max(0, Math.floor(camX / T) - 1), x1 = Math.min(COLS - 1, Math.ceil((camX + VW) / T));
    const y0 = Math.max(0, Math.floor(camY / T) - 1), y1 = Math.min(ROWS - 1, Math.ceil((camY + VH) / T) + 1);
    const list = [];
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const cell = objByCell[y][x];
      if (!cell) continue;
      for (let i = 0; i < cell.length; i++) list.push({ y: y * T + T - i, kind: 'obj', x, y, o: cell[i] });
    }
    list.push({ y: P.y, kind: 'player' });
    list.sort((a, b) => a.y - b.y);
    for (const it of list) {
      if (it.kind === 'player') drawPlayer(P.x - camX, P.y - camY);
      else drawSprite(it.o.sk, it.x * T - camX, it.y * T - camY, it.o.rot);
    }
    if (NIGHT.a > 0.02) {
      const nb = bgImg['bg_night'];
      if (nb && nb.complete && nb.naturalWidth) {
        ctx.globalAlpha = NIGHT.a;
        ctx.drawImage(nb, 0, 0, VW, VH);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = 'rgba(48,32,44,' + Math.min(0.6, NIGHT.a).toFixed(3) + ')';
        ctx.fillRect(0, 0, VW, VH);
      }
      if (NIGHT.a < 0.75) for (const nn of NPC) {
        const bb = Math.sin(performance.now() / 480 + nn.x) * 5;
        sprite('fx_r2c2', nn.x * T + 28 - camX, nn.y * T - 30 + bb - camY, 0.85);
      }
    }
    if (debug) {
      ctx.globalAlpha = 0.35; ctx.fillStyle = '#ff2d6f';
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++)
        if (solid[y][x]) ctx.fillRect(x * T - camX, y * T - camY, T, T);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#00ff00';
      ctx.strokeRect(P.x - 11 - camX, P.y - 9 - camY, 22, 10);
    }
  }

  // ---------------------------------------------------------------- loop
  let debug = /debug=1/.test(location.search);
  addEventListener('keydown', e => { if (e.key === 'D') debug = !debug; });
  let last = 0, acc = 0;
  function frame(ts) {
    if (!last) last = ts;
    let dt = Math.min(0.05, (ts - last) / 1000);
    last = ts;
    acc += dt;
    while (acc >= 1 / 120) { step(1 / 120); acc -= 1 / 120; }
    const shx = SHAKE > 0 ? (Math.random() * 6 - 3) : 0;
    const shy = SHAKE > 0 ? (Math.random() * 6 - 3) : 0;
    const vwW = VW / ZOOM, vhW = VH / ZOOM;          // 世界單位下嘅可見範圍
    const camX = Math.max(0, Math.min(COLS * T - vwW, Math.round(P.x - vwW / 2) + shx));
    const camY = Math.max(0, Math.min(ROWS * T - vhW, Math.round(P.y - vhW / 2) + shy));
    CAM.x = camX; CAM.y = camY;
    if (W.kind === 'room') drawRoom();
    else { ctx.save(); ctx.scale(ZOOM, ZOOM); drawScene(camX, camY); ctx.restore(); }
    if (TITLE.on) {
      drawTitle();
      drawTrans();
      requestAnimationFrame(frame);
      return;
    }
    drawQuest();
    drawGoalMark();
    // tamagotchi-style attention indicator
    if (STATE.flags.quest_started && STATE.items.length < 3 && !DLG.on && !MENU.open
        && Math.sin(DLG.t * 7 + performance.now() / 260) > 0) {
      sprite('fx_r2c1', VW - 66, 18, 1);
    }
    if (!DLG.on && !CUT.on && !TRANS.on) drawIconRow();
    if (MENU.open) drawMenu();
    drawCutin();
    drawConfirm();
    if (DLG.on) drawDialog();
    if (CREDITS.on) drawCredits();
    if (MERGE.on) drawMerge();
    drawPhoto();
    drawCast();
    drawCeleb();                                  // 煙花／彩帶蓋喺 credits 上面（喜慶）
    drawTrans();
    if (W.flash > 0) {                       // 入／出舖頭嘅白閃
      ctx.fillStyle = 'rgba(255,250,252,' + Math.min(0.9, W.flash * 2).toFixed(3) + ')';
      ctx.fillRect(0, 0, VW, VH);
      W.flash = Math.max(0, W.flash - 0.04);
    }
    requestAnimationFrame(frame);
  }

  function start() {
    const q = new URLSearchParams(location.search);
    if (q.get('x')) P.x = +q.get('x') * T + 24;
    if (q.get('y')) P.y = +q.get('y') * T + 46;
    const d = q.get('dir');
    if (d) { press(d, 1); }
    const n = +(q.get('frames') || 0);
    for (let i = 0; i < n; i++) step(1 / 60);     // deterministic replay for tests
    if (q.get('talk')) {
      if (q.get('flag')) { STATE.flags[q.get('flag')] = 1; }
      startScene(q.get('talk'));
      const adv = +(q.get('adv') || 0);
      for (let i = 0; i < adv; i++) advance();
      if (q.get('sel')) DLG.sel = +q.get('sel');
      DLG.n = DLG.chars.length; DLG.done = true;
    }
    if (q.get('items')) {
      STATE.flags.quest_started = 1;
      for (const it of q.get('items').split(',')) STATE.items.push(it);
    }
    if (q.get('menu')) {
      MENU.open = true; document.body.classList.add('in-menu');
      MENU.page = q.get('menu') === '1' ? null : q.get('menu');
      if (q.get('sel')) MENU.sel = +q.get('sel');
    }
    if (q.get('log')) for (const l of q.get('log').split('|')) addLog('兔仔朋友', l);
    if (q.get('started')) STATE.flags.started = 1;
    if (q.get('flags')) q.get('flags').split(',').forEach(f => { STATE.flags[f] = 1; });
    if (q.get('cut')) { CUT.on = true; CUT.phase = q.get('cut'); CUT.t = +(q.get('ct') || 0); NIGHT.a = +(q.get('night') || 0); }
    if (q.get('room')) enterRoom(q.get('room'));
    if (q.get('giftui')) openGiftUI('msg');
    if (q.get('guess')) openGiftUI('guess');
    if (q.get('merge')) { MERGE.on = true; MERGE.demo = 1; MERGE.t = parseFloat(q.get('merge')) || 5.0; }
    if (q.get('zoomtest')) transition(null, { zoom: { x: +(q.get('zx') || 14), y: +(q.get('zy') || 11), k: 1.95 },
      card: q.get('zoomtest'), color: '#FFF6FA', out: 0.1, hold: 30, inn: 0.1, thenAt: 'in' });
    if (q.get('logocard')) transition(null, { logo: true, sub: q.get('logocard'), card: null,
      color: '#1B1420', out: 0.08, hold: 30, inn: 0.1 });
    if (q.get('confirm')) { CONFIRM.on = true; }
    if (q.get('monkey')) { const ex0 = (W.room && W.room.extra || [])[0]; if (ex0) monkeyPop(ex0); }
    if (q.get('photo')) { PHOTO.on = true; PHOTO.t = 0.5; }
    if (q.get('cast')) { CAST.on = true; CAST.t = 6; CAST.a = 1; }
    if (q.get('credits')) { CREDITS.on = true; CREDITS.t = 0; CREDITS.a = 1; STATE.flags.act3_done = 1; }
    if (q.get('night')) { NIGHT.a = 1; if (q.get('night') === 'fade') NIGHT.a = 0.5; }
    if (q.get('celeb')) { CELEB.on = true; for (let i = 0; i < 6; i++) celebPuff();
      CELEB.parts.forEach((pp, i) => { pp.t = (i % 3) * 0.3; }); }
    if (q.get('card')) transition(null, { card: q.get('card'), sub: q.get('cardsub') || null, out: 0.3, hold: 30, inn: 0.3, color: q.get('cardcolor') || '#1B1420' });
    if (q.get('title') || q.get('tphase') || !STATE.flags.started) {
      P.x = 3 * T + 24; P.y = 13 * T + 46; startTitle();
      if (q.get('tphase')) {
        TITLE.phase = q.get('tphase');
        TITLE.t = +(q.get('tt') || 0);
        TITLE.line = TITLE.phase === 'text' ? (+(q.get('tline') || 0)) : 0;
        if (TITLE.phase === 'name') document.body.classList.add('in-title-name');
      }
    }
    if (q.get('title') || q.get('tphase') || !STATE.flags.started) {
      transition(null, { logo: true, card: null, sub: '2026 · 9 · 19', wait: true,
                         color: '#1B1420', out: 0.6, hold: 0.35, inn: 0.8 });
    } else {
      transition(null, { color: '#1B1420', out: 0.02, hold: 0.02, inn: 0.8 });
    }
    if (!document.body.dataset.noLoop) requestAnimationFrame(frame);
    window.__game = { P, solid, COLS, ROWS, T, trig };
    window.__dbg = { DLG, W, STATE, MENU, CONFIRM, BGM, OPT, bgmStart, bgmStop, ROOMS, startScene, enterRoom, exitRoom, advance, pressA, TITLE, doReset, goal, save };
  }
  window.__step = step;
  window.__press = press;
})();

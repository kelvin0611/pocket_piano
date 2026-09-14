# bday-game / game — 點開嚟玩 / 點部署

## 現況（v1.1 · 2026-09-14 完成全部劇情）
✅ 已做
- 24×30 格 Mary Land 村口、4 方向走動（鍵盤＋虛擬十字鍵）、碰撞、鏡頭跟隨
- **對話系統**：九宮格對白框、打字機效果（~45 字/秒）、兔仔頭像＋名牌、旁白／角色字色分開
- **3 選 1 選擇題**：十字鍵↑↓ 或直接點畫面揀，A／點畫面確認
- **兔仔 Act 1 對白**：觸發方式＝面向兔仔按 A，或者直接撞埋去（撞到有畫面震動）
- **Tamagotchi 式外殼 UI**：底部 icon 列（心願／道具／記錄／設定）、LCD 狀態面板、閃燈「!」attention、按掣 beep、自動存檔
- **Act 0**：開場字幕 → 蛋裂開孵出主角 → 命名（輸入＋START，存 localStorage）→ 9 月曆圈住 9/19
- **Act 2 三個關卡**：三間舖嘅室內場景（背景圖＋NPC＋走動＋出口）、熊師傅（芝士選擇題）、龍蝦師傅（夾最大隻龍蝦小遊戲，用唔同大細嘅龍蝦圖做選項）、綠貓 barista（甜度選擇題）；每關問同一句引導問題 → 拎到心願碎片
- **踏到舖頭門口嘅磚 = 入室內**（白閃轉場）；室內行落底部出口返村口
- **機殼外框**：蛋形粉紅機身＋深色屏幕邊＋鎖匙扣＋揚聲器窿＋POCKET PIANO 名牌（Tamagotchi 實體感）
- **Act 3 結局**：行到南面籬笆 → 跳籬笆（主角跳起動作＋hop 動畫）→ 全村天黑（NPC 出 Zzz）→ 夢境房（傻豬）→ 最後 3 選 1 → 生日會場（企鵝侍應）→ 拆禮物盒（大圖＋奶白圓牌底）→ 卡夾 → credits → 「妳想要咩禮物？」可打字 → **Send 畀傻豬 ♥（開 WhatsApp 自動填好）**
⏭ 未做：音效音樂（只有 beep）、正式出 link（GitHub Pages／Netlify）、手機實機測試

## 轉場系統（`transition()`）
所有換場都經同一個「淡出 → 中途做嘢 →（可選）章節卡 → 淡入」：
- 開機淡入（黑）｜入／出舖頭（奶白 0.35/0.28/0.45）
- 章節卡：`第一章・Mary Land`（奶白）／`第二章・數羊之夜`（黑）／`第三章・生日會`（黑）—— 字色會按底色自動轉深／淺
- Act 0 三個階段之間都係淡接（蛋→命名→日曆）
- 對白框每次開啟都會由下往上滑入（`DLG.anim`）
- credits 自己淡入
- 過場期間會加 `body.in-trans`，自動收埋十字鍵／A／B／icon 列／提示字

## 點跑
```bash
cd ~/.hermes/profiles/sweetg/workspace/bday-game/game
python3 -m http.server 8000      # 開 http://localhost:8000
```
`index.html` 直接雙擊（file://）都開得 —— `data.js` / `script.js` 都係普通 `<script>`，唔使 fetch。

## 操作（Tamagotchi 邏輯：3 掣分工）
| 掣 | 做咩 |
|---|---|
| 十字鍵 | 行路；選單裡面 ←→ 揀 icon、↑↓ 捲；對白選擇題 ↑↓ 揀 |
| **A** | 對話／確認／跳過打字機 |
| **B** | 開／閂選單（入咗頁面就係「返去」）＝ 原機 C 掣嘅取消職能 |
| 點畫面 | 對白推進；有選擇題就點嗰行 |
| 鍵盤 | 方向鍵／WASD、空白鍵＝A、Esc 唔用（之後可以綁 B） |
| 測試參數 | `?started=1` 跳過 Act 0；`?flags=a,b` 設旗標；`?room=` 入房；`?talk=<scene>&adv=N&sel=K`；`?cut=jump&ct=0.7` 過場；`?giftui=1`；`?menu=`；`?debug=1` |

### 底部 icon 列
`心願`（進度＋♥）｜`道具`（8 格收集）｜`記錄`（對話 log）｜`設定`（♪ 聲音開關／名／日數）

## 檔案
| 檔 | 內容 |
|---|---|
| `index.html` | 畫面 + CSS + 虛擬按鍵（540×960 邏輯解析度，自動縮放） |
| `game.js` | 引擎：地圖、碰撞、走動、鏡頭、y-sort 繪圖、**對話引擎、Tamagotchi 選單、beep** |
| `script.js` | **劇情／對白（改呢個就得，唔使碰引擎）** |
| `data.js` | **生成檔**：由 `../assets/manifest.json` 壓縮出嚟嘅 sprite 表 |
| `assets/` | 由 `build_game.py` 複製（令呢個 folder 可以獨立部署） |

改完素材：`cd .. && uv run --with pillow python3 build_game.py`

## 點加對白／場景（`script.js`）
```js
scenes: {
  my_scene: [
    { who:'rabbit', face:'happy', text:'{name} 你好！' },   // face: face / happy
    { choice:[ {text:'A',next:'a_scene'}, {text:'B',next:'b_scene'} ] },
    { flag:'some_flag' },            // 記低事件（會存檔）
    { item:'item_r1c1' },            // 收到道具 → HUD 心願碎片 +1
    { who:'narrator', text:'〔旁白〕' },   // 旁白冇頭像、字色淺啲
    { goto:'other_scene' },
    { end:true },
  ],
}
```
`speakers` 定義每個人嘅名同頭像（頭像由 build_assets 自動由 sprite 裁頭出嚟：`<npc>_idle` / `<npc>_happy`）。

## 地圖點改（`game.js`）
- 地面：`GROUND` 每個字一格 —— `.`草地 `f`花圃 `h`橫路 `v`直路 `x`十字 `4`-`7`轉角（通 B+R／L+B／T+L／T+R）`s`石地 `b`門口磚
- 物件：`house(x,y,doorCol,{...})`、`tree(x,y)`、`props` 陣列（`[x, y, spriteKey, solid]`）
- 一樓可以疊多層（後 `put` 嘅畫喺上面）；物件要 `solid:1` 先擋得住玩家
- NPC：`NPC` 陣列（加 `scene` / `sceneDone` 就會有得傾）

## 部署（之後出 link）
push 上 GitHub → Settings → Pages（folder = `game/`）；手機開 link 就玩得。

## 已知
- 主角 Piano 素材係 Krea 出（44px 高）；NPC 係 Gemini 出再縮到 44px 對齊。
- `T1_r1c4` 係深灰綠色 tile，唔好放入 `GRASS`。
- 有啲地面 tile 唔係 full-bleed → 畫地面一定要先鋪一層草地底，否則會見黑格。
- headless 驗證：`?x=&y=&dir=&frames=`（固定步數重播）、`?talk=<scene>&adv=N&sel=K`、`?menu=1|status|bag|log|set`、`?debug=1`

## v1.2 — 第二批素材入庫（2026-09-14）

### 新增素材
| 類別 | 內容 |
|---|---|
| 背景 ×6 | `bg_home`（屋企房間，Act 0 用）、`bg_night`（村口夜晚插畫）、`bg_cake`（三層蛋糕特寫）、`bg_buffet`（自助餐長枱）、`bg_party2`（派對枱）、`bg_credits`（星空＋蛋糕剪影，中間留白放字） |
| 招牌 8 | `SG_r1c1`～`r2c4`：意粉／龍蝦／咖啡／心＋屋招牌、簷篷、燈籠、黑板、旗串 |
| 大圖 8 | `PR_r1c1`～`r2c4`：三層蛋糕、大禮物盒、卡夾、花束、蠟燭、拉炮、氣球、卡邦尼 |
| 特效 8 | `FX2_r1c1`～`r2c4`：煙花 ×2、彩帶 ×2、心心 ×2、閃／星 ×2 |
| 主角動作 16 | `pianob_r1c1`～`r4c4`（拎卡夾／拆禮物／吹蠟燭／拍手／戴生日帽…） |
| 傻豬動作 16 | `pigb_r1c1`～`r4c4`（戴生日帽版本）＋ 6 個新頭像 `pigb_face_*`／`pianob_face_*` |
| Logo | `logo.png`（POCKET PIANO 泡泡字，189×96） |

重建指令：`uv run --with pillow --with numpy python3 build_assets2.py`（會併入現有 manifest，唔會覆蓋第一批）

### 新系統
- **CUTIN 大圖插片**：`{cutin:'bg_cake'}` → 全屏背景插片，畫喺對白框**下面**（自動淡入淡出，預設 2.4 秒）
- **CELEB 慶祝特效**：`{celebrate:true}` → 隨機灑煙花／彩帶（`drawCeleb()` 畫喺 credits 上面）
- **POSE 主角動作**：`{pose:'pianob_r1c3'}` → 主角換格（吹蠟燭／拎卡夾…），`{pose:null}` 還原
- **轉場 Logo 卡**：`transition(null,{logo:true, sub:'2026 · 9 · 19'})`
- **夜晚 cross-fade**：`NIGHT.a` 0→1 直接淡入 `bg_night` 插畫（唔再只係壓暗）；入夢境／會場自動 `NIGHT.a=0`

### 新增測試參數
`?notrans=1`（跳過所有轉場）、`?logocard=<副題>`、`?credits=1`、`?celeb=1`、`?night=1`（或 `night=fade`）

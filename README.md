# 🎂 Pocket Piano — 傻肥嘅生日 · Mary Land

一個**手機直向、16-bit pixel art 劇情小遊戲**，靈感嚟自 Tamagotchi 手提機：
蛋形機身、LCD 螢幕、十字鍵＋A／B 掣、beep 音效、自動存檔。

> A vertical pixel-art story game (single HTML + Canvas 2D, no framework, no build step).
> 生日禮物：9 月 19 日。

---

## 玩法 / How to play
1. **最簡單**：雙擊 `index.html`（用 Chrome／Safari 開，file:// 直接行得）
2. **或者**開個本機 server（手機同一個 Wi-Fi 都玩得）：
   ```bash
   cd Pocket-Piano
   python3 -m http.server 8099
   # 手機開 http://<你電腦 IP>:8099/
   ```
3. **操作**：十字鍵行路｜**A** 傾偈／確認｜**B** 開選單（心願／道具／記錄／設定／去村口）

---

## 上 GitHub Pages（免費出 link）
1. GitHub 開一個新 repo（例如 `pocket-piano`）
2. 將呢個 folder 入面**所有檔案**上傳（或者用 GitHub Desktop 直接 drag）
3. Repo → **Settings → Pages** → Source 揀 `Deploy from a branch`，Branch 揀 `main` + `/ (root)` → Save
4. 等 1 分鐘 → 條 link 會係 `https://<你 username>.github.io/pocket-piano/`

> ⚠️ 呢個世界任何人有 link 就開得。唔想公開就開 repo 時揀 **Private**（Private repo 嘅 Pages 要 GitHub Pro 先得；想免費又唔公開，可以改用 Netlify 嘅 password 功能）。
> ⚠️ `index.html` 一定要喺**根目錄**，唔可以放入 subfolder，否則 Pages 開唔到。

---

## 檔案結構
```
index.html     機殼外框（蛋形機身、貼紙、十字鍵、A／B 掣）＋ 螢幕縮放
game.js        遊戲引擎：地圖、走動、碰撞、鏡頭、對話、選單、轉場、BGM、音效
script.js      ★ 全部劇情對白（想改字改呢個就得，唔使掂引擎）
data.js        素材索引（自動生成，唔好手改）
assets/        圖：chars/ 角色、tiles/ 地圖、bg/ 背景、portraits/ 對話頭像、ui/ 介面
docs/          故事大綱、Tamagotchi 設計參考、出圖 prompt、開發筆記
source-images/ 出圖原檔（AI 生成素材表同背景，40 張，附對照表 README）
```

## 技術
- 純 **HTML + Canvas 2D**，零依賴、零 build step（唔使 npm）
- 素材：Gemini 生成 → 沿 cyan `#00FFFF` 分隔帶切格 → 去背（含淡青殘留清除）→ 量化到統一 **40 色調色板**
- 音樂／音效：WebAudio 即場合成（chiptune BGM＋角色「外星話」音效），冇音檔
- 存檔：localStorage（`bday_save_v1`），設定 → 「↺ 重新開始」可重玩

## 操作細節
| 掣 | 功能 |
|---|---|
| 十字鍵 | 行路（撞 NPC／籬笆／舖頭門口會有震動回饋） |
| A | 傾偈、確認、跳過字幕 |
| B | 開／閂選單（↑↓ 揀，A 入） |
| 設定內 | 音效開關、背景音樂開關、重新開始 |

# 🎂 第三批出圖 Prompt（Act 3 / 精美升級）

> 每段都係**完整、可以獨立 copy 貼落出圖工具**（共用風格句已經 inline）。
> ⚠️ 呢次請揀 **PNG**（唔要 JPEG）—— 上次 JPEG 令去背邊緣有雜訊、九宮格有色差。
> 出完**唔使改名、唔使切圖**，全部丟落同一個 folder，話我一聲，我用 `build_assets.py` 自動切格／去背／統一調色板。

**三條鐵規**
1. **Sprite／道具／特效**：`FLAT SOLID PURE CYAN #00FFFF` 填滿每一格（唔好寫 magenta，會出返粉紅）
2. **背景圖**：直向 9:16，**下面三分一留簡單**（要放角色行路）；**唔要** cyan 底
3. **一張圖一個角色／一組物件**，4 欄 × 4 行＝16 格 或 4 欄 × 2 行＝8 格

**共用調色板（貼落每條 prompt）**
`pink #FBCFD6, deeper pink #E39AB4, cream #FFF3F8, dark outline #4A2E38, coral #E8705F, mint #A8E6CF, sky #CFE9FF, yellow #FFD44D`

---

## 🖼 背景圖（9:16 直向）

### BG-A／生日會場・蛋糕近景（結局用）
```
Pixel art background illustration, VERTICAL 9:16 phone format, 16-bit handheld RPG style. Chunky pixels, hard pixel edges, no anti-aliasing, no gradients, flat colours only.
PALETTE: pink #FBCFD6, deeper pink #E39AB4, cream #FFF3F8, dark outline #4A2E38, coral #E8705F, mint #A8E6CF, sky #CFE9FF, yellow #FFD44D.
Close-up of a big pink three-tier birthday cake with lit candles, cream frosting swirls, tiny pink flowers and strawberries on top, warm string lights and pink bunting behind, a few wrapped gift boxes at the sides, soft pink evening light. Keep the lower third simple and uncluttered (plain tablecloth) so game characters can walk over it.
No characters, no text, no letters, no numbers, no watermark.
```

### BG-B／生日會場・自助餐長枱（結局用）
```
Pixel art background illustration, VERTICAL 9:16 phone format, 16-bit handheld RPG style. Chunky pixels, hard pixel edges, no anti-aliasing, no gradients, flat colours only.
PALETTE: pink #FBCFD6, deeper pink #E39AB4, cream #FFF3F8, dark outline #4A2E38, coral #E8705F, mint #A8E6CF, sky #CFE9FF, yellow #FFD44D.
A long buffet table at a pink birthday party: plates of pink pastries, a bowl of creamy pasta, a plate of cheese-baked lobster, tall glasses of green matcha latte, a chocolate fountain, fruit and tiny flags on sticks, pink tablecloth with lace edge, balloons and bunting above, a pink night sky with stars. Keep the lower third simple so game characters can walk over it.
No characters, no text, no letters, no numbers, no watermark.
```

### BG-C／Credits 底圖（要留白放字）
```
Pixel art background illustration, VERTICAL 9:16 phone format, 16-bit handheld RPG style. Chunky pixels, hard pixel edges, no anti-aliasing, flat colours only.
PALETTE: dark plum #4A2E38, deep pink #C4708F, pink #FBCFD6, cream #FFF3F8, yellow #FFD44D, sky #CFE9FF.
A dreamy night sky with big soft stars, a crescent moon, fluffy pink clouds and floating sparkles; at the very bottom edge a small silhouette of a birthday cake with candles and a few gift boxes. The MIDDLE 60% of the image must stay almost empty and simple (just plain night sky) so text can be placed on it later.
No characters, no text, no letters, no numbers, no watermark.
```

### BG-D／村口・夜晚版（Act 3 天黑用，代替我而家嘅「壓暗」）
```
Pixel art background illustration, VERTICAL 9:16 phone format, top-down 16-bit handheld RPG village, seen from directly above. Chunky pixels, hard pixel edges, no anti-aliasing, flat colours only.
PALETTE: dark plum #4A2E38, deep pink #C4708F, pink #FBCFD6, cream #FFF3F8, mint #A8E6CF, deep green #6FBFA0, yellow #FFD44D, sky #CFE9FF.
A cute pastel village at NIGHT: a two-lane pink dirt crossroad, pink cottages with warm yellow lit windows, glowing street lamps, a small stone plaza with a fountain, pink pond, flower beds, trees and hedges, pink night sky, stars and a crescent moon at the top. Cosy, quiet, magical.
No characters, no text, no letters, no numbers, no watermark.
```

### BG-E／屋企房間（Act 0 開場用）
```
Pixel art background illustration, VERTICAL 9:16 phone format, 16-bit handheld RPG style interior view. Chunky pixels, hard pixel edges, no anti-aliasing, flat colours only.
PALETTE: pink #FBCFD6, deeper pink #E39AB4, cream #FFF3F8, wood brown #C89A7A, dark outline #4A2E38, sky #CFE9FF, yellow #FFD44D.
A cosy small cottage bedroom: a wooden bed with a pink quilt, a round rug, a small wooden shelf with plush toys, a toy piano keyboard on the floor, a wooden window showing pink hills outside, warm soft light coming in, a little vase of pink flowers. Keep the lower third simple (wooden floor) so game characters can walk over it.
No characters, no text, no letters, no numbers, no watermark.
```

---

## 🎁 大圖道具（4 欄 × 2 行 = 8 格；cyan 底）
> 用嚟做結局嘅「大圖」——而家我用 32px icon 放大，會有鋸齒，所以要專門出一次。
```
Pixel art RPG item prop sheet, EXACTLY 4 columns x 2 rows = 8 equal square cells, separated only by a very thin cyan gap line.
Pixel art, chunky pixels, hard pixel edges, no anti-aliasing, no gradients, flat colours only.
PALETTE: pink #FBCFD6, deeper pink #E39AB4, cream #FFF3F8, dark outline #4A2E38, coral #E8705F, mint #A8E6CF, sky #CFE9FF, yellow #FFD44D.
CELL 1: a three-tier pink birthday cake with candles. CELL 2: a big pink wrapped gift box with a cream ribbon bow. CELL 3: a small pink card holder / card case with a tiny heart. CELL 4: a bouquet of three pink flowers. CELL 5: a lit candle. CELL 6: a party popper with confetti. CELL 7: a single pink balloon on a string. CELL 8: a plate of creamy carbonara spaghetti.
Each item centred in its own cell, never touching the cell edges.
FLAT SOLID PURE CYAN #00FFFF background filling every cell completely, edge to edge (definitely NOT pink and NOT white). No text, no letters, no numbers, no labels, no watermark, no border.
```

---

## ✨ 特效（4 欄 × 2 行 = 8 格；cyan 底）
```
Pixel art RPG effect icon sheet, EXACTLY 4 columns x 2 rows = 8 equal square cells, separated only by a very thin cyan gap line.
Pixel art, chunky pixels, hard pixel edges, no anti-aliasing, no gradients, flat colours only.
PALETTE: pink #FBCFD6, deeper pink #E39AB4, cream #FFF3F8, dark outline #4A2E38, coral #E8705F, yellow #FFD44D, sky #CFE9FF.
CELL 1: a pink firework burst. CELL 2: a coral firework burst. CELL 3: a burst of confetti and ribbons. CELL 4: a small confetti puff. CELL 5: two pink hearts rising. CELL 6: a single big pink heart. CELL 7: a shining four-point sparkle. CELL 8: a cluster of tiny stars.
Each icon centred in its own cell, never touching the cell edges.
FLAT SOLID PURE CYAN #00FFFF background filling every cell completely, edge to edge (definitely NOT pink and NOT white). No text, no letters, no numbers, no labels, no watermark, no border.
```

---

## 🏪 舖頭招牌（4 欄 × 2 行 = 8 格；cyan 底；**唔要文字**）
```
Pixel art shop sign sheet, EXACTLY 4 columns x 2 rows = 8 equal square cells, separated only by a very thin cyan gap line.
Pixel art, chunky pixels, hard pixel edges, no anti-aliasing, no gradients, flat colours only.
PALETTE: pink #FBCFD6, deeper pink #E39AB4, cream #FFF3F8, dark outline #4A2E38, wood brown #C89A7A, coral #E8705F, mint #A8E6CF, yellow #FFD44D.
CELL 1: a hanging wooden signboard with a bowl of spaghetti. CELL 2: a hanging wooden signboard with a red lobster. CELL 3: a hanging wooden signboard with a coffee cup. CELL 4: a hanging wooden signboard with a heart and a small house. CELL 5: a pink and cream striped shop awning. CELL 6: a pink lantern. CELL 7: a small pink chalkboard menu. CELL 8: a bunch of small pink flags on a string.
No text, no letters, no numbers anywhere (symbols and pictures only). Each object centred in its own cell.
FLAT SOLID PURE CYAN #00FFFF background filling every cell completely, edge to edge (definitely NOT pink and NOT white). No watermark, no border.
```

---

## 🐷 傻豬（男朋友）動作補充（4 欄 × 4 行 = 16 格；cyan 底）
```
Pixel art character sprite sheet, EXACTLY 4 columns x 4 rows = 16 equal square cells, separated only by a very thin cyan gap line.
Pixel art for a top-down 16-bit handheld RPG. Chunky pixels, hard pixel edges, no anti-aliasing, no gradients, flat colours only.
PALETTE: pink #FBCFD6, deeper pink #E39AB4, cream #FFF3F8, dark outline #4A2E38, light blue #A9C9EC, yellow #FFD44D, mint #A8E6CF, sky #CFE9FF.
CHARACTER: a cute chibi pink pig boy mascot. Chubby round pink body, a big round pink snout with two round nostrils, two tiny black dot eyes, small round dark-rimmed glasses, a deep-plum hoodie, short pink arms and feet, a tiny curly tail, a small pink birthday hat on his head.
Same character in all 16 cells, identical size and colours, centred, never touching the cell edges.
ROW 1: idle front, walking frame 1, walking frame 2, back view.
ROW 2: walking left, walking right, waving one arm, holding up a gift box.
ROW 3: holding a bouquet of pink flowers, clapping both hands, eating a slice of cake, sleeping with eyes closed.
ROW 4: sitting on the floor, pointing up at the sky, spreading arms wide for a hug, shyly hiding behind his own hands.
FLAT SOLID PURE CYAN #00FFFF background filling every cell completely, edge to edge (definitely NOT pink and NOT white). No text, no letters, no numbers, no labels, no watermark, no margin, no panel, no border.
```

---

## 🐑 主角 Piano 動作補充（4 欄 × 4 行 = 16 格；cyan 底）
```
Pixel art character sprite sheet, EXACTLY 4 columns x 4 rows = 16 equal square cells, separated only by a very thin cyan gap line.
Pixel art for a top-down 16-bit handheld RPG. Chunky pixels, hard pixel edges, no anti-aliasing, no gradients, flat colours only.
PALETTE: pink #FBCFD6, deeper pink #E39AB4, cream #FFF3F8, dark outline #4A2E38, light blue #A9C9EC, yellow #FFD44D, mint #A8E6CF, sky #CFE9FF.
CHARACTER: a small cute fluffy pink sheep-like mascot girl. Her head is a big round fluffy PINK cloud of wool wider than her body, with a small light-blue bow on the upper left of her head, a large round white face with two tiny black dot eyes, soft pink blush cheeks, a tiny smiling mouth, and a small slim pink body with short arms and feet; a round wool tail at the back.
Same character in all 16 cells, identical size and colours, centred, never touching the cell edges.
ROW 1: holding a small pink card case, opening a gift box, blowing out a candle, clapping happily.
ROW 2: wearing a small pink birthday hat, twirling around, hugging a big gift box, playing a small piano keyboard.
ROW 3: jumping with joy (both arms up), eating a slice of cake, looking up at the stars, holding a single pink flower.
ROW 4: waving, back view, side view facing left, side view facing right.
FLAT SOLID PURE CYAN #00FFFF background filling every cell completely, edge to edge (definitely NOT pink and NOT white). No text, no letters, no numbers, no labels, no watermark, no margin, no panel, no border.
```

---

## 🪧（可選）Logo 字
```
Pixel art logo lettering on a plain background, chunky pixels, hard edges, flat colours only, retro 16-bit handheld style.
The words "POCKET PIANO" in rounded bubble pixel letters, pink #FBCFD6 with a deep plum #4A2E38 outline and a cream #FFF3F8 highlight, slightly arched, centred.
FLAT SOLID PURE CYAN #00FFFF background (definitely NOT pink and NOT white). No other text, no watermark.
```
> AI 出字有時會拼錯，出到滿意的才給我；唔靚就跳過（我照用系統字）。

---

## 📋 優先次序（想快見效就跟呢個次序出）
| 優先 | 圖 | 為咩 |
|---|---|---|
| 🔴 1 | BG-C credits 底圖、大圖道具、特效 | 你講「最後生日快樂需要更多生成」——credits 同結局大圖最緊要 |
| 🔴 2 | BG-D 村口夜晚版 | 而家天黑係用半透明壓暗，有專用夜晚圖會靚好多 |
| 🟠 3 | BG-A 蛋糕近景、BG-B 自助餐長枱 | 生日會場三個鏡頭 |
| 🟠 4 | 傻豬 / 主角動作補充 | 結局動作更豐富 |
| 🟡 5 | BG-E 屋企房間、舖頭招牌 | Act 0 開場、舖頭更有辨識度 |
| ⚪ 6 | Logo 字 | 有時間先 |

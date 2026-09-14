# 🐑 新 Piano 主角 — 補充動作 Prompt（行路／動作）

> 而家主角係新 Piano（粉紅爆炸頭＋藍蝴蝶結）。現有 16 格全部都揸住嘢／做緊動作，
> **冇「純正面企定」同「正面行路」格**，所以行路睇落唔夠自然。
> 出下面兩張就完美。
>
> **規則**：PNG（唔要 JPEG）、純 `#00FFFF` cyan 底、一張圖一組嘢、唔要文字。
> 出完丟同一個 folder 話我一聲，我自動切格＋去邊＋換入主角。

## 角色描述（每次都要一樣，否則會變咗第二隻）
```
CHARACTER: a small cute chibi sheep-like mascot girl. Her head is a big round FLUFFY PINK cloud of wool,
wider than her body, with a small light-blue bow on the upper-left of her head. She has a large round
cream-white face with two tiny black dot eyes, soft pink blush cheeks and a tiny smiling mouth.
Her body is slim and pale blue-white with short arms and short feet, and a small round wool tail at the back.
She wears nothing else (no clothes, no shoes).
```

---

## 🐑 PM-6／行路動作表（4×4＝16 格）**最重要**
```
Pixel art character sprite sheet, EXACTLY 4 columns x 4 rows = 16 equal square cells, separated only by a very thin cyan gap line.
Pixel art for a top-down 16-bit handheld RPG. Chunky pixels, hard pixel edges, no anti-aliasing, no gradients, flat colours only.
PALETTE: pink #FBCFD6, deeper pink #E39AB4, cream #FFF3F8, dark outline #4A2E38, coral #E8705F, sky #CFE9FF, yellow #FFD44D.
CHARACTER: a small cute chibi sheep-like mascot girl. Her head is a big round FLUFFY PINK cloud of wool, wider than her body, with a small light-blue bow on the upper-left of her head. She has a large round cream-white face with two tiny black dot eyes, soft pink blush cheeks and a tiny smiling mouth. Her body is slim and pale blue-white with short arms and short feet, and a small round wool tail at the back. She wears nothing else.
Same character in all 16 cells, identical size and colours, centred, NEVER touching the cell edges, and NOT holding any object.
ROW 1 (facing down / towards the viewer): standing still; walking frame 1 (left foot forward); walking frame 2 (right foot forward); walking frame 3 (arms swinging).
ROW 2 (facing up / away, back view): standing still; walking frame 1; walking frame 2; walking frame 3.
ROW 3 (facing LEFT in side view): standing still; walking frame 1; walking frame 2; and one happy hop.
ROW 4 (facing RIGHT in side view): standing still; walking frame 1; walking frame 2; and one happy hop.
FLAT SOLID PURE CYAN #00FFFF background filling every cell completely, edge to edge (definitely NOT pink and NOT white). No text, no letters, no numbers, no labels, no watermark, no border.
```

## 🐑 PM-7／動作表（4×2＝8 格；想多啲互動動作就出）
```
Pixel art character sprite sheet, EXACTLY 4 columns x 2 rows = 8 equal square cells, separated only by a very thin cyan gap line.
Pixel art for a top-down 16-bit handheld RPG. Chunky pixels, hard pixel edges, no anti-aliasing, no gradients, flat colours only.
PALETTE: pink #FBCFD6, deeper pink #E39AB4, cream #FFF3F8, dark outline #4A2E38, coral #E8705F, sky #CFE9FF, yellow #FFD44D.
CHARACTER: the same small cute chibi sheep-like mascot girl (big round FLUFFY PINK wool head wider than her body, small light-blue bow on the upper-left of her head, large round cream-white face, two tiny black dot eyes, pink blush cheeks, slim pale blue-white body, short arms and feet, small round wool tail).
CELL 1: dancing with both arms up. CELL 2: clapping happily. CELL 3: sitting on the ground with legs crossed. CELL 4: sleeping while standing, eyes closed, a small Zzz.
CELL 5: eating a slice of cake. CELL 6: holding up a small pink gift box. CELL 7: blowing a candle with both hands near her mouth. CELL 8: giving a thumbs up with a wink.
Each pose centred in its own cell, never touching the cell edges.
FLAT SOLID PURE CYAN #00FFFF background filling every cell completely, edge to edge (definitely NOT pink and NOT white). No text, no letters, no numbers, no labels, no watermark, no border.
```

---

## 出完之後我會點用
| 格 | 用途 |
|---|---|
| PM-6 ROW 1 | 向下企定 ＋ 行路 ×3（最影響觀感） |
| PM-6 ROW 2 | 向上（背面）行路 ×3 |
| PM-6 ROW 3 / 4 | 左／右行路 ×3 |
| PM-7 | 結局／彩蛋／劇情插入動作（跳舞、拍手、睡、食蛋糕…） |

（如果覺得出 4×4 太逼，可以分兩張出：一張「行路 4×4」、一張「動作 4×2」。）

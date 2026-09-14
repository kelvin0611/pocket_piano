# 🏠 四間舖外觀 — 出圖 Prompt

> 用喺村口：每間屋而家係程式砌嘅簡單外牆（`assets/tiles/house_*.png`，192×144）。
> 出好呢四張就會換走佢哋，屋會變成一張完整插畫，唔再一格格。

## 規則（四張都一樣）
- **每間一張**，**橫向 4:3**（建議 1024×768），正面平視（front view），**唔要透視、唔要側面**。
- 屋要**填滿成張圖**：左右貼邊、屋頂頂住上邊、牆腳貼住下邊，**唔好畫地面／草／路**。
- **背景用洋紅 `#FF00FF`**（唔好用 cyan！Piano 個淺藍蝴蝶結就係俾 cyan 去背食咗）。
- **門要喺左邊第二格**：將闊度分 4 等份，門喺第 2 份（左起 25%–50%），門底貼住圖底。遊戲靠呢個位入舖。
- 唔要任何文字、字母、數字、水印。
- 出完放入 `source-images/05-舖頭外觀/`，話我知就得，我會去背、縮到 192×144、駁入遊戲。

## 共用開頭（每個 prompt 前面都要有）
```
Pixel art, 16-bit handheld RPG style, chunky pixels, hard pixel edges, no anti-aliasing, no gradients, flat colours only. Drawn on a 64×48 pixel grid, landscape 4:3.
PALETTE: pink #FBCFD6, deeper pink #E39AB4, cream #FFF3F8, dark outline #4A2E38, coral #E8705F, mint #A8E6CF, deep green #6FBFA0, wood brown #C89A7A, sky #CFE9FF, yellow #FFD44D.
A single cute small-town shop building seen perfectly FRONT-ON (flat elevation, no perspective, no side walls visible). The building fills the whole image edge to edge: roof touching the top edge, wall base touching the bottom edge. NO ground, NO grass, NO road, NO sky.
Background: solid flat magenta #FF00FF only.
The entrance door is in the SECOND quarter from the left (between 25% and 50% of the width), its bottom touching the bottom edge.
Thick 2-pixel dark outline #4A2E38 around the whole building. No text, no letters, no numbers, no watermark.
```

## ① 屋企（Piano 屋企）→ `house_home`
```
[共用開頭]
A cosy pink cottage: soft pink shingled gable roof #E39AB4 with a small chimney, cream-pink walls #FBCFD6 with light wooden trim, a round-top wooden door with a heart-shaped window in it, one square window with a white frame and a flower box of small pink and cream flowers on the right half, a small wooden hanging sign with a heart and a tiny house icon (icons only, no text), a pink paper lantern hanging by the door. Warm, homely, sweet.
```

## ② 海鮮餐廳（龍蝦師傅）→ `house_seafood`
```
[共用開頭]
A seaside seafood restaurant: coral-red tiled roof #E8705F, cream walls with a light blue-and-white wave pattern band along the bottom, a wooden door with a round porthole window, a coral-and-cream striped awning above the door, a big window on the right half showing a small fish tank with a red lobster inside, a wooden hanging sign shaped like a lobster (icon only, no text), a small life ring and a coil of rope as decoration. Cheerful, fresh, seaside.
```

## ③ 意粉店（熊師傅）→ `house_pasta`
```
[共用開頭]
A little Italian pasta trattoria: warm terracotta-brown tiled roof #C89A7A, cream walls #FFF3F8 with exposed light brick patches, a green wooden door, a red-and-white checked striped awning above the door, a window on the right half with a small potted basil plant and a plate of spaghetti on the sill, a hanging wooden sign with a fork-and-noodles icon (icon only, no text), a small string of warm yellow lights under the roof edge. Cosy, homely, delicious.
```

## ④ Cafe（綠貓 barista）→ `house_cafe`
```
[共用開頭]
A small cafe: mint-green roof #A8E6CF with deep green trim #6FBFA0, cream walls, a wooden door with a small glass pane, a mint-and-cream striped awning above the door, a big window on the right half showing a coffee machine and cups on a shelf, hanging green plants in pots, a small chalkboard stand with a coffee-cup doodle (no text) and a hanging sign with a matcha latte cup icon (icon only, no text). Calm, fresh, relaxing.
```

> 想統一啲：四張一齊出，或者出完第一張之後叫佢「same style as the previous image」再出其餘三張。

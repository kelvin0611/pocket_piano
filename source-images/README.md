# 🖼 原圖（Source Images）

呢個 folder 係**所有出圖原檔**（AI 生成嘅 4×4／4×2 素材表同背景）。
遊戲實際用嘅係切好、去背、量化好嘅 `../assets/`，**呢度嘅圖唔會影響遊戲運作**，純粹存檔＋將來想重切／改色都有得用。

---

## 📁 01-第一批（25 張，本身已經有中文名）
| 檔名 | 用途 |
|---|---|
| `T1／Mary Land 草地＋泥路＋石路.jpeg`／`…2.jpeg` | 地圖主 tile（草地／泥路／石路） |
| `T2／樹、籬笆、水池.jpeg` | 樹／籬笆／水池 |
| `T3／屋同店（外觀.jpeg` | 屋同店外觀 |
| `T4／街頭裝飾.jpeg` | 街燈／路牌／旗仔 |
| `T5／室內地板＋牆.jpeg` | 室內地板同牆 |
| `T6／室內傢俬同道具.jpeg` | 枱／椅／層架 |
| `T7／生日會場佈置.jpeg` | 生日會場佈置 |
| `角色 1白色兔仔朋友.jpeg` 等 7 張 | 7 個 NPC（兔仔／傻豬／熊／龍蝦／綠貓／企鵝／羊婆婆） |
| `UI1 : 對話框.jpeg` | 對話框九宮格 |
| `UI2／手機十字鍵.jpeg` | 舊十字鍵（已換搖桿） |
| `UI3／道具 icon（4×2 = 8 個）.jpeg` | 道具 icon |
| `UI4／特效 icon.jpeg` | 特效 icon |
| `BG3／海鮮餐廳.jpeg`、`BG4／Cafe.jpeg`、`BG5／數羊之夜.jpeg`、`BG6／生日會場.jpeg`、`D2. 意粉店內（卡邦尼關卡）.jpeg`、`標題頁面.jpeg` | 場景背景 |

## 📁 02-第二批（12 張，**已改名**）
| 原檔名（Gemini 亂碼） | 新檔名 | 遊戲用途 |
|---|---|---|
| `…2lb1me…jpeg` | `01_招牌-店鋪招牌表.jpeg` | 三間舖頭招牌（`SG`） |
| `…daa0ot…jpeg` | `02_道具-大圖道具表.jpeg` | 場上大圖道具（`PR`） |
| `…za9r7u…jpeg` | `03_特效-煙花彩帶心心.jpeg` | 煙花／彩帶／心心特效（`FX2`） |
| `…2w63jz…jpeg` | `04_主角Piano-動作表.jpeg` | 主角動作 16 格（`pianob`，後被 15 取代行路） |
| `…lj4v32…jpeg` | `05_傻豬-動作表.jpeg` | 傻豬動作 16 格（`pigb`） |
| `…5wby9m…jpeg` | `06_背景-蛋糕.jpeg` | `bg_cake` |
| `…cyr8le…jpeg` | `07_背景-屋企.jpeg` | `bg_home` |
| `…k2y44e…jpeg` | `08_背景-夜晚.jpeg` | `bg_night` |
| `…uvy0g9…jpeg` | `09_背景-自助餐.jpeg` | `bg_buffet` |
| `…zcrt0t…jpeg` | `10_背景-派對枱.jpeg` | `bg_party2` |
| `…dve69b…jpeg` | `11_背景-結局星空.jpeg` | `bg_credits`（結局／封面底） |
| `…drdhj0…jpeg` | `12_LOGO.jpeg` | `logo`（POCKET PIANO ） |

## 📁 03-獼猴（2 張）
| 原檔名 | 新檔名 | 用途 |
|---|---|---|
| `…ggdyd1…jpeg` | `13_獼猴-動作表.jpeg` | 獼猴 4×4（生日會彩蛋） |
| `…lcgh6x…jpeg` | `14_獼猴-大頭.jpeg` | 對話頭像 + 機殼貼紙 |

## 📁 04-新主角（1 張）
| 原檔名 | 新檔名 | 用途 |
|---|---|---|
| `…a6emei…jpeg` | `15_主角Piano-行路表.jpeg` | **現任主角** 16 格（4 方向 × 企定+行路） |

---

## 對應 build script
| Script | 用邊批原圖 |
|---|---|
| `build_assets.py` | 01-第一批 |
| `build_assets2.py` | 02-第二批（01–12） |
| `build_assets3.py` | 03-獼猴（13–14） |
| `build_assets4.py` | 04 嘅 `04_主角Piano-動作表` |
| `build_assets5.py` | 04-新主角（15） |

> 想換圖／重切：出完新圖放入 `~/Downloads/` → 話我 → 我寫新一支 `build_assetsN.py` 併入（**唔會重跑舊 script**，避免蓋走已驗收嘅素材）。

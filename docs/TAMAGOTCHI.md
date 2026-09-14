# 參考 Tamagotchi 嘅操作邏輯同設計概念

> 呢份係「呢個遊戲邊啲設計係抄 Tamagotchi、邊啲係故意唔抄」嘅對照表。
> 事實來源：Tamagotchi Fandom（1996 Pet）、Thaao's P1 Care Guide、官方 Connection 說明書、日本 HOUSE LA / Design Vault 嘅設計分析（見文末連結）。

## 一、原機嘅操作邏輯（照抄嘅基礎）
| 原機設計 | 內容 |
|---|---|
| 3 個掣 A／B／C | **A**＝移動 icon 選擇（由左上開始，左→右，再落第二行）／**B**＝確認揀到嘅 icon（冇揀任何 icon 就跳去時鐘）／**C**＝清掉選擇、閂咗而家個 menu |
| Icon 列＝功能入口 | 上排照護 icon（食物／玩／燈／藥），下排狀態（開心・清潔・健康・**聲音開關**）；整個 device 就只有呢條 icon 列做導航 |
| Attention icon | **唔可以揀**，自己會著燈（肚餓／唔開心見底、要熄燈瞓覺、要 discipline）；15 分鐘內唔理＝一次 care mistake。便便同病**唔會**觸發 |
| 計量用 hearts | Hungry 0–4 個心、Happy 0–4 個心；食一餐＝+1 肚餓心＋體重 +1，零食＝+1 開心心＋體重 +2 |
| Status 畫面 | 用 A／B 換頁、C 出；心形填色＝分數 |
| 聲音開關 | 冇揀 icon 嘅時候，**A＋C 同時按** 開／閂 |
| 重開 | A＋C 長按到出現新蛋 |
| 冇暫停 | 一拉電池片就開始跑，always-on；唔係「開檔／存檔」嘅遊戲 |

## 二、設計概念（為何佢會上癮）
- **Maximum expression from minimum pixels**：32×16 像素單色 LCD，只靠幾個 icon 同粗糙 sprite 表達肚餓／病／眼瞓。
- **Icon 列＝daily dashboard**：把「照顧」拆成 8 個一眼睇得明嘅 icon，學識一次就永遠記得。
- **Beep 製造急迫感**：壓電蜂鳴器用頻率令你即刻想睇一睇。
- **Kawaii 減低戒心**：可愛外表包住一個「責任系統」。
- **成長＝照顧質素嘅結果**：定時回應（唔好等見底）＝好照顧 → 進化靚。規律一亂就變差。
- **「照顧嘅勞動先令人愛上」**：設計者講明 pets 只有 20–30% 時間可愛，其餘都係麻煩——正因為付出，先會珍惜。
- **物理感**：蛋形外殼、3 粒掣三角形排列、鎖匙扣當飾物。

## 三、我哋呢個遊戲點對應
| 原機 | 我哋（`game/`） | 狀態 |
|---|---|---|
| A／B／C 3 掣 | A＝確認／對話，B＝開閂選單。手機只有兩粒圓掣，所以 C 嘅「取消／返回」併入 B | ✅ 已做 |
| Icon 列導航 | 畫面底部 icon 列：**心願／道具／記錄／設定**，←→ 揀、A 入、B 出 | ✅ 已做 |
| Attention icon 自己著燈 | 右上角閃「!」＝有心願碎片未拎（唔可以「揀」，只會自己閃） | ✅ 已做 |
| Hearts 計量 | 心願碎片用 ♥／♡；未拎嘅行寫「未拎」 | ✅ 已做 |
| Status 畫面 | 「心願」頁＝3 行進度＋♥；「道具袋」＝8 格 icon；「記錄」＝對話 log（↑↓ 捲） | ✅ 已做 |
| 聲音開關 | 設定頁「♪ 聲音：開／閂」；所有掣同對白都有 blip（揀 icon 880Hz、確認 1318Hz、取消 523Hz、對白 784Hz） | ✅ 已做（未做：實機 A＋C 手勢） |
| 單色 LCD 美學 | 選單／狀態頁＝奶白 LCD 面板＋粉紅點陣格＋粗 plum 邊；對白框用遊戲素材嘅九宮格 | ✅ 已做 |
| 32×16 極限像素 | 48px tile、44px 角色、統一 40 色調色板、`image-rendering: pixelated` | ✅ 已做 |
| 冇得暫停 | **故意唔跟**：自動存 localStorage（佢玩到一半熄機／俾人叫走都唔會唔見進度） | ✅ 已做 |
| 成長＝照顧質素 | **變奏**：Act 2 三個關卡嘅選擇、Act 3 最後 3 選 1，決定最後一句對白 | ⏳ 待做 |
| 蛋／實體感 | 開場「蛋裂開」動畫（Act 0）＋ 可選：手機機殼外框＋機身顏色 | ⏳ 待做 |
| 日數／世代 | 設定頁「第 1 日」；之後可以變「陪咗妳第 N 日」 | ⏳ 部分 |
| 15 分鐘無回應＝care mistake | **故意唔跟**：唔想俾時間壓力（今次係生日禮物，唔係養成遊戲） | 🚫 唔做 |

## 四、跟落可以做（依 Tamagotchi 邏輯排序）
1. **Act 0 命名＋蛋裂開**：用「蛋」做轉場（原機嘅 hatching），命名畫面 = 原機開機設定時間嘅儀式感。
2. **A＋B 手勢**：例如長按 A＋B = 叫出狀態頁（對應原機 A＋C 開閂聲）。
3. **心跳式 idle**：主角無操作時自己眨眼／彈跳（已做眨眼）＋偶爾自己走去物件旁（原機「隨機事件」）。
4. **結局用 hearts 收尾**：3 個心願碎片集齊 → 全 ♥ 滿格音效 → 生日會。

## 參考
- Tamagotchi Fandom — *Tamagotchi (1996 Pet)*（設計、Feed／Discipline／Attention 機制）
- Thaao's Tamas — *Tamagotchi P1 Care Guide*（A／B／C 操作、icon 清單、聲音 A＋C）
- Tamagotchi 官方 — *Connection web manual*（Attention icon、A／B 操作、重開手勢）
- JapanHouse LA — *The Hatching of an Icon*（icon 視覺語言、kawaii＋極簡設計）
- The Design Vault — *Tamagotchi: When Pixels Became Pets*（32×16 螢幕、頂部照護 icon＋底部狀態列、蜂鳴器）

# Google Maps 遷移與啟用

2026-09-13。地图显示迁移已整合至实际开发项目，保留已有天气等功能。本次仅本地开发，未部署。

## 本次范围（2026-09-13 更新）

使用者已要求先完成 Google Maps 的地图显示切换，并在指定源项目本地预览；实际交通路线后续接入。用户已有金钥，将自行配置。当前开发目录：`/Users/team0ne_m/Code/japan_journey_site/kansai-cloudflare-source`。

地圖元件使用 Google Maps JavaScript API、Advanced Markers、InfoWindow 及 Polyline。保留行程编号、同地点多次造访、卡片与地图联动、日期和 Plan A/B 切换、游览范围/当天全程以及手机视图切换。

浏览器读取 `routes.json`，不调用 Routes API。当前数据为空，按用户最新要求以带箭头的虚线连接相邻地点，表示游览顺序；缺失或到期的真实路线不再显示其几何，改用明确标注的顺序示意。Google Routes API 的日本公共交通限制仍然存在，真实几何需另行接入并验证。

本机预览与金钥填写步骤见 [LOCAL-MAPS-PREVIEW.md](LOCAL-MAPS-PREVIEW.md)。已配置本地浏览器金钥，并在 Chrome 验证真实底图、标记交互、游览顺序连线与 BrowserSync 热重载；正式 Worker 环境仍需独立验收。

NAVITIME 是后续候选。其 API 市场版本不提供巴士等进阶功能，RapidAPI 条款也限制保存回传数据，不能假设免费500次即满足本项目完整路线和永久保存需求。另行核对直接签约功能、费用、覆盖和授权。

## Google Cloud 設定

1. 在 Google Cloud 選擇或建立專案，為正式使用連結計費帳戶，啟用 **Maps JavaScript API**。
2. 建立供瀏覽器使用的 API 金鑰。應用程式限制選 **Websites / HTTP referrers**；允許正式網站 `https://trip.team0ne.work`。建議開發使用另一把金鑰，只允許實際本機預覽的來源，例如 `http://localhost:8787`；使用其他埠或 127.0.0.1 時必須一併設定。
3. API 限制只允許 **Maps JavaScript API**。這把金鑰會傳給已登入的瀏覽器，限制來源和 API 才是它的主要保護；不要把伺服器 Routes 金鑰放入此欄。
4. 在 Map Management 建立 **JavaScript Map ID**，建議選 Vector，以啟用新版地點標記。需要調整背景風格時再綁定雲端樣式。
5. 在本機被 Git 忽略的 `.dev.vars` 設定 `GOOGLE_MAPS_BROWSER_KEY` 與 `GOOGLE_MAPS_MAP_ID`。值不要貼到聊天或提交到版本庫。保留原有登入設定。
6. 正式環境於確認上線時再設定這兩個名稱；金鑰可存為 Cloudflare secret。Map ID 不是密鑰，但本專案同樣支援環境設定。注意既有部署流程是否會覆蓋 Dashboard 普通變數，必要時以部署保留的 secret 形式存放設定。

帳戶計費、條款接受及正式發布尚未執行。純原型可另外評估官方 Maps Demo Key，但它不是正式上線金鑰，本草稿沒有使用 Demo Key。

官方文件：[Maps JavaScript API 啟用](https://developers.google.com/maps/documentation/javascript/get-api-key)、[Map ID](https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over)、[API 載入](https://developers.google.com/maps/documentation/javascript/load-maps-js-api)。

## 預存路線資料

`dist/routes.json` 格式為 `{ "version": 1, "segments": [...] }`。每個 segment 包含：

| 欄位 | 意義 |
|---|---|
| `day` | 1–7 |
| `plan` | `shared`、`A` 或 `B`；指定方案優先於 shared |
| `from` / `to` | `PLACES` 中的起終點 ID |
| `toStep` | 到達節點的固定 `commentId`；避免同一酒店的多次造訪混用路線 |
| `source` | `independent` 或 `google-routes` |
| `sourceNote` | 來源與使用依據，由我們自行記錄 |
| `parts` | 依序排列的子段；各有 `mode`、`label`、`path` |

`mode` 使用 `walk`、`rail`、`bus`、`shuttle`；`path` 是 `[緯度, 經度]` 陣列，並非 GeoJSON 的經度在前格式。`label` 是我們自行撰寫、核對的路線說明。各子段保留獨立幾何，不為了拼接而畫出不存在的道路。站口與步行接駁需要人工核對。

建置檢查資料格式、座標、來源、段落唯一性、節點先後及期限；瀏覽時再核對當天方案、起終點與有效期。缺失或過期的資料不绘制其实际几何，使用带方向箭头的虚线示意游览顺序，并明确说明不代表实际道路或交通线路。

## Google 路線保存期限

採用 Google Routes 資料時，`capturedAt` 與 `expiresAt` 必填（含時區的 ISO 時間），期限最多30天；到期時前端不再繪製，建置也會阻止發布過期幾何。這是期限防呆，不等於自動完成所有儲存刪除義務。

依目前適用非 EEA 帳戶的 Google 服務條款第19節，經緯度只能暫存最多連續30天，之後須刪除；不得搭配非 Google 底圖。此例外不代表可保存整份 API 回應、班次、票價等所有欄位。獨立撰寫的行程名稱、交通說明和時間預留與 Google 幾何分開管理。

因此先不要把 Google 衍生的實際路線提交進 Git 或長期備份。正式導入前，需要完成暫存檔、部署資產及備份的到期移除流程；若網站要長期保存旅行紀錄，可另用有長期保存權限、獨立取得的幾何資料，仍畫在 Google 底圖上。轉成 JSON 或重新命名為 independent 不會改變資料來源。

本次沒有呼叫 Routes API、保存 Google 路線幾何或建立定時更新任務。[Google 第19節](https://cloud.google.com/maps-platform/terms/maps-service-terms)、[Routes 政策](https://developers.google.com/maps/documentation/routes/policies)。

## 驗證與上線

執行既有 `npm run check`，現在包含 `npm run test:maps`。需要有效設定後再驗證：

- Day 1–7、Plan A/B、全程總覽、相同酒店多次造訪、資訊窗及返回卡片。
- 手機從隱藏的地圖切換進來後，尺寸和視野正常；鍵盤可聚焦標記，Google 署名未被遮擋。
- 實際 Google 網域、nonce 和金鑰來源限制都可工作，沒有 CSP 錯誤。
- 拖動、縮放和切換日期不增加 Routes API 呼叫；沒有金鑰或網路異常時，仍可閱讀行程。
- 預存路線導入後，核對各段實際形狀；小火車、指定巴士和酒店接駁不能自動替換成其他最快交通。

登入頁仍使用原有 CSP 和 no-referrer。只有已登入的行程 HTML 加上每次回應獨立的 script nonce 及 Google 所需網域；對外 referrer 只提供來源，不提供完整行程網址。`/api/maps-config` 僅登入後可讀，且只返回瀏覽器金鑰與 Map ID。沒有新增 Routes API 代理，也沒有新增資料庫綁定。

不要單獨部署 dist；必須保留現有 Worker 登入保護。有效金钥配置和真实地图验证完成后再安排发布；路线数据作为后续独立阶段。

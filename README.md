# 关西七日

Google Maps 地图显示已整合。运行 `npm run preview:maps` 打开本机预览；在 `.dev.vars` 填入 `GOOGLE_MAPS_BROWSER_KEY` 后刷新页面。详见 [Google Maps 配置](docs/GOOGLE-MAPS.md)。当前显示行程地点与带方向箭头的游览顺序连线，实际交通路线另行补充。

本次完成本地地图显示切换和游览顺序连线，未发布。已在 Chrome 验证 Google Maps 实际渲染及 BrowserSync 热重载。

最新需求已允許按需查詢最新路線；目前尚未實作。Google 官方明確排除 Routes API 的日本公共交通覆蓋，因此日本鐵路／巴士的站內動態規劃須另行選擇交通資料來源；不能假定 Google 消費者地圖的能力都可透過 API 取得。詳見上述遷移文件的覆蓋更正。

正式开发目录为本仓库，线上地址为 https://trip.team0ne.work/ 。私有仓库：https://github.com/team0ne1/japan-journey-site 。推送 `main` 会触发检查与自动发布；一次性发布令牌配置和日常操作见 [AUTOMATED-DEPLOY.md](AUTOMATED-DEPLOY.md)。

已准备 **Cloudflare Workers 迁移版本**，新增成员一次性邀请、问答尝试限制、30 天登录态、领队 Passkey 与页面内邀请管理。完整手动部署流程见 [DEPLOY-CLOUDFLARE.md](DEPLOY-CLOUDFLARE.md)，权限设计见 [SECURITY.md](SECURITY.md)。本地检查：`npm ci && npm run check`；发布由你手动运行 `npm run deploy`。

现已加入每个行程节点的共享评论和顶部“全部建议”汇总：全体成员互相可见、领队可标记已处理。评论沿用登录服务的 SQLite，无需新增数据库配置；已部署网站的升级步骤也在部署说明中。调整节点时保留 `dist/data.js` 中的固定评论编号，避免讨论错位。

原始行程资源仍在 `dist/`；`scripts/build.mjs` 将它们和 `web/` 登录界面打包到 `.build/assets/`，由 `src/worker.ts` 统一鉴权后提供。`wrangler.jsonc` 配置 Worker 与 SQLite Durable Object。`.openai/hosting.json` 仅保留原 Sites 项目记录，不用于 Cloudflare 部署，也不放入迁移包。**不要单独发布 dist/，否则会绕过身份验证。**

静态行程网页。`dist/data.js` 保存地点、每天安排与 Day6/Day7 的 Plan B，`dist/estimates.js` 保存建议游览时长及每日费用组成，`dist/hours.js` 保存分区开放、最晚入场／开席／点单与结束时间及官方来源，`dist/hours-guide.md` 是完整核对表，`dist/app.js` 负责日期、方案切换和地图，`dist/style.css` 提供桌面与手机布局。

费用口径：JPY（日元）／成人；所有金额旁明确显示JPY或日元，不单独使用¥符号，五人合计按相同标准乘5；各日合计由费用条目计算，住宿计入入住当晚。交通、酒店、餐饮和税费杂项采用规划预留，未核查指定日期房态和报价。已核票价附官方来源；备选项目不加入主线总额。前五晚按不含餐、有马按含次日早餐、加太海月按一泊两食估算，防止重复计餐。合计不包含国际机票、购物和另选升级消费。

行程根据同项目的《关西行程双层路线草案-2026-09-11.md》整理，完整文字快照位于 `dist/itinerary.md`。更新行程时同时维护每日转场、酒店候选、次日出发点和体力参考。

当前草稿地图改用 Google Maps JavaScript API，浏览时读取预存路线，不请求路径规划；这描述当前实现，不再是未来版本的需求限制。所有地点仍可标记；尚未录入几何的段落明确显示为顺序示意。实际导航保留逐段 Google Maps 链接。

图片：Saigen Jiro，《Kamo River from Shijo Bridge》，Wikimedia Commons，CC0 1.0。来源：https://commons.wikimedia.org/wiki/File:Kamo_River_from_Shijo_Bridge.jpg 。图片为参考景观，并非旅行日实拍。

所有酒店、餐厅和活动均未自动预订；已接入只读天气展示，未接入多人行程编辑。URL 的 day、plan 片段仅用于分享当前视图，不修改旅伴的选择或任何订单。

开放时间核对日期：2026-09-11，按10月行程适用季节记录。未知最晚入场不从闭园时间倒推；公共道路与收费室内区域、住客泡汤与日归泡汤分别说明。春日大社和落柿舍的来源时间差异已保留说明。每日卡片、地图弹窗和备选卡共用同一份开放数据。若草山主线按17:00前退出收费草坡安排，完整日落仍待开放许可。

Google 地图通过登录后的 /api/maps-config 读取受限浏览器金钥和 Map ID；未配置时提示地图尚未启用。来源署名由 Google 地图组件显示。

每日单行时间轴：`dist/schedule.js` 保存连续的暂定排程，时长决定色块宽度，不同颜色区分交通、游览、用餐、酒店与自由时间。它把原本粗略的上午／下午细化为规划占位，非车票或预约确认；不修改费用或卡路里估算。每个色块可点击或键盘聚焦查看完整起止时间与说明，支持横向放大。Day6/7随Plan A/B一起切换；Day7使用以离店为0点的相对时间，不假定航班时刻。以后更改路线时必须同步调整此排程、data.js中的站点顺序和各点时长。


每日天气现使用 Open-Meteo 官方 Forecast API，显示逐小时天气、气温、降水概率与日出日落，支持当日地区选择。仅登录可读，不调整行程；预报期外（包括日出日落）明确显示暂未开放。本功能按当前私人、无广告／无订阅的非商业用途使用免费接口，界面保留来源、CC BY 4.0许可链接和数据转换说明。缓存、安全边界、许可核对及56项测试记录见 [天气模块说明](docs/WEATHER.md)。本轮只完成本地开发，未提交、推送或部署。

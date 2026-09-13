# 本机 Google Maps 预览

在本项目目录运行 `npm run preview:maps`，打开 http://localhost:8790/。

编辑项目根目录的 `.dev.vars`：

```dotenv
GOOGLE_MAPS_BROWSER_KEY="填入你的 Google Maps key"
GOOGLE_MAPS_MAP_ID="DEMO_MAP_ID"
```

本地预览可以使用官方 `DEMO_MAP_ID`；正式上线替换为自己创建的 JavaScript Map ID。
这个浏览器金钥只需启用 Maps JavaScript API，并允许来源 `http://localhost:8790`。
若使用 127.0.0.1 访问，也需加入 `http://127.0.0.1:8790`。浏览器金钥会发送给网页，建议限制 API 和网站来源，不需要授予所有 API 权限。

保存后浏览器会自动刷新，预览服务器每次读取最新配置，不需要手动重启。`.dev.vars` 已被 Git 忽略；不要提交或贴进聊天。

此入口仅监听本机 127.0.0.1，展示当前项目的地图、行程及日期/方案交互，不连接正式成员、评论、收藏和天气服务，不用于对外发布。完整的本地 Worker 使用原有 `npm run dev` 流程（默认 localhost:8787），需另外完成本地登录配置；对应金钥来源也需允许该端口。不要将此预览脚本放入生产 Worker。

当前范围：Google 底图、地点编号、信息窗、卡片定位、日期与 Plan A/B 切换。`dist/routes.json` 尚为空，缺少真实轨迹的路段以带方向箭头的虚线连接，表示游览顺序；颜色对应计划交通方式，不代表实际道路或交通线路。交通数据供应商及实际路线另行接入。

## 热重载（BrowserSync）

使用现成的 [BrowserSync](https://github.com/BrowserSync/browser-sync)，开发依赖固定为 3.0.4。启动命令仍为 `npm run preview:maps`，地址仍为 http://localhost:8790/。

- 监听 `dist/` 所有文件及 `.dev.vars`；保存 CSS 时直接注入样式，HTML、JavaScript 和配置变化时自动刷新。
- 当前日期与 Plan A/B 保留在 URL 中。CSS 更新保留当前地图实例。
- Node watch 在预览服务器代码变化时自动重启，BrowserSync 在重连时刷新浏览器。
- 仅监听本机地址，关闭控制面板和浏览器间操作同步。生产 Worker 不包含 BrowserSync。

保持启动进程运行即可。前台运行时按 Ctrl+C 停止；本次已将服务器在后台启动，日志位于 `/tmp/kansai-map-preview.log`。

# 购物清单

入口：侧栏「购物清单」，可分享 `/#view=shopping`。所有登录成员与领队均可新增、查看、标记已买到／恢复待购买。再次打开页面或点击刷新列表读取共享数据。

商品名称必填（120 字），数量／备注可选（500 字）。店铺可留空，每件商品最多选 8 家；输入店名和城市搜索，从 Google 结果选择分店。选中后自动读取近期／常规营业时间，显示完整一周，不依赖中文日期排列猜测“今天”。明确区分 Google 未提供、读取失败、暂时停业、永久停业。接口失败不会阻止保存已选地点或无地点商品。未选择的搜索词不会作为地点保存。

## Google 配置

复用 `GOOGLE_MAPS_BROWSER_KEY` 和原有 Maps SDK，不新增服务端密钥。现有 Google Cloud 项目还需要启用 **Places API (New)**，并在浏览器密钥的 API 限制中允许它；同时保留 Maps JavaScript API 和原有网站来源限制。按需搜索与查询详情会产生相应 Google API 调用。真实 Google 返回取决于项目授权、配额及网络。

使用 `Place.searchByText` 搜索，`Place.fetchFields` 读取名称、地址、营业状态、近期及常规营业时间和来源。保存的店铺数据仅有 Place ID；名称、地址、时间不写入数据库／本地存储。清单中只对进入可见区域的店铺查询详情，同次列表渲染复用相同地点结果，刷新时重新读取。界面保留 Google Maps 与第三方来源署名，以及地图服务隐私说明。

## 数据与权限

复用 TripAuth SQLite，新建 `shopping_items` 和 `shopping_rates`，不更改原有成员、评论、收藏数据，也不新增 Cloudflare 资源。接口：`GET /api/shopping`、`POST /api/shopping/create`、`POST /api/shopping/status`。身份来自服务端会话；写入沿用来源校验及请求体上限。每位成员 10 分钟最多新增 30 项，旅行最多 500 项；重试通过用户与 requestId 去重，购买状态明确设置而非反转。移除成员撤销访问并匿名化原记录。

本版提供添加、共享浏览、刷新及购买状态，不提供修改／删除已保存商品。表单中的已选地点可移除。Google API 不可用时，商品清单仍可使用，地点仍可通过 Google 地图链接打开。

参考：[Google Text Search](https://developers.google.com/maps/documentation/javascript/place-search)、[Places 数据字段](https://developers.google.com/maps/documentation/javascript/reference/place)、[Google 数据与署名政策](https://developers.google.com/maps/documentation/javascript/policies)。

## 验证记录

2026-09-28：构建、类型生成／检查、5 项地图测试、70 项应用测试及模拟发布通过。新增测试覆盖多成员共享、可选／多地点、身份与来源校验、并发重试、成员撤销及移除、持久化、购买状态、频率限制，以及 Google 字段请求、停业／未知／节假日营业时间和超时。

在隔离本地 Worker 实测登录、无地点提交、购买状态及刷新保留；使用明确标注“模拟”的 Google 响应验证搜索、多店选择、移除后重选、自动营业时间及未知提示。手机宽度检查无横向溢出。截图在 artifacts/shopping-desktop.png 与 artifacts/shopping-mobile.png，均为本地测试数据。当前本地没有 Google 浏览器密钥，因此未验证真实 Google 店铺响应；尚未部署正式网站。模拟代码仅临时加入 .build/assets，最终构建会移除，不进入发布包。

2026-09-29：将购物清单改动合入正式仓库最新 main，保留更新后的行程编译、酒店／行李衔接、收藏来源预览及 10 人成员上限。完整检查通过：14 项行程测试、6 项地图测试、78 项应用测试，以及构建、类型检查和模拟发布。推送 main 后由既有 GitHub Actions 执行部署；Google Places 实际授权及线上店铺响应仍需单独验证。

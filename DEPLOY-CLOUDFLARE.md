# 将关西行程手动部署到 Cloudflare

这是一个 **Cloudflare Worker + Static Assets + SQLite Durable Object** 项目。保留现有行程、地图、时间轴、费用和卡路里估算，增加成员邀请与领队 Passkey。没有自动连接或修改你的 Cloudflare 账户，也没有改动原 Sites 网站。

整个部署只需要你在电脑上运行一次发布命令，再到 Cloudflare 控制台填入三个配置值。**不要直接把 `dist` 拖到 Pages 或静态网站上传入口**：那会省略身份验证，公开里面的行程数据。请按下述 Worker 部署流程操作。

## 1. 准备项目与本地工具

安装 Node.js 22 或更新的受支持版本。解压 `kan
sai-cloudflare-source.tar.gz` 到一个单独文件夹，在此文件夹打开终端；如果使用原项目，则在 `itinerary-site` 中操作。

```sh
npm ci
npm run check
```

检查会构建网页、生成类型、运行身份验证测试，并执行本地部署演练。**`check` 不发布网站、不登录账户、不创建云端资源。** 首次安装需要网络下载依赖。

## 2. 由你登录并发布 Worker

```sh
npx wrangler login
npx wrangler whoami
npm run deploy
```

在浏览器中完成你自己的 Cloudflare 授权，确认选择正确账户。如果有多个账户，按提示选择，或在 `wrangler.jsonc` 中添加你账户实际的 `account_id`。

项目默认名为 `kansai-private-journey`。若账户已有同名 Worker，请在发布前修改 `wrangler.jsonc` 的 `name`，避免覆盖已有项目。

发布会按配置自动创建并绑定 `TRIP_AUTH` 对应的 SQLite Durable Object。它负责同一趟旅行的邀请、严格尝试计数、Passkey 公钥与会话。**不用另外手工创建 D1、KV、R2，也不需要运行常驻服务器。**

命令完成后会返回实际的 `https://kansai-private-journey.<你的子域>.workers.dev` 地址。此时网页显示“尚未完成配置”，返回 503，是预期行为：配置缺失时不会放出行程。

## 3. 决定长期使用的访问地址

可以直接长期使用上一步得到的 workers.dev 地址，也可以添加自己的域名：

Cloudflare 控制台 → **Workers 和 Pages** → 此 Worker → **设置 / Settings** → **域和路由 / Domains & Routes** → **添加 / Add** → **自定义域 / Custom Domain**。

填写你拥有并已在 Cloudflare 管理的专用子域，例如 `trip.your-domain.com`（只是示例，不要照抄）。等待域名与 HTTPS 生效。不要覆盖已有网站使用的子域。

**请先确定长期地址，再绑定 Passkey。** 本项目的 Passkey 严格绑定该域名，换域名后通常需要重新绑定。配置正式域名后，其他 workers.dev 别名会被应用拒绝访问；默认也关闭版本预览网址。

## 4. 在控制台填三个值

在本地运行：

```sh
npm run secrets:generate
```

它生成两份不同的随机密钥。请自行保存在密码管理器中，不要发在聊天、截图或代码仓库里。

进入此 Worker → **设置 / Settings** → **变量和机密 / Variables and Secrets**，添加：

| 名称 | 类型 | 填什么 |
| --- | --- | --- |
| `APP_ORIGIN` | 文本 / Text | 最终完整地址，例如 `https://trip.your-domain.com`。末尾不加 `/`，不含路径、查询或片段 |
| `AUTH_SECRET` | 机密 / Secret | 生成器输出的 AUTH_SECRET，43 个字符 |
| `SETUP_SECRET` | 机密 / Secret | 生成器输出的 SETUP_SECRET，43 个字符 |

保存并应用部署。默认的 `TRIP_ID=kansai-october-2026` 留在配置文件中；**上线后不要随意更改 TRIP_ID**，它决定访问哪一份旅行身份数据。

`AUTH_SECRET` 用于答案校验、IP 摘要和待领取邀请的加密，日常升级必须保持不变。它不是成员密码。`SETUP_SECRET` 只用于首次领队绑定；初次绑定后同一凭证不能自动重置管理员。

本项目启用了 `keep_vars`，后续命令行部署会保留控制台配置的值；不要在仓库的 `vars` 中添加同名示例值覆盖它们。

## 5. 绑定领队并邀请成员

1. 用支持 Passkey 的 Safari、Chrome 或 Edge 打开 **正式地址 `/setup`**。
2. 输入你保存的 `SETUP_SECRET`，为凭证起名，通过面容、指纹或设备解锁码完成绑定。
3. 登录后，点击行程页右上角的 **成员邀请**。
4. 先添加一个备用 Passkey。若主凭证由 Apple/Google/密码管理器同步，可再用独立的硬件安全密钥作为备用；同一同步账户中的两台设备并非独立的恢复途径。
5. 添加成员姓名或昵称、问题及正确答案。问题应说明格式，例如“生日按 MM-DD 填写”。不需要在源码或部署配置中填写成员资料。
6. 点击该成员的 **领取邀请链接**，复制并单独发送。链接仅领取一次；关闭面板后如果没有保存，选择 **重新邀请** 即可。
7. 成员打开邀请、回答问题后，浏览器保持登录 30 天。成员不需要 Cloudflare 或 ChatGPT 账号。

最多可添加 5 位普通成员，领队单独管理；这不改变行程中原有的“5 人同行”及费用计算。

邀请有效期为 7 天、最多失败 5 次；第五次失败后旧邀请立即失效，服务器只生成一次新邀请。新邀请只出现在领队的面板中，不会自动发给失败请求者。此版本没有邮件或聊天通知；领队打开面板点击刷新即可查看。

管理操作要求 5 分钟内完成过 Passkey 验证。添加 Passkey 会再次验证身份；删除 Passkey 会退出领队全部浏览器，且不能删除最后一个 Passkey。普通成员不能访问管理接口。

## 6. 上线后由你做一次实际确认

本地测试已经覆盖服务器协议和访问限制，但无法替代你设备上的生物识别与实际云端环境。

- 未登录的新浏览器打开首页，应进入登录页；直接打开 `/data.js`、`/itinerary.md`、`/hours-guide.md` 应返回未授权。
- 领队绑定、退出、重新用 Passkey 登录后，能打开成员面板。
- 用一个测试成员的邀请，在另一个浏览器登录；确认地图、每日时间轴、Plan A/B、JPY 费用和景点外链正常。
- 另建一条测试邀请，连续答错五次；旧链接失效，领队面板显示一个新邀请待领取。
- 撤销测试成员登录后，该浏览器再次请求行程文件被拒绝。已经看过或下载过的内容无法从对方设备追回。

确认上述流程后，再把正式成员邀请发给朋友。原 Sites 地址不会自动跳转，也不会自动删除；新站正常后，可自行停止分享旧地址并调整原站访问权限。

## 日常修改与更新

### 移除成员

领队打开页面顶部「成员邀请」，在对应成员卡片点击「移除成员」并确认；必要时先完成 Passkey 验证。服务器会在同一个事务中撤销该成员全部登录、删除其所有历史/当前邀请记录和未领取邀请密文，并删除姓名、问题和答案校验信息。成员卡片和名额计数随即刷新；重复提交移除请求不会产生额外影响。

已有评论保留正文与讨论状态，署名改为「已移除成员」，不再保留原成员 ID；正文中的自述或他人手工写下的名字不会自动改写。再次添加同名成员是新身份，必须使用新邀请，不继承旧登录或旧评论的作者权限。

「撤销登录和邀请」仍保留成员资料，适合只需重新验证的情况；「移除成员」删除资料并释放一个名额。已下载到成员设备的内容无法收回，后续服务器访问立即被拒绝。

接口：`POST /api/admin/member/remove`，JSON 为 `{ "memberId": "成员编号" }`；要求领队有效会话、5 分钟内 Passkey 验证、同源 JSON 请求。只适用于普通成员，不能用于删除领队或 Passkey。

### 首页与旧邀请自动进入

已验证的浏览器在 30 天登录有效期内，直接打开 `https://trip.team0ne.work/` 即可自动进入。浏览器会随请求携带安全 Cookie；网站读取对应成员身份，领队会显示管理入口。无需给网址添加姓名、邀请令牌或其他身份参数。

再次打开已使用的邀请链接或 `/login` 时，服务器会先检查现有登录：有效则直接转回行程，并清除邀请链接片段；不会再次验证或消耗邀请。未登录时，旧邀请仍然不能重用，页面会提示使用之前验证过的浏览器或向领队申请新邀请。`/setup` 保留为首次设置和恢复入口。

本次修复只需更新原 Worker，保留原域名、APP_ORIGIN、AUTH_SECRET、TRIP_ID、绑定和存储。无需重新发送已登录成员的邀请。微信内置浏览器、Safari、Chrome、无痕窗口及不同设备可能使用不同的 Cookie 存储；同一个 Google 账号不会自动同步网站登录 Cookie。退出、清除网站数据、到期或领队撤销后需要重新登录。

### 已部署网站：更新评论功能

这次更新沿用 `TripAuth` 已有的 SQLite Durable Object。**不需要创建 D1 数据库，不需要添加绑定或密钥，也不需要重新配置成员或 Passkey。** 评论表会在更新后第一次访问时自动建立；原身份表继续保留。

在原项目目录替换更新的源文件，保留你已配置的 `wrangler.jsonc` 中 Worker 名称、TRIP_ID、绑定和现有迁移记录，也保留原来的私有 `.dev.vars`（若有）。不要用另一个 Worker 名称重新建站。然后自行运行：

```sh
npm ci
npm run check
npm run deploy
```

如果你使用 Cloudflare 的 Git 自动构建，提交本次源文件，沿用原来的构建和部署设置即可。后台仍沿用原 APP_ORIGIN、AUTH_SECRET、SETUP_SECRET；无需再次打开首次设置页。

更新后登录原网址，每个行程节点下方都有“建议与讨论”，页面顶部有“全部建议”。请用两个成员身份验证：一个发表评论，另一个刷新后应能在地点下方及汇总中看到；领队标记“已处理”后，所有成员都能看到状态变化。

### 评论怎么使用

- 评论对所有已登录的同行成员公开，没有私密评论或仅领队可见的内容；网站入口仍使用原来的邀请或 Passkey 登录。
- 所有人都可以查看全部建议，按“待讨论”筛选，并点地点名称返回对应行程。领队也可以直接在该地点发表评论回复。
- 成员可删除自己的评论；领队可删除任何评论、标记“已处理”或恢复讨论。评论操作不要求反复验证 Passkey；邀请和凭证管理仍要求近期 Passkey 验证。
- 页面在可见时每分钟更新评论，回到页面也会更新，并提供手动刷新。不是即时聊天，也不会自动发送邮件或修改行程。
- 每条最多 1000 字；每个身份每 10 分钟最多 30 次评论写入操作（发表、删除、标记合计）。网络重试不会重复发表。同一标签页切换日期或方案会保留尚未提交的草稿；刷新或关闭标签页不保留草稿。
- 每个节点最多累计 500 条，全程最多累计 10,000 条（包括已删除记录）。删除会清空正文并保留防重复提交的记录。

### 调整行程时保留评论关联

`dist/data.js` 中每个 `step()` 的第一个参数是固定评论编号，第二个参数才是地图地点编号。调整时间、顺序或将同一行程步骤移动到另一日时，保留第一个参数；替换为无关的新活动时使用新编号。不要把已有编号分配给别的活动。

前五天 A/B 共用行程与评论，第六、七天各方案分别讨论；同一天同一酒店的寄存与夜间回房也是独立节点。构建会生成服务器使用的 `src/comment-targets.ts`，无需手动编辑它。移除节点后，旧建议仍在汇总中保留并标注“原行程节点已移除”，不会悄悄挂到其他地点。

行程仍编辑 `dist/data.js`、`dist/schedule.js`、`dist/hours.js`、`dist/estimates.js` 等原文件；登录页面在 `web/`，后台在 `src/`。不要编辑 `.build/`，它会在构建时重建。

```sh
npm run check
npm run deploy
```

只要 Worker、TRIP_ID、Durable Object 绑定和密钥不变，普通代码更新不会清空成员或会话。不要重复初始化、删掉 Durable Object 绑定，或删除存储记录。

## 领队丢失全部 Passkey 时

优先使用备用 Passkey。若全部丢失，需要你能登录 Cloudflare 账户，按以下顺序恢复：

1. 本地重新运行 `npm run secrets:generate`，**只使用新输出的 SETUP_SECRET**；不要替换原 AUTH_SECRET。
2. 在控制台更新 SETUP_SECRET，并新增文本变量 `ADMIN_RECOVERY_ENABLED=true`，应用部署。
3. 打开 `/login` → “领队首次设置或恢复”，输入新的 SETUP_SECRET，点击“重置领队凭证”。这会删除领队全部 Passkey、撤销领队会话，保留普通成员资料和登录。
4. 页面跳转到 `/setup`，使用同一个新的 SETUP_SECRET 重新绑定领队 Passkey。然后添加备用凭证。
5. 回控制台删除 `ADMIN_RECOVERY_ENABLED`，或设为 `false`，应用部署。一个恢复凭证只能执行一次重置。

不提供生日或成员邀请恢复领队身份的功能。Cloudflare 账户本身应由你妥善保管。

## 本地预览（可选）

```sh
npm run secrets:generate -- --local
npm run dev
```

查看私有 `.dev.vars` 文件中的 SETUP_SECRET，用 `http://localhost:8787/setup` 初始化本地测试身份。若文件已存在，生成器会拒绝覆盖。文件已被 Git 忽略，请勿上传；本地身份记录与 Cloudflare 云端分开。

本地的 Passkey 绑定 localhost，不能用于正式域名。某些浏览器对 localhost 的 Secure Cookie 或设备凭证限制不同，正式 HTTPS 地址是最终验证环境。

## 参考文档

- [Cloudflare Worker 静态资源](https://developers.cloudflare.com/workers/static-assets/)
- [让所有资源请求先经过 Worker](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/)
- [SQLite Durable Object 存储](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)
- [Workers 变量和机密](https://developers.cloudflare.com/workers/configuration/secrets/)
- [自定义域名](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [SimpleWebAuthn 服务器验证](https://simplewebauthn.dev/docs/packages/server)

文档与依赖核对：2026-09-12。控制台中文标签可能随版本调整，英文名称一并列出便于定位。

# 自动更新旅行网站

正式网站：https://trip.team0ne.work/
Worker：kansai-private-journey
Cloudflare account：0a24af260b9e3362f9bbe75965b2fe44

## 日常更新

这个目录是今后的正式开发目录。修改完成后提交、推送到 GitHub 私有仓库的 `main` 分支，GitHub Actions 自动完成：安装锁定依赖 → 构建 → 类型检查 → 测试 → 模拟发布 → 发布 Worker → 检查正式网站。

PR 只检查，不发布；生产发布只接受 main。也可在 GitHub 的 Actions → Publish trip website → Run workflow 手动运行 main。发布过程按顺序执行，不中途取消已经开始的生产发布。

同一套流程可以在本机运行：

```sh
npm ci
npm run check
npm run deploy
npm run smoke
```

本机部署使用 Wrangler 登录；GitHub 云端发布使用下文单独的 API Token，不上传本机 OAuth 登录或网站身份密钥。

## GitHub 一次性配置

1. 在 Cloudflare → My Profile → API Tokens 创建用于此仓库的令牌。可使用 Edit Cloudflare Workers 模板，仅选择上述账户和 `team0ne.work` 区域；需要 Worker 脚本编辑及该域名的 Workers Routes 编辑权限，按模板保留所需读取权限。
2. 在 GitHub 私有仓库 → Settings → Secrets and variables → Actions → New repository secret，名称填 `CLOUDFLARE_API_TOKEN`，值填刚创建的令牌。也可以在自己的终端运行 `gh secret set CLOUDFLARE_API_TOKEN`，在隐藏输入提示中粘贴。不要把令牌发到聊天或提交到仓库。
3. 在 Actions 手动运行 Publish trip website，选择 main；第一次发布检查通过后，此后推送 main 自动发布。

账户 ID 和正式域名不是密钥，已固定在配置里。网站的 AUTH_SECRET、SETUP_SECRET 只保留在原 Worker；CI 不需要知道它们。不要轮换身份密钥、修改 TRIP_ID 或重建 Durable Object 来完成普通代码升级。

## 验证与排查

Actions 的失败步骤会显示原因。检查失败时不会进入发布。发布后的只读检查验证匿名首页跳转、登录页可用、领队仍已初始化、数据和评论仍需登录，并比较线上登录脚本与当前构建的一致性。不在正式网站创建测试成员、评论或 Passkey。

若已发布但后续检查失败，先查看 Actions 日志和 Cloudflare 部署记录。不要自动回滚数据库：代码版本回退不等于数据回退。

依赖版本由 package-lock.json 固定；GitHub Actions 按提交 SHA 固定。仅发布步骤接收 Cloudflare 令牌，PR 检查没有生产令牌。

参考：[Cloudflare GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)

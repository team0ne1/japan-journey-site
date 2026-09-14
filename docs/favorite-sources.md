# 收藏夹多条消息来源

每个地点支持0–8条来源，每条为`{url,title}`：URL最长2048字，HTTP/HTTPS；标题可空，最长300字。前端留空URL行不提交。标题为空时卡片显示完整URL；使用textContent渲染标题。

`POST /api/favorites/preview`：已登录、同源JSON请求，经现有会话验证，每个成员每10分钟最多40次。后端仅抓取source-preview.ts内明确列出的常见推荐平台HTTPS主机，逐跳校验重定向，不发送浏览器Cookie或认证信息。总超时5秒，最多4次请求，只读取前256KiB HTML。优先og:title、twitter:title、title；不执行脚本，不绕过平台限制。未知网站与读取失败返回空标题，仍允许保存URL或手填标题。

输入链接600ms后尝试预览；响应仅更新同一行、同一版本且用户从未手动修改的标题。移除行和重置表单使旧响应失效。保存不等待预览。

现有Durable Object SQLite的favorites表新增sources TEXT NOT NULL DEFAULT ''，存储JSON数组；旧行默认空字符串，读取时从原sourceUrl映射为单条空标题来源。sourceUrl保留，并写入第一条URL以兼容旧接口。建表后检查PRAGMA，自动增加缺失列，不删除或重建旧表。提交重试比较完整有序数组。

列表接口新增sources数组；CSV保留原8列位置，在第9列追加消息来源标题；第5列链接及第9列标题按同一顺序以单元格内换行分隔，空标题保留对应空行。仍使用UTF-8 BOM、CSV引号转义及公式注入防护。

本地8790为仅行程地图预览，无法访问登录数据库及标题接口；完整功能使用本地Worker预览。没有远程数据库迁移或自动部署。

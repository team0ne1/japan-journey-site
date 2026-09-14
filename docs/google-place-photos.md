# Day2 Google 地点照片

七个缺图地点使用Maps JavaScript Places库，按明确Place ID读取photos并使用getURI实时加载，不将Google照片文件提交到仓库。卡片显示Google Maps与作者署名链接，点击可放大，失败保留图片搜索入口。当前页面内避免重复请求，刷新页面重新获取。现有本地照片优先，不改变其他景点照片。需要现有浏览器Key允许Places API (New)，2026-09-15已验证七个地点均返回照片。

- 大阪駅：`ChIJC6fjlY3mAGARSshZ6CLIrhs`
- 野々宮：`ChIJXxvnVv-pAWARqv_nHlpOUGg`
- 愛宕寺前：`ChIJ4V1ugjmqAWARKD-j8T4xUYI`
- 嵯峨嵐山駅：`ChIJeVL-m_6pAWAR2fDtIzRBWRI`
- 亀岡駅：`ChIJGxCciMJUAGARMTym5nPrY0c`
- 保津川下り 出発地点：`ChIJ5e_0rsRUAGARV6H3azfT3DM`
- 保津川下り 着船場【乗り場ではありません!】：`ChIJr-wW1QCqAWARnsMRi2g2ung`

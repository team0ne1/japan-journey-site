# 关西七日 · 秋日旅程

## 旅程概况

2026-09-23展示规则：路线图和每日游览列表省略普通中转车站；此文件中既有车站资料和交通步骤保留供路段规划使用，不应直接全部渲染为游览节点。实际站内寄存／取件车站可保留。最新路线以《关西七日行程-路线图.md》为准，本次行李逐日审核仅推进第一天，其余天数留待后续确认。

```yaml journey:trip
version: 1.0-draft
id: kansai-october-2026
name: 关西七日
title: 秋日关西，按自己的节奏走。
startDate: 2026-10-01
endDate: 2026-10-07
timezone: Asia/Tokyo
partySize: 5
weightKg: 70
currency: JPY
updated: 2026-09-23
hoursChecked: 2026-09-11
status: 规划草案
intro: 公共交通与步行
description: 关西旅行计划：每日路线地图、出行方式、行李衔接、体力参考与温泉备选。
planningNote: 酒店和餐厅尚未预订，航班、房态及部分班次待确认。步行量包含景区内部与坡道；卡路里按70公斤成人估算，仅指活动额外消耗。天气尚未接入，不显示未经查询的旅行日预报。
planLabels:
  A: 第五晚有马＋第六晚神户
  B: 加太休闲·加太海月
  B2: 加太休闲·休暇村纪州加太（Plan B住宿支线）
planNote: Plan A第五天下午由奈良转往有马，首选御幸荘 花結び一泊二食；第六天有马小镇午饭后前往神户市区酒店，闲逛后傍晚去须磨，晚餐及可选维纳斯桥后住神户。Plan B为加太休闲日，可选加太海月或休暇村纪州加太；B2仅表示后者的住宿支线，第六、七天必须联动选择。酒店未预订，切换地图不代表完成订房。
budgetScope: 当前统计合计含交通、主线门票／体验、住宿和杂项预留；餐饮只计入已预订餐厅，未预订的早餐、午晚餐、茶点和临时用餐不计入。因此不是完整旅行开支。国际机票、购物和未选备选项目另计，尚非实际账单。
budgetNotes:
  - 住宿按入住当晚记账，并按同行人数分摊预算占位；未按实际双床／三人房报价计算。酒店确定后再替换为实价；餐饮只有确认预订后才按对应餐段价格纳入。
  - 前四晚暂按不含餐估算；Plan A第五晚按有马一泊二食方向待报价，Plan B第五晚仍住奈良；Day6神户酒店与餐食待选，加太海月候选方案假设含当晚晚餐及次日早餐。酒店尚未预订，套餐餐食仅随住宿整体预留，不另列餐饮，也不表示已付款。
  - 建议时长由本行程节奏估算，茶体验、列车和花火另参考官方时长；卡路里为粗估区间，含景区内部与上下坡、不含基础代谢。
  - 餐饮采用已预订餐厅口径。优先匹配Tabelog同一分店、对应午餐／晚餐的人均预算并记录查询日期；若有已订套餐确定价格，则以套餐为准。候选或等待确认的餐厅不计入，缺失价格不当作免费。
plans:
  A:
    - day-01
    - day-02
    - day-03
    - day-04
    - day-05-a
    - day-06-a
    - day-07-a
  B:
    - day-01
    - day-02
    - day-03
    - day-04
    - day-05
    - day-06-b
    - day-07-b
  B2:
    - day-01
    - day-02
    - day-03
    - day-04
    - day-05
    - day-06-b2
    - day-07-b2
handoffs:
  - id: day-01-to-day-02
    fromDay: day-01
    toDay: day-02
    fromStep: d1-osaka-2
    toStep: d2-kyoto
    note: 明早从大阪酒店退房，带行李去京都站前酒店；寄存后再去岚山。
  - id: day-02-to-day-03
    fromDay: day-02
    toDay: day-03
    fromStep: d2-kyoto-3
    toStep: d3-kyoto
    note: 明天不换酒店，行李留房间；哲学小道与贵船之间乘公共交通。
  - id: day-03-to-day-04
    fromDay: day-03
    toDay: day-04
    fromStep: d3-kyoto-2
    toStep: d4-uji
    note: 明早退房先寄存，伏见稻荷短游后回酒店取件，再乘JR去宇治。
  - id: day-04-to-day-05
    fromDay: day-04
    toDay: day-05
    fromStep: d4-uji-3
    toStep: d5-nara
    note: 花火散场回JR宇治，步行回酒店。明天带行李去JR奈良。
  - id: day-04-to-day-05-a
    fromDay: day-04
    toDay: day-05-a
    fromStep: d4-uji-3
    toStep: d5a-storage
    note: 宇治退房后带行李到JR奈良站前寄存，午后取件前往有马。
  - id: day-05-a-to-day-06-a
    fromDay: day-05-a
    toDay: day-06-a
    fromStep: d5a-hotel
    toStep: d6-arima-hotel
    note: 第五晚有马一泊二食；第六天早餐、温泉小镇午餐后取件去神户，不再从奈良出发。
  - id: day-06-a-to-day-07-a
    fromDay: day-06-a
    toDay: day-07-a
    fromStep: d6-kobe-hotel
    toStep: d7-kix
    note: 明天从神户市区酒店前往关西机场，交通与出发时间按酒店、航班及航站楼倒排。
  - id: day-05-to-day-06-b
    fromDay: day-05
    toDay: day-06-b
    fromStep: d5-nara-2
    toStep: d6-b-kaigetsu
    note: 当晚住奈良，避免晚餐后赶跨城车。前五晚住宿整合仍在讨论；第六天选择神户市区或加太海月。
  - id: day-06-b-to-day-07-b
    fromDay: day-06-b
    toDay: day-07-b
    fromStep: d6-b-kaigetsu
    toStep: d7-b-kix
    note: 明早按航班选择09:30或10:10送站，经南海线去关西机场。需更早离店时另确认交通。
  - id: day-05-to-day-06-b2
    fromDay: day-05
    toDay: day-06-b2
    fromStep: d5-nara-2
    toStep: d6-b2-hotel
    note: Plan B选择休暇村时使用；前五晚住宿整合尚在讨论，起点随最终住宿确认。
  - id: day-06-b2-to-day-07-b2
    fromDay: day-06-b2
    toDay: day-07-b2
    fromStep: d6-b2-hotel
    toStep: d7-b2-hotel
    note: 休暇村住宿与翌日送站联动；在加太站合并至原机场返程方向，具体铁路换乘及航班余量待核。

```

## 地点 · 关西国际机场

```yaml journey:place
id: kix
name: 关西国际机场
lat: 34.4354
lng: 135.2441
mapQuery: Kansai International Airport
```

## 地点 · Sugata Hotel Osaka

2026-09-23用户确认第一晚已预订。正式名称 Sugata Hotel Osaka Shinsaibashi, Series by Marriott；按本行程10/1入住、10/2退房。地址大阪市中央区南船場2-6-25，电话+81 6-4708-3360。订单房型、房价、餐食和取消条件待补充，不将此前筛选的15㎡双床房当作实际订单。[万豪官网](https://www.marriott.com/en-us/hotels/osass-sugata-hotel-osaka-shinsaibashi-series/overview/)

第一天建议直接到酒店放行李，再乘车去通天阁，依次参考日本桥商圈、难波八阪神社、黑门市场，接回道顿堀游览；不在难波站增加存取件往返。官网入住15:00、退房11:00，前台24小时；[Booking设施资料](https://www.booking.com/hotel/jp/sugata-hotel-osaka-shinsaibashi-series-by-marriott.html)列有行李寄存，但入住前可寄存时段、费用和容量待酒店确认，不能推断免费或全天可寄存。

酒店位于南船场，和Cross Hotel是不同地点。机场到店先沿用《酒店选择》中的交通候选：南海至天下茶屋，转堺筋线到长堀桥，再步行到店；电梯出口、实际班次及门到门用时待核，不沿用Cross Hotel“南海难波步行10分钟”。这些车站只是路段交通信息，不作为行程停留或寄存节点。

```yaml journey:place
id: sugata-osaka
name: Sugata Hotel Osaka
lat: 34.6766358566958
lng: 135.504816406363
mapQuery: Sugata Hotel Osaka Shinsaibashi 2-6-25 Minamisenba Osaka
checked: 2026-09-23
coordinateNote: 万豪官网地图提供的酒店位置，非已核电梯出口或酒店门口精确点
hotel:
  name: Sugata Hotel Osaka Shinsaibashi, Series by Marriott
  area: 大阪 · 南船场／心斋桥
  url: https://www.marriott.com/en-us/hotels/osass-sugata-hotel-osaka-shinsaibashi-series/overview/
  status: 已预订，2026-09-23用户确认；订单明细待补充
  note: 按本行程10/1入住、10/2退房；15:00入住、11:00退房。第一天优先酒店寄存，具体时段、费用及容量待酒店确认。
hours:
  scope: 酒店入住／退房 · 日本当地时间
  open: 10/1 15:00起入住
  last: 晚到接待条件以订单或酒店确认为准
  close: 10/2 11:00前退房
  note: 提前寄存的时段、费用及容量待确认。地址大阪市中央区南船場2-6-25，电话+81 6-4708-3360。酒店不提供机场接驳。
  sources:
    - - 万豪酒店官网
      - https://www.marriott.com/en-us/hotels/osass-sugata-hotel-osaka-shinsaibashi-series/overview/
  status: 2026-09-23官网核对
```

## 地点 · Cross Hotel Osaka

历史候选资料：2026-09-23用户已确认第一晚预订Sugata Hotel Osaka，本馆不再用于第一天住宿或寄存规划。

```yaml journey:place
id: osaka
name: Cross Hotel Osaka
lat: 34.6697
lng: 135.5001
mapQuery: Cross Hotel Osaka
hotel:
  name: Cross Hotel Osaka
  area: 大阪 · 难波／道顿堀
  url: https://cross-osaka.orixhotelsandresorts.com/wcrsoskp/access/
  note: 靠近道顿堀，晚饭与夜景后步行回房。上午抵达先寄存，房间按酒店入住时间交付。
  status: 住宿候选 · 尚未预订
```

## 地点 · 南海难波站

```yaml journey:place
id: namba
name: 南海难波站
lat: 34.6641
lng: 135.5019
mapQuery: Nankai Namba Station
```

## 地点 · 通天阁

2026-09-23按用户要求加入第一天，在Sugata寄存后前往，再接日本桥商圈。先保留到访与周边闲逛，上塔与否按现场兴致决定；不默认已购票或必须上塔。官网列出的展望台常规营业为09:00–21:45，一般展望台最后入场21:15，特别屋外展望台最后入场21:35；成人套票1,500日元，含一般与特别屋外展望台，入场采用时间预约制。[通天阁官方营业与票价](https://www.tsutenkaku.co.jp/annai/)

```yaml journey:place
id: tsutenkaku
name: 通天阁
mapQuery: 通天閣 大阪市浪速区恵美須東1-18-6
checked: 2026-09-23
lat: 34.6524992
lng: 135.5063058
coordinateNote: 通天阁官方交通页步行导航目的地；https://www.tsutenkaku.co.jp/access/
hours:
  scope: 展望台；周边街区不套用此时段
  open: 09:00–21:45
  last: 一般展望台21:15；特别屋外展望台21:35
  close: 21:45
  note: 上塔需预约入场时间，未购票；是否上塔由当天兴致决定，临时调整以官方公告为准。
  sources:
    - - 通天阁官方营业与票价
      - https://www.tsutenkaku.co.jp/annai/
  status: 2026-09-23核查
tickets:
  - id: tsutenkaku-adult
    name: 通天阁一般＋特别屋外展望台成人套票
    category: admission
    audience: adult
    currency: JPY
    amount: 1500
    priceStatus: verified
    checked: 2026-09-23
    source: https://www.tsutenkaku.co.jp/annai/
    note: 15岁及以上，一位成人计；仅上塔时发生，未购票，不含滑梯等其他项目。
```

## 地点 · でんでんタウン／日本橋筋商店街

2026-09-23按用户要求加入第一天通天阁之后。でんでんタウン为日本桥电器、动漫商圈称呼，日本橋筋商店街属于其中，按同一段逛街处理、保留两个名称，不重复安排两次停留。先按喜欢的店随兴逛，具体店铺和各店营业时间待选；公共街道可通行不代表商铺营业。[商店街官方地图](https://www.nippombashi.jp/shopmap.php)；[大阪市街区介绍](https://www.city.osaka.lg.jp/toshikeikaku/page/0000390675.html)

```yaml journey:place
id: nippombashi-denden
name: でんでんタウン／日本橋筋商店街
mapQuery: 日本橋筋商店街 でんでんタウン 大阪
checked: 2026-09-23
lat: 34.6549385
lng: 135.5055773
coordinateNote: 大阪观光局商圈地图代表点，非指定店铺入口；https://osaka-info.jp/experience/ja/osaka/spot/229
hours:
  scope: 日本桥商圈店铺
  open: 各店独立营业
  last: 待选店后核实
  close: 各店独立
  note: 两个名称合并为一次街区游览；不预设全部店铺营业或固定停留时长。
  sources:
    - - 商店街官方地图
      - https://www.nippombashi.jp/shopmap.php
  status: 街区已核实，店铺待选
```

## 地点 · 难波八阪神社

2026-09-23按用户要求加入第一天日本桥商圈之后、黑门市场之前。地址大阪市浪速区元町2-9-19，以境内参拜、观赏狮子殿为主；与京都八坂神社为不同地点。大阪观光局列境内开门06:00–17:00，另列营业09:00–16:50；到得晚就按现场情况取舍，不为闭门赶路。[神社官网](https://nambayasaka.jp/)；[大阪观光局开放时间](https://osaka-info.jp/special/dc/event/detail12/)

```yaml journey:place
id: namba-yasaka
name: 难波八阪神社
mapQuery: 難波八阪神社 大阪市浪速区元町2-9-19
checked: 2026-09-23
coordinateNote: 暂使用神社名称及官方地址查询，入口精确坐标待核
hours:
  scope: 境内开门时间
  open: 06:00–17:00
  last: 未公布独立最晚进入时间，避免临近闭门才抵达
  close: 17:00
  note: 大阪观光局另列营业09:00–16:50，不能把境内开门时段当作所有服务时间。
  sources:
    - - 大阪观光局难波八阪神社
      - https://osaka-info.jp/special/dc/event/detail12/
    - - 神社官网
      - https://nambayasaka.jp/
  status: 2026-09-23核查
```

## 地点 · 黑门市场

2026-09-23按用户要求加入第一天难波八阪神社之后，再衔接道顿堀。以市场闲逛和按兴趣选小吃为主，晚餐仍在梅田。官网逐店列营业与休息日，市场没有适用于所有店铺的统一营业时间；选店后再核实，优先白天到访，不承诺晚到仍能逛齐。[黑门市场官网与店铺目录](https://kuromon.com/jp/)

```yaml journey:place
id: kuromon-market
name: 黑门市场
mapQuery: 黒門市場 大阪 日本橋
checked: 2026-09-23
lat: 34.664796
lng: 135.506985
coordinateNote: 大阪观光局市场地图代表点，非指定店铺入口；https://osaka-info.jp/spot/gastronomy-kuromon/
hours:
  scope: 市场各商铺
  open: 各店独立营业
  last: 各店售罄与点餐截止分别确认
  close: 各店独立，不能统一视为夜市
  note: 优先白天随兴逛吃；餐饮、购物按实际选择另计，未预订。
  sources:
    - - 黑门市场官方店铺目录
      - https://kuromon.com/jp/
  status: 2026-09-23核查，具体店铺待选
```

## 地点 · 中崎町

2026-09-23按用户要求加入第一天下午。大阪观光局介绍这里为梅田附近的咖啡、杂货、古着街区；本行程走公共街巷、挑喜欢的店短逛，建议45–60分钟，咖啡休息可包含在此段。各店营业日和时间独立，尚未指定店铺，不把街区可通行等同于店铺全天开门。[大阪观光局介绍](https://osaka-info.jp/experience/ja/osaka/spot/203)

```yaml journey:place
id: nakazakicho
name: 中崎町
lat: 34.7069399
lng: 135.5053825
mapQuery: 中崎町 大阪 カフェ 雑貨
duration: 建议45–60分钟，按兴趣短逛并休息
checked: 2026-09-23
coordinateNote: 大阪观光局街区地图参考中心；具体店铺尚未确定
hours:
  scope: 街区公共道路与沿街商铺
  open: 街区无统一营业时段
  last: 各店独立，待选店后核实
  close: 各店独立
  note: 优先安排下午，不能承诺晚间仍有店可逛。
  sources:
    - - 大阪观光局中崎町介绍
      - https://osaka-info.jp/experience/ja/osaka/spot/203
  status: 2026-09-23核查；具体店铺未定
```

## 地点 · 梅田商圈

2026-09-23按用户要求加入第一天，与中崎町合并为北部逛街段。按60–90分钟短逛规划，先围绕茶屋町一带挑感兴趣的商店，不默认逛完所有商场；梅田晚饭后可按兴致前往空中庭园展望台，另列观景地点。商场和店铺分别营业，餐饮、购物费用另计。[大阪观光局梅田周边散步介绍](https://osaka-info.jp/modelcourse/course-kimono-walk/)

```yaml journey:place
id: umeda-shopping
name: 梅田商圈
lat: 34.706844
lng: 135.499551
mapQuery: 梅田 茶屋町 大阪 ショッピング
duration: 建议60–90分钟，只挑感兴趣的商店
checked: 2026-09-23
coordinateNote: 以大阪观光局茶屋町地图作为梅田商圈参考点，不是寄存站点
hours:
  scope: 梅田商圈商铺
  open: 各商场及店铺独立营业
  last: 待选店后核实
  close: 不设统一闭店时间
  note: 不将餐厅营业时段套用到商场零售店。
  status: 店铺尚未确定
```

## 地点 · 梅田蓝天大厦・空中庭园展望台

2026-09-23按用户更正，作为第一天梅田晚饭后的观景地点。常规09:30–22:30、22:00最后入场；包含39楼、40楼及露天屋顶，须从展望台专用入口进入，按指示前往3楼出发层，不能使用办公楼电梯。观景可参考60–90分钟，找入口、排队和上楼另计；按当日体力与兴致决定，不设日落／蓝调或固定入场目标。[官方中文营业及票价](https://www.skybldg.co.jp/tw/)；[官方展望台及入口说明](https://www.skybldg.co.jp/observatory/)

普通成人票2,000日元／人，未购票；特别活动与临时营业调整以当天公告为准。梅田晚餐餐厅尚未确定，饭后步行距离与耗时待选店后核实，疲劳时可打车；游览结束乘市内交通或打车返回Sugata。

```yaml journey:place
id: umeda-sky
name: 梅田蓝天大厦・空中庭园展望台
mapQuery: 梅田スカイビル 空中庭園展望台 大阪
lat: 34.7050738
lng: 135.4902845
duration: 建议观景60–90分钟，排队和上楼另计
checked: 2026-09-23
coordinateNote: 官方中文交通页链接的步行导航终点参考坐标；现场按展望台专用入口指示进入
hours:
  scope: 空中庭园展望台普通营业
  open: 09:30–22:30
  last: 22:00最后入场
  close: 22:30
  note: 常规时段，特别活动、临时营业调整与露天屋顶开放情况以当日公告为准。
  sources:
    - - 梅田蓝天大厦官方中文营业说明
      - https://www.skybldg.co.jp/tw/
    - - 官方展望台及入口说明
      - https://www.skybldg.co.jp/observatory/
  status: 2026-09-23核查
tickets:
  - id: umeda-sky-adult
    name: 空中庭园展望台成人普通票
    category: admission
    audience: adult
    currency: JPY
    amount: 2000
    priceStatus: verified
    checked: 2026-09-23
    source: https://www.skybldg.co.jp/tw/
    note: 按一位成人计，未购票；不含其他体验或餐食。
```

## 地点 · 心斋桥筋

```yaml journey:place
id: shinsaibashi
name: 心斋桥筋
lat: 34.6728
lng: 135.5012
mapQuery: Shinsaibashi Suji Shopping Street
duration: 建议逛店 60–90分钟
hours:
  scope: 心斋桥筋街道
  open: 户外散步区域；未查到统一门禁时刻
  last: 不适用统一景区检票；现场限制优先
  close: 官方介绍未列统一闭园时间
  note: 店铺各自营业，街道通行时间不代表可以进店；选定店铺后需另核其入店与点单截止。
  sources:
    - - 商店街官方问答
      - https://www.shinsaibashi.or.jp/contact/faq
  status: 公共户外
```

## 地点 · 法善寺横丁

```yaml journey:place
id: hozenji
name: 法善寺横丁
lat: 34.6679
lng: 135.5021
mapQuery: Hozenji Yokocho
duration: 建议游览 15–20分钟
hours:
  scope: 法善寺境内参拜＋横丁散步
  open: 境内24小时可参拜
  last: 境内参拜无每日入场截止
  close: 境内无每日闭门时刻
  note: 授与所10:00–18:00；这是御朱印等服务时间。横丁餐厅各自营业，不套用寺院参拜时间。
  sources:
    - - 法善寺官网
      - https://houzenji.jp/
  status: 全天参拜
```

## 地点 · 道顿堀・戎桥

```yaml journey:place
id: dotonbori
name: 道顿堀・戎桥
lat: 34.6687
lng: 135.5013
mapQuery: Ebisubashi Osaka
duration: 建议游览 30–45分钟
hours:
  scope: 道顿堀街道・戎桥
  open: 户外散步区域；未查到统一门禁时刻
  last: 不适用统一景区检票；现场限制优先
  close: 官方介绍未列统一闭园时间
  note: 仅安排河畔与桥上夜景；商店、餐厅和其他设施各自营业，灯牌点亮时间也不等于街道开放时间。
  sources:
    - - 大阪官方旅游信息
      - https://osaka-info.jp/spot/dotonbori/
  status: 公共户外
```

## 地点 · 京都站前酒店

```yaml journey:place
id: kyoto
name: 京都站前酒店
lat: 34.9896
lng: 135.7597
mapQuery: Daiwa Roynet Hotel Kyoto Ekimae Premier
hotel:
  name: Daiwa Roynet Kyoto-Ekimae PREMIER
  area: 京都 · 京都站前 · 连住两晚
  url: https://www.daiwaroynet.jp/en/kyoto-ekimae/
  note: 暂用京都站前分店作路线起点；两晚不换酒店，方便岚山、稻荷及宇治转场。
  status: 住宿候选 · 尚未预订
```

## 地点 · 京都站

```yaml journey:place
id: kyotost
name: 京都站
lat: 34.9858
lng: 135.7588
mapQuery: Kyoto Station
```

## 地点 · JR马堀站

```yaml journey:place
id: umahori
name: JR马堀站
lat: 35.0105
lng: 135.6021
mapQuery: Umahori Station
```

## 地点 · 小火车龟冈站

```yaml journey:place
id: kameoka
name: 小火车龟冈站
lat: 35.0134
lng: 135.6063
mapQuery: Torokko Kameoka Station
hours:
  scope: 嵯峨野小火车・龟冈→嵯峨
  open: 按10/2实际运行日历及所订车次
  last: 乘车截止依所订班次；未查到统一提前停止检票分钟数
  close: 以该车次发车时间为准
  note: 预约尚未完成。建议提前15–20分钟到站是本行程预留，并非官方检票截止；不能用售票窗口下班时间判断还能否乘车。
  sources:
    - - 运营官网与预约
      - https://www.sagano-kanko.co.jp/
    - - 运营方问答
      - https://www.sagano-kanko.co.jp/faq/
  status: 按车次预约
tickets:
  - id: sagano-adult-one-way
    name: 嵯峨野小火车成人单程
    category: transport
    audience: adult
    currency: JPY
    amount: 880
    priceStatus: reference
    checked: 2026-09-12
    source: https://www.kameoka.info/seeing/tram.php
    note: 龟冈市观光协会与京都府观光联盟列成人单程参考价；运营方票价页本次读取未显示个人票价数字。实际10/2车次以购票页面为准；已含在交通总预留，不能另加入门票。
    sources:
      - - 京都府观光联盟
        - https://www.kyoto-kankou.or.jp/info_search/2815
      - - 运营方票价与订票
        - https://www.sagano-kanko.co.jp/ticket/
    booking: https://ars-saganokanko.triplabo.jp/home
```

## 地点 · 小火车嵯峨站

```yaml journey:place
id: saga
name: 小火车嵯峨站
lat: 35.0187
lng: 135.6806
mapQuery: Torokko Saga Station
hoursFrom: kameoka
```

## 地点 · 保津川漂流（保津川游船）

2026-09-15核查。保津川下り从龟冈单向到岚山，约16公里；这里是上船处，不能在小火车嵯峨站附近直接上这班船。选择第二天游船支线时，从京都站乘JR至龟冈站，北口步行至乘船场，不坐小火车。地址：京都府亀岡市保津町下中島2，咨询0771-22-5846。[游船官网](https://www.hozugawakudari.jp/)；[用户提供的铁路官网介绍](https://www.sagano-kanko.co.jp/tc/spot/89/)

2026年3月10日至12月13日，平日定期船09:00至15:00每小时一班。官网票价页船程约2小时，FAQ约100分钟且随水位变化；排程按约2小时，加接驳、受付和候船余量。10月2日周五按此时段规划，实际运航仍以当日公告为准。[官方时刻](https://www.hozugawakudari.jp/service/timetable)；[官方票价](https://www.hozugawakudari.jp/tickets)；[官方FAQ](https://www.hozugawakudari.jp/faq)

五人可按个人在线预约，官网预约说明称前日截止；无预约可现场排队，但不保证余位或等候长度。官网旧“个人预约案内”与当前说明不一致，以预约说明、2026/8/4公告及实际购票页面为准。小火车与船分开确认，五人同船需求随预订核实；未订票。票价每位成人6,000日元，五位成人30,000日元。[官方预约说明](https://www.hozugawakudari.jp/tickets/reservation)；[当日券公告](https://www.hozugawakudari.jp/emergency/43635)

```yaml journey:place
id: hozu-board
name: 保津川漂流（保津川游船）
mapQuery: 35.017202,135.5868593
mapUrl: https://maps.app.goo.gl/qsj8R7UKqQ3Bv2L78
lat: 35.017202
lng: 135.5868593
coordinateSource: https://maps.app.goo.gl/qsj8R7UKqQ3Bv2L78
duration: 船程按约2小时规划；接驳、受付及候船另计
checked: 2026-09-15
coordinateNote: 用户指定Google地点的3d/4d坐标，2026-09-15核对；不是地图视角中心。到场后前往建筑二楼受付，实际登船位置听从工作人员指引。
photoStatus: 待补充对应地点照片
hours:
  scope: 2026/3/10至12/13平日定期船
  open: 09:00／10:00／11:00／12:00／13:00／14:00／15:00
  last: 须在预约时刻前办理受付；本支线优先上午船
  close: 常规定期船末班15:00
  note: >-
    导航目的地：保津川下り乗船場（龟冈），地址京都府亀岡市保津町下中島2；咨询0771-22-5846。
    到场先去乘船场建筑2楼受付报到，再按工作人员指引登船，不直接到河边等船。
    当前路线：京都站乘JR山阴本线（嵯峨野线）到JR亀岡駅，走北口，步行约8分钟到乘船场，勿走南口；五人可留10–15分钟步行余量。
    JR龟冈站与小火车龟冈站不是同一站；本支线不坐小火车、不乘小火车站接驳巴士。目标09:15–09:30抵达受付，优先10:00船，具体报到要求以订单为准。
    官方文章标注2011年发布，接驳班次、票价与现场动线需行前复核；天气水位可能导致停航，10/2余位尚未确认。
  sources:
    - - 官方JR北口步行指引
      - https://www.hozugawakudari.jp/blog/保津川下り・・・
    - - 官方JR步行指引视频
      - https://www.youtube.com/watch?v=GoaQWTE-8aY
    - - 官方小火车接驳与二楼受付指引
      - https://www.hozugawakudari.jp/blog/経路案内・トロッコ編
    - - 官方乘船场周边交通图
      - https://www.hozugawakudari.jp/access
    - - 官方指定Google地图地点
      - https://maps.google.co.jp/maps?cid=16382368630482245859
    - - 官方2026年时刻表
      - https://www.hozugawakudari.jp/service/timetable
    - - 官方预约说明
      - https://www.hozugawakudari.jp/tickets/reservation
  status: 2026-09-15核查；非订票确认
tickets:
  - id: hozu-adult
    name: 保津川游船定期乘合船
    category: experience
    audience: adult
    currency: JPY
    amount: 6000
    priceStatus: verified
    checked: 2026-09-15
    source: https://www.hozugawakudari.jp/tickets
    booking: https://www.hozugawakudari.jp/tickets/reservation
    note: 每位成人；五位成人合计30000日元，仅选择游船支线时计入，JR及返程交通另计。
```

## 地点 · 保津川游船岚山下船场

此处为保津川下り在岚山的着船场，位于渡月桥上游一带；不是龟冈售票乘船场，也不是岚山当地短程租船的码头。以[运营方交通图](https://www.hozugawakudari.jp/access)及[FAQ中“保津川下り着船場”地图入口](https://www.hozugawakudari.jp/faq)定位。官网列下船场步行至JR嵯峨岚山站约15–20分钟，这是直接返程走法，不能当作游玩到爱宕念佛寺的时间。

```yaml journey:place
id: hozu-land
name: 保津川游船岚山下船场
mapQuery: Hozugawa River Boat Ride End Point
mapUrl: https://maps.google.com/?cid=8699325452857230238
lat: 35.0132166
lng: 135.6731493
coordinateSource: Google Places ChIJr-wW1QCqAWARnsMRi2g2ung
duration: 下船整理、洗手间及休息预留15分钟
checked: 2026-09-15
coordinateNote: 2026-09-15通过Google Places核对Hozugawa River Boat Ride End Point坐标；此处仅为岚山下船场，不是龟冈乘船场。
photoStatus: 待补充对应地点照片
```

## 地点 · 爱宕念佛寺

2026-09-15补充：游船支线由岚山步行上行至本寺，游览后首选打车下山到JR嵯峨岚山站，避免重复走回。寺院官网列车站至寺院出租车约5分钟、约1,500日元／车，仅作相反方向参考；返程按行车10–15分钟加叫车等待规划，实际费用与到位时间另核。五人安排两辆普通车或确认可载五名乘客的车型，不能把一辆普通车当五人车；提前约回程车，不默认寺门口有候客车辆。出租车是支线的返程交通，不另画交通分支。官网同时注明从车站步行约1小时且多上坡，不能把本支线当作全程轻松下坡。[寺院官方交通及开放信息](https://www.otagiji.com/visit-en)

```yaml journey:place
id: otagi
name: 爱宕念佛寺
lat: 35.031143
lng: 135.661555
mapQuery: Otagi Nenbutsuji Kyoto
duration: 建议游览 45–60分钟
hours:
  scope: 爱宕念佛寺境内
  open: 09:00–16:00
  last: 官网未单列，待向寺院确认
  close: 16:00结束开放
  note: 周三、周六关闭；当前安排10/2周五。不要沿用旧攻略的08:00–17:00或16:45受付信息。
  sources:
    - - 寺院官方开放信息
      - https://www.otagiji.com/visit-en
  status: 未单列最晚入场
tickets:
  - id: otagi-adult
    name: 爱宕念佛寺普通入场
    category: admission
    audience: adult
    currency: JPY
    amount: 1000
    priceStatus: verified
    checked: 2026-09-12
    source: https://www.otagiji.com/visit-en
    note: 普通成人单人入场，不采用团体或儿童优惠。
```

## 地点 · 嵯峨鸟居本

```yaml journey:place
id: toriimoto
name: 嵯峨鸟居本
lat: 35.025766
lng: 135.667776
mapQuery: Saga Toriimoto Preserved Street
duration: 建议街区短逛 20–30分钟；午饭另留45–60分钟
hours:
  scope: 嵯峨鸟居本老街
  open: 户外散步区域；未查到统一门禁时刻
  last: 不适用统一景区检票；现场限制优先
  close: 官方介绍未列统一闭园时间
  note: 当前走旧街道，不含町并保存馆或化野念佛寺入内；那些设施的关门时间不适用于整条老街，沿街午餐店仍需另核。
  sources:
    - - 京都官方地区介绍
      - https://totteoki.kyoto.travel/27165/
  status: 公共户外
```

## 地点 · 落柿舍周边

```yaml journey:place
id: rakushisha
name: 落柿舍周边
lat: 35.020476
lng: 135.670863
mapQuery: Rakushisha Kyoto
duration: 建议周边游览 15–20分钟
hours:
  scope: 落柿舍周边；如临时选择入内
  open: 入内参考10:00–17:00；当前主线只走周边
  last: 最晚入内时间未单列
  close: 入内参观17:00结束
  note: 京都市观光页列10:00开门，JR东海观光页仍列09:00，来源有差异。若决定入内，按10:00后安排并向现场确认；周边道路不套用院内时间。
  sources:
    - - 京都市官方观光页
      - https://ja.kyoto.travel/tourism/single01.php?category_id=8&tourism_id=710
    - - JR东海观光页（时间有差异）
      - https://souda-kyoto.jp/guide/spot/rakushisha.html
  status: 来源时间有差异
tickets:
  - id: rakushisha-adult
    name: 落柿舍入内参观
    category: admission
    audience: adult
    currency: JPY
    amount: 300
    priceStatus: reference
    checked: 2026-09-12
    source: https://souda-kyoto.jp/guide/spot/rakushisha.html
    note: JR东海旅游页成人参考价，标注通常含税；不是景点运营方直接报价，临时入内前再核。当前只游览周边，不计入主线。
```

## 地点 · 岚山竹林

```yaml journey:place
id: bamboo
name: 岚山竹林
lat: 35.016819
lng: 135.671301
mapQuery: Arashiyama Bamboo Forest
duration: 建议游览 20–30分钟
hours:
  scope: 岚山竹林小径・公共通行段
  open: 户外散步区域；未查到统一门禁时刻
  last: 不适用统一景区检票；现场限制优先
  close: 官方介绍未列统一闭园时间
  note: 这里指主线竹林小径；不含另有门禁的竹林散策路、寺院或私人庭园。普通散步与季节灯光活动时间分开，当前安排白天下午。
  sources:
    - - 京都官方徒步路线介绍
      - https://plus.kyoto.travel/entry/trail_nishiyama01
  status: 公共户外
```

## 地点 · 渡月桥

```yaml journey:place
id: togetsu
name: 渡月桥
lat: 35.012877
lng: 135.677775
mapQuery: Togetsukyo Bridge Kyoto
duration: 建议河畔游览 20–40分钟
hours:
  scope: 渡月桥与相邻河畔
  open: 户外散步区域；未查到统一门禁时刻
  last: 不适用统一景区检票；现场限制优先
  close: 官方介绍未列统一闭园时间
  note: 按公共步行段规划；保津川游船仅在第二天可选支线加入，其他河边收费项目未安排。
  sources:
    - - 京都官方岚山地区地图
      - https://ja.kyoto.travel/doc/pdf/map/areamap_saga_arashiyama.pdf
  status: 公共户外
```

## 地点 · 八坂神社

```yaml journey:place
id: yasaka
name: 八坂神社
lat: 35.0037
lng: 135.7785
mapQuery: Yasaka Shrine Kyoto
duration: 建议参拜 20–30分钟
hours:
  scope: 八坂神社境内参拜
  open: 24小时可参拜
  last: 境内参拜无每日入场截止
  close: 境内无每日闭门时刻
  note: 社务所09:00–17:00、祈祷受付09:00–16:00；晚饭前后可看境内，但不能据此保证夜间仍有御朱印等服务。
  sources:
    - - 八坂神社参拜说明
      - https://www.yasaka-jinja.or.jp/sanpai/?display=sp
  status: 全天参拜
```

## 地点 · 花见小路

```yaml journey:place
id: hanami
name: 花见小路
lat: 35.0016
lng: 135.7751
mapQuery: Hanamikoji Street Kyoto
duration: 建议漫步 15–20分钟
hours:
  scope: 花见小路公共通行段
  open: 户外散步区域；未查到统一门禁时刻
  last: 不适用统一景区检票；现场限制优先
  close: 官方介绍未列统一闭园时间
  note: 沿可通行街道夜游；私有小巷与茶屋不属于随时可进入的景区，遵守入口及拍摄标识。
  sources:
    - - 京都市官方祇园地区介绍
      - https://ja.kyoto.travel/area/area06.php
  status: 公共户外
```

## 地点 · 祇园白川

```yaml journey:place
id: shirakawa
name: 祇园白川
lat: 35.0056
lng: 135.7745
mapQuery: Gion Shirakawa
duration: 建议游览 15–20分钟
hours:
  scope: 祇园白川・巽桥周边
  open: 户外散步区域；未查到统一门禁时刻
  last: 不适用统一景区检票；现场限制优先
  close: 官方介绍未列统一闭园时间
  note: 安排公共道路短距离夜游；店内、私有通道的准入与营业时间另计。
  sources:
    - - 京都市官方祇园地区介绍
      - https://ja.kyoto.travel/area/area06.php
  status: 公共户外
```

## 地点 · 祇园四条站

```yaml journey:place
id: gionshijo
name: 祇园四条站
lat: 35.0031
lng: 135.7723
mapQuery: Gion Shijo Station
```

## 地点 · 永观堂（禅林寺）

2026-09-21补充：第三天上午首站，安排普通入内参观后步行至若王子桥、由南向北走哲学之道。建议参观45–60分钟，是本行程预留；不强求登高或走遍所有院内角落。常规受付09:00–16:00、17:00闭门，成人普通票1,000日元；不套用旧攻略的600日元或秋季夜间特别参观规则。[官方参观说明](https://www.eikando.or.jp/English/haikan_e.html)；[官方普通票价](https://www.eikando.or.jp/pdf/haikanryo.pdf)

```yaml journey:place
id: eikando
name: 永观堂（禅林寺）
mapQuery: 永観堂 禅林寺 京都
duration: 建议参观45–60分钟
checked: 2026-09-21
coordinateNote: 官方活动页Google地点坐标
photoStatus: 待补充对应地点照片
hours:
  scope: 普通日间参观
  open: 09:00–17:00
  last: 16:00受付结束
  close: 17:00闭门
  note: 法务或活动可能影响部分区域，特别参观另核。
  sources:
    - - 永观堂官方参观说明
      - https://www.eikando.or.jp/English/haikan_e.html
  status: 2026-09-21核查
tickets:
  - id: eikando-adult
    name: 永观堂普通参观
    category: admission
    audience: adult
    currency: JPY
    amount: 1000
    priceStatus: verified
    checked: 2026-09-21
    source: https://www.eikando.or.jp/pdf/haikanryo.pdf
    note: 普通成人单人票，不含特别参观。
lat: 35.0145812
lng: 135.7943607
```

## 地点 · 银阁寺（慈照寺）

2026-09-21补充：第三天正式游览地点，和“银阁寺桥附近・小道北端”分别建档，避免只走到桥便当作已参观寺院。官网普通参观约30分钟，行程留45–60分钟慢游；不自动加入特別拝観。10月受付08:30–17:00，17:20前下山离场；成人普通票1,000日元。展望所等部分区域有台阶，可按体力采用寺院公布的绕行路径。[官方开放及票价](https://www.shokoku-ji.jp/ginkakuji/access/)；[官方FAQ](https://www.shokoku-ji.jp/ginkakuji/faq/)

```yaml journey:place
id: ginkakuji-temple
name: 银阁寺（慈照寺）
mapQuery: 銀閣寺 慈照寺 京都市左京区銀閣寺町2
duration: 建议参观45–60分钟，官网普通参观参考约30分钟
checked: 2026-09-21
coordinateNote: 官方交通页地图中心；具体入寺入口以现场指引为准
photoStatus: 待补充对应地点照片
hours:
  scope: 3月至11月普通参观
  open: 08:30–17:00
  last: 17:00最后入场
  close: 17:20前下山离场
  note: 本次10/3适用夏期时段；特別拝観不包含在本安排。
  sources:
    - - 银阁寺官方参观说明
      - https://www.shokoku-ji.jp/ginkakuji/access/
    - - 银阁寺官方FAQ
      - https://www.shokoku-ji.jp/ginkakuji/faq/
  status: 2026-09-21核查
tickets:
  - id: ginkakuji-adult
    name: 银阁寺普通参观
    category: admission
    audience: adult
    currency: JPY
    amount: 1000
    priceStatus: verified
    checked: 2026-09-21
    source: https://www.shokoku-ji.jp/ginkakuji/access/
    note: 普通成人单人票，不含特別拝観。
lat: 35.027021298771984
lng: 135.79765862926578
```

## 地点 · 若王子桥・哲学小道南端

```yaml journey:place
id: nyakuoji
name: 若王子桥・哲学小道南端
lat: 35.0209
lng: 135.7942
mapQuery: Nyakuoji Bridge Kyoto
duration: 哲学小道全段建议 60–90分钟，至银阁寺桥附近
hours:
  scope: 哲学小道・若王子桥至北端
  open: 户外散步区域；未查到统一门禁时刻
  last: 不适用统一景区检票；现场限制优先
  close: 官方介绍未列统一闭园时间
  note: 官方按约2公里散步道介绍，未列营业或门禁时刻；当前主线在步道前后分别参观永观堂及银阁寺；不自动加入若王子神社或其他沿线寺院。
  sources:
    - - 京都市官方哲学之道介绍
      - https://ja.kyoto.travel/tourism/single01.php?tourism_id=2684
  status: 公共户外
```

## 地点 · 银阁寺桥附近・小道北端

```yaml journey:place
id: ginkaku
name: 银阁寺桥附近・小道北端
lat: 35.027
lng: 135.793
mapQuery: Ginkakuji Bridge Kyoto
duration: 银阁寺桥途经约5–10分钟；午餐另安排
hoursFrom: nyakuoji
```

## 地点 · 出町柳站

```yaml journey:place
id: demachi
name: 出町柳站
lat: 35.0306
lng: 135.773
mapQuery: Demachiyanagi Station
```

## 地点 · 贵船口站

```yaml journey:place
id: kibuneguchi
name: 贵船口站
lat: 35.1058
lng: 135.7633
mapQuery: Kibuneguchi Station
```

## 地点 · 贵船神社本宫

```yaml journey:place
id: kifune
name: 贵船神社本宫
lat: 35.1217
lng: 135.7629
mapQuery: Kifune Shrine
duration: 本宫＋近处溪边建议 60–90分钟；等灯笼另留约30分钟
hours:
  scope: 贵船神社本宫
  open: 06:00–20:00（5/1–11/30）
  last: 官网未单列，需在闭门前完成参拜
  close: 20:00闭门
  note: 授与所09:00–17:00；灯笼从日落亮至闭门。本宫门禁不代表33路巴士会运营至20:00，也不直接适用于奥宫。
  sources:
    - - 贵船神社参拜说明
      - https://kifunejinja.jp/en/info/
  status: 未单列最晚入场
tickets:
  - id: kifune-main-admission
    name: 贵船神社本宫参拜
    category: admission
    audience: adult
    currency: JPY
    amount: 0
    priceStatus: verified
    checked: 2026-09-12
    source: https://kifunejinja.jp/en/info/
    note: 官网明确免费参拜；御守、御朱印等另计。
```

## 地点 · 贵船奥宫方向

```yaml journey:place
id: okumiya
name: 贵船奥宫方向
lat: 35.1281
lng: 135.7651
mapQuery: Kifune Shrine Okumiya
duration: 备选支线另加 30–45分钟，含往返
hours:
  scope: 贵船奥宫方向・备选
  open: 未查到奥宫单独的明确开放时段
  last: 待确认
  close: 待确认；不套用本宫20:00
  note: 官网介绍三社参拜，但明确的06:00–20:00标在本宫。奥宫仅作白天余力支线，夜间可入范围未确认。
  sources:
    - - 贵船神社三社参拜说明
      - https://kifunejinja.jp/info/
  status: 时间待确认
```

## 地点 · 伏见稻荷大社

```yaml journey:place
id: inari
name: 伏见稻荷大社
lat: 34.9671
lng: 135.7727
mapQuery: Fushimi Inari Taisha
duration: 建议短线游览 60–75分钟，含鸟居内部步行，不登顶
hours:
  scope: 伏见稻荷境内・千本鸟居短线
  open: 昼夜均可参拜
  last: 自由参拜区域无每日验票截止
  close: 该参拜区域未设每日闭门时刻
  note: 依据京都市官方“昼夜参拜可能”。神职服务、御朱印和店铺另有时间；当前只走本殿外、鸟居与奥社附近，不登顶。
  sources:
    - - 京都市官方参拜信息
      - https://ja.kyoto.travel/tourism/single01.php?category_id=7&tourism_id=448
  status: 昼夜参拜
```

## 地点 · Hotel Trend JR Uji Ekimae

```yaml journey:place
id: uji
name: Hotel Trend JR Uji Ekimae
lat: 34.8887
lng: 135.8008166667
mapQuery: Hotel Trend JR Uji Ekimae 19-2 Uji Ichiban
hours:
  scope: 已预订住宿 · 2026/10/4–10/5（日本当地时间）
  open: 10/4 15:00起办理入住
  last: 订单入住窗口至24:00；晚到请提前联系酒店
  close: 10/5 10:00前退房
  note: 已预订2026/10/4–10/5，4位成人、2间房、1晚。禁烟双床房1间（2张单人床，2人，19,800 JPY）＋禁烟双人房1间（1张双人床，2人，17,600 JPY），均不含餐。4位成人、2间房、1晚：含10%增值税房费总额37,400 JPY（日元）；Booking.com支付／补贴4,080 JPY，扣减后计算金额33,320 JPY。确认信不据此证明旅客已付款或待付金额，付款状态以订单为准；额外服务不包含。入住10/4 15:00–24:00；10/5 10:00前退房（日本当地时间）。建议花火前办妥入住，15:00前寄存须另向酒店确认。地址：〒611-0021 京都府宇治市宇治壱番19-2；电话+81 774 20 3200。取消：入住前1天之前免费，临近1天内取消或未入住收全额；具体截止时刻以订单为准。
  status: 已核对用户提供的预订确认信
hotel:
  name: Hotel Trend JR Uji Ekimae
  area: 宇治 · JR宇治站南口 · 京都府宇治市宇治壱番19-2
  url: https://hotel-trend.jp/uji/
  note: 已预订2026/10/4–10/5，4位成人、2间房、1晚。禁烟双床房1间（2张单人床，2人，19,800 JPY）＋禁烟双人房1间（1张双人床，2人，17,600 JPY），均不含餐。4位成人、2间房、1晚：含10%增值税房费总额37,400 JPY（日元）；Booking.com支付／补贴4,080 JPY，扣减后计算金额33,320 JPY。确认信不据此证明旅客已付款或待付金额，付款状态以订单为准；额外服务不包含。入住10/4 15:00–24:00；10/5 10:00前退房（日本当地时间）。建议花火前办妥入住，15:00前寄存须另向酒店确认。地址：〒611-0021 京都府宇治市宇治壱番19-2；电话+81 774 20 3200。取消：入住前1天之前免费，临近1天内取消或未入住收全额；具体截止时刻以订单为准。
  status: 已预订 · 10/4–10/5 · 4位成人／2间房／1晚
```

## 地点 · JR宇治站

```yaml journey:place
id: ujist
name: JR宇治站
lat: 34.8904
lng: 135.8008
mapQuery: Uji Station JR
```

## 地点 · 平等院表参道

```yaml journey:place
id: omotesando
name: 平等院表参道
lat: 34.8906
lng: 135.8076
mapQuery: Byodoin Omotesando
duration: 建议茶店街区 45–60分钟；午饭另留45–60分钟
hours:
  scope: 平等院表参道商店街
  open: 户外散步区域；未查到统一门禁时刻
  last: 不适用统一景区检票；现场限制优先
  close: 官方介绍未列统一闭园时间
  note: 主线是茶店与午餐，未包含平等院寺院入内；不能把平等院庭园关门时刻当作商店街统一时间，茶店需各自确认。
  sources:
    - - 宇治观光协会步行路线
      - https://www.kyoto-uji-kankou.or.jp/guide/course09.html
  status: 公共户外
```

## 地点 · 对凤庵

```yaml journey:place
id: taihoan
name: 对凤庵
lat: 34.8888
lng: 135.809
mapQuery: Taihoan Uji
duration: 薄茶体验20–30分钟；含报到留30–45分钟
hours:
  scope: 对凤庵・薄茶茶席候选
  open: 10:00–16:00
  last: 抹茶最后开席15:30；须至少提前10分钟换取茶席券
  close: 16:00茶席结束
  note: 15:30是最后开始时间，不是可随时到场的门票截止。煎茶最后开席15:20、仅指定日提供；所订项目和场次优先。年内1/10–12/20开席，月末休席（遇周末节假日提前），预约仍未完成。
  sources:
    - - 官方茶席问答PDF
      - https://www.kyoto-uji-kankou.or.jp/pdf/taihoan-faq.pdf
    - - 茶席安排与预约
      - https://www.kyoto-uji-kankou.or.jp/taihoan.html
  status: 已公布最后开席
tickets:
  - id: taihoan-usucha
    name: 对凤庵薄茶体验
    category: experience
    audience: adult
    currency: JPY
    amount: 1500
    priceStatus: verified
    checked: 2026-09-12
    source: https://www.kyoto-uji-kankou.or.jp/taihoan-en.html
    note: 含税；当前主线选择薄茶，约20–30分钟，尚未预约。
    booking: https://www.kyoto-uji-kankou.or.jp/taihoan-en.html
  - id: taihoan-matcha-making
    name: 对凤庵抹茶点前体验
    category: experience
    audience: adult
    currency: JPY
    amount: 3600
    priceStatus: verified
    checked: 2026-09-12
    source: https://www.kyoto-uji-kankou.or.jp/taihoan-en.html
    note: 含税；替换薄茶时才采用，不与薄茶费用相加；约40分钟，官方要求提前三天预约。
    booking: https://www.kyoto-uji-kankou.or.jp/taihoan-en.html
```

## 地点 · 宇治桥

```yaml journey:place
id: ujibridge
name: 宇治桥
lat: 34.8936
lng: 135.8064
mapQuery: Uji Bridge
duration: 建议河畔游览 20–30分钟
hours:
  scope: 宇治桥与公共河岸
  open: 户外散步区域；未查到统一门禁时刻
  last: 不适用统一景区检票；现场限制优先
  close: 官方介绍未列统一闭园时间
  note: 桥上及河岸短游；不含游船、鵜饲或收费设施。河岸局部封闭与桥梁通行情况以当天标识为准。
  sources:
    - - 宇治观光协会景点介绍
      - https://www.kyoto-uji-kankou.or.jp/tourism-en.html
  status: 公共户外
```

## 地点 · JR长池站

```yaml journey:place
id: nagaike
name: JR长池站
lat: 34.8418
lng: 135.7903
mapQuery: Nagaike Station Kyoto
```

## 地点 · 木津川运动公园・花火会场

```yaml journey:place
id: fireworks
name: 木津川运动公园・花火会场
lat: 34.846066
lng: 135.796123
mapQuery: 京都府立木津川運動公園（城陽五里五里の丘）
duration: 花火约40分钟；提前入场、等候和散场另留90–150分钟
hours:
  scope: 城阳秋花火2026・10/4专用会场
  open: 14:00开场
  last: 市政府及主办方页面未单列最终检票截止，待票面/入场细则确认
  close: 21:00闭场
  note: 花火19:00开始约40分钟；行程目标18:00–18:15入场是人流预留，不是官方截止。当日公园临时休园，需前卖票入场，无现场售票；不套用公园平日开放时间。
  sources:
    - - 公园官网｜城阳五里五里之丘
      - https://fmtpark.com/
    - - 城阳市2026花火公告
      - https://www.city.joyo.kyoto.jp/joint/0000012600.html
    - - 主办方2026专题
      - https://xn--6oqz6c35b6zh48ipn2e0ys.jp/hanabi/2026/index.html
  status: 未单列最晚入场
  ticketSales:
    - label: 购票安排
      text: 需使用闲鱼代买服务（团队购票计划，尚未购买；非主办方官方售票渠道）。
      name: ""
      url: ""
    - label: 线上购票
      text: Ticket Pia：2,500 JPY／人；手续费以结账为准。2026/10/3
        17:00（日本时间）停售，售完提前结束。普通会员购票需日本电话号码认证。
      name: Ticket Pia 售票入口
      url: https://t.pia.jp/en/pia/event/event.do?eventBundleCd=b2669988
    - label: 线下售票
      text: 城阳市观光协会：2,000 JPY／人；09:00–17:00，周三休息。
      name: 城阳市观光协会 · Google 地图
      query: 一般社団法人 城陽市観光協会 京都府城陽市寺田樋尻44-8
    - label: 线下售票
      text: 京都府立木津川运动公园：2,000 JPY／人；09:00–17:00，周四休息。
      name: 木津川运动公园 · Google 地图
      query: 京都府立木津川運動公園（城陽五里五里の丘）
    - label: 线下售票
      text: 文化パルク城阳：2,000 JPY／人；09:00–17:00，周一休息。
      name: 文化パルク城阳 · Google 地图
      query: 文化パルク城陽 京都府城陽市
tickets:
  - id: joyo-general
    name: 城阳秋花火一般前卖票
    category: admission
    audience: adult
    currency: JPY
    amount: 2000
    priceStatus: verified
    checked: 2026-09-12
    source: https://www.city.joyo.kyoto.jp/joint/0000012600.html
    note: 指定线下售票处一般票；1票1人。仅前卖票，无当天售票，售至10/3或售罄为止。
    eventDate: 2026-10-04
    channel: 线下售票处
    booking: https://xn--6oqz6c35b6zh48ipn2e0ys.jp/hanabi/2026/index.html
  - id: joyo-pia
    name: 城阳秋花火Pia网售票
    category: admission
    audience: adult
    currency: JPY
    amount: 2500
    priceStatus: verified
    checked: 2026-09-12
    source: https://www.city.joyo.kyoto.jp/joint/0000012600.html
    note: Pia网络渠道公布票价，额外平台收费待结算核实并在杂项预留中处理；不要与一般票同时累计。
    eventDate: 2026-10-04
    channel: Pia网售
    booking: https://xn--6oqz6c35b6zh48ipn2e0ys.jp/hanabi/2026/index.html
coordinateSource: https://www.kyoto-kankou.or.jp/info_search/9632
```

## 地点 · 御宿野乃奈良

```yaml journey:place
id: nara
name: 御宿野乃奈良
lat: 34.6827
lng: 135.8201
mapQuery: Onyado Nono Nara
hotel:
  name: 御宿野乃奈良
  area: 奈良 · JR奈良站旁
  url: https://dormy-hotels.com/dormyinn/hotels/nono_nara/
  note: 抵达先寄存，乘公交入公园；晚餐后回房，次日从酒店带行李出发。
  status: 住宿候选 · 尚未预订
```

## 地点 · JR奈良站

```yaml journey:place
id: narast
name: JR奈良站
lat: 34.6804
lng: 135.8189
mapQuery: Nara Station JR
```

## 地点 · 春日大社・林荫参道

```yaml journey:place
id: kasuga
name: 春日大社・林荫参道
lat: 34.6814
lng: 135.8485
mapQuery: Kasuga Taisha Nara
duration: 林荫参道＋看鹿建议 60–90分钟
hours:
  scope: 春日大社・参道与御本社参拜所
  open: 御本社参拜所06:30–17:30（3–10月）
  last: 普通参拜所未单列；特別参拜09:00–16:00，最晚受付未另列
  close: 御本社参拜所17:30；特別参拜16:00结束
  note: 这里采用官网“基本信息”的分季节时刻；页眉另显示06:00–18:00，信息有差异，按较短窗口安排。林荫参道不等于本殿回廊；主线不含收费特別参拜。若加国宝殿：10:00–17:00、16:30止入馆；万叶植物园：09:00–16:30、16:00止入园。
  sources:
    - - 春日大社官方分区时间
      - https://www.kasugataisha.or.jp/about/basic/
  status: 分区开放・来源有差异
tickets:
  - id: kasuga-special
    name: 春日大社御本殿特别参拜
    category: admission
    audience: adult
    currency: JPY
    amount: 700
    priceStatus: verified
    checked: 2026-09-12
    source: https://www.kasugataisha.or.jp/guidance/index/modal-09/
    note: 仅适用于御本殿特别参拜，不是林荫参道通行费；当前未选此项目。
```

## 地点 · 东大寺

```yaml journey:place
id: todaiji
name: 东大寺
lat: 34.689
lng: 135.8398
mapQuery: Todaiji Nara
duration: 备选参观 45–60分钟，往返支线另留时间
hours:
  scope: 东大寺大佛殿・备选入内
  open: 07:30–17:30（4–10月）
  last: 大佛殿最晚验票未在官网单列，待确认
  close: 17:30结束拝观
  note: 如加入，放在午后且留45–60分钟完整参观，不能留到返城时临时冲门。官网17:00最終入館指东大寺博物馆，不是大佛殿；两者必须分开。
  sources:
    - - 东大寺官方拝观时间
      - https://www.todaiji.or.jp/information/haikan/
  status: 未单列最晚入场
tickets:
  - id: todaiji-daibutsuden
    name: 东大寺大佛殿单馆票
    category: admission
    audience: adult
    currency: JPY
    amount: 800
    priceStatus: verified
    checked: 2026-09-12
    source: https://www.todaiji.or.jp/information/haikan/
    note: 成人个人票；目前仅为备选。大佛殿与博物馆套票为另一票种，不能替代单馆票口径；官网注明现金支付。
```

## 地点 · 水谷茶屋附近

```yaml journey:place
id: mizuya
name: 水谷茶屋附近
lat: 34.6837
lng: 135.8482
mapQuery: Mizuya Chaya Nara
duration: 周边停留 15–20分钟；午饭休息另留60–90分钟
hours:
  scope: 水谷茶屋附近；若选择在茶屋休息
  open: 店内11:00–16:00
  last: 最后点单15:30；最晚入店未单列
  close: 店内16:00结束营业
  note: 店家官网列周二、周三休息，10/5周一仍须留意临时日历。当前这里只是午休区域，餐厅未选定；最后点单不等于保证15:30前均可入座。
  sources:
    - - 水谷茶屋店家官网
      - https://sites.google.com/view/mizuyachaya-kasugano--winter/%E3%83%9B%E3%83%BC%E3%83%A0?authuser=0
  status: 已公布最后点单
```

## 地点 · 若草山南侧山麓

```yaml journey:place
id: wakakusa
name: 若草山南侧山麓
lat: 34.6884
lng: 135.8482
mapQuery: Kotono yado Musashino Nara
hours:
  scope: 若草山南麓→收费草坡入口
  open: 常规开山09:00–17:00（10月在开山期内）
  last: 官方未单列“最晚入山”；需另留上山、观景、下山时间
  close: 17:00结束开放；本行程按此前退出安排
  note: 官方步道图的北门标到16:30、南门到17:00；当前走南侧。10/5日落约17:36，普通开放时段不支持草坡等到完整日落；图中出口标识不能当作获准闭门后停留。
  sources:
    - - 奈良县若草山开放信息
      - https://www.pref.nara.lg.jp/site/park/2585.html
    - - 官方步道与门禁图
      - https://www.pref.nara.lg.jp/documents/2378/20251023155602.pdf
  status: 未单列最晚入场
```

## 地点 · 若草山一重目草坡

```yaml journey:place
id: hill
name: 若草山一重目草坡
lat: 34.6897
lng: 135.851
mapQuery: Wakakusayama Ichijume
duration: 一重目停留 20–30分钟；上下坡另留30–40分钟
hoursFrom: wakakusa
tickets:
  - id: wakakusa-adult
    name: 若草山个人入山票
    category: admission
    audience: adult
    currency: JPY
    amount: 150
    priceStatus: verified
    checked: 2026-09-12
    source: https://www.pref.nara.lg.jp/site/park/2585.html
    note: 成人个人票；五人不满足30人团体优惠。只在入山时计一次，不因往返山麓再收费。
```

## 地点 · 东大寺南大门

```yaml journey:place
id: nandaimon
name: 东大寺南大门
lat: 34.6858
lng: 135.8392
mapQuery: Todaiji Nandaimon
duration: 途经外观 10–15分钟
hours:
  scope: 东大寺南大门・外部经过
  open: 外部通行；寺方未单列南大门参观时间
  last: 外部经过不进入大佛殿检票区；南大门未单列入场截止
  close: 南大门外部未查到统一关闭时刻
  note: 2026-09-14起随东大寺支线备选，主路线不再安排外观停留。大佛殿10月07:30–17:30是另一收费区域的拝观窗口，不能据此判断南大门关闭；遇现场围挡按开放路线绕行。
  sources:
    - - 东大寺分区拝观说明
      - https://www.todaiji.or.jp/information/haikan/
  status: 外部经过
```

## 地点 · 近铁奈良・晚餐区域

```yaml journey:place
id: kintetsunara
name: 近铁奈良站
lat: 34.6844
lng: 135.8276
mapQuery: Kintetsu Nara Station
duration: 进站与换乘按当次交通安排预留
```

## 地点 · 三宫站

```yaml journey:place
id: sannomiya
name: 三宫站
lat: 34.693
lng: 135.1947
mapQuery: Sannomiya Station Kobe
```

## 地点 · 三宫たびサポ・寄存候选

```yaml journey:place
id: storage
name: 三宫たびサポ・寄存候选
lat: 34.692949
lng: 135.192816
mapQuery: Kobe Sannomiya Tabisapo
```

## 地点 · 白鹤酒造资料馆

```yaml journey:place
id: hakutsuru
name: 白鹤酒造资料馆
lat: 34.7147
lng: 135.2608
mapQuery: Hakutsuru Sake Brewery Museum
duration: 建议参观 60–75分钟
hours:
  scope: 白鹤酒造资料馆
  open: 09:30–16:30
  last: 16:00停止入馆
  close: 16:30闭馆
  note: 当前10/6用常规时刻。10/3酒藏开放活动改为10:00开馆，不能套到10/6；5人自由参观无需团体预约，临时休馆以官网为准。
  sources:
    - - 白鹤酒造官方入馆说明
      - https://www.hakutsuru.co.jp/community/shiryo/?trflg=1
  status: 已公布最晚入场
tickets:
  - id: hakutsuru-admission
    name: 白鹤酒造资料馆入馆
    category: admission
    audience: adult
    currency: JPY
    amount: 0
    priceStatus: verified
    checked: 2026-09-12
    source: https://www.hakutsuru.co.jp/community/shiryo/?trflg=1
    note: 官网明确免费；五人无需团体预约。购物和另付费消费不在免费范围内。
```

## 地点 · 阪神住吉站

```yaml journey:place
id: sumiyoshi
name: 阪神住吉站
lat: 34.7132
lng: 135.2611
mapQuery: Sumiyoshi Station Hanshin
```

## 地点 · JR须磨站

```yaml journey:place
id: suma
name: JR须磨站
lat: 34.6423
lng: 135.1127
mapQuery: Suma Station JR
```

## 地点 · 须磨站前海边

```yaml journey:place
id: beach
name: 须磨站前海边
lat: 34.6412
lng: 135.1136
mapQuery: Suma Beach
duration: 建议停留90分钟，其中坐下休息至少60分钟
hours:
  scope: JR须磨站前海边・散步休息
  open: 户外散步区域；未查到统一门禁时刻
  last: 不适用统一景区检票；现场限制优先
  close: 官方介绍未列统一闭园时间
  note: 10月只看海、短走和坐下休息；海水浴场夏季管理时间、淋浴设施及咖啡店营业时间不等于公共海岸通行时间。
  sources:
    - - 神户官方海边路线
      - https://www.feel-kobe.jp/model_course/kobe-seaside/
  status: 公共户外
```

## 地点 · 神户元町站

```yaml journey:place
id: motomachi
name: 神户元町站
lat: 34.6895
lng: 135.1873
mapQuery: Motomachi Station Kobe
```

## 地点 · 县厅前站

```yaml journey:place
id: kencho
name: 县厅前站
lat: 34.691037
lng: 135.184026
mapQuery: Kenchomae Station Kobe
```

## 地点 · Venus Bridge

```yaml journey:place
id: venus
name: Venus Bridge
lat: 34.69721
lng: 135.180768
mapQuery: Venus Bridge Kobe
duration: 建议观景 45–60分钟，上下山另计
hours:
  scope: Venus Bridge・展望区域
  open: 户外散步区域；未查到统一门禁时刻
  last: 不适用统一景区检票；现场限制优先
  close: 官方介绍未列统一闭园时间
  note: 神户官方列免费入场并介绍夜景用途，但未单列开闭或最晚进入时刻。可保留黄昏与蓝调计划，出发前复核临时步道封闭；不填未经证实的“24小时”。
  sources:
    - - 神户官方Venus Bridge介绍
      - https://www.feel-kobe.jp/facilities/0000000091/
  status: 公共户外
```

## 地点 · 谷上站

```yaml journey:place
id: tanigami
name: 谷上站
lat: 34.7613
lng: 135.1717
mapQuery: Tanigami Station
```

## 地点 · 有马口站

```yaml journey:place
id: arimaguchi
name: 有马口站
lat: 34.7963
lng: 135.22
mapQuery: Arimaguchi Station
```

## 地点 · 有马温泉站

```yaml journey:place
id: arimast
name: 有马温泉站
lat: 34.7994
lng: 135.2455
mapQuery: Arima Onsen Station
```

## 地点 · 神户市区酒店（待选）

当前第六晚住宿方向，具体酒店尚未选择。当前Plan A第五晚有马、第六晚神户；更早住宿整合仍在讨论，不默认神户连住。须核实寄存、入住时间与五人房型，未预订。

```yaml journey:place
id: kobe-hotel
name: 神户市区酒店（待选）
duration: 住宿
```

## 地点 · 奈良市综合观光案内所（JR奈良站前）

2026-09-14核查：行李服务09:00–16:00、14:00停止收件。五件行李容量待确认；不以开馆时间代替取件截止。[官方服务时间变更](https://narashikanko.or.jp/news/detail_95.html)

```yaml journey:place
id: nara-jr-storage
name: 奈良市综合观光案内所
mapQuery: 奈良市総合観光案内所 JR奈良駅
hours:
  scope: 行李寄存
  open: 09:00–16:00
  last: 14:00停止收件
  close: 16:00
  note: 五人行李容量待核；Plan A目标约13:40取件，不等到截止。
  sources:
    - - 奈良市观光协会官方公告
      - https://narashikanko.or.jp/news/detail_95.html
  status: 2026-09-14核查
lat: 34.6814
lng: 135.8195
coordinateSource: https://www.naracity-guide.com/spots/195
coordinateNote: JR奈良旧站舍区域参考点
```

## 地点 · 有马温泉小镇

Plan A第六天上午至午餐活动区域。具体餐厅尚未选择；第五晚一泊二食仅包含当晚晚餐及次日早餐，第六天小镇午餐另计。

```yaml journey:place
id: arima-town
name: 有马温泉小镇
mapQuery: 有馬温泉 街歩き
duration: 上午按兴致短逛，中午用餐
lat: 34.7974
lng: 135.248
coordinateNote: 温泉小镇区域参考点，非午餐餐厅
```

## 地点 · 有马温泉 御幸荘 花結び

2026-09-14按用户指定，列为Plan A第五晚（2026/10/5）一泊二食首选。五人房型、房量、套餐价格和预订均未确认。

常规15:00入住、10:00退房，特殊套餐另有安排。第六天按早餐后10:00前退房、寄存后逛小镇、午餐后回取行李规划；退房后寄存条件尚待酒店确认。[官方FAQ](https://www.hanamusubi.co.jp/faq/)

官网餐厅页列早餐开餐07:30／08:00／08:30，晚餐开餐18:00／19:00。当前暂以19:00晚餐为预约目标，仍争取17点左右到店休息，不把晚餐开始时间当作最晚入住时间。FAQ与餐厅页对用餐场所的描述不同，实际套餐的用餐地点、五人同席、含餐入住截止和迟到处理须确认。[官方馆内案内](https://www.hanamusubi.co.jp/facilities/)；[官方FAQ](https://www.hanamusubi.co.jp/faq/)

酒店提供有马温泉站及巴士站接送；到站后致电078-904-0166。官网未明确接送时段、五人及行李容量和等待时间；出站至到店暂留20–30分钟仅为规划余量，不能套用鸿胧馆的接驳时段和车程。翌日午餐后送站待联系确认。[官方交通](https://www.hanamusubi.co.jp/access/)

```yaml journey:place
id: hanamusubi
name: 御幸荘 花結び
mapQuery: 御幸荘 花結び 神戸市北区有馬町351
duration: 第五晚一泊二食首选
hotel:
  name: 御幸荘 花結び
  area: 有马温泉
  url: https://www.hanamusubi.co.jp/
  booking: https://www.hanamusubi.co.jp/
  note: 常规15:00入住、10:00退房；晚餐18:00／19:00开餐，暂以19:00为预约目标。五人房型、餐食安排、退房后寄存及午餐后送站待确认。
  status: 用户指定首选，未预订；官网外观照片已补
  shuttle: https://www.hanamusubi.co.jp/access/
lat: 34.796301
lng: 135.25009
coordinateSource: https://www.hanamusubi.co.jp/access/
coordinateNote: 官网嵌入地图区域参考点；到站电话接驳
hours:
  scope: 花結び・住客入住与餐食
  open: 常规15:00入住
  last: 含晚餐方案最晚入住时间待酒店确认
  close: 翌日10:00退房
  note: 晚餐18:00／19:00开餐，目标19:00待预约；早餐07:30／08:00／08:30开餐。退房后寄存和午餐后送站待确认。
  sources:
    - - 酒店FAQ
      - https://www.hanamusubi.co.jp/faq/
    - - 馆内餐厅
      - https://www.hanamusubi.co.jp/facilities/
    - - 接驳说明
      - https://www.hanamusubi.co.jp/access/
  status: 2026-09-14核查
photo:
  kind: official
  src: photos/hanamusubi.jpg
  thumbnail: photos/thumbs/hanamusubi.jpg
  width: 450
  height: 320
  thumbnailWidth: 450
  thumbnailHeight: 320
  alt: 御幸荘 花結び酒店外观参考
  caption: 花結び官网外观参考；未预订。
  author: 御幸荘 花結び
  license: 官网图片 · 版权所有
  source: https://www.hanamusubi.co.jp/access/
  note: 仅作住宿地点参考，具体房型以预订为准。
```

## 地点 · 大阪站

```yaml journey:place
id: osakast
name: 大阪站
mapQuery: Osaka Station
lat: 34.7025
lng: 135.4959
coordinateNote: 大阪站区域参考点，换乘出口待定
```

## 地点 · 有马温泉 月光园 鸿胧馆

2026-09-14核查。日文名：月光園 鴻朧館；前次交通测算使用的酒店示例；当前Plan A第五晚首选已改为御幸荘 花結び。本馆保留比较资料，不再作为当前路线图住宿节点，未预订。不同于姊妹馆游月山庄，套餐用餐地点与形式须分别确认。

官网FAQ：入住15:00–19:00、退房12:00，特殊套餐优先；会席料理时段17:30–19:30、用餐约2小时，五人同席可在预约时提出。具体10/5晚餐起始时间及含餐入住截止须按套餐确认，不把19:30直接理解为可以19:30才到店。鴻朧館大浴场06:00–08:00、09:00–24:00。[官方FAQ](https://kouroukan.com/faq/)

接驳08:00–19:00，到有马温泉站后致电078-903-5503。FAQ称等5–10分钟、交通页称10–15分钟，保守采用后者；车程约5分钟，连同出站和装五人行李预留20–30分钟。19点后接驳不保证；不默认出租车一定更快。[官方交通](https://kouroukan.com/access/)

```yaml journey:place
id: gekkoen-kouroukan
name: 有马温泉 月光园 鸿胧馆
mapQuery: 月光園 鴻朧館 神戸市北区有馬町318
duration: 第五晚一泊二食测算候选
hotel:
  name: 月光園 鴻朧館
  area: 有马温泉
  url: https://kouroukan.com/
  booking: https://kouroukan.com/plan/
  note: 常规15:00–19:00入住、12:00退房；晚餐具体起始时段、五人同席、10/5套餐与余房待确认。
  status: 2026-09-14核查；测算候选，未预订，坐标与配图待补
  shuttle: https://kouroukan.com/access/
hours:
  scope: 鴻朧館住客大浴场
  open: 06:00–08:00、09:00–24:00
  last: 未单列最后进入时间
  close: 08:00晨间清扫、夜间24:00
  sources:
    - - 月光园鸿胧馆官方FAQ
      - https://kouroukan.com/faq/
  status: 2026-09-14核查
```

## 地点 · 有马 Grand Hotel

2026-09-13补充核查：酒店官方公告明确2026年10月5日因包场，住宿休馆；不能直接把原10/6住宿挪至10/5。若第五晚改住有马，须另选酒店并核实五人房间及晚餐到店时限。当前正式Plan A已改为第五晚花結び，本馆只保留历史比较资料。[官方休馆公告](https://www.arima-gh.jp/news/business-hours/)

```yaml journey:place
id: arima
name: 有马 Grand Hotel
lat: 34.8003
lng: 135.2424
mapQuery: Arima Grand Hotel
duration: 入住后预留 60–90分钟洗漱、泡汤与放松，不要求持续浸泡
hotel:
  name: 有马 Grand Hotel
  area: 有马温泉 · Plan A
  url: https://www.arima-gh.jp/
  booking: https://reserve.489ban.net/client/arima-gh/0/detail/601291
  note: 优先查晚到含早方案：17:00–21:00入住，10:30退房。先在三宫吃晚饭；接站08:00–21:00，到站后联系酒店。
  status: 住宿候选 · 尚未预订
  shuttle: https://www.arima-gh.jp/etc/access/
hours:
  scope: 有马Grand・云海大浴场（住客）
  open: 05:00–10:30／11:30–次日00:30
  last: 住客最后进入浴场的时间未单列
  close: 10:30、次日00:30分别结束该时段
  note: 这是云海浴场使用时间，不是酒店入住截止或日归入浴受付。当前晚到方案须21:00前入住；泡汤需预留洗浴时间，其他浴场时刻另核。
  sources:
    - - 酒店云海浴场说明
      - https://www.arima-gh.jp/hotspring/unkai/
  status: 未单列最晚入场
```

## 地点 · 新今宫站

```yaml journey:place
id: shinimamiya
name: 新今宫站
lat: 34.6502
lng: 135.5013
mapQuery: Shin Imamiya Station
```

## 地点 · 和歌山市站

```yaml journey:place
id: wakayamashi
name: 和歌山市站
lat: 34.2367
lng: 135.1668
mapQuery: Wakayamashi Station
```

## 地点 · 加太站

```yaml journey:place
id: kada
name: 加太站
lat: 34.2756
lng: 135.0809
mapQuery: Kada Station Wakayama
```

## 地点 · 休暇村紀州加太

2026-09-13核查。英文名 KYUKAMURA KISHU KADA；和歌山市深山483。作为Plan B中和歌山加太海月的住宿替代，全队二选一，不是连续入住两家。资料中的B2表示Plan B内部的休暇村住宿支线，与路线图中的第二个住宿选择对应。

海景露天温泉「天空の湯」、观景露台和海景餐厅适合酒店内休闲；不默认住下后能步行到加太海月附近的海岸。餐厅官方常规时段：早餐07:00–09:30（最后点单09:00），晚餐17:30–20:30（最后点单19:30）；实际套餐用餐时段须按预订确认。温泉住客开放时间、房型、五人房量及10/6价格尚待核实。[官方设施介绍](https://www.qkamura.or.jp/kada/facilities/)

加太站至酒店定时接驳约10分钟。官网当前列加太站发13:55、14:55、15:55、16:55、18:00等班次；酒店翌晨发08:40、09:25、10:05、10:35等班次。不是随到随发；五人及行李容量、是否须提前联系与出行日班次待核。采用本酒店必须重排第七天送站，不能套用加太海月09:30／10:10时刻。[官方交通与完整时刻表](https://www.qkamura.or.jp/kada/access/)

```yaml journey:place
id: kyukamura-kishu-kada
name: 休暇村紀州加太
mapQuery: 休暇村紀州加太 和歌山市深山483
duration: 一晚住宿；入住后海景、泡汤、酒店用餐
hotel:
  name: 休暇村紀州加太
  area: 加太 · Plan B住宿备选
  url: https://www.qkamura.or.jp/kada/
  booking: https://www.qkamura.or.jp/kada/
  note: 常规15:00入住、10:00退房，特殊套餐以预订条款为准。优先比较海景房与一泊两食，未核五人房型、价格及余房。
  status: 2026-09-13核查 · 住宿备选，尚未预订；坐标及配图待补
  shuttle: https://www.qkamura.or.jp/kada/access/
lat: 34.292794
lng: 135.072548
coordinateSource: https://www.backpackers.com.tw/forum/map.php?discover=&gid=47994&gtype=spot
coordinateNote: 酒店区域参考点，接驳上下车点以官网为准
hours:
  scope: 休暇村纪州加太・住客
  open: 常规15:00入住
  last: 含餐方案最晚入住待确认；晚餐最后点单19:30
  close: 翌日10:00退房；晚餐20:30结束
  note: 早餐07:00–09:30、最后点单09:00；晚餐17:30–20:30。加太站至酒店约10分钟定时接驳；酒店早班08:40、09:25、10:05、10:35等，出行日班次需复核。
  sources:
    - - 酒店设施
      - https://www.qkamura.or.jp/kada/facilities/
    - - 接驳班次
      - https://www.qkamura.or.jp/kada/access/
  status: 按套餐及出行日确认
```

## 地点 · 和歌山加太海月

```yaml journey:place
id: kaigetsu
name: 和歌山加太海月
lat: 34.2742
lng: 135.0632
mapQuery: Kada Kaigetsu 1905 Kada Wakayama
duration: 入住后酒店休闲 3–4小时；海边短走15–30分钟可省略
hotel:
  name: 和歌山加太海月
  area: 加太海岸 · Plan B
  url: https://kada-kaigetsu.com/top/
  booking: https://kada-kaigetsu.com/qa/
  note: 优先查海景房与一泊两食。15:00入住、10:00退房，以所订方案为准；接站12:00–21:00，翌日送站09:30／10:10。
  status: 住宿候选 · 尚未预订
  shuttle: https://kada-kaigetsu.com/access/
hours:
  scope: 加太海月・大浴场（住客）
  open: 入住日15:00后–23:00；翌晨05:30–09:00
  last: 住客最后进入浴场的时间未单列
  close: 晚间23:00；晨间09:00结束
  note: 官网一般浴场时段从11:00起，但住客明确从15:00入住后使用。日归泡汤另为11:00–15:00、14:30受付结束，不能把日归时刻用于本次住宿方案。
  sources:
    - - 加太海月官方住客问答
      - https://kada-kaigetsu.com/qa/
    - - 日归入浴（区别适用范围）
      - https://kada-kaigetsu.com/day_use/
  status: 未单列最晚入场
```

## 地点 · 泉佐野站

```yaml journey:place
id: izumisano
name: 泉佐野站
lat: 34.4117
lng: 135.3168
mapQuery: Izumisano Station
```

## 地点 · 鸭川公共河岸・备选

```yaml journey:place
id: kamo
name: 鸭川公共河岸・备选
hours:
  scope: 鸭川公共河岸・备选
  open: 户外散步区域；未查到统一门禁时刻
  last: 不适用统一景区检票；现场限制优先
  close: 官方介绍未列统一闭园时间
  note: 餐厅位置顺路时才加入；具体河岸入口尚未选定，雨后水位与临时封闭情况须按当天现场确认。
  sources:
    - - 京都府河川公共利用说明
      - https://www.pref.kyoto.jp/kamogawa/documents/dai25kaisiryou1.pdf
  status: 公共户外
lat: 35.003
lng: 135.7717
coordinateNote: 四条大桥河岸区域参考点；依晚餐餐厅调整
```

## 地点 · 浜福鶴 吟醸工房

2026-09-13 核查；Day 6 白鹤替换候选，尚未纳入路线图。侧重玻璃通道观察实际酿造、发酵和试饮；具体作业随日期及时间变化。与原神户东部酒藏安排较接近，建议优先比较。地址：神户市东滩区鱼崎南町4丁目4番6号；阪神鱼崎或南鱼崎站步行约10分钟。[官网交通](https://www.hamafukutsuru.co.jp/about/index.html)

```yaml journey:place
id: hamafukutsuru
name: 浜福鶴 吟醸工房
mapQuery: 浜福鶴 吟醸工房 神戸市東灘区魚崎南町4丁目4番6号
duration: 规划建议45–75分钟；非官方固定场次时长
hours:
  scope: 吟醸工房自由参观与试饮
  open: 10:00–17:00；周一休馆，周一逢节假日顺延翌日
  last: 有料试饮16:15最后点单；未单列最晚入馆
  close: 17:00
  note: 少于10人可不预约自由参观；5人不默认有专人导览。10/6为周二，按常规规则可考虑，临时调整以官网为准。实际生产作业不能保证全部看见。
  sources:
    - - 浜福鶴官方见学说明
      - https://www.hamafukutsuru.co.jp/factory/index.html
  status: 2026-09-13核查；候选，入口坐标和配图待补
tickets:
  - id: hamafukutsuru-admission
    name: 吟醸工房入馆
    category: admission
    audience: adult
    currency: JPY
    amount: 0
    priceStatus: verified
    checked: 2026-09-13
    source: https://www.hamafukutsuru.co.jp/factory/index.html
    note: 入馆免费；另付费试饮和购物不含。
```

## 地点 · 麒麟啤酒神户工厂

2026-09-13 核查；Day 6 工厂参观候选，尚未纳入路线图。用户所称“三田的麒麟”对应神户市北区的这座工厂；一般体验包括麦芽、啤酒花与试饮。应作为半天安排重排，不直接塞入白鹤原时段。建议比较“奈良 → 工厂 → 有马”的整天替代走法；行李交接点和完整铁路衔接待定。[工厂官网](https://www.kirin.co.jp/experience/factory/kobe/)

三田站有免费接驳，官网当前列单程约20分钟；班次有限。三宫直达工厂的有偿巴士仅周末及节假日运行，不适用于10/6周二。五人同场余位未查询、未预约。[官方交通](https://www.kirin.co.jp/experience/factory/kobe/access/)

```yaml journey:place
id: kirin-kobe
name: 麒麟啤酒神户工厂
mapQuery: キリンビール 神戸工場 神戸市北区赤松台2-1-1
duration: 一番搾りおいしさ実感ツアー约70分钟；交通、候车另计
hours:
  scope: 一番搾りおいしさ実感ツアー
  open: 按预约场次；周一休馆，逢节假日营业并顺延下一个平日休馆
  last: 以所订场次的报到要求为准
  close: 以预约日历为准；年末年始及临时休馆另列
  note: 须预约。10/6五人同场余位、当日具体生产情况及语言辅助待核。不得采用旧预约网站的历史日历判断现时余位。
  sources:
    - - 麒麟神户工厂官方介绍
      - https://www.kirin.co.jp/experience/factory/kobe/
    - - 官网当前链接的预约入口
      - https://kirinfactory.revn.jp/?label=9
  status: 2026-09-13核查；未预约，入口坐标和配图待补
tickets:
  - id: kirin-kobe-ichiban-tour
    name: 一番搾りおいしさ実感ツアー
    category: admission
    audience: adult
    currency: JPY
    amount: 1000
    priceStatus: verified
    checked: 2026-09-13
    source: https://www.kirin.co.jp/experience/factory/kobe/
    note: 含税，适用2026-10-01起场次的20岁及以上参加者；5名符合年龄的成人合计5000 JPY，不含交通餐饮。不能沿用9月底前500 JPY价格，也不是3000 JPY的另一种高级体验。
```

## 地点 · 格力高神户工厂（グリコピア神戸）

2026-09-13 核查；Day 6 非酒类工厂候选，尚未纳入路线图。看Pocky与Pretz生产线，适合更喜欢食品制作的成员。位于神户西区，需经西神中央站接公交到高塚台1丁目；完整转场时间待核。建议单独比较半天安排。10/6未在官网目前列出的10月休馆及计划停线日期中，但五人同场余位、临时生产变化仍待确认。[官方介绍与交通](https://www.glico.com/jp/enjoy/experience/glicopia/kobe/)

```yaml journey:place
id: glicopia-kobe
name: 格力高神户工厂（グリコピア神戸）
mapQuery: グリコピア神戸 神戸市西区高塚台7丁目1番
duration: 导览约80分钟；另选手作体验另计
hours:
  scope: 工厂预约导览
  open: 平日场次10:00、11:00、13:00、14:00、15:00；完全预约制
  last: 预约时间前20分钟起可入馆；不是最晚报到时刻
  close: 设施营业至16:30；休馆日期以当月公告为准
  note: 一般周五休馆，存在调整。五人同场余位未核。生产线可能临时停运，届时以视频说明替代；不承诺一定看到运行中的全部工序。
  sources:
    - - 格力高神户官方公告与见学说明
      - https://www.glico.com/jp/enjoy/experience/glicopia/kobe/
  status: 2026-09-13核查；未预约，入口坐标和配图待补
tickets:
  - id: glicopia-kobe-admission
    name: 工厂导览入馆
    category: admission
    audience: adult
    currency: JPY
    amount: 0
    priceStatus: verified
    checked: 2026-09-13
    source: https://www.glico.com/jp/enjoy/experience/glicopia/kobe/
    note: 预约导览免费；另付费手作体验和购物不含。
```

### Day 6 候选筛选记录

**最新决定（2026-09-13）：取消工厂参观；下述工厂资料仅作历史参考，不再属于当前行程候选。须磨沙滩调整到上午，中午用餐及午后室内休息。**

2026-09-13：菊正宗酒造记念馆自2026年4月起通常周二休馆，因此不列作10/6的常规替补。[菊正宗官方开放规则](https://www.kikumasamune.co.jp/kinenkan/access.html)

本次只补充候选资料。白鹤现有地点编号、既有日程及路线图仍保留；最终替换方案尚未选定。浜福鶴优先作为同区域替换，麒麟及格力高需另排交通和半天时段；全队只选其中一种工厂安排，不叠加多个工厂。

## 地点 · 舞子海上步道

2026-09-13 核查；Day 6 非工厂候选，未纳入正式路线。即舞子海上プロムナード，位于明石海峡大桥桥下，环形步道约317米，含展览与观景休息区。遮阳不等于全程空调；车站至入口仍有户外路段。建议停留45–60分钟，不安排长距离公园暴走，也不等同于大桥登塔体验。

```yaml journey:place
id: maiko-marine-promenade
name: 舞子海上步道
mapQuery: 舞子海上プロムナード
duration: 规划建议45–60分钟
hours:
  scope: 海上步道
  open: 09:00–18:00
  last: 17:30
  close: 18:00
  note: 10月至3月每月第二个周一休馆，逢节假日顺延；另有年末休馆。10/6周二按常规规则可考虑，临时开放情况待行前复核。
  sources:
    - - 舞子公园官方设施说明
      - https://hyogo-maikopark.jp/facility/f01/
  status: 2026-09-13核查；候选，坐标及配图待补
tickets:
  - id: maiko-promenade-adult-weekday
    name: 平日成人入馆
    category: admission
    audience: adult
    currency: JPY
    amount: 250
    priceStatus: verified
    checked: 2026-09-13
    source: https://hyogo-maikopark.jp/facility/f01/
    note: 适用普通成人平日票；高龄等优惠另计。
```

## 地点 · 神户 Plaisir 本店

2026-09-13 核查；Day 6 神户牛午餐初筛候选。神户肉流通推进协议会指定店注册编号447，地址神户市中央区下山手通2-11-5，与本店官网一致。[官方注册名单](https://www.kobe-niku.jp/shop?prefecture=28)

官网铁板烧午餐明确提供神户牛：腿肉80克9570日元、120克12210日元；西冷80克12650日元，均含税。套餐含前菜、汤、沙拉、烤蔬菜、主食、甜点与餐后饮品；5人腿肉120克套餐合计61050日元，另点饮料另计。[当前官方菜单](https://kobeplaisir-honten.jp/archives/menu/44)

尚未完成Google Maps与日文食べログ实际评价核查，不授予餐厅推荐等级；10/6五人同席余位与临时营业安排待确认，未预约。

```yaml journey:place
id: kobe-plaisir-honten
name: 神户 Plaisir 本店
mapQuery: 神戸プレジール 本店 神戸市中央区下山手通2-11-5
duration: 午餐规划预留90–120分钟
hours:
  scope: 午餐
  open: 11:30–15:00；通常周一休息
  last: 14:00最后点单
  close: 15:00
  note: 候选餐厅；须选择菜单明确标注神户牛的套餐。5人同席余位尚未核实。
  sources:
    - - 神户Plaisir本店午餐菜单
      - https://kobeplaisir-honten.jp/archives/menu/44
    - - 神户牛官方指定注册店名单
      - https://www.kobe-niku.jp/shop?prefecture=28
  status: 2026-09-13核查；菜单及注册信息已核，评价、余位、坐标与配图待补
```

### Day 6 非工厂方案讨论记录

**最新Plan A以day-06-a为准：上午有马、午餐也在有马小镇，午后才进神户酒店与城市闲逛；以下神户午餐的讨论已被取代。**

**最终以 day-06-a 最新顺序为准：中午大餐 → 下午城市闲逛 → 傍晚须磨海边 → 晚上大餐 → 可选出租车往返维纳斯桥 → 神户酒店。以下上午须磨等记录为已被取代的历史讨论。**

**最新决定（2026-09-13）：保留须磨并提前至上午，删除工厂参观。下面“舞子替换须磨”的建议已被本次决定取代；舞子仅保留资料候选，尚未加入路线。正式日程见 day-06-a。**

2026-09-13：用户希望提供不以工厂参观为核心的选择，上午至中午避免烈日下长距离步行，舞子大桥可纳入考虑，中午安排较好的用餐。建议候选顺序：奈良酒店 → 三宫寄存 → 舞子海上步道 → 三宫神户牛午餐 → 室内休息 → 三宫取行李 → 有马温泉。舞子用于替换白鹤及正午须磨海边安排，不在原行程上继续堆叠。若保留Venus Bridge，应放在傍晚并说明仍有户外上坡步行；也可取消以便更早入住温泉。以上尚未成为正式路线，具体班次及时间待选定后规划。

午餐另一个方向是舞子当地日式会席：舞子Villa「有栖川」秋晴れ会席官网列价4000日元，适用2026/9/1–10/31午餐，含刺身、秋季天妇罗、三田猪肉小锅与季节釜饭；税费口径、营业时间、5人余位、评价及短距离接驳待核。它不能替代项目既定的正式神户牛用餐要求，若采用需另排神户牛，故当前优先讨论神户牛午餐。[官方菜单](https://maikovilla.co.jp/menu/14168/)

## 2026-10-01 · 大阪

```yaml journey:day
id: day-01
date: 2026-10-01
city: 大阪
title: 大阪街区、逛店与高空夜景
subtitle: 先到Sugata安顿行李；通天阁、日本桥商圈、难波八阪神社、黑门市场接道顿堀，再经法善寺、心斋桥、中崎町至梅田，按体力选择，晚饭后有兴致再去空中庭园展望台。
intensity: 抵达日 · 随兴休闲
hotel: sugata-osaka
focus:
  - sugata-osaka
  - tsutenkaku
  - nippombashi-denden
  - namba-yasaka
  - kuromon-market
  - nakazakicho
  - umeda-shopping
  - umeda-sky
  - shinsaibashi
  - hozenji
  - dotonbori
luggage: 建议关西机场带全部行李直接到当晚大阪酒店，未到入住时间先寄存、可入住则放房间，之后轻装游览。南海难波仅为交通经过点，不安排存取行李；酒店已确定为Sugata；入住前寄存条件待酒店确认。
next: 明早退房带全部行李赴京都Cross Keys；第二天寄存与路线另行逐日审核，不沿用京都站前酒店假设。
rest: 北部商圈保留坐下吃饭／喝咖啡的时间，城市跨区乘车；不为追日落赶路。抵达或逛街拖晚时缩短停留，再按体力决定当晚执行范围。
notes:
  - 用户明确第一天晚饭在梅田；酒店寄存后新增通天阁、日本桥商圈、难波八阪神社、黑门市场，再接道顿堀并向北逛至梅田。餐厅待选，未预约，继续采用随兴安排。
  - 2026-09-23用户确认第一天无需严谨安排，随机应变。以下地点及顺序为参考清单，不是全部必去或固定时刻要求；按精神、天气、现场兴致增减停留与调整顺序。
  - 中崎町安排在梅田之前，争取下午逛小店；空中庭园展望台安排夜景，不设日落或蓝调硬目标。
  - 2026-09-23第一天审核建议为当晚酒店寄存；用户已确认预订Sugata Hotel Osaka，不新增难波站寄存安排。
  - でんでんタウン与日本橋筋商店街合并为一个商圈游览节点，两个名称均保留；新增段按用户列举顺序连接，不代表最短步行路线。
  - 难波八阪神社17:00闭门，黑门市场各店独立营业；只作取舍依据，不倒排赶路时间。通天阁是否上塔现场再定。
  - 暂按上午抵达；航班时间未定，入境、取件时间另留。
  - Sugata Hotel Osaka已由用户确认预订；午晚餐尚未预订。
links: []
optional: []
overview:
  - d1-kix
  - d1-osaka
budget:
  summary: 地点为弹性清单，费用随实际选择发生；Sugata订单金额与交通待补充，未预订餐饮不计。
  items:
    - name: 可选门票 · 空中庭园展望台
      min: 0
      max: 2000
      note: 不去为0 JPY，去则普通成人票2,000 JPY／人；未购票。
      source: https://www.skybldg.co.jp/tw/
      confirmed: true
  notes:
    - 住宿价格待补充，目前没有已预订餐厅。
    - 通天阁是否上塔尚未决定，成人展望台套票1,500 JPY／人只作备选费用，暂不计入已选项目合计。
schedule:
  note: 用户明确无需严谨时间表，随机应变；先酒店安顿行李，其他地点按当天情况选择，顺序与停留时长均仅供参考，不要求全部完成。营业时间只作可行性边界。
  slots: []
stops:
  - id: d1-kix
    place: kix
    time: 按实际航班
    mode: rail
    connection: ""
    duration: ""
    note: 入境、取行李后再出发。
  - id: d1-osaka
    place: sugata-osaka
    time: 抵达后安顿／游览后返回
    mode: rail
    connection: 机场铁路与市内交通至Sugata；候选经天下茶屋换乘至长堀桥，实际班次、电梯出口及拖箱步行待核
    duration: ""
    note: 建议先在当晚酒店寄存，到入住时间后回房休息；若已可入住则直接放房间。Sugata已预订，当日提前寄存条件待确认。
  - id: d1-tsutenkaku
    place: tsutenkaku
    time: 看体力与兴致 · 顺序仅供参考
    mode: rail
    connection: Sugata寄存后乘市内交通至通天阁一带；候选长堀桥经堺筋线至惠美须町再步行，也可打车，具体班次与耗时待核
    note: 先保留到访和周边闲逛；上塔与否现场按兴趣决定，未订时段或购票，不默认安排滑梯等项目。
  - id: d1-nippombashi
    place: nippombashi-denden
    time: 看体力与兴致 · 顺序仅供参考
    mode: walk
    connection: 通天阁一带步行接日本桥商圈；按选店位置游览，具体步行耗时待核
    note: でんでんタウン／日本橋筋商店街合并为一次逛街，挑感兴趣的电器、动漫或游戏店。
  - id: d1-namba-yasaka
    place: namba-yasaka
    time: 看体力与兴致 · 顺序仅供参考
    mode: walk
    connection: 日本桥商圈向西赴难波八阪神社，步行或按体力打车；耗时取决于离开的店铺位置，待核
    note: 看狮子殿与参拜；17:00闭门只作可行性边界，不为补齐地点赶路。
  - id: d1-kuromon
    place: kuromon-market
    time: 看体力与兴致 · 顺序仅供参考
    mode: walk
    connection: 难波八阪神社向东赴黑门市场，按体力步行或打车；具体路线与耗时待核
    note: 按营业情况随兴逛吃，各店时间不同；晚饭仍留在梅田，不要求市场每家都逛。
  - id: d1-dotonbori
    place: dotonbori
    time: 看体力与兴致 · 顺序仅供参考
    mode: walk
    connection: 黑门市场游览后步行衔接道顿堀・戎桥；具体出入口和步行耗时待核
    note: 由新增南部游览段接回道顿堀与戎桥，不要求等到夜景。
  - id: d1-hozenji
    place: hozenji
    time: 看体力与兴致 · 顺序仅供参考
    mode: walk
    connection: 道顿堀附近短步行至法善寺横丁
    note: 顺路看看巷子；晚饭留给梅田，不在此绑定餐厅。
  - id: d1-shinsaibashi
    place: shinsaibashi
    time: 看体力与兴致 · 顺序仅供参考
    mode: walk
    connection: 从法善寺／道顿堀一带向北接心斋桥筋，沿商店街随兴逛
    note: 按营业情况挑店，之后乘车去中崎町，不把跨区转场当长距离徒步。
  - id: d1-nakazakicho
    place: nakazakicho
    time: 看体力与兴致 · 顺序仅供参考
    mode: rail
    connection: 心斋桥至中崎町区域乘市内交通，站内及街区入口步行另计；具体班次待核
    duration: 45–60分钟
    note: 选感兴趣的小店和咖啡馆，不逐店打卡；具体店铺营业时间待选店后核实。
  - id: d1-umeda
    place: umeda-shopping
    time: 看体力与兴致 · 顺序仅供参考
    mode: walk
    connection: 中崎町至梅田茶屋町一带，依选店位置短距离步行；暂留15–25分钟，非导航实测
    duration: 逛街60–90分钟仅作参考，晚餐另留充分时间
    note: 在梅田吃晚饭，餐厅待选、未预约；购物按兴趣，不为饭后其他景点压缩用餐。
  - id: d1-umeda-sky
    place: umeda-sky
    time: 看体力与兴致 · 顺序仅供参考
    mode: walk
    connection: 梅田晚饭后如有兴致，步行至梅田蓝天大厦展望台专用入口；具体距离与耗时待选定餐厅后核实，疲劳时可打车，排队和上楼另留余量
    duration: 60–90分钟
    note: 若当天选择前往，按常规22:00最后入场、22:30关闭判断是否还有充足观景时间；不设到达目标，晚到或疲劳就不赶着补齐。
    fees:
      - ticketOptions:
          - umeda-sky-adult
        accounting: budget
        budgetItem: day-01-cost-02
  - id: d1-osaka-2
    place: sugata-osaka
    time: 抵达后安顿／游览后返回
    mode: rail
    connection: 如去了空中庭园，从梅田蓝天大厦乘市内交通或打车回Sugata；若跳过，则从梅田用餐处直接回酒店
    duration: ""
    note: 回酒店休息，为明早跨城留体力。
distanceKm: []
activityKcal: []
activityNote: 新增通天阁、日本桥商圈、难波八阪神社、黑门市场，衔接道顿堀与原北部行程；全程步行总量与热量待重算，不默认全部步行。
dining: []
flexible: true
```

### 第一天行李审核 · 2026-09-23（酒店已确定，寄存细则待核）

用户确认第一晚已预订 **Sugata Hotel Osaka**。建议路线：**关西国际机场 → Sugata寄存／入住 → 通天阁 → でんでんタウン／日本橋筋商店街 → 难波八阪神社 → 黑门市场 → 道顿堀・戎桥 → 法善寺横丁 → 心斋桥筋 → 中崎町 → 梅田商圈及晚饭 → 空中庭园展望台（饭后按兴致）→ Sugata**。

优先把酒店作为唯一存取行李点，晚间从梅田或空中庭园展望台乘车回酒店，不必绕回车站取箱子；去各商圈时均轻装。15:00前抵达以向前台寄存为目标；15:00后若已可交房则直接把行李放房间。平台列有寄存服务，但具体提前寄存时段、费用和容量待酒店确认。酒店不在原Cross Hotel的位置，机场接驳和晚间返程不能沿用旧步行分钟数。

南海难波等车站不设寄存节点；只有酒店无法接收行李时再比较顺路车站寄存，不预先增加取件绕行。第一晚住宿选择已确认，无需再次询问酒店名称；订单价格与寄存细则尚未确认。第二天及以后继续逐日审核。

## 2026-10-02 · 京都 · 岚山

```yaml journey:day
id: day-02
date: 2026-10-02
city: 京都 · 岚山
title: 沿山脚下行，夜里走进祇园
subtitle: 原路线沿山脚下行；另可选JR直达龟冈＋保津川游船，岚山下船后徒步上行至爱宕念佛寺，再打车下山。另设究极懒人版：京都酒店直接打车至爱宕念佛寺，再下行闲逛。晚间短游由体力决定。
intensity: 较充实
hotel: cross-keys
focus:
  - umahori
  - kameoka
  - saga
  - otagi
  - toriimoto
  - rakushisha
  - bamboo
  - togetsu
luggage: 入住前和退房后的行李均在Cross Keys民宿交接；咖啡厅仅用于办理入住，寄存可用时段另核。
next: 明天不换酒店，行李留房间；哲学小道与贵船之间乘公共交通。
rest: 岚山后回房休息约60分钟。结束较晚就缩短祇园夜游，正常吃晚饭。
notes:
  - Cross Keys 已预订10/2–10/4两晚。住宿查询口径4位成人、2间房；4位成人、2晚住宿合计3,349.99 CNY（人民币）；实际订单房间与寝具配置待补充。16:00–21:00到对面the
    kind
    cafe办理入住，最迟10/1告知预计到达时间；10/4须10:00前退房。入住前及退房后可寄存，交接点已确认在Cross Keys民宿，可用时段另核。住宿税现金另付，金额待房东告知。电话+81-90-3710-5869。
  - 原京都站前酒店的交通时长与住宿预算已失效；餐饮营业时间不等于民宿接待时间。
  - 2026-09-15新增究极懒人支线：大阪晚起后到京都寄存，酒店直接打车到爱宕念佛寺，跳过小火车和游船，再沿原路线下行；不沿用主线早起时刻表。
  - 2026-09-15新增游船支线；下列主线stops、时刻和预算不包含游船，选择支线须整体替换对应白天段，不能叠加两条路线。
  - 爱宕念佛寺官网列周三、周六休息，保留在10/2周五。
  - 小火车及上山巴士待核班次。鸭川黄昏仅在餐厅位置顺路且时间允许时加入。
links:
  - - 小火车官网／预约
    - https://www.sagano-kanko.co.jp/
  - - 爱宕念佛寺开放信息
    - https://www.otagiji.com/visit-en
optional:
  - id: day-02-optional-lazy
    place: otagi
    note: 究极懒人版，适用于第二天在大阪晚起或想省体力时；全队跳过小火车和游船，京都酒店寄存后直接打车上山。
    fromStep: d2-kyoto
    toStep: d2-otagi
    budgetNote: 不计小火车、游船或原上山巴士费用，改计京都酒店至寺院出租车；五人两辆普通车或可载五名乘客的车型，费用待酒店地址和车型确认。爱宕寺门票仍只计一次。
    scheduleNote: 按实际起床和抵达京都时间安排，不设必须搭乘的观光班次。寺院16:00关闭，争取15:00前抵达并留45–60分钟参观；若太晚则放弃寺院，不赶关门。15:00是规划目标，非官方最晚入场。
    stops:
      - id: d2l-otagi
        place: otagi
        mode: taxi
        connection: Cross Keys民宿寄存并午餐后，直接打车到爱宕念佛寺
        note: 从Cross Keys本町2丁目89出发，不从旧京都站前酒店出发；住宿按4位成人2间房，同行乘车人数及行李容量另核，出租车费用重新报价。
    next: 到寺院后接回d2-otagi参观及d2-toriimoto、d2-rakushisha、d2-bamboo、d2-togetsu下行顺序，再回京都酒店；这是替代抵达方式，不重复参观寺院。
  - id: day-02-optional-hozu
    place: hozu-board
    note: 高精力版本：全队共同选择的完整保津川游船支线；京都站JR→龟冈站北口步行登船、船回岚山，徒步到爱宕念佛寺后首选打车下山。详见本日支线说明。
    fromStep: d2-kyoto
    toStep: d2-kyoto-2
    budgetNote: 游船另加6000日元／成人；五位成人30000日元。不含小火车或龟冈接驳巴士，JR及爱宕寺返程出租车另核，不直接套用原路线交通合计。
    scheduleNote: 高精力版本以早班船为目标，但咖啡厅最早寄存时间尚未确认；原08:00–08:15寄存、10:00船的倒排暂不可执行，需确认寄存及新地址衔接后重新排程。
    stops:
      - id: d2h-jrkameoka
        place: jr-kameoka
        mode: rail
        connection: 京都站乘JR山阴本线（嵯峨野线）至JR龟冈站；官方参考快速约19分钟、普通约30分钟，候车另计
        time: 目标09:00–09:15到站（预算）
        note: 从北口出站，不走南口；这里不是小火车龟冈站，本支线不坐小火车。
      - id: d2h-board
        place: hozu-board
        mode: walk
        connection: JR龟冈站北口步行约8分钟至乘船场；五人按10–15分钟预算，先去建筑二楼受付
        time: 优先10:00船，未订
        note: 目标09:15–09:30抵达并办理受付，优先预约10:00船；报到截止以订单要求为准。
        fees:
          - ticketOptions:
              - hozu-adult
            accounting: optional
      - id: d2h-land
        place: hozu-land
        mode: boat
        connection: 龟冈顺流至岚山，船程按约2小时规划
        time: 目标约12:00下船；水位和候船会影响到达
        note: 先整理及洗手间，再开始徒步；不把下船时刻当成保证。
      - id: d2h-togetsu
        place: togetsu
        mode: walk
        connection: 下船场沿河至渡月桥北端，步行暂留5–10分钟
        note: 河畔短看，在周边坐下吃午餐45–60分钟；不过桥绕去南岸，餐厅待选。
      - id: d2h-bamboo
        place: bamboo
        mode: walk
        connection: 从桥北端沿岚山主街至竹林小径，沿公共道路进入
        note: 从东向西穿竹林再向北，不穿越天龙寺收费庭园抄近路；不另加庭园参观。
      - id: d2h-rakushisha
        place: rakushisha
        mode: walk
        connection: 从竹林西侧向北，沿公共道路至落柿舍周边
        note: 周边短停，不默认入内。
      - id: d2h-toriimoto
        place: toriimoto
        mode: walk
        connection: 沿嵯峨野街巷向北接鸟居本老街
        note: 老街短逛，途中按需要坐下休息；化野念佛寺不自动加入。
      - id: d2h-otagi
        place: otagi
        mode: walk
        connection: 沿鸟居本旧街道继续向北上行至爱宕念佛寺，走寺院入口方向
        time: 争取14:45–15:00抵达，留45–60分钟参观
        note: 16:00关闭，最晚入场另核；延误时缩短或放弃末段，不赶路追关门。
      - id: d2h-return
        place: sagaarashiyama
        mode: taxi
        connection: 爱宕念佛寺→JR嵯峨岚山站，首选打车下山
        note: 行车先留10–15分钟，叫车等待另计；五人两辆普通车或合适车型，提前约车。不再步行原路下山。
      - id: d2h-kyoto
        place: kyoto
        mode: rail
        connection: JR返回京都站，步行回酒店，接回d2-kyoto-2入住休息
        note: 保留约60分钟回房休息；晚间祇园按体力缩短。
  - place: kamo
    note: 鸭川黄昏：20–30分钟，仅在餐厅位置顺路且体力允许时加入。
    id: day-02-optional-01
overview:
  - d2-kyoto
budget:
  summary: 住宿4人2晚合计3,349.99 CNY；交通与现金住宿税待确认。人民币房费单列，不直接并入JPY合计。
  items:
    - id: day-02-cost-02
      name: 门票 · 爱宕念佛寺
      kind: daily
      category: admission
      ticketOptions:
        - otagi-adult
      quantity: 1
      step: d2-otagi
      note: 按一位成人计费，票价与景点卡片引用同一记录。
  notes:
    - 小火车费用归入交通，不在门票中重复相加。
    - 岚山各点时长不含点与点之间交通；街区与竹林内部步行已含在游览时长内。
    - 目前没有已确认预订的餐厅。餐饮未纳入本日统计合计，临时用餐另计；时间轴中的吃饭与休息安排仍保留。
schedule:
  note: 京都住宿及交通已更新，旧分钟表暂停；寄存、实际班次与新地址衔接待核。
  slots: []
stops:
  - id: d2-osaka
    place: sugata-osaka
    time: 较早出发
    mode: walk
    connection: ""
    duration: ""
    note: 退房，带走全部行李。
  - id: d2-crosskeys-storage
    place: cross-keys
    time: 按新住宿衔接，时刻待核
    mode: rail
    connection: 按Cross Keys新地址衔接
    duration: ""
    note: Cross Keys 已预订10/2–10/4两晚。住宿查询口径4位成人、2间房；4位成人、2晚住宿合计3,349.99 CNY（人民币）；实际订单房间与寝具配置待补充。16:00–21:00到对面the
      kind
      cafe办理入住，最迟10/1告知预计到达时间；10/4须10:00前退房。入住前及退房后可寄存，交接点已确认在Cross Keys民宿，可用时段另核。住宿税现金另付，金额待房东告知。电话+81-90-3710-5869。
  - id: d2-umahori
    place: umahori
    time: 上午
    mode: rail
    connection: 京都站乘JR嵯峨野线
    duration: ""
    note: JR到马堀，步行衔接观光小火车。
  - id: d2-kameoka
    place: kameoka
    time: 按预约班次
    mode: walk
    connection: 另留进站、候车时间
    duration: 候车预留15–20分钟；观光列车乘坐约25分钟
    note: 搭乘龟冈向嵯峨方向的小火车。
    fees:
      - ticketOptions:
          - sagano-adult-one-way
        accounting: included
        budgetItem: day-02-cost-01
  - id: d2-saga
    place: saga
    time: 约25分钟车程后
    mode: rail
    connection: 嵯峨野观光小火车；需要另购票
    duration: ""
    note: 到小火车嵯峨终点，再衔接上山巴士。
  - id: d2-otagi
    place: otagi
    time: 上午末段
    mode: bus
    connection: 到野宫站乘94路至爱宕寺前，班次待核
    note: 看1200尊小石像，留寺内慢游时间。
    fees:
      - ticketOptions:
          - otagi-adult
        accounting: budget
        budgetItem: day-02-cost-02
  - id: d2-toriimoto
    place: toriimoto
    time: 午餐／茶点
    mode: walk
    connection: 从北往南沿老街走
    note: 老街午饭、茶点，开始向南下行。
  - id: d2-rakushisha
    place: rakushisha
    time: 下午
    mode: walk
    connection: 沿山脚向南
    note: 落柿舍周边慢走，不要求进入每个景点。
    fees:
      - ticketOptions:
          - rakushisha-adult
        accounting: optional
  - id: d2-bamboo
    place: bamboo
    time: 下午
    mode: walk
    connection: 继续向南步行
    note: 竹林短游，按现场人流调整停留。
  - id: d2-togetsu
    place: togetsu
    time: 下午
    mode: walk
    connection: 主干全段约3.4公里，寺内和支线另计
    note: 河畔与渡月桥，累了就结束岚山段。
  - id: d2-kind-checkin
    place: kind-cafe
    mode: walk
    time: 16:00–21:00
    connection: 岚山返程后先到咖啡厅办理入住
    note: 21:00前办好入住，再到对面Cross Keys休息；不可先夜游再回来办理。
  - id: d2-kyoto-2-crosskeys
    place: cross-keys
    time: 按新住宿衔接，时刻待核
    mode: rail
    connection: 按Cross Keys新地址衔接
    duration: ""
    note: Cross Keys 已预订10/2–10/4两晚。住宿查询口径4位成人、2间房；4位成人、2晚住宿合计3,349.99 CNY（人民币）；实际订单房间与寝具配置待补充。16:00–21:00到对面the
      kind
      cafe办理入住，最迟10/1告知预计到达时间；10/4须10:00前退房。入住前及退房后可寄存，交接点已确认在Cross Keys民宿，可用时段另核。住宿税现金另付，金额待房东告知。电话+81-90-3710-5869。
  - id: d2-yasaka
    place: yasaka
    time: 晚饭前后
    mode: bus
    connection: 市内交通，订餐后重算
    note: 晚餐区域待定，暂以八坂神社作为夜游进入点。
  - id: d2-hanami
    place: hanami
    time: 晚饭后
    mode: walk
    connection: 八坂向西
    note: 短距离夜间漫步，遵守现场拍摄与通行标识。
  - id: d2-shirakawa
    place: shirakawa
    time: 晚饭后
    mode: walk
    connection: 祇园内部短走
    note: 白川夜景，不为走完街区额外绕路。
  - id: d2-gionshijo
    place: gionshijo
    time: 返程
    mode: walk
    connection: 步行至祇园四条
    duration: ""
    note: 在车站附近收束夜游。
  - id: d2-kyoto-3-crosskeys
    place: cross-keys
    time: 按新住宿衔接，时刻待核
    mode: rail
    connection: 按Cross Keys新地址衔接
    duration: ""
    note: Cross Keys 已预订10/2–10/4两晚。住宿查询口径4位成人、2间房；4位成人、2晚住宿合计3,349.99 CNY（人民币）；实际订单房间与寝具配置待补充。16:00–21:00到对面the
      kind
      cafe办理入住，最迟10/1告知预计到达时间；10/4须10:00前退房。入住前及退房后可寄存，交接点已确认在Cross Keys民宿，可用时段另核。住宿税现金另付，金额待房东告知。电话+81-90-3710-5869。
distanceKm:
  - 8
  - 11
activityKcal:
  - 300
  - 550
dining: []
```

### 第二天可选支线 · JR龟冈与保津川游船（2026-09-15更新）

本支线不乘小火车：京都酒店寄存 → JR京都站 → JR龟冈站北口 → 步行约8分钟至乘船场 → 建筑2楼受付 → 游船至岚山。原路线的小火车安排保留，仅用于原路线。

优先10:00船；暂按大阪酒店06:00–06:30出发、京都酒店08:00–08:15寄存完成、09:00–09:15到JR龟冈、09:15–09:30抵达受付倒排。车次、酒店寄存及预约仍待确认，报到截止以订单为准。JR快速约19分钟、普通约30分钟是官方参考，不含候车和站内移动。

约中午下船 → 渡月桥午餐 → 竹林 → 落柿舍周边 → 鸟居本 → 爱宕念佛寺 → 打车下山至JR嵯峨岚山 → 京都酒店休息 → 按体力夜游祇园。上行步行主干约3.5–4.5公里、70–95分钟，寺内另计；连同用餐停留约3小时15分–4小时15分，晚下船时缩短或取消寺院末段，不赶16:00关门。全日里程、热量及JR、出租车总费用待核；船票6000 JPY／成人，五人30000 JPY；本支线没有小火车票或龟冈接驳巴士费。

[官方JR北口交通指引](https://www.hozugawakudari.jp/blog/保津川下り・・・)。

### 第二天可选支线 · 究极懒人版（2026-09-15）

适用于第一晚住大阪后，第二天睡醒已晚，或当天想减少换乘和体力消耗的情况。全队选择同一走法，**不乘小火车、不坐保津川游船**：

**大阪酒店退房 → 京都酒店寄存 → 从酒店直接打车到爱宕念佛寺 → 嵯峨鸟居本 → 落柿舍周边 → 岚山竹林 → 渡月桥 → JR嵯峨岚山站 → 京都酒店。**

在京都酒店寄存处分岔，爱宕念佛寺处接回原路线；从寺院开始总体下行，按兴致逛，不再徒步上山。这里打车指京都酒店直接送到寺院，不是先乘JR到岚山再叫车。五人用两辆普通出租车或确认可载五名乘客的车型，车程与费用待具体酒店地址、车型和路况确认，不把官网“JR嵯峨岚山站出发约5分钟、1,500日元”的短程参考套用于京都酒店。

不安排必须早起赶上的小火车或船班；按实际到达时间安排午餐、茶歇和休息，若未吃午饭就在京都酒店附近先吃再上山，餐厅待选。寺院开放09:00–16:00、周三及周六关闭，10/2为周五。宜争取15:00前到寺，留45–60分钟参观；这不是官方最晚入场承诺。如果起得太晚而无法从容参观，就取消寺院参观，改在岚山短逛，不为补全行程赶路。[寺院官方开放及交通说明](https://www.otagiji.com/visit-en)

下山以鸟居本、落柿舍周边、竹林、渡月桥为顺序，不要求每处停满时间，也不自动添加其他寺院。疲惫时可以提前收束并叫车，交通调整不另画分支。寺内和下山仍需步行；省去的是上山步行及车船衔接。回京都酒店继续保留休息，祇园夜游依体力决定。费用剔除未乘坐的小火车、游船和上山巴士，加入酒店直达寺院的出租车，爱宕寺门票只计一次；原主线的时间表、交通总额和体力估算不直接沿用。

## 2026-10-03 · 京都 · 贵船

```yaml journey:day
id: day-03
date: 2026-10-03
city: 京都 · 贵船
title: 永观堂、哲学之道、银阁寺与贵船
subtitle: 永观堂 → 哲学之道 → 银阁寺，午餐休息后经出町柳前往贵船。
intensity: 增加两座寺院参观，按体力控制停留
hotel: cross-keys
focus:
  - eikando
  - philosopher
  - ginkakuji-temple
  - demachi
  - kibuneguchi
  - kifune
luggage: 入住前和退房后的行李均在Cross Keys民宿交接；咖啡厅仅用于办理入住，寄存可用时段另核。
next: 明早退房先寄存，伏见稻荷短游后回酒店取件，再乘JR去宇治。
rest: 午饭、咖啡与坐下休息留90–120分钟；贵船以本宫和近处溪边为主。
notes:
  - 2026-09-21补全永观堂、哲学之道、银阁寺主线，两座寺院均安排普通入内参观；银阁寺桥仅为途经点。
  - 若约09:00开始永观堂，寺院各留45–60分钟、哲学之道60–90分钟、两端衔接合留20–30分钟，午餐休息另留90–120分钟；均为规划预留，不是预约时刻。
  - 前往贵船的实际车次待核；上午拖晚则缩短贵船奥宫等可选停留，不压缩午餐休息或赶路。
  - Cross Keys 已预订10/2–10/4两晚。住宿查询口径4位成人、2间房；4位成人、2晚住宿合计3,349.99 CNY（人民币）；实际订单房间与寝具配置待补充。16:00–21:00到对面the kind cafe办理入住，最迟10/1告知预计到达时间；10/4须10:00前退房。入住前及退房后可寄存，交接点已确认在Cross Keys民宿，可用时段另核。住宿税现金另付，金额待房东告知。电话+81-90-3710-5869。
  - 原京都站前酒店的交通时长与住宿预算已失效；餐饮营业时间不等于民宿接待时间。
  - 不走鞍马山徒步；奥宫是可缩短的支线。
  - 贵船神社本宫开放至20:00不等于巴士运营到20:00。先核33路末段班次，再决定离开时间。
links:
  - - 贵船参拜与灯笼开放信息
    - https://kifunejinja.jp/en/info/
optional:
  - place: okumiya
    note: 贵船奥宫方向：往返支线另加30–45分钟，可完全省略。
    id: day-03-optional-01
overview: []
budget:
  summary: 住宿4人2晚合计3,349.99 CNY；交通与现金住宿税待确认。人民币房费单列，不直接并入JPY合计。
  items:
    - id: day-03-cost-eikando
      name: 门票 · 永观堂
      kind: daily
      category: admission
      ticketOptions:
        - eikando-adult
      quantity: 1
      step: d3-eikando
      note: 按一位普通成人计费1000日元，与地点票价记录一致。
      min: 1000
      max: 1000
      source: https://www.eikando.or.jp/haikan.html
      confirmed: true
    - id: day-03-cost-ginkakuji
      name: 门票 · 银阁寺
      kind: daily
      category: admission
      ticketOptions:
        - ginkakuji-adult
      quantity: 1
      step: d3-ginkakuji
      note: 按一位普通成人计费1000日元，两寺合计2000日元／人；不含特别参观。
      min: 1000
      max: 1000
      source: https://www.shokoku-ji.jp/ginkakuji/access/
      confirmed: true
  notes:
    - 贵船奥宫为可选支线，建议另加30–45分钟；不加入鞍马山徒步。
    - 目前没有已确认预订的餐厅。餐饮未纳入本日统计合计，临时用餐另计；时间轴中的吃饭与休息安排仍保留。
schedule:
  note: 两寺及哲学之道游览合留约3–4小时，午餐休息另留90–120分钟；下午接贵船。旧分钟表暂停，Cross Keys出发交通、银阁寺至出町柳及贵船往返班次待核。
  slots: []
stops:
  - id: d3-kyoto-crosskeys
    place: cross-keys
    time: 按新住宿衔接，时刻待核
    mode: walk
    connection: 按Cross Keys新地址衔接
    duration: ""
    note: Cross Keys 已预订10/2–10/4两晚。住宿查询口径4位成人、2间房；4位成人、2晚住宿合计3,349.99 CNY（人民币）；实际订单房间与寝具配置待补充。16:00–21:00到对面the kind cafe办理入住，最迟10/1告知预计到达时间；10/4须10:00前退房。入住前及退房后可寄存，交接点已确认在Cross Keys民宿，可用时段另核。住宿税现金另付，金额待房东告知。电话+81-90-3710-5869。
  - id: d3-eikando
    place: eikando
    time: 上午，约09:00开始为规划参考
    mode: bus
    connection: Cross Keys出发，市内公共交通至永观堂附近后短步行；具体线路与候车待核
    duration: 参观45–60分钟
    note: 普通入内参观，按体力选择院内路线。
    fees:
      - ticketOptions:
          - eikando-adult
        accounting: budget
        budgetItem: day-03-cost-eikando
  - id: d3-nyakuoji
    place: nyakuoji
    time: 永观堂参观后
    mode: walk
    connection: 永观堂至若王子桥，步行暂留10–15分钟
    note: 从哲学之道南端进入，不另外参观若王子神社。
  - id: d3-philosopher
    place: philosopher
    time: 上午至午间
    mode: walk
    connection: 沿水渠由南向北慢走
    duration: 全段60–90分钟，含沿途短停
    note: 不为最短导航绕去大马路，不重复叠加两端节点的步道时长。
  - id: d3-ginkaku
    place: ginkaku
    time: 步道北端
    mode: walk
    connection: 哲学之道北端至银阁寺桥
    note: 此处只是过渡节点，随后继续进入银阁寺。
  - id: d3-ginkakuji
    place: ginkakuji-temple
    time: 午前至午间，随散步节奏调整
    mode: walk
    connection: 银阁寺桥沿参道到寺院入口，暂留10–15分钟
    duration: 参观45–60分钟
    note: 普通境内参观；结束后在周边用午餐、喝咖啡，坐下休息90–120分钟，再前往出町柳。
    fees:
      - ticketOptions:
          - ginkakuji-adult
        accounting: budget
        budgetItem: day-03-cost-ginkakuji
  - id: d3-demachi
    place: demachi
    time: 午后
    mode: bus
    connection: 银阁寺参观及周边午餐后，市内交通至出町柳叡电起点；具体上车站与班次待核
    duration: ""
    note: 乘车到出町柳，不把市内转场当徒步。
  - id: d3-kibuneguchi
    place: kibuneguchi
    time: 下午
    mode: rail
    connection: 叡山电铁
    duration: ""
    note: 乘鞍马方向；必要时宝池换乘。
  - id: d3-kifune
    place: kifune
    time: 下午至傍晚，随上午进度与返程班次调整
    mode: bus
    connection: 33路巴士，末班待核
    note: 本宫灯笼与近处溪边；奥宫方向可选，不强求走完。
    fees:
      - ticketOptions:
          - kifune-main-admission
        accounting: free
  - id: d3-kibuneguchi-2
    place: kibuneguchi
    time: 按末班倒排
    mode: bus
    connection: 33路返程
    duration: ""
    note: 乘巴士下山，避免因错过末班被迫夜间徒步。
  - id: d3-demachi-2
    place: demachi
    time: 晚间
    mode: rail
    connection: 叡山电铁
    duration: ""
    note: 乘叡电返回市区。
  - id: d3-kyoto-2-crosskeys
    place: cross-keys
    time: 按新住宿衔接，时刻待核
    mode: bus
    connection: 按Cross Keys新地址衔接
    duration: ""
    note: Cross Keys 已预订10/2–10/4两晚。住宿查询口径4位成人、2间房；4位成人、2晚住宿合计3,349.99 CNY（人民币）；实际订单房间与寝具配置待补充。16:00–21:00到对面the kind cafe办理入住，最迟10/1告知预计到达时间；10/4须10:00前退房。入住前及退房后可寄存，交接点已确认在Cross Keys民宿，可用时段另核。住宿税现金另付，金额待房东告知。电话+81-90-3710-5869。
distanceKm: []
activityKcal: []
activityNote: 新增两寺境内步行，原5–7公里与热量估算暂停，待实际参观范围及交通明确后重算。
dining: []
```

## 2026-10-04 · 宇治 · 城阳

```yaml journey:day
id: day-04
date: 2026-10-04
city: 宇治 · 城阳
title: 茶香、鸟居与秋夜花火
subtitle: 稻荷只走短线。宇治茶文化之后先回房休息，再出发看花火。
intensity: 较充实
hotel: uji
focus:
  - uji
  - omotesando
  - taihoan
  - ujibridge
  - nagaike
  - fireworks
luggage: Cross Keys于10:00前退房并按约定寄存 → 京阪往返伏见稻荷 → 返回取件（交接点已确认在Cross Keys民宿） → 清水五条经东福寺换JR至宇治。
next: 花火散场回JR宇治，步行回酒店。明天带行李去JR奈良。
rest: 15:00后回房至少休息60分钟。先吃晚饭，再轻装去会场。
notes:
  - Cross Keys 已预订10/2–10/4两晚。住宿查询口径4位成人、2间房；4位成人、2晚住宿合计3,349.99 CNY（人民币）；实际订单房间与寝具配置待补充。16:00–21:00到对面the
    kind
    cafe办理入住，最迟10/1告知预计到达时间；10/4须10:00前退房。入住前及退房后可寄存，交接点已确认在Cross Keys民宿，可用时段另核。住宿税现金另付，金额待房东告知。电话+81-90-3710-5869。
  - 原京都站前酒店的交通时长与住宿预算已失效；餐饮营业时间不等于民宿接待时间。
  - 花火19:00起约40分钟，仅售前卖票，尚未购票。
  - 会场地图点为公园位置；实际检票入口待官方会场图。散场排队另留时间。
  - 茶体验候选未预约，店家与预约时段确定后再细调。
links:
  - - 宇治商工会议所观光地图｜景点・茶店・美食
    - https://travel.ujicci.or.jp/app/public/index
  - - 城阳市花火官方信息
    - https://www.city.joyo.kyoto.jp/joint/0000012600.html
  - - 对凤庵体验／预约
    - https://www.kyoto-uji-kankou.or.jp/taihoan.html
optional: []
overview:
  - d4-uji
budget:
  summary: 住宿4人2晚合计3,349.99 CNY；交通与现金住宿税待确认。人民币房费单列，不直接并入JPY合计。
  items:
    - id: day-04-cost-02
      name: 体验 · 对凤庵薄茶
      kind: daily
      category: experience
      ticketOptions:
        - taihoan-usucha
      quantity: 1
      step: d4-taihoan
      note: 按一位成人计费，票价与景点卡片引用同一记录。
    - id: day-04-cost-fireworks
      name: 门票 · 城阳秋花火
      kind: daily
      category: admission
      ticketOptions:
        - joyo-general
        - joyo-pia
      quantity: 1
      step: d4-fireworks
      note: 按一位成人计费，票价与景点卡片引用同一记录。
  notes:
    - 茶体验暂以薄茶1500日元、20–30分钟为基准。若改抹茶点前体验3600日元，另加2100日元／人，体验约40分钟（报到另计）。
    - 未把平等院内部参观加入当前路线或总额。
    - 目前没有已确认预订的餐厅。餐饮未纳入本日统计合计，临时用餐另计；时间轴中的吃饭与休息安排仍保留。
  sources:
    - - 对凤庵官方价格与时长
      - https://www.kyoto-uji-kankou.or.jp/taihoan-en.html
schedule:
  note: 京都住宿及交通已更新，旧分钟表暂停；寄存、实际班次与新地址衔接待核。
  slots: []
stops:
  - id: d4-kyoto-crosskeys
    place: cross-keys
    time: 按新住宿衔接，时刻待核
    mode: walk
    connection: 按Cross Keys新地址衔接
    duration: ""
    note: Cross Keys 已预订10/2–10/4两晚。住宿查询口径4位成人、2间房；4位成人、2晚住宿合计3,349.99 CNY（人民币）；实际订单房间与寝具配置待补充。16:00–21:00到对面the
      kind
      cafe办理入住，最迟10/1告知预计到达时间；10/4须10:00前退房。入住前及退房后可寄存，交接点已确认在Cross Keys民宿，可用时段另核。住宿税现金另付，金额待房东告知。电话+81-90-3710-5869。
  - id: d4-inari
    place: inari
    time: 早上短线
    mode: rail
    connection: JR京都至稻荷
    note: 本殿、千本鸟居与奥社附近折返，不登顶。
  - id: d4-kyoto-2-crosskeys
    place: cross-keys
    time: 按新住宿衔接，时刻待核
    mode: rail
    connection: 按Cross Keys新地址衔接
    duration: ""
    note: Cross Keys 已预订10/2–10/4两晚。住宿查询口径4位成人、2间房；4位成人、2晚住宿合计3,349.99 CNY（人民币）；实际订单房间与寝具配置待补充。16:00–21:00到对面the
      kind
      cafe办理入住，最迟10/1告知预计到达时间；10/4须10:00前退房。入住前及退房后可寄存，交接点已确认在Cross Keys民宿，可用时段另核。住宿税现金另付，金额待房东告知。电话+81-90-3710-5869。
  - id: d4-uji
    place: uji
    time: 午前／午间
    mode: rail
    connection: JR宇治；从稻荷结束到放妥行李留75–100分钟
    duration: ""
    note: 酒店已预订，15:00起可入住；如午前到达，先确认能否寄存，再进入茶文化行程。
  - id: d4-omotesando
    place: omotesando
    time: 午饭
    mode: walk
    connection: 酒店向东短走
    note: 表参道茶店与特色美食，不强求逐店打卡。
  - id: d4-taihoan
    place: taihoan
    time: 午后 · 待预约
    mode: walk
    connection: 按预约时间安排
    note: 茶体验候选，坐下体验茶文化。
    fees:
      - ticketOptions:
          - taihoan-usucha
        accounting: budget
        budgetItem: day-04-cost-02
      - ticketOptions:
          - taihoan-matcha-making
        accounting: optional
  - id: d4-ujibridge
    place: ujibridge
    time: 午后
    mode: walk
    connection: 河畔短线
    note: 宇治川、宇治桥慢走。
  - id: d4-uji-2
    place: uji
    time: 15:00后
    mode: walk
    connection: 回房
    duration: ""
    note: 办理入住、休息至少一小时，提前吃晚饭。
  - id: d4-nagaike
    place: nagaike
    time: 傍晚
    mode: rail
    connection: JR宇治至长池，酒店到入场留45–75分钟
    duration: ""
    note: 轻装去会场；目标18:00–18:15入场。
  - id: d4-fireworks
    place: fireworks
    time: 19:00 · 约40分钟
    mode: walk
    connection: 车站到公园，含入场和人流余量
    note: 按实际检票口入场；票务、座位与散场规则待确认。
    fees:
      - ticketOptions:
          - joyo-general
          - joyo-pia
        accounting: budget
        budgetItem: day-04-cost-fireworks
  - id: d4-nagaike-2
    place: nagaike
    time: 散场后
    mode: walk
    connection: 按现场人流组织
    duration: ""
    note: 排队离场，不承诺固定到站分钟数。
  - id: d4-uji-3
    place: uji
    time: 晚间
    mode: rail
    connection: JR＋酒店短距离步行
    duration: ""
    note: 回JR宇治，走回已入住的酒店。
distanceKm:
  - 6
  - 9
activityKcal:
  - 250
  - 500
dining: []
```

### 第五天：若草山 → JR奈良取件 → 有马一泊二食，时间测算

**2026-09-14已建立正式Plan A（day-05-a），第五晚首选御幸荘 花結び；当前预算仍争取13:00离开草坡、约17点到酒店，19:00晚餐待预约。下文为历次测算，酒店规则以花結び资料及正式Plan A为准；班次、接驳、房量与用餐尚未确认。**

**历史测算示例：月光园鸿胧馆，已由下方花結び正式Plan A替代。以下接驳规则与18:30假设仅属于旧酒店示例，不用于花結び。** 奈良段使用山麓出租车15–20分钟；铁路仍留130–150分钟；有马站出站至本酒店按20–30分钟（含等接驳10–15分钟、约5分钟车程及装行李）重算。其余取件进站20–30分钟、登记入住15–20分钟不变。从山麓上车到酒店门口185–230分钟（3小时5分–3小时50分），到完成入住200–250分钟（3小时20分–4小时10分）；加一重目下山15–25分钟，草坡出发到完成入住215–275分钟（3小时35分–4小时35分）。这比上方泛酒店出租车版本多留5分钟接驳；同口径与巴士版本比较仍约省20–30分钟，不保证班次离散情况下到店恰好提前同样分钟。

推荐样例：13:00离开一重目 → 13:20山麓出租车上车 → 13:40 JR奈良 → 14:05取件进站完成 → 16:25有马温泉站 → 16:50到鸿胧馆 → 17:10完成入住。全部为规划占位，并非10/5确认列车时刻。若酒店能确认18:30会席，例中约留80分钟休息和延误缓冲；13:30离山则整体顺延30分钟，17:40完成入住。建议13:00–13:30离开草坡，不以19:00入住上限为日常目标。酒店具体10/5房量及晚餐时段尚未确认；正式第五天与次日出发节点待方案选定后同步。

**出租车版本更新（2026-09-14）：** 以南侧山麓「古都の宿 むさし野」周边合法上车点为参考，酒店官网列近铁／JR奈良站至酒店出租车约10–15分钟；反向至JR奈良先按15–20分钟车程预留，不是10/5实测导航，不包含叫车等待，上车点须与司机确认。[山麓酒店官方交通参考](https://www.nara-musashino.com/about.html)

在车已到位、两辆车同步接走五人的假设下，将原“山麓步行＋候车＋巴士35–50分钟”替换为“出租车15–20分钟”，其他项目不变：从一重目离开到完成有马酒店入住由230–300分钟减至210–270分钟（3小时30分–4小时30分）；从山麓上车开始算，到酒店门口180–225分钟（3小时–3小时45分），完成入住195–245分钟（3小时15分–4小时5分）。同口径约节省20–30分钟；列车班次离散，省下的道路时间不保证全部转化为提早到店。未约好车辆时叫车等待另加，不假设零等待。

样例：13:00离开一重目 → 13:20山麓上车 → 13:40 JR奈良取件 → 14:05准备乘电车 → 16:25有马温泉站 → 16:45酒店 → 17:05完成入住。此表全部是预算占位，不是已核实的列车发到时刻。与原13:00离山、17:25完成入住样例比较，节省20分钟；18:00晚餐仍建议保留13:00左右离山，节省的时间优先作缓冲。下文巴士版本保留供比较。

核查日期：2026-09-14。旅行日：2026-10-05（周一）。本节是可行性测算，未确认酒店、五人房量和10/5精确列车班次，不替换为已落实的执行时刻表。按现有一重目草坡计算，不是第三重山顶停车场。

**关键更新：JR奈良站前奈良市综合观光案内所自2026/4/1起寄存服务09:00–16:00，14:00停止收件。开馆至21:00不等于行李可取到21:00。** 上午存、下午提前取可行，五件行李容量仍未确认；不住宿御宿野乃时不默认其提供寄存。[观光协会官方变更公告](https://narashikanko.or.jp/news/detail_95.html)

| 路段 | 规划预留 | 证据与限制 |
|---|---|---|
| 一重目草坡下至南侧山麓 | 15–25分钟 | 按当前短线步道的团队步速估算，不含第三重山顶 |
| 山麓步行到巴士站、候车、巴士到JR奈良 | 35–50分钟 | 官方进山交通参考为巴士后步行约15分钟；返程方向、候车与道路余量另计，非已核实返程班次 |
| 取五件行李、洗手间、进站上站台 | 20–30分钟 | 团队操作预留；寄存点在JR奈良站前 |
| JR奈良 → 大阪 → JR三ノ宮／地铁三宫 → 谷上 → 有马口 → 有马温泉 | 130–150分钟 | 全铁路估算，含换乘，按五人带箱留余量；4次换乘。公开工作日样例约127分钟，但并非10/5已核实班次 |
| 有马温泉站出站、联系接驳、到酒店 | 15–25分钟 | 酒店待选；兵卫向阳阁官方允许到站联系接驳，可作接驳机制参考 |
| 酒店登记入住、放行李 | 15–20分钟 | 团队操作预留 |
| 合计：离开草坡到完成入住 | 230–300分钟，即3小时50分–5小时 | 不含额外长时间延误，也未安排饭前泡汤 |

计算样例（均为规划占位，不是实际列车时刻）：13:00离开草坡 → 13:20山麓 → 14:00到JR奈良寄存点 → 14:25取件完成并候车出发 → 16:45有马温泉站 → 17:05酒店 → 17:25完成入住。合计265分钟；若18:00晚餐，另有35分钟余量，可吸收部分等待，不应再塞入完整泡汤活动。

保守倒排采用“离开草坡至晚餐共5小时”预算：18:00晚餐对应13:00离开草坡；18:30对应13:30；19:00对应14:00。这是建议出发界线而非保证或绝对最晚出发时刻；酒店更早的含餐入住截止优先。若已在山麓，可少计下山约20分钟；若坚持16:40才下山返城，预计晚间到店，且案内所已停止取件，不适合该一泊二食方案。

[奈良县山麓交通](https://www.pref.nara.lg.jp/yamayaki/1006.html)；[奈良交通公园交通](https://navi.narakotsu.co.jp/lang/ja/access/jr-narapark.html)；[奈良至有马公开线路样例](https://transit.yahoo.co.jp/search/result?all=1&expkind=1&from=%E5%A5%88%E8%89%AF&s=0&stype=&ticket=ic&to=%E6%9C%89%E9%A6%AC%E6%B8%A9%E6%B3%89&ws=3)。最后一链接查询页面的日期为9/11，路线1含巴士，不能当作全铁路；路线2约2小时7分为铁路参考。10/5定日查询未成功取得结果，不写入未经验证的分段列车发到时刻。

晚餐核查示例：兵卫向阳阁官网当前餐厅页列木兰／紫阳花17:30–21:00、最后点单20:00，花之舞17:30–21:00、最后入场19:30。**餐厅营业时段不是含餐住宿可随时到店的承诺**；必须确认具体10/5套餐的最晚入住、五人晚餐开始时刻及迟到处理。曾检索到的旧1314y套餐仅有效至2026/3/31，不能用于10/5判断或报价。酒店尚未选定，本节的18:00／18:30／19:00仅为比较情景。[官方餐厅时段](https://www.hyoe.co.jp/facilities/restaurant/)；[官方接驳](https://www.hyoe.co.jp/access/)

原有马Grand Hotel在2026/10/5因包场住宿休馆，必须另选酒店。[官方休馆公告](https://www.arima-gh.jp/news/business-hours/)

结论：一泊二食具有可行性，但若草山应安排到午前／午后较早，约13:00–14:00离开草坡；不能只删东大寺却保留草坡夕照与奈良晚饭。更希望饭前从容泡汤，则在上述建议基础上再提前45–60分钟离山。

## 2026-10-05 · 奈良 → 有马（Plan A）

```yaml journey:day
id: day-05-a
date: 2026-10-05
city: 奈良 → 有马
title: 奈良看鹿与草坡，前往已订的兆乐
subtitle: 宇治退房 → 近铁奈良寄存 → 公园与若草山 → 取件赴有马兆乐，东大寺只在时间充裕时加入。
intensity: 半日游览与跨城移动
hotel: choraku
focus:
  - kasuga
  - mizuya
  - hill
  - hanamusubi
luggage: 宇治10:00前退房，经JR奈良转至近铁奈良寄存；游览后回同一处取件，铁路赴有马并联系兆乐接送。柜位尺寸及取件时间待审核。
next: 10/6从兆乐退房，小镇午餐后取件前往神户市区酒店；寄存待确认。
rest: 午后不加景点；到酒店后休息，晚餐及泡汤以从容为先。
notes:
  - 兆乐已预订10/5–10/6一晚；房型、餐食、价格与入住截止待订单。
  - 原19:00晚餐并非兆乐已确认安排；保留提早离奈良的余量，待酒店确认后重算。
  - 近铁奈良寄存与用车容量待确认；不在奈良过夜，也不等若草山夕照。
optional:
  - id: day-05-a-optional-todaiji
    place: todaiji
    note: 东大寺及南大门仅在不影响午后出发时考虑，默认跳过；不可压缩转场缓冲来加入。
  - id: day-05-a-optional-nandaimon
    place: nandaimon
    note: 随东大寺支线选择，不属于主路线。
overview:
  - d5a-kintetsu-storage
  - d5a-hill
  - d5a-hotel
budget:
  summary: 酒店已订但价格未提供；交通、寄存与税费待核，未预订餐饮不计。
  items:
    - name: 若草山成人入山费
      min: 150
      max: 150
      note: 进入一重目草坡时发生。
      source: https://www.pref.nara.lg.jp/site/park/2585.html
      confirmed: true
  notes:
    - 兆乐是否含餐、房费待确认，不使用花結び套餐价格。
schedule:
  note: 午后离开奈良，待兆乐晚餐与入住时刻确认后再倒排。
  slots: []
stops:
  - id: d5a-uji
    place: uji
    time: 早餐后
    mode: walk
    connection: 宇治退房带行李
    note: 10:00前退房；订单不含早餐，另行安排。前一晚花火后的休息也要兼顾，不通过强行早起塞入更多景点。
  - id: d5a-kintetsu-storage
    place: nara-kintetsu-storage
    time: 上午
    mode: taxi
    connection: JR宇治直达JR奈良后，打车至近铁奈良站寄存；两辆普通车或确认五人及行李容量
    note: 上午办理寄存，五件行李容量待核。
  - id: d5a-kasuga
    place: kasuga
    time: 上午
    mode: taxi
    connection: 从近铁奈良站寄存后打车到公园附近允许下车处，再短步行
    note: 五人用车及上下车点待核，仅走林荫短线。
  - id: d5a-mizuya
    place: mizuya
    time: 午前或午间
    mode: walk
    connection: 公园内部短步行
    note: 奈良午间用餐或茶歇；店家营业与供应需行前复核，避免排队挤占离山时间。
  - id: d5a-wakakusa
    place: wakakusa
    time: 午前至午后较早
    mode: walk
    connection: 到若草山南侧山麓
    note: 不去第三重山顶，不安排夕照等待。
  - id: d5a-hill
    place: hill
    time: 午后较早 · 依酒店到店要求倒排
    mode: walk
    connection: 南侧入口至一重目草坡
    note: 不等落日；兆乐最晚到店时间确认后重算离山和取件时刻。
  - id: d5a-down
    place: wakakusa
    time: 午后较早 · 依酒店到店要求倒排
    mode: walk
    connection: 原路下山到约定出租车上车点
    note: 不等落日；兆乐最晚到店时间确认后重算离山和取件时刻。
    deadline:
      title: 离山提醒 · 兆乐到店要求待确认
      transit: 公共交通：最晚离山时间待重新倒排
      taxi: Uber／出租车：目的地设为近铁奈良站，最晚出发时间待重新倒排
      calculation: 计入山麓至车站、取行李、铁路换乘、等待酒店接驳及办理入住的时间。
      pickup: 返回早上同一寄存点。提前确认车辆和行李容量，叫车等待也计入交通时间。
      caveat: 原13:20／13:45截止基于另一家酒店19:00晚餐，现已失效，不是兆乐订单承诺。
      source: https://choraku.com/access/
      uberSource: https://www.uber.com/global/ja/r/cities/nara-nara-jp/
  - id: d5a-kintetsu-pickup
    place: nara-kintetsu-storage
    time: 午后较早 · 依酒店到店要求倒排
    mode: taxi
    connection: 可用Uber／出租车至近铁奈良（车程暂留15分钟）；公共交通含步行候车暂留40分钟；取件及进站另留30分钟
    note: 不等落日；兆乐最晚到店时间确认后重算离山和取件时刻。
  - id: d5a-kintetsu-depart
    place: kintetsunara
    time: 取件后进站
    mode: walk
    connection: 从寄存柜到近铁奈良站站台，优先使用电梯
    note: 核对列车终点为神户三宫，优先直通快速急行；不再返回JR奈良或大阪站。
  - id: d5a-sannomiya
    place: sannomiya
    time: 午后铁路换乘
    mode: rail
    connection: 近铁奈良乘直通快速急行至阪神神户三宫，不在大阪站换乘，再步行转地铁三宫
    note: 优先神户三宫直通班次；普通车或其他终点可能需换乘，行前核10月5日班次。阪神站至地铁的电梯与带箱步行计入余量。
  - id: d5a-tanigami
    place: tanigami
    time: 换乘
    mode: rail
    connection: 地铁经新神户至谷上
    note: 不另安排神户游览。
  - id: d5a-arimaguchi
    place: arimaguchi
    time: 换乘
    mode: rail
    connection: 神户电铁至有马口
    note: 换乘有马温泉支线。
  - id: d5a-arimast
    place: arimast
    time: 约16:55（目标预算）
    mode: rail
    connection: 有马口至有马温泉；近铁奈良至此整体暂留150–170分钟（含候车及三宫换乘），未核实班次
    note: 到站联系花結び接驳。
  - id: d5a-hotel
    place: hanamusubi
    time: 约17:25到店、17:45完成入住（目标预算）
    mode: shuttle
    connection: 出站、等待及接驳共留20–30分钟
    note: 一泊二食，目标19:00会席待酒店确认；含餐入住截止另核。接驳20–30分钟为规划余量，非酒店承诺。
dining: []
links:
  - - 兆乐官网
    - https://choraku.com/
  - - 兆乐交通与接送
    - https://choraku.com/access/
```

## 2026-10-05 · 奈良（Plan B留宿版本）

```yaml journey:day
id: day-05
date: 2026-10-05
city: 奈良
title: 林间看鹿与草坡，预留提前返城空间
subtitle: 主路线不含东大寺及南大门；仅作时间充裕时的备选，为第五晚可能转往有马做准备。
intensity: 有坡度
hotel: nara
focus:
  - kasuga
  - mizuya
  - wakakusa
  - hill
  - kintetsunara
luggage: 宇治退房带行李 → JR奈良 → 御宿野乃寄存 → 公交入公园。
next: 当晚住奈良，避免晚餐后赶跨城车。前五晚住宿整合仍在讨论；第六天选择神户市区或加太海月。
rest: 午饭后坐下休息。东大寺可不去，森林只走开放短线，不默认加入长距离环线。
notes:
  - 2026-09-14：东大寺大佛殿原已为备选，本次进一步将南大门外观及专门绕行从主路线删除。不要把已有备选再次当成新省下的参观时间。
  - 第五晚有马方案仍待选酒店、寄存点及交通后重排；旧奈良住宿字段仅为占位，不能据此执行晚间行程。有马Grand
    Hotel在10/5住宿休馆，不能直接平移预订。
  - 若草山一般开放至17:00，10/5日落约17:36。草坡日落尚需确认允许停留区域与退出规则；未确认前安排闭门前夕照。
  - 山顶巴士末班17:20早于日落，不拿它解决看完日落下山。
  - 一重目点位仅作山坡示意；按官方步道图走，地图不代表已确认夜间开放。
links:
  - - 若草山官方步道图
    - https://www.pref.nara.lg.jp/documents/2378/20251023155602.pdf
  - - 开放信息
    - https://www.pref.nara.lg.jp/site/park/2585.html
  - - 奈良10月日落表
    - https://eco2.mtk.nao.ac.jp/koyomi/dni/2026/s3010.html
optional:
  - place: nandaimon
    note: 随东大寺支线选择；不再作为主路线必经或停留景点。
    id: day-05-optional-nandaimon
  - place: todaiji
    note: 东大寺与南大门合为可选支线，默认不去；只在不影响提前离开奈良时选择。大佛殿参观45–60分钟，南大门与往返另留；成人门票 JPY
      800，未计入主线总额。
    id: day-05-optional-01
    fees:
      - ticketOptions:
          - todaiji-daibutsuden
        accounting: optional
overview:
  - d5-nara
budget:
  summary: 公园林荫与一重目草坡为主，坡道是当天主要体力负担。东大寺只在时间与体力允许时加入。
  items:
    - name: 交通
      min: 1000
      max: 1600
      note: 宇治到奈良与奈良市内公交预算。
      source: null
      confirmed: false
      kind: daily
      id: day-05-cost-01
      currency: JPY
    - id: day-05-cost-02
      name: 门票 · 若草山入山
      kind: daily
      category: admission
      ticketOptions:
        - wakakusa-adult
      quantity: 1
      step: d5-hill
      note: 按一位成人计费，票价与景点卡片引用同一记录。
    - name: 当晚住宿
      min: 9000
      max: 15000
      note: 御宿野乃奈良每人分摊占位，按不含餐估算。
      source: null
      confirmed: false
      kind: lodging
      id: day-05-cost-04
      currency: JPY
    - name: 税费／杂项预留
      min: 300
      max: 1000
      note: 住宿相关税费、喂鹿等可变小额支出预留。
      source: null
      confirmed: false
      kind: daily
      id: day-05-cost-05
      currency: JPY
  notes:
    - 东大寺大佛殿是备选，不计入主线合计：另加800日元／人、45–60分钟参观，支线往返时间另留。
    - 目前没有已确认预订的餐厅。餐饮未纳入本日统计合计，临时用餐另计；时间轴中的吃饭与休息安排仍保留。
  sources:
    - - 东大寺官方门票
      - https://www.todaiji.or.jp/information/haikan/
schedule:
  note: 奈良主线已移除南大门必经段，饭后经三条通返回JR奈良；具体时间分配待复核。
  slots: []
stops:
  - id: d5-uji
    place: uji
    time: 早餐后
    mode: walk
    connection: ""
    duration: ""
    note: 10:00前取全部行李退房；订单不含早餐，另行安排。
  - id: d5-nara
    place: nara
    time: 上午
    mode: rail
    connection: JR宇治至奈良，酒店到寄存点留50–75分钟
    duration: ""
    note: 先到酒店寄存，再去公园。
  - id: d5-kasuga
    place: kasuga
    time: 上午
    mode: bus
    connection: 乘公交入园，保存脚力
    note: 林荫参道、开放短步道与鹿；深一些的森林段放白天。
    fees:
      - ticketOptions:
          - kasuga-special
        accounting: optional
  - id: d5-mizuya
    place: mizuya
    time: 午饭／午后
    mode: walk
    connection: 公园内部短步行
    note: 午间坐下休息。东大寺作为可选支线，餐厅待选。
  - id: d5-wakakusa
    place: wakakusa
    time: 下午
    mode: walk
    connection: 不直接导航到第三重山顶
    duration: 山麓入山准备约10–15分钟
    note: 到若草山南侧山麓。点位使用山麓旅馆作路标，不是本晚酒店。
  - id: d5-hill
    place: hill
    time: 闭门前夕照
    mode: walk
    connection: 南门至一重目约500米单程，包含爬坡
    note: 一重目草坡观景；上下坡另留30–40分钟，17:00前退出收费草坡。完整日落须另确认开放许可。
    fees:
      - ticketOptions:
          - wakakusa-adult
        accounting: budget
        budgetItem: day-05-cost-02
  - id: d5-wakakusa-2
    place: wakakusa
    time: 17:00前退出
    mode: walk
    connection: 原步道下山
    duration: 下山后短歇约10分钟
    note: 按开放时间回到山麓，之后向市区走，避免入夜再穿森林。
  - id: d5-kintetsunara
    place: kintetsunara
    time: 晚饭
    mode: walk
    connection: 从若草山山麓返城，不专门绕行参观南大门
    note: 奈良晚餐是否保留随有马住宿方案重排。
  - id: d5-nara-2
    place: nara
    time: 晚饭后
    mode: walk
    connection: 回JR奈良酒店
    duration: ""
    note: 沿三条通方向回酒店，累了可改公交。
distanceKm:
  - 6
  - 9
activityKcal:
  - 300
  - 550
dining: []
```

## 2026-10-06 · 有马 → 神户

```yaml journey:day
id: day-06-a
date: 2026-10-06
city: 有马 → 神户
title: 有马小镇午餐、神户闲逛与须磨夕照
subtitle: 有马早餐与小镇午餐 → 下午神户酒店 → 城市闲逛 → 傍晚须磨 → 晚餐及可选夜景。
intensity: 弹性休闲
hotel: kobe-hotel
focus:
  - arima-town
  - sannomiya
  - motomachi
  - beach
  - venus
  - kobe-hotel
luggage: 按兆乐订单退房；拟寄存后轻装游小镇、用午餐，再回酒店取件赴神户。寄存、取件及接送需确认，不沿用花結び退房时间。
next: 第七天从神户市区酒店前往关西机场，班次与出发时间按航班倒排。
rest: 上午不安排海边；下午城市闲逛可随时坐下喝咖啡或回酒店休息，傍晚海边预留放空时间。
notes:
  - 兆乐早餐、退房时刻待订单确认；神户当晚酒店待选。
  - 目标12:00–13:00左右小镇午餐，饭后取件出发；酒店间转场暂留75–105分钟，具体班次与神户酒店待定。
  - 神户目标14:30左右到酒店，未到入住时间先寄存；实际酒店寄存和入住条件待核。
  - 午后闲逛不设置必须走完的清单；若转场较晚则缩短闲逛，不为同时完成购物与海边夕照而赶路。
  - 傍晚留给须磨，晚餐接在海边之后；维纳斯桥仅为饭后可选，元町站附近出租车往返。
  - 工厂已删除，舞子仅保留资料候选；第六晚住神户，不再夜间返回有马。
links:
  - - 神户官方维纳斯桥介绍
    - https://www.feel-kobe.jp/facilities/0000000091/
optional:
  - id: day-06-a-optional-venus
    place: venus
    note: 饭后按兴致选择，元町站附近打车往返，不追赶蓝调时段。
overview:
  - d6-storage
  - d6-beach
  - d6-kobe-hotel
budget:
  summary: 本次调整后交通、神户酒店及两顿大餐预算待重算；删除旧有马方案的金额，空项不表示免费。
  items: []
  notes:
    - 有马午餐及神户晚餐均未选定；正式神户牛优先安排神户晚餐，套餐、预算与预约另核。
    - 维纳斯桥出租车需按五人实际用车方案报价，不沿用公共交通预算。
schedule:
  note: 本日只确定顺序和宽泛时段，不设置逐分钟执行表；海边日落与饭后夜景不安排跨点追赶。
  slots: []
stops:
  - id: d6-arima-hotel
    place: hanamusubi
    time: 上午
    mode: walk
    connection: 酒店早餐、休息及按兴致泡汤
    note: 常规10:00前退房，先确认午餐期间寄存安排。
  - id: d6-arima-town
    place: arima-town
    time: 上午至午间
    mode: walk
    connection: 酒店至小镇的短距离散步，必要时酒店接驳
    note: 不规定必须参观的店铺。
  - id: d6-arima-lunch
    place: arima-town
    time: 12:00–13:00左右（规划）
    mode: walk
    connection: 小镇内选店用午餐
    note: 餐厅待选；一泊二食不含这顿午餐。
  - id: d6-arima-pickup
    place: hanamusubi
    time: 午餐后
    mode: walk
    connection: 回酒店取暂存行李
    note: 神户酒店到达时间须包含这段往返和接驳等待。
  - id: d6-arimast
    place: arimast
    time: 取件后
    mode: shuttle
    connection: 花結び送至有马温泉站
    note: 按酒店当日安排联系送站。
  - id: d6-arimaguchi
    place: arimaguchi
    time: 午后转场
    mode: rail
    connection: 有马温泉支线至有马口
    note: 全队带行李同行。
  - id: d6-tanigami
    place: tanigami
    time: 午后转场
    mode: rail
    connection: 神户电铁至谷上
    note: 换乘地铁。
  - id: d6-sannomiya
    place: sannomiya
    time: 午后抵达
    mode: rail
    connection: 地铁谷上至三宫
    note: 酒店间整体先留75–105分钟，包含取件后的接驳、换乘与市区酒店最后一段，班次待核。
  - id: d6-storage
    place: kobe-hotel
    time: 目标14:30左右（规划）
    mode: walk
    connection: 从三宫前往所选酒店，距离较远则打车
    note: 先放好行李；未到酒店允许入住时间则寄存，入住条件待核。
  - id: d6-motomachi
    place: motomachi
    time: 神户酒店放妥行李后至下午较晚
    mode: walk
    connection: 三宫与元町一带城市闲逛，按兴趣选店
    note: 不设置必须走完的购物清单；随时咖啡、休息，不为增加步数而绕路。
  - id: d6-suma
    place: suma
    time: 约16:00前后出发方向，依当天节奏调整
    mode: rail
    connection: 从市中心就近乘JR前往须磨；路线图暂以元町站出发表示，班次待核
    note: 根据当天状态留足海边时间，不等到临近日落才匆忙出发。
  - id: d6-beach
    place: beach
    time: 傍晚至日落前后
    mode: walk
    connection: JR须磨站南侧至沙滩短距离步行
    duration: 建议留约60–90分钟，可随兴致调整
    note: 沙滩散步、坐下看海、放空；不为了去维纳斯桥看蓝调而提前离开。
  - id: d6-suma-2
    place: suma
    time: 海边休息尽兴后
    mode: walk
    connection: 短距离返回JR须磨站
    note: 不安排第二处日落或蓝调追赶。
  - id: d6-sannomiya-2
    place: sannomiya
    time: 晚上
    mode: rail
    connection: 须磨返回神户市中心；晚餐区域暂以三宫表示，餐厅待选
    duration: 充分预留晚餐时间
    note: 再安排一顿大餐；预约时间须给海边与返城留缓冲，具体菜系及预算待选。
  - id: d6-venus
    place: venus
    time: 晚饭后可选，不设必到时刻
    mode: taxi
    connection: 元町站附近打车前往；下车点及最后短距离步行待核
    note: 五人需两辆普通出租车或确认可载五名乘客的车型；往返以出租车为主，夜间返程叫车条件待核。选择本支线时插入晚餐与回酒店之间。
  - id: d6-city-return
    place: motomachi
    time: 仅在选择维纳斯桥后
    mode: taxi
    connection: 维纳斯桥打车返回元町一带；最终可按酒店位置调整下车点
    note: 本段随维纳斯桥支线启用；跳过维纳斯桥时不必经过此站。
  - id: d6-kobe-hotel
    place: kobe-hotel
    time: 当晚尽兴后
    mode: walk
    connection: 根据酒店位置选择短步行或打车，具体路线待定
    note: 回神户市区酒店休息，不再跨城赶往温泉酒店。
dining: []
```

## 2026-10-07 · 神户 → 关西机场

```yaml journey:day
id: day-07-a
date: 2026-10-07
city: 神户 → 关西机场
title: 留够余量，轻松返程
subtitle: 从神户市区酒店出发，所有时间由实际航班倒排。
intensity: 返程
hotel: null
focus:
  - kobe-hotel
  - sannomiya
  - kix
luggage: 神户市区酒店退房，带全部行李前往机场。
next: 按实际航班及航站楼要求留足值机、安检时间。
rest: 依出发时间安排早餐，不添加景点。
notes:
  - 酒店、航班及T1／T2尚未确认；不沿用旧有马送站及铁路接驳时间表。
links:
  - - 三宫至关西机场巴士
    - https://www.kate.co.jp/tcn/timetable/detail/KB
optional: []
overview:
  - d7-kix
budget:
  summary: 改从神户市区出发后，交通预算按所选酒店与机场方案重算；空项不表示免费。
  items: []
schedule:
  note: 航班确定后倒排离店时间、机场交通与值机安检余量。
  slots: []
stops:
  - id: d7-kobe-hotel
    place: kobe-hotel
    time: 按航班倒排
    mode: walk
    connection: 酒店到机场交通上车点的接驳待酒店选定后规划
    note: 早餐、收拾、退房；不默认住宿含早餐。
  - id: d7-sannomiya
    place: sannomiya
    time: 按班次倒排
    mode: walk
    connection: 酒店至三宫；按实际距离选择步行或打车
    note: 候车、装行李留余量。
  - id: d7-kix
    place: kix
    time: 按航班要求提前抵达
    mode: bus
    connection: 暂以三宫机场巴士表示，实际班次及航站楼待核
    note: 交通方案可在详情中比较，不为交通选择增加路线图分支。
dining: []
```


## 2026-10-06 · 和歌山 · 加太

```yaml journey:day
id: day-06-b
date: 2026-10-06
city: 和歌山 · 加太
title: 把一整天，留给海与温泉
subtitle: 奈良 → 加太海月。午睡、海景、泡汤与酒店晚餐。
intensity: 休闲恢复
hotel: kaigetsu
focus:
  - kada
  - kaigetsu
luggage: 从奈良酒店带全部行李到加太海月。加太站用酒店接驳，放妥行李后才短逛。
next: 明早按航班选择09:30或10:10送站，经南海线去关西机场。需更早离店时另确认交通。
rest: 下午整段用于酒店休息。附近15–30分钟散步可以完全省略，不加入登山或友岛徒步。
notes:
  - Plan B整天替换神户与有马，按房态及取消条件提前选择，并非已订好可随时切换。
  - 海景房、价格、五人房型与一泊两食方案待确认。酒店餐饮需事先预约。
  - 接站12:00–21:00，乘加太线前电话告知酒店发车时刻。
links:
  - - 加太海月官网
    - https://kada-kaigetsu.com/top/
  - - 接驳与交通
    - https://kada-kaigetsu.com/access/
  - - 入住与餐饮说明
    - https://kada-kaigetsu.com/qa/
optional: []
overview:
  - d6-b-kaigetsu
budget:
  summary: 整天用于恢复体力：中午抵达加太，下午入住、午睡、看海与泡汤。把大部分预算放在海景住宿和一泊两食。
  items:
    - name: 交通
      min: 2200
      max: 3300
      note: 奈良经新今宫、南海线至加太，加酒店接驳的规划预算。
      source: null
      confirmed: false
      kind: daily
      id: day-06-b-cost-01
      currency: JPY
    - name: 门票／体验
      min: 0
      max: 0
      note: 酒店附近可选短走，不增加收费景点。
      source: null
      confirmed: false
      kind: daily
      id: day-06-b-cost-02
      currency: JPY
    - name: 当晚住宿
      min: 15000
      max: 30000
      note: 加太海月每人分摊预算占位，假设一泊两食，含当晚晚餐、次日早餐与住客大浴场，非指定日期报价。
      source: null
      confirmed: false
      kind: lodging
      id: day-06-b-cost-04
      currency: JPY
    - name: 税费／杂项预留
      min: 300
      max: 1000
      note: 住宿相关税费与小额支出预留。
      source: null
      confirmed: false
      kind: daily
      id: day-06-b-cost-05
      currency: JPY
  notes:
    - 若最终订素泊或仅含早房型，需要另安排晚餐；只有确认预订餐厅后才增加独立餐饮费用，未订晚餐继续列为统计范围之外。
    - 目前没有已确认预订的餐厅。餐饮未纳入本日统计合计，临时用餐另计；时间轴中的吃饭与休息安排仍保留。
schedule:
  start: 08:00
  note: 加太海月按一整天休闲规划；交通预留3.5小时、途中午饭另留1小时。15:00入住与18:00晚餐为候选安排，未订房。
  slots:
    - end: 09:00
      type: meal
      label: 早餐
      place: ""
      note: ""
      id: day-06-b-slot-01
    - end: 09:30
      type: hotel
      label: 收拾、退房
      place: nara
      note: ""
      id: day-06-b-slot-02
      step: d6-b-nara
    - end: 12:00
      type: travel
      label: 奈良→新今宫→和歌山
      place: wakayamashi
      note: ""
      id: day-06-b-slot-03
      step: d6-b-wakayamashi
    - end: 13:00
      type: meal
      label: 换乘途中午饭
      place: wakayamashi
      note: ""
      id: day-06-b-slot-04
      step: d6-b-wakayamashi
    - end: 13:45
      type: travel
      label: 南海加太线
      place: kada
      note: ""
      id: day-06-b-slot-05
      step: d6-b-kada
    - end: 14:00
      type: travel
      label: 酒店接驳
      place: kaigetsu
      note: ""
      id: day-06-b-slot-06
      step: d6-b-kaigetsu
    - end: 14:15
      type: hotel
      label: 寄存行李
      place: kaigetsu
      note: ""
      id: day-06-b-slot-07
      step: d6-b-kaigetsu
    - end: 15:00
      type: free
      label: 等入住、看海休息
      place: kaigetsu
      note: 房间和住客浴场使用均按15:00后安排，不假设提前开放。
      id: day-06-b-slot-08
      step: d6-b-kaigetsu
    - end: 15:15
      type: hotel
      label: 办理入住
      place: kaigetsu
      note: ""
      id: day-06-b-slot-09
      step: d6-b-kaigetsu
    - end: 18:00
      type: hotel
      label: 午睡、泡汤、海景
      place: kaigetsu
      note: 附近15–30分钟散步可从此段自行选择，不增加徒步主线。
      id: day-06-b-slot-10
      step: d6-b-kaigetsu
    - end: 19:30
      type: meal
      label: 酒店晚饭
      place: kaigetsu
      note: ""
      id: day-06-b-slot-11
      step: d6-b-kaigetsu
    - end: 24:00
      type: hotel
      label: 海景与回房休息
      place: kaigetsu
      note: ""
      id: day-06-b-slot-12
      step: d6-b-kaigetsu
stops:
  - id: d6-b-nara
    place: nara
    time: 09:30–10:00
    mode: walk
    connection: ""
    duration: ""
    note: 吃好早餐再退房出发。
  - id: d6-b-shinimamiya
    place: shinimamiya
    time: 上午
    mode: rail
    connection: JR大和路线
    duration: ""
    note: JR转南海本线，减少拖箱走路。
  - id: d6-b-wakayamashi
    place: wakayamashi
    time: 午饭／换乘
    mode: rail
    connection: 南海本线；按当日班次选择
    duration: ""
    note: 途中午饭，不增加沿途景点。具体可在纪之川或和歌山市换乘。
  - id: d6-b-kada
    place: kada
    time: 13:00–14:30左右
    mode: rail
    connection: 南海加太线
    duration: ""
    note: 联系酒店接站，不拖箱步行25分钟去酒店。
  - id: d6-b-kaigetsu
    place: kaigetsu
    time: 抵达后寄存 · 15:00入住
    mode: shuttle
    connection: 酒店接站；奈良到酒店整体留3–3.5小时，午饭另留
    note: 到酒店后就放慢节奏。午睡、泡汤、海景；傍晚可选短散步，18:00／18:30／19:00酒店晚餐，以预订方案为准。
distanceKm:
  - 1
  - 3
activityKcal:
  - 40
  - 150
dining: []
```

## 2026-10-07 · 加太 → 关西机场

```yaml journey:day
id: day-07-b
date: 2026-10-07
city: 加太 → 关西机场
title: 海边早餐之后，前往机场
subtitle: 与Day6的加太海月方案联动；上午只保留返程必需移动。
intensity: 返程
hotel: null
focus:
  - kaigetsu
  - kada
  - wakayamashi
  - izumisano
  - kix
luggage: 加太海月取全部行李 → 酒店送站 → 南海线 → 关西机场。
next: 酒店到机场先留2–2.5小时，值机安检另留。航班未定，不能先锁死送站班次。
rest: 早餐与晨间泡汤只在航班允许时保留，上午不增加新的景点。
notes:
  - 酒店送站09:30／10:10；退房一般10:00，坐10:10班次也要先按时退房。
  - 若需更早抵达机场，另确认早间交通或调整前一晚住宿。
links:
  - - 加太海月接驳
    - https://kada-kaigetsu.com/access/
optional: []
overview:
  - d7-b-kix
budget:
  summary: 酒店早餐后按送站班次返程，上午不安排景点。早餐暂按前晚一泊两食候选方案已含处理，尚未订房或付款；其他用餐未预订，不计入餐饮。
  items:
    - name: 交通
      min: 1500
      max: 2300
      note: 加太线、南海本线与机场线，含酒店送站的规划预算。
      source: null
      confirmed: false
      kind: daily
      id: day-07-b-cost-01
      currency: JPY
    - name: 门票／体验
      min: 0
      max: 0
      note: 只保留返程必需移动。
      source: null
      confirmed: false
      kind: daily
      id: day-07-b-cost-02
      currency: JPY
    - name: 当晚住宿
      min: 0
      max: 0
      note: 当天返程，不安排日本住宿。
      source: null
      confirmed: false
      kind: lodging
      id: day-07-b-cost-04
      currency: JPY
    - name: 杂项预留
      min: 200
      max: 600
      note: 少量行程必需支出预留。
      source: null
      confirmed: false
      kind: daily
      id: day-07-b-cost-05
      currency: JPY
  notes:
    - 若航班要求早于酒店送站离开，另行交通费用需追加；不在当前公共交通预算中。
    - 目前没有已确认预订的餐厅。餐饮未纳入本日统计合计，临时用餐另计；时间轴中的吃饭与休息安排仍保留。
schedule:
  start: -90
  relative: true
  note: 航班未定，以“离开酒店”为0点。酒店到机场预留2.5小时，机场手续与候机暂留3小时；这不是实际起飞时间。酒店送站09:30／10:10，需按航班核对能否使用。餐食可在候机预留内安排。
  slots:
    - end: -45
      type: meal
      label: 酒店早餐
      place: kaigetsu
      id: day-07-b-slot-01
      step: d7-b-kaigetsu
    - end: 0
      type: hotel
      label: 收拾行李、退房
      place: kaigetsu
      id: day-07-b-slot-02
      step: d7-b-kaigetsu
    - end: 15
      type: travel
      label: 酒店送站
      place: kada
      id: day-07-b-slot-03
      step: d7-b-kada
    - end: 55
      type: travel
      label: 加太线到和歌山
      place: wakayamashi
      id: day-07-b-slot-04
      step: d7-b-wakayamashi
    - end: 70
      type: travel
      label: 换乘候车
      place: wakayamashi
      id: day-07-b-slot-05
      step: d7-b-wakayamashi
    - end: 130
      type: travel
      label: 南海本线到泉佐野
      place: izumisano
      id: day-07-b-slot-06
      step: d7-b-izumisano
    - end: 150
      type: travel
      label: 机场线与航站楼移动
      place: kix
      id: day-07-b-slot-07
      step: d7-b-kix
    - end: 330
      type: travel
      label: 值机、安检与候机预留
      place: kix
      id: day-07-b-slot-08
      step: d7-b-kix
stops:
  - id: d7-b-kaigetsu
    place: kaigetsu
    time: 早餐／退房
    mode: walk
    connection: ""
    duration: 早餐、收拾与退房预留60–90分钟，按送站时间倒排
    note: 早餐、收拾行李，不增加散步项目。
  - id: d7-b-kada
    place: kada
    time: 09:30或10:10送站
    mode: shuttle
    connection: 酒店送站
    duration: ""
    note: 按航班倒排，不把固定送站当成随时可出发。
  - id: d7-b-wakayamashi
    place: wakayamashi
    time: 铁路换乘
    mode: rail
    connection: 南海加太线
    duration: ""
    note: 按班次在纪之川或和歌山市换本线，地图用和歌山市作换乘参照。
  - id: d7-b-izumisano
    place: izumisano
    time: 换乘机场线
    mode: rail
    connection: 南海本线
    duration: ""
    note: 带全部行李换乘。
  - id: d7-b-kix
    place: kix
    time: 提前抵达航站楼
    mode: rail
    connection: 南海机场线
    duration: ""
    note: 到机场整体2–2.5小时预算，另加值机安检。
distanceKm:
  - 1
  - 3
activityKcal:
  - 40
  - 150
dining: []
```


## 2026-10-06 · 加太住宿备选 · 休暇村紀州加太

```yaml journey:day
id: day-06-b2
date: 2026-10-06
city: 加太
title: 海景、温泉与酒店晚餐
subtitle: Plan B住宿支线：加太站 → 休暇村紀州加太。
intensity: 休闲
hotel: kyukamura-kishu-kada
focus:
  - kada
  - kyukamura-kishu-kada
luggage: 带行李到加太站，乘休暇村接驳到酒店，不沿用加太海月接驳。
next: 翌日使用day-07-b2，按航班选择本酒店送站班次。
rest: 入住后以酒店休闲为主，不叠加加太海月或其他必去景点。
notes:
  - 与day-06-b二选一，全队住同一家酒店；次日行程必须使用对应版本。
  - 前五晚住宿尚在讨论，当前沿用奈良出发方向；班次、房价、五人余房均未确认。
optional: []
overview:
  - d6-b2-hotel
budget:
  summary: 住宿、餐食、交通待报价，不沿用加太海月预算；空项不代表免费。
  items: []
schedule:
  note: 仅确定路线和入住方向，实际班次与餐食按预订重排。
  slots: []
stops:
  - id: d6-b2-nara
    place: nara
    time: 上午，随住宿方案调整
    mode: walk
    connection: 从前晚住宿地出发
    note: 前五晚住宿整合未定。
  - id: d6-b2-shinimamiya
    place: shinimamiya
    time: 交通衔接
    mode: rail
    connection: 奈良经JR至新今宫，实际班次待核
    note: 不增加沿途景点。
  - id: d6-b2-wakayamashi
    place: wakayamashi
    time: 交通衔接
    mode: rail
    connection: 南海本线；路线图用和歌山市表示，具体换乘站在交通详情核定
    note: 途中午饭另留时间。
  - id: d6-b2-kada
    place: kada
    time: 下午
    mode: rail
    connection: 南海加太线至加太站
    note: 与酒店定时接驳衔接，不默认到站即有车。
  - id: d6-b2-hotel
    place: kyukamura-kishu-kada
    time: 常规15:00起入住
    mode: shuttle
    connection: 加太站至休暇村接驳约10分钟，出行日班次待核
    note: 海景、休息、泡汤与酒店晚餐；具体套餐、浴场开放时间待确认。
dining: []
```

## 2026-10-07 · 休暇村紀州加太 → 关西机场

```yaml journey:day
id: day-07-b2
date: 2026-10-07
city: 加太 → 关西机场
title: 从休暇村出发返程
subtitle: 酒店 → 加太站，与加太海月路线合并 → 关西机场。
intensity: 返程
hotel: null
focus:
  - kyukamura-kishu-kada
  - kada
  - kix
luggage: 全部行李随休暇村接驳到加太站，之后铁路至机场。
next: 按实际航班及航站楼留足值机安检时间。
rest: 早餐随航班和送站安排，不添加游览任务。
notes:
  - 仅与day-06-b2联动；官网当前晨间送站08:40、09:25、10:05、10:35，具体日期再核。
  - 早班机若不能衔接常规定时接驳，须另核可行交通或重新评估住宿；未确认航班前不承诺早餐后出发来得及。
optional: []
overview:
  - d7-b2-kix
budget:
  summary: 按休暇村接驳与实际铁路方案重算，空项不代表免费。
  items: []
schedule:
  note: 以航班倒排，不能套用加太海月送站时刻。
  slots: []
stops:
  - id: d7-b2-hotel
    place: kyukamura-kishu-kada
    time: 按航班倒排，常规10:00退房
    mode: walk
    connection: 早餐、收拾、退房
    note: 是否含早餐及餐食时段以所订方案为准。
  - id: d7-b2-kada
    place: kada
    time: 选定送站班次
    mode: shuttle
    connection: 休暇村至加太站约10分钟
    note: 到这里与加太海月返程路线合并；车辆与行李容量待核。
  - id: d7-b2-wakayamashi
    place: wakayamashi
    time: 铁路换乘
    mode: rail
    connection: 南海加太线；具体在纪之川或和歌山市换乘属于交通详情
    note: 不为铁路选择增加分支。
  - id: d7-b2-izumisano
    place: izumisano
    time: 铁路换乘
    mode: rail
    connection: 南海本线
    note: 衔接机场线。
  - id: d7-b2-kix
    place: kix
    time: 按航班要求提前抵达
    mode: rail
    connection: 南海机场线
    note: 计入候车、行李与航站楼移动余量，出发时间尚未确定。
dining: []
```

## 地点 · 野宫站

```yaml journey:place
id: nonomiya-bus
name: 野宫站
mapQuery: 野々宮 バス停 京都バス
duration: 步行到站、候车共预留15–30分钟；94路班次待核
checked: 2026-09-14
coordinateNote: 具体点位待核，不绘制假坐标
photoStatus: 待补充对应地点照片
```

## 地点 · 爱宕寺前

```yaml journey:place
id: otagi-bus
name: 爱宕寺前
mapQuery: 愛宕寺前 バス停 京都
duration: 下车至寺门短走约5分钟
checked: 2026-09-14
coordinateNote: 具体点位待核，不绘制假坐标
photoStatus: 待补充对应地点照片
```

## 地点 · JR嵯峨岚山站

```yaml journey:place
id: sagaarashiyama
name: JR嵯峨岚山站
mapQuery: JR嵯峨嵐山駅
lat: 35.0188
lng: 135.6812
checked: 2026-09-14
coordinateNote: 规划参考点，非精确出入口
photoStatus: 待补充对应地点照片
```

## 地点 · 哲学小道

```yaml journey:place
id: philosopher
name: 哲学之道
mapQuery: 哲学の道 京都
lat: 35.023
lng: 135.7938
duration: 全段60–90分钟，含沿水渠停留，不与两端重复计时
checked: 2026-09-14
coordinateNote: 规划参考点，非精确出入口
photoStatus: 待补充对应地点照片
```

## 地点 · JR稻荷站

```yaml journey:place
id: inarist
name: JR稻荷站
mapQuery: JR稲荷駅
lat: 34.9667
lng: 135.7707
checked: 2026-09-14
coordinateNote: 规划参考点，非精确出入口
photoStatus: 待补充对应地点照片
```

## 地点 · 千本鸟居

```yaml journey:place
id: senbon
name: 千本鸟居
mapQuery: 伏見稲荷大社 千本鳥居
duration: 往返约20–30分钟，已包含在伏见稻荷60–75分钟短线内
checked: 2026-09-14
coordinateNote: 境内路线参考点，依官方境内图行走
photoStatus: 待补充对应地点照片
hours:
  scope: 伏见稻荷境内短线
  open: 境内参拜无统一闭门时刻；本行程只安排白天
  last: 户外参道无统一检票截止；授与所另有时间
  close: 夜间照明与天气条件以现场为准
  note: 鸟居至奥社往返包含在60–75分钟短线内，不另加登山。
  sources:
    - - 伏见稻荷境内图
      - https://inari.jp/sp/map/
  status: 境内公共参道
lat: 34.967
lng: 135.774783
coordinateSource: https://osanpo.info/osanpo/253
```

## 地点 · 奥社

```yaml journey:place
id: okusha
name: 奥社
mapQuery: 伏見稲荷大社 奥社奉拝所
duration: 停留10–15分钟；短线在此折返，不登顶
checked: 2026-09-14
coordinateNote: 境内路线参考点，依官方境内图行走
photoStatus: 待补充对应地点照片
hours:
  scope: 伏见稻荷境内短线
  open: 境内参拜无统一闭门时刻；本行程只安排白天
  last: 户外参道无统一检票截止；授与所另有时间
  close: 夜间照明与天气条件以现场为准
  note: 鸟居至奥社往返包含在60–75分钟短线内，不另加登山。
  sources:
    - - 伏见稻荷境内图
      - https://inari.jp/sp/map/
  status: 境内公共参道
lat: 34.966496
lng: 135.775679
coordinateSource: https://osanpo.info/osanpo/253
```

## 地点 · 宇治川

```yaml journey:place
id: ujiriver
name: 宇治川
mapQuery: 宇治川 宇治公園
lat: 34.891
lng: 135.81
duration: 与宇治桥合计20–30分钟
checked: 2026-09-14
coordinateNote: 规划参考点，非精确出入口
photoStatus: 待补充对应地点照片
```

## 地点 · 三条通

```yaml journey:place
id: sanjo
name: 三条通
mapQuery: 三条通 奈良
lat: 34.6824
lng: 135.824
duration: 饭后往JR奈良方向短逛15–20分钟
checked: 2026-09-14
coordinateNote: 规划参考点，非精确出入口
photoStatus: 待补充对应地点照片
```

## 地点 · 三宫・元町一带

```yaml journey:place
id: kobe-city
name: 三宫・元町一带
mapQuery: 三宮 元町 神戸
lat: 34.6905
lng: 135.191
duration: 逛店及咖啡约60–90分钟，累了随时缩短
checked: 2026-09-14
coordinateNote: 规划参考点，非精确出入口
photoStatus: 待补充对应地点照片
```

## 地点 · 神户市区（晚餐店待选）

```yaml journey:place
id: kobe-dinner
name: 神户市区（晚餐店待选）
mapQuery: 神戸 三宮 レストラン
duration: 晚餐约60–90分钟；未预订，不计餐费
checked: 2026-09-14
coordinateNote: 具体点位待核，不绘制假坐标
photoStatus: 待补充对应地点照片
```

## 地点 · 近铁奈良站行李寄存（Plan A）

```yaml journey:place
id: nara-kintetsu-storage
name: 近铁奈良站・行李寄存
lat: 34.6844
lng: 135.8276
mapQuery: 近鉄奈良駅 コインロッカー
coordinateNote: 车站区域参考点，不是指定柜体或出租车上车点。
duration: 寄存／取件及进站预留30分钟
hours:
  scope: 储物柜寄存与取件
  open: 具体柜组可用时间待确认
  last: 以现场柜组及所在区域出入限制为准
  close: 待确认，不能套用JR奈良案内所16:00截止
  note: 官方确认近铁奈良设有储物柜；五件行李空位及尺寸不保证。先落实可用柜组，再开始游览，拍照记录位置；费用以现场JPY报价为准，尚未计入已确认总额。
  sources:
    - - 近铁官方储物柜
      - https://www.kintetsu.co.jp/gyoumu/coinlocker/
    - - 近铁奈良站内图
      - https://www.kintetsu.co.jp/soukatsu/kounai/nara.html
    - - 阪神官方直通运行说明
      - https://www.hanshin.co.jp/company/division/
  status: 2026-09-14核查设施，空位及时段待确认
```

## 地点 · JR龟冈站

```yaml journey:place
id: jr-kameoka
name: 龜岡車站
mapQuery: 35.0166895,135.5824658
mapUrl: https://maps.app.goo.gl/bkWVswwsDiDPUT9d7
lat: 35.0166895
lng: 135.5824658
coordinateSource: https://maps.app.goo.gl/bkWVswwsDiDPUT9d7
duration: 北口出站至乘船场步行约8分钟，按10–15分钟留量
coordinateNote: 用户指定Google龜岡車站地点坐标（非地图视角中心），2026-09-15核对；标记为车站地点，出站仍选择北口前往乘船场。
hours:
  scope: 乘船场步行衔接
  open: 以JR实际列车时刻为准
  last: 乘船受付须按订单提前抵达
  close: 不适用景区闭园时间
  note: 京都乘JR山阴本线（嵯峨野线），快速约19分钟、普通约30分钟；出JR龟冈站北口步行约8分钟至乘船场，先去2楼受付。
  sources:
    - - 官方JR交通指引
      - https://www.hozugawakudari.jp/blog/保津川下り・・・
  status: 2026-09-15核查；实际班次待确认
```

## 地点 · Cross Keys

```yaml journey:place
id: cross-keys
name: Cross Keys
mapQuery: 89 Honmachi 2-chome Higashiyama-ku Kyoto 605-0981 Japan
mapUrl: https://www.google.com/maps/search/?api=1&query=89+Honmachi+2-chome+Higashiyama-ku+Kyoto+605-0981+Japan
coordinateNote: 房东提供的民宿地址，门口精确坐标待核；不是对面咖啡厅。
hotel:
  name: Cross Keys（Airbnb）
  booking: https://maps.app.goo.gl/FL4xS4HgDQhL79P18
  area: 京都 · 东山区本町2丁目89 · 10/2–10/4两晚
  status: 已预订 · 4人2晚合计3,349.99 CNY
  note: Cross Keys 已预订10/2–10/4两晚。住宿查询口径4位成人、2间房；4位成人、2晚住宿合计3,349.99 CNY（人民币）；实际订单房间与寝具配置待补充。16:00–21:00到对面the
    kind
    cafe办理入住，最迟10/1告知预计到达时间；10/4须10:00前退房。入住前及退房后可寄存，交接点已确认在Cross Keys民宿，可用时段另核。住宿税现金另付，金额待房东告知。电话+81-90-3710-5869。
hours:
  scope: 房东确认的入住与退房（JST）
  open: 入住16:00–21:00，先到the kind cafe
  last: 最迟10月1日告知预计入住时间
  close: 10月4日10:00前退房
  note: Cross Keys 已预订10/2–10/4两晚。住宿查询口径4位成人、2间房；4位成人、2晚住宿合计3,349.99 CNY（人民币）；实际订单房间与寝具配置待补充。16:00–21:00到对面the
    kind
    cafe办理入住，最迟10/1告知预计到达时间；10/4须10:00前退房。入住前及退房后可寄存，交接点已确认在Cross Keys民宿，可用时段另核。住宿税现金另付，金额待房东告知。电话+81-90-3710-5869。
    入住请先导航至Breakfast “the kind”（本町2丁目84-2，坐标34.9937865, 135.7698649），由房东带往对面89号客房；the kind kyoto和Tomi Kintsugi工作室不是另设入住点。民宿门口精确坐标尚未核实，使用地址导航，不套用咖啡馆坐标。早餐是否包含待确认。
  sources:
    - - 办理入住 · Breakfast “the kind” 地图
      - https://maps.app.goo.gl/FL4xS4HgDQhL79P18
    - - 住宿与行李交接 · Cross Keys地址导航
      - https://www.google.com/maps/search/?api=1&query=89+Honmachi+2-chome+Higashiyama-ku+Kyoto+605-0981+Japan
  status: 2026-09-21核对房东最终入住信息
```

## 地点 · the kind cafe

```yaml journey:place
id: kind-cafe
name: the kind cafe
lat: 34.9937865
lng: 135.7698649
mapQuery: Breakfast the kind 2-84-2 Honmachi Kyoto
mapUrl: https://maps.app.goo.gl/FL4xS4HgDQhL79P18
hours:
  scope: Cross Keys入住办理处（行李在民宿交接）
  open: 入住接待16:00–21:00；寄存时段须预约
  last: 入住前至少一天告知预计到达时间
  close: 21:00入住截止；不是咖啡厅餐饮闭店时间
  note: 地址京都市東山区本町2丁目84-2；民宿在对面89号。先到咖啡厅办理，再由房东指引前往客房。入住前／退房后寄存的交接点已确认在Cross Keys民宿，可用时段另核。
  sources:
    - - 房东指定地图
      - https://maps.app.goo.gl/FL4xS4HgDQhL79P18
  status: 2026-09-21核对房东指定Google地图
```

## 地点 · 清水五条站

```yaml journey:place
id: kiyomizu-gojo
lat: 34.9959035
lng: 135.76856809999998
mapUrl: https://maps.google.com/?cid=8199630476856242200
coordinateNote: 2026-09-19核对Google车站地点坐标，电梯出口与换乘通道另核。
name: 清水五条站
mapQuery: 清水五条駅 京阪
hours:
  scope: 铁路衔接
  open: 以当日列车时刻为准
  last: 实际班次待核
  close: 不适用景区门禁
  note: 按车站指示选择停靠本站的列车，电梯出口及带箱步行待核。
  sources:
    - - 京阪官方车站资料
      - https://www.keihan.co.jp/traffic/station/161/info.html
  status: 按最新路线图规划，班次待核
```

## 地点 · 京阪伏见稻荷站

```yaml journey:place
id: keihan-inari
lat: 34.9687187
lng: 135.7693455
mapUrl: https://maps.google.com/?cid=4052349761068891854
coordinateNote: 2026-09-19核对Google车站地点坐标，电梯出口与换乘通道另核。
name: 京阪伏见稻荷站
mapQuery: 伏見稲荷駅 京阪
hours:
  scope: 铁路衔接
  open: 以当日列车时刻为准
  last: 实际班次待核
  close: 不适用景区门禁
  note: 按车站指示选择停靠本站的列车，电梯出口及带箱步行待核。
  sources: []
  status: 按最新路线图规划，班次待核
```

## 地点 · 东福寺站

```yaml journey:place
id: tofukuji
lat: 34.9813652
lng: 135.769927
mapUrl: https://maps.google.com/?cid=9574032542439507878
coordinateNote: 2026-09-19核对Google车站地点坐标，电梯出口与换乘通道另核。
name: 东福寺站
mapQuery: 東福寺駅 京阪 JR
hours:
  scope: 铁路衔接
  open: 以当日列车时刻为准
  last: 实际班次待核
  close: 不适用景区门禁
  note: 从京阪出站换JR奈良线往宇治，预留行李换乘时间；核对停靠宇治的列车。
  sources:
    - - 京阪官方车站资料
      - https://www.keihan.co.jp/traffic/station/153/info.html
  status: 按最新路线图规划，班次待核
```


## 銀水荘 兆楽

```yaml journey:place
id: choraku
name: 銀水荘 兆楽
lat: 34.80303321762264
lng: 135.24677724228215
mapQuery: Ginsuisou Choraku 1654-1 Arimacho Kobe Japan
coordinateNote: 酒店官方交通地图坐标，2026-09-23核对。
hotel:
  name: 銀水荘 兆楽（Ginsuisou Choraku）
  area: 有马温泉 · 有馬町1654-1 · 10/5–10/6一晚
  status: 已预订 · 用户确认，订单明细待补充
  url: https://choraku.com/
  booking: https://choraku.com/access/
  note: 10/5入住、10/6退房。住宿查询4位成人、2间房；实际订单房型、餐食、价格、税费及取消条款待补充。到达有马后致电+81-78-904-0666联系町内免费接送，资料列07:00–22:00，可能需等待，具体上车点当日确认。退房后寄存及取件时段待酒店确认。
hours:
  scope: 已预订住宿 · 2026/10/5–10/6
  open: 入住时刻以订单方案为准，待补充
  last: 若含晚餐，最晚到店时刻须向兆乐确认
  close: 退房时刻待订单确认
  note: 町内接送与入住受付是不同时间范围；19:00晚餐只是原规划假设，尚不是兆乐已确认的安排。
  sources:
    - - 酒店官方交通与接送
      - https://choraku.com/access/
  status: 预订日期已确认；订单时刻待核
```


## 嵯峨野观光小火车

```yaml journey:place
id: sagano-ride
name: 嵯峨野观光小火车
lat: 35.0134
lng: 135.6063
mapQuery: Torokko Kameoka Station
duration: 列车体验约25分钟；提前15–20分钟候车是规划建议
hours:
  scope: 观光小火车体验
  open: 依10/2运行日历与所订车次
  last: 检票截止以所订班次为准
  close: 以车次为准
  note: 本节点为游览项目，沿用原方案龟冈上车、嵯峨下车，再乘巴士或打车赴爱宕寺；车次与接续待订票时核对。
  sources:
    - - 官方车次与订票
      - https://www.sagano-kanko.co.jp/ticket/
  status: 尚未订票
```


## d1_03

```yaml journey:leg
id: d1_03
to: d1_03
mode: rail
connection: 关西机场乘南海至天下茶屋→堺筋线长堀桥→步行至Sugata；电梯出口、带箱换乘与班次待核
```


## d1_tsutenkaku

```yaml journey:leg
id: d1_tsutenkaku
to: d1_tsutenkaku
mode: rail
connection: Sugata寄存后乘市内交通至通天阁；候选长堀桥经堺筋线至惠美须町后步行，疲劳时可打车，具体班次与耗时待核
```


## d1_nippombashi

```yaml journey:leg
id: d1_nippombashi
to: d1_nippombashi
mode: walk
connection: 通天阁一带步行接でんでんタウン／日本橋筋商店街，具体走法依选店位置，耗时待核
```


## d1_nambayasaka

```yaml journey:leg
id: d1_nambayasaka
to: d1_nambayasaka
mode: walk
connection: 日本桥商圈向西赴难波八阪神社；按体力步行或打车，具体起点与耗时待核
```


## d1_kuromon

```yaml journey:leg
id: d1_kuromon
to: d1_kuromon
mode: walk
connection: 难波八阪神社向东赴黑门市场；按体力步行或打车，具体路线与耗时待核
```


## d1_06

```yaml journey:leg
id: d1_06
to: d1_06
mode: walk
connection: 黑门市场之后步行衔接道顿堀・戎桥，具体出入口与耗时待核；顺序仅供参考
```


## d1_05

```yaml journey:leg
id: d1_05
to: d1_05
mode: walk
connection: 道顿堀附近短步行至法善寺
```


## d1_04

```yaml journey:leg
id: d1_04
to: d1_04
mode: walk
connection: 向北逛心斋桥筋，随时休息
```


## d1_nakazaki

```yaml journey:leg
id: d1_nakazaki
to: d1_nakazaki
mode: rail
connection: 心斋桥乘御堂筋线至梅田后步行；也可按位置转谷町线至中崎町，出口现场导航
```


## d1_umeda

```yaml journey:leg
id: d1_umeda
to: d1_umeda
mode: walk
connection: 中崎町步行往梅田／茶屋町，晚餐店待选
```


## d1_skybuilding

```yaml journey:leg
id: d1_skybuilding
to: d1_skybuilding
mode: walk
connection: 可选：梅田晚饭后步行至梅田蓝天大厦展望台专用入口；具体距离与耗时待餐厅确定后核实，疲劳时可打车，电梯与排队另计
```


## d1_07

```yaml journey:leg
id: d1_07
to: d1_07
mode: rail
connection: 若去空中庭园：从梅田蓝天大厦乘市内交通或打车回Sugata；不去则由梅田用餐处直接回店，具体接驳待核
```


## d2_02

```yaml journey:leg
id: d2_02
to: d2_02
mode: rail
connection: Sugata退房→心斋桥乘御堂筋线梅田→JR大阪至京都→乘车至Cross Keys寄存，接收时段待确认
```


## d2_04

```yaml journey:leg
id: d2_04
to: d2_04
mode: rail
connection: Cross Keys赴京都站→JR山阴本线马堀→步行至小火车龟冈站，体验至嵯峨；尚未订票，车次与候车时间待核
```


## d2h_board

```yaml journey:leg
id: d2h_board
to: d2h_board
mode: rail
connection: Cross Keys赴京都站→JR山阴本线龟冈站北口→步行约8分钟到保津川乘船场；不乘观光小火车，依船票提前报到
```


## d2_checkin

```yaml journey:leg
id: d2_checkin
to: d2_checkin
mode: taxi
connection: 岚山游览后可直接打车至the kind cafe；或经JR嵯峨岚山→京都站转车。16:00–21:00办理入住
```


## d2_16

```yaml journey:leg
id: d2_16
to: d2_16
mode: rail
connection: 祇园白川步行祇园四条→京阪清水五条→步行回Cross Keys；累了打车
```


## d3_eikando

```yaml journey:leg
id: d3_eikando
to: d3_eikando
mode: taxi
connection: Cross Keys可打车赴永观堂；公交可经京阪三条转市巴士5路至南禅寺・永观堂道，班次待核
```


## d3_02

```yaml journey:leg
id: d3_02
to: d3_02
mode: walk
connection: 永观堂向北步行至若王子桥，接哲学之道
```


## d3_03

```yaml journey:leg
id: d3_03
to: d3_03
mode: walk
connection: 沿水渠向北慢走，途中休息
```


## d3_04

```yaml journey:leg
id: d3_04
to: d3_04
mode: walk
connection: 至哲学之道北端银阁寺桥，桥只短停
```


## d3_ginkaku

```yaml journey:leg
id: d3_ginkaku
to: d3_ginkaku
mode: walk
connection: 银阁寺桥经参道步行进寺
```


## d3_07

```yaml journey:leg
id: d3_07
to: d3_07
mode: rail
connection: 银阁寺游览及午餐后赴出町柳→叡山电车贵船口→33路巴士贵船→步行本宫；回程巴士末班另核
```


## d3_10

```yaml journey:leg
id: d3_10
to: d3_10
mode: rail
connection: 本宫步行至巴士站→33路贵船口→叡山电车出町柳→京阪清水五条→步行Cross Keys
```


## d4_02

```yaml journey:leg
id: d4_02
to: d4_02
mode: rail
connection: 退房寄存→清水五条→京阪伏见稻荷→步行大社，选择停靠该站列车
```


## d4_03

```yaml journey:leg
id: d4_03
to: d4_03
mode: rail
connection: 大社步行京阪伏见稻荷→清水五条→步行Cross Keys取件
```


## d4_04

```yaml journey:leg
id: d4_04
to: d4_04
mode: rail
connection: 取件后清水五条→京阪东福寺→换JR奈良线宇治→南口步行酒店；15:00前寄存待确认
```


## d4_10

```yaml journey:leg
id: d4_10
to: d4_10
mode: rail
connection: 酒店步行JR宇治→奈良线长池→步行木津川运动公园，花火前计入排队安检
```


## d4_12

```yaml journey:leg
id: d4_12
to: d4_12
mode: rail
connection: 散场步行长池→JR奈良线宇治→步行酒店；预留拥挤和候车
```


## d5a_storage

```yaml journey:leg
id: d5a_storage
to: d5a_storage
mode: rail
connection: 宇治酒店退房→JR宇治至JR奈良→打车至近铁奈良站寄存，柜位尺寸待核
```


## d5a_hotel

```yaml journey:leg
id: d5a_hotel
to: d5a_hotel
mode: rail
connection: 取件后近铁奈良优先直通快速急行至阪神神户三宫→地铁三宫→谷上→神户电铁有马口→有马温泉→致电兆乐接送；非直通班次需额外换乘，10/5班次及等车时间待核
```


## d6_arimatown

```yaml journey:leg
id: d6_arimatown
to: d6_arimatown
mode: shuttle
connection: 兆乐退房拟寄存，向酒店确认接送至小镇的安排
```


## d6_hotelpickup

```yaml journey:leg
id: d6_hotelpickup
to: d6_hotelpickup
mode: shuttle
connection: 小镇午餐后联系兆乐接送或自行返店取件，寄存条件待确认
```


## d6_02

```yaml journey:leg
id: d6_02
to: d6_02
mode: rail
connection: 兆乐接送有马温泉站→有马口→谷上→地铁三宫→神户酒店；酒店未定，出口与步行待核
```


## d6_06

```yaml journey:leg
id: d6_06
to: d6_06
mode: rail
connection: 从市区JR三宫或元町至须磨，出站步行海边
```


## d6_16

```yaml journey:leg
id: d6_16
to: d6_16
mode: walk
connection: 未去夜景则从晚餐地点回酒店；若去Venus Bridge，预先落实出租车下山再回店
```


## d7_06

```yaml journey:leg
id: d7_06
to: d7_06
mode: bus
connection: 神户酒店赴三宫机场巴士站→关西机场；铁路可备选。按航班、航站楼和班次倒排，计入酒店到站与行李时间
```

/* Visitor access, reception cutoffs and closing are deliberately separate.
   Checked against linked official/operator/tourism sources on 2026-09-11.
   Times are Japan local time, selected for the October 1–7 itinerary. */
const HOURS_CHECKED='2026-09-11';
const access=(scope,open,last,close,note,sources,status='未单列最晚入场')=>({scope,open,last,close,note,sources,status});
const outdoor=(scope,note,sources)=>access(scope,'户外散步区域；未查到统一门禁时刻','不适用统一景区检票；现场限制优先','官方介绍未列统一闭园时间',note,sources,'公共户外');
const ACCESS_HOURS={
 shinsaibashi:outdoor('心斋桥筋街道','店铺各自营业，街道通行时间不代表可以进店；选定店铺后需另核其入店与点单截止。',[['商店街官方问答','https://www.shinsaibashi.or.jp/contact/faq']]),
 hozenji:access('法善寺境内参拜＋横丁散步','境内24小时可参拜','境内参拜无每日入场截止','境内无每日闭门时刻','授与所10:00–18:00；这是御朱印等服务时间。横丁餐厅各自营业，不套用寺院参拜时间。',[['法善寺官网','https://houzenji.jp/']],'全天参拜'),
 dotonbori:outdoor('道顿堀街道・戎桥','仅安排河畔与桥上夜景；商店、餐厅和其他设施各自营业，灯牌点亮时间也不等于街道开放时间。',[['大阪官方旅游信息','https://osaka-info.jp/spot/dotonbori/']]),
 kameoka:access('嵯峨野小火车・龟冈→嵯峨','按10/2实际运行日历及所订车次','乘车截止依所订班次；未查到统一提前停止检票分钟数','以该车次发车时间为准','预约尚未完成。建议提前15–20分钟到站是本行程预留，并非官方检票截止；不能用售票窗口下班时间判断还能否乘车。',[['运营官网与预约','https://www.sagano-kanko.co.jp/'],['运营方问答','https://www.sagano-kanko.co.jp/faq/']],'按车次预约'),
 otagi:access('爱宕念佛寺境内','09:00–16:00','官网未单列，待向寺院确认','16:00结束开放','周三、周六关闭；当前安排10/2周五。不要沿用旧攻略的08:00–17:00或16:45受付信息。',[['寺院官方开放信息','https://www.otagiji.com/visit-en']]),
 toriimoto:outdoor('嵯峨鸟居本老街','当前走旧街道，不含町并保存馆或化野念佛寺入内；那些设施的关门时间不适用于整条老街，沿街午餐店仍需另核。',[['京都官方地区介绍','https://totteoki.kyoto.travel/27165/']]),
 rakushisha:access('落柿舍周边；如临时选择入内','入内参考10:00–17:00；当前主线只走周边','最晚入内时间未单列','入内参观17:00结束','京都市观光页列10:00开门，JR东海观光页仍列09:00，来源有差异。若决定入内，按10:00后安排并向现场确认；周边道路不套用院内时间。',[['京都市官方观光页','https://ja.kyoto.travel/tourism/single01.php?category_id=8&tourism_id=710'],['JR东海观光页（时间有差异）','https://souda-kyoto.jp/guide/spot/rakushisha.html']],'来源时间有差异'),
 bamboo:outdoor('岚山竹林小径・公共通行段','这里指主线竹林小径；不含另有门禁的竹林散策路、寺院或私人庭园。普通散步与季节灯光活动时间分开，当前安排白天下午。',[['京都官方徒步路线介绍','https://plus.kyoto.travel/entry/trail_nishiyama01']]),
 togetsu:outdoor('渡月桥与相邻河畔','按公共步行段规划；游船、商店及河边收费设施各有时间，未安排这些项目。',[['京都官方岚山地区地图','https://ja.kyoto.travel/doc/pdf/map/areamap_saga_arashiyama.pdf']]),
 yasaka:access('八坂神社境内参拜','24小时可参拜','境内参拜无每日入场截止','境内无每日闭门时刻','社务所09:00–17:00、祈祷受付09:00–16:00；晚饭前后可看境内，但不能据此保证夜间仍有御朱印等服务。',[['八坂神社参拜说明','https://www.yasaka-jinja.or.jp/sanpai/?display=sp']],'全天参拜'),
 hanami:outdoor('花见小路公共通行段','沿可通行街道夜游；私有小巷与茶屋不属于随时可进入的景区，遵守入口及拍摄标识。',[['京都市官方祇园地区介绍','https://ja.kyoto.travel/area/area06.php']]),
 shirakawa:outdoor('祇园白川・巽桥周边','安排公共道路短距离夜游；店内、私有通道的准入与营业时间另计。',[['京都市官方祇园地区介绍','https://ja.kyoto.travel/area/area06.php']]),
 kamo:outdoor('鸭川公共河岸・备选','餐厅位置顺路时才加入；具体河岸入口尚未选定，雨后水位与临时封闭情况须按当天现场确认。',[['京都府河川公共利用说明','https://www.pref.kyoto.jp/kamogawa/documents/dai25kaisiryou1.pdf']]),
 nyakuoji:outdoor('哲学小道・若王子桥至北端','官方按约2公里散步道介绍，未列营业或门禁时刻；当前不进入若王子神社、银阁寺或其他沿线寺院。',[['京都市官方哲学之道介绍','https://ja.kyoto.travel/tourism/single01.php?tourism_id=2684']]),
 kifune:access('贵船神社本宫','06:00–20:00（5/1–11/30）','官网未单列，需在闭门前完成参拜','20:00闭门','授与所09:00–17:00；灯笼从日落亮至闭门。本宫门禁不代表33路巴士会运营至20:00，也不直接适用于奥宫。',[['贵船神社参拜说明','https://kifunejinja.jp/en/info/']]),
 okumiya:access('贵船奥宫方向・备选','未查到奥宫单独的明确开放时段','待确认','待确认；不套用本宫20:00','官网介绍三社参拜，但明确的06:00–20:00标在本宫。奥宫仅作白天余力支线，夜间可入范围未确认。',[['贵船神社三社参拜说明','https://kifunejinja.jp/info/']],'时间待确认'),
 inari:access('伏见稻荷境内・千本鸟居短线','昼夜均可参拜','自由参拜区域无每日验票截止','该参拜区域未设每日闭门时刻','依据京都市官方“昼夜参拜可能”。神职服务、御朱印和店铺另有时间；当前只走本殿外、鸟居与奥社附近，不登顶。',[['京都市官方参拜信息','https://ja.kyoto.travel/tourism/single01.php?category_id=7&tourism_id=448']],'昼夜参拜'),
 omotesando:outdoor('平等院表参道商店街','主线是茶店与午餐，未包含平等院寺院入内；不能把平等院庭园关门时刻当作商店街统一时间，茶店需各自确认。',[['宇治观光协会步行路线','https://www.kyoto-uji-kankou.or.jp/guide/course09.html']]),
 taihoan:access('对凤庵・薄茶茶席候选','10:00–16:00','抹茶最后开席15:30；须至少提前10分钟换取茶席券','16:00茶席结束','15:30是最后开始时间，不是可随时到场的门票截止。煎茶最后开席15:20、仅指定日提供；所订项目和场次优先。年内1/10–12/20开席，月末休席（遇周末节假日提前），预约仍未完成。',[['官方茶席问答PDF','https://www.kyoto-uji-kankou.or.jp/pdf/taihoan-faq.pdf'],['茶席安排与预约','https://www.kyoto-uji-kankou.or.jp/taihoan.html']],'已公布最后开席'),
 ujibridge:outdoor('宇治桥与公共河岸','桥上及河岸短游；不含游船、鵜饲或收费设施。河岸局部封闭与桥梁通行情况以当天标识为准。',[['宇治观光协会景点介绍','https://www.kyoto-uji-kankou.or.jp/tourism-en.html']]),
 fireworks:access('城阳秋花火2026・10/4专用会场','14:00开场','市政府及主办方页面未单列最终检票截止，待票面/入场细则确认','21:00闭场','花火19:00开始约40分钟；行程目标18:00–18:15入场是人流预留，不是官方截止。当日公园临时休园，需前卖票入场，无现场售票；不套用公园平日开放时间。',[['公园官网｜城阳五里五里之丘','https://fmtpark.com/'],['城阳市2026花火公告','https://www.city.joyo.kyoto.jp/joint/0000012600.html'],['主办方2026专题','https://xn--6oqz6c35b6zh48ipn2e0ys.jp/hanabi/2026/index.html']]),
 kasuga:access('春日大社・参道与御本社参拜所','御本社参拜所06:30–17:30（3–10月）','普通参拜所未单列；特別参拜09:00–16:00，最晚受付未另列','御本社参拜所17:30；特別参拜16:00结束','这里采用官网“基本信息”的分季节时刻；页眉另显示06:00–18:00，信息有差异，按较短窗口安排。林荫参道不等于本殿回廊；主线不含收费特別参拜。若加国宝殿：10:00–17:00、16:30止入馆；万叶植物园：09:00–16:30、16:00止入园。',[['春日大社官方分区时间','https://www.kasugataisha.or.jp/about/basic/']],'分区开放・来源有差异'),
 mizuya:access('水谷茶屋附近；若选择在茶屋休息','店内11:00–16:00','最后点单15:30；最晚入店未单列','店内16:00结束营业','店家官网列周二、周三休息，10/5周一仍须留意临时日历。当前这里只是午休区域，餐厅未选定；最后点单不等于保证15:30前均可入座。',[['水谷茶屋店家官网','https://sites.google.com/view/mizuyachaya-kasugano--winter/%E3%83%9B%E3%83%BC%E3%83%A0?authuser=0']],'已公布最后点单'),
 wakakusa:access('若草山南麓→收费草坡入口','常规开山09:00–17:00（10月在开山期内）','官方未单列“最晚入山”；需另留上山、观景、下山时间','17:00结束开放；本行程按此前退出安排','官方步道图的北门标到16:30、南门到17:00；当前走南侧。10/5日落约17:36，普通开放时段不支持草坡等到完整日落；图中出口标识不能当作获准闭门后停留。',[['奈良县若草山开放信息','https://www.pref.nara.lg.jp/site/park/2585.html'],['官方步道与门禁图','https://www.pref.nara.lg.jp/documents/2378/20251023155602.pdf']]),
 nandaimon:access('东大寺南大门・外部经过','外部通行；寺方未单列南大门参观时间','外部经过不进入大佛殿检票区；南大门未单列入场截止','南大门外部未查到统一关闭时刻','当前只是返城路上经过。大佛殿10月07:30–17:30是另一收费区域的拝观窗口，不能据此判断南大门关闭；遇现场围挡按开放路线绕行。',[['东大寺分区拝观说明','https://www.todaiji.or.jp/information/haikan/']],'外部经过'),
 todaiji:access('东大寺大佛殿・备选入内','07:30–17:30（4–10月）','大佛殿最晚验票未在官网单列，待确认','17:30结束拝观','如加入，放在午后且留45–60分钟完整参观，不能留到返城时临时冲门。官网17:00最終入館指东大寺博物馆，不是大佛殿；两者必须分开。',[['东大寺官方拝观时间','https://www.todaiji.or.jp/information/haikan/']]),
 hakutsuru:access('白鹤酒造资料馆','09:30–16:30','16:00停止入馆','16:30闭馆','当前10/6用常规时刻。10/3酒藏开放活动改为10:00开馆，不能套到10/6；5人自由参观无需团体预约，临时休馆以官网为准。',[['白鹤酒造官方入馆说明','https://www.hakutsuru.co.jp/community/shiryo/?trflg=1']],'已公布最晚入场'),
 beach:outdoor('JR须磨站前海边・散步休息','10月只看海、短走和坐下休息；海水浴场夏季管理时间、淋浴设施及咖啡店营业时间不等于公共海岸通行时间。',[['神户官方海边路线','https://www.feel-kobe.jp/model_course/kobe-seaside/']]),
 venus:outdoor('Venus Bridge・展望区域','神户官方列免费入场并介绍夜景用途，但未单列开闭或最晚进入时刻。可保留黄昏与蓝调计划，出发前复核临时步道封闭；不填未经证实的“24小时”。',[['神户官方Venus Bridge介绍','https://www.feel-kobe.jp/facilities/0000000091/']]),
 arima:access('有马Grand・云海大浴场（住客）','05:00–10:30／11:30–次日00:30','住客最后进入浴场的时间未单列','10:30、次日00:30分别结束该时段','这是云海浴场使用时间，不是酒店入住截止或日归入浴受付。当前晚到方案须21:00前入住；泡汤需预留洗浴时间，其他浴场时刻另核。',[['酒店云海浴场说明','https://www.arima-gh.jp/hotspring/unkai/']]),
 kaigetsu:access('加太海月・大浴场（住客）','入住日15:00后–23:00；翌晨05:30–09:00','住客最后进入浴场的时间未单列','晚间23:00；晨间09:00结束','官网一般浴场时段从11:00起，但住客明确从15:00入住后使用。日归泡汤另为11:00–15:00、14:30受付结束，不能把日归时刻用于本次住宿方案。',[['加太海月官方住客问答','https://kada-kaigetsu.com/qa/'],['日归入浴（区别适用范围）','https://kada-kaigetsu.com/day_use/']])
};
ACCESS_HOURS.ginkaku=ACCESS_HOURS.nyakuoji;
ACCESS_HOURS.hill=ACCESS_HOURS.wakakusa;
ACCESS_HOURS.saga=ACCESS_HOURS.kameoka;

// Ticket sales are separate from the event's admission hours.
ACCESS_HOURS.fireworks.ticketSales = [
 {label:'购票安排', text:'需使用闲鱼代买服务（团队购票计划，尚未购买；非主办方官方售票渠道）。', name:'', url:''},
 {label:'线上购票', text:'Ticket Pia：2,500 JPY／人；手续费以结账为准。2026/10/3 17:00（日本时间）停售，售完提前结束。普通会员购票需日本电话号码认证。', name:'Ticket Pia 售票入口', url:'https://t.pia.jp/en/pia/event/event.do?eventBundleCd=b2669988'},
 {label:'线下售票', text:'城阳市观光协会：2,000 JPY／人；09:00–17:00，周三休息。', name:'城阳市观光协会 · Google 地图', query:'一般社団法人 城陽市観光協会 京都府城陽市寺田樋尻44-8'},
 {label:'线下售票', text:'京都府立木津川运动公园：2,000 JPY／人；09:00–17:00，周四休息。', name:'木津川运动公园 · Google 地图', query:'京都府立木津川運動公園（城陽五里五里の丘）'},
 {label:'线下售票', text:'文化パルク城阳：2,000 JPY／人；09:00–17:00，周一休息。', name:'文化パルク城阳 · Google 地图', query:'文化パルク城陽 京都府城陽市'},
];

function renderAccessHours(id,compact=false){
 const h=ACCESS_HOURS[id];if(!h)return '';
 return `<div class="access-hours${compact?' compact-hours':''}"><div class="hours-heading"><strong>${escapeHtml(h.scope)}</strong><span>${escapeHtml(h.status)}</span></div><dl><div><dt>可游览／使用</dt><dd>${escapeHtml(h.open)}</dd></div><div class="entry-cutoff"><dt>最晚进入／受付</dt><dd>${escapeHtml(h.last)}</dd></div><div><dt>关闭／结束</dt><dd>${escapeHtml(h.close)}</dd></div>${(h.ticketSales||[]).map(sale=>`<div><dt>${escapeHtml(sale.label)}</dt><dd>${escapeHtml(sale.text)}<br>${sale.name?external(sale.url||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(sale.query),sale.name):''}</dd></div>`).join('')}</dl>${h.ticketSales?'<p>仅售预售票：线下售票截至2026/10/3，售完即止；10/4活动当天不售票。</p>':''}<details><summary>适用区域、例外与官方来源</summary><p>${escapeHtml(h.note)}</p><div class="hours-sources">${(h.sources||[]).map(([label,url])=>external(url,label)).join('')}</div><small>核对于 ${HOURS_CHECKED} · 日本时间 · 临时变更以官方当日公告为准</small></details></div>`;
}

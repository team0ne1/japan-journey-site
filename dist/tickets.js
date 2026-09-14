// Adult prices researched on 2026-09-12; see docs/TICKET-PRICES.md.
// These are display references. Daily totals are computed only from budget items.
'use strict';
const ADULT_TICKETS = Object.freeze({
 otagi: {label:'成人门票', amount:'1,000', source:'https://www.otagiji.com/visit-en', note:'计入当天门票'},
 taihoan: {label:'成人薄茶体验', amount:'1,500', source:'https://www.kyoto-uji-kankou.or.jp/taihoan-en.html', note:'计入当天体验；抹茶点前3,600 JPY为替代升级'},
 fireworks: {label:'成人一般前卖票', amount:'2,000–2,500', source:'https://www.city.joyo.kyoto.jp/joint/0000012600.html', note:'线下2,000／Pia网售2,500 JPY；渠道择一，附加费另留'},
 hill: {label:'成人入山费', amount:'150', source:'https://www.pref.nara.lg.jp/site/park/2585.html', note:'计入当天门票；须在开放时段内游览'},
 todaiji: {label:'成人大佛殿门票', amount:'800', source:'https://www.todaiji.or.jp/information/haikan/', note:'备选，未计入主线'},
 rakushisha: {label:'成人入内参考票价', amount:'300', source:'https://souda-kyoto.jp/guide/spot/rakushisha.html', note:'本行程只看周边，未计入；入内前复核'},
 kasuga: {label:'成人特别参拜', amount:'700', source:'https://www.kasugataisha.or.jp/guidance/index/modal-09/', note:'自选付费区域；当前林荫参道路线未计入'},
 hakutsuru: {label:'资料馆参观', amount:'0', source:'https://www.hakutsuru.co.jp/community/shiryo/?trflg=1', note:'免费；购买酒品另计'},
 kifune: {label:'本宫参拜', amount:'0', source:'https://kifunejinja.jp/en/info/', note:'免费；御守等另计'},
 kameoka: {label:'成人小火车单程参考', amount:'880', source:'https://www.kameoka.info/seeing/tram.php', note:'已含在交通预留，票价以订票时为准'}
});
function renderTicket(placeId) {
 const meta=typeof JOURNEY_MODEL!=='undefined'?JOURNEY_MODEL.places[placeId]?.tickets?.find(t=>t.audience==='adult'):null;
 const ticket=ADULT_TICKETS[placeId]||(meta?{label:meta.name,amount:Number(meta.amount).toLocaleString('en-US'),source:meta.source,note:meta.note,checked:meta.checked,booking:meta.booking}:null);
 if(!ticket)return '';
 return `<div class="ticket-price"><p><span>${escapeHtml(ticket.label)}</span><strong>${ticket.amount==='0'?'免费 · 0 JPY':escapeHtml(ticket.amount)+' JPY／人'}</strong></p><small>${escapeHtml(ticket.note)} · ${external(ticket.source,'票价来源')} · 核对 ${escapeHtml(ticket.checked||'2026.09.12')}${ticket.booking?' · '+external(ticket.booking,'官方预约'):''}</small></div>`;
}

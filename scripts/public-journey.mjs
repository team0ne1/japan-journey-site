// Explicit publication boundary: private booking sources never reach browser assets.
const privateDetail = /冨浪|Tominami|09037105864|3710[- ]?586[49]|预订确认|确认信|确认号|预订编号|Booking\.com|住宿查询|实际订单|订单|确认预订|最迟10|10\/4须|已预订|已订|预订日期|房费|补贴|扣减|付款|取消：|免费取消|4位成人|4人2晚|2间房|3,349\.99|3349\.99|37,400|33,320|19,800|17,600|4,080|用户已提供收件|收件人和84|住宿已确认|额外服务不包含|按下方配送先/;
const forbidden = /冨浪|Tominami|09037105864|3710[- ]?586[49]|5454533427|3,349\.99|3349\.99|37,400|33,320|19,800|17,600|4,080/;
export function assertPublicText(text) {
 if (forbidden.test(text)) throw new Error('Private booking information in public artifact');
}
function clean(value) {
 if (typeof value === 'string') return value.split(/(?<=[。；\n])/).filter(part => !privateDetail.test(part)).join('').trim();
 if (Array.isArray(value)) return value.map(clean).filter(v => v !== '');
 if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([key]) => !['delivery','recipient','recipientEn','postalCode','phone','addressJa','addressEn','bookingConfirmation','confirmationNumber','pin','guestName','guestEmail'].includes(key)).map(([key,v]) => [key,clean(v)]));
 return value;
}
export function publicJourney(source) {
 const model=clean(source);
 for (const [id,place] of Object.entries(model.places)) {
  if (place.hotel) {
   place.hotel={name:place.hotel.name,area:place.hotel.area.replace(/ · 10\/.*$/, ''),url:place.hotel.url,booking:place.hotel.booking,shuttle:place.hotel.shuttle,status:'住宿地点参考'};
   place.hotel.note='住宿地点与交通供路线参考；房型、价格、入住及寄存条件请向住宿方查询。';
   if(place.hours) {
    place.hours.scope='住宿接待信息';
    for(const key of ['open','last','close'])place.hours[key]=(place.hours[key]||'请向住宿方确认').replace(/10\/\d+\s*/g,'').replace(/10月\d+日/g,'').replace(/最迟.*告知预计入住时间/,'请提前告知预计到达时间');
    place.hours.status='请以住宿方公开信息及所选方案为准';
    place.hours.note='办理入住、退房和行李寄存前，请与住宿方确认。';
   }
  }
  const fallback=source.places[id]?.delivery?.fallback;
  if(fallback)place.shippingFallback={...clean(fallback),note:'先确认住宿方可在20:00后代收，随身保留当天用品。若也错过11:30或收件条件不满足，再改京都站寄存、返程取件。车程、排队及站内步行另留，不沿用早班游船安排。'};
 }
 for(const days of Object.values(model.variants)) for(const list of Object.values(days)) for(const day of list) {
  if(day.budget) {
   day.budget.items=day.budget.items.filter(item=>!/住宿|房费|住宿税/.test(item.name));
   (day.budget.notes??=[]).push('公开版不包含个人住宿订单及实际住宿支出。');
  }
  for(const stop of day.stops){
   if(model.places[stop.id]?.hotel)stop.note=model.places[stop.id].hotel.note;
   if(stop.id==='yamato-minamisemba-2')stop.note='办理前向住宿方取得收件人、地址、电话及可代收时段。南船场10:00截止；错过可改新大阪东口11:30前寄送（20:00起送达），无法寄送再用京都站寄存。';
  }
 }
 assertPublicText(JSON.stringify(model));
 return model;
}

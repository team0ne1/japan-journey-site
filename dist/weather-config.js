// Representative places for each day's selectable weather area; no schedule linkage.
const WEATHER_YEAR = 2026;
const WEATHER_CURRENT_AREAS = [
  ['osaka','大阪'],['kyoto','京都'],['nara','奈良'],['sannomiya','神户'],
  ['kaigetsu','和歌山・加太'],['kix','关西机场']
];
const WEATHER_AREAS = {
  1: [['osaka','大阪'],['kix','关西机场']],
  2: [['togetsu','岚山'],['yasaka','祇园'],['osaka','大阪']],
  3: [['nyakuoji','哲学小道'],['kifune','贵船']],
  4: [['uji','宇治'],['inari','伏见稻荷'],['fireworks','城阳花火会场']],
  5: [['nara','奈良'],['goshoboh','有马温泉']],
  6: [['sannomiya','神户'],['beach','须磨海边'],['goshoboh','有马温泉']],
  7: [['kix','关西机场'],['sannomiya','神户']]
};
const WEATHER_AREAS_B = {}; // Retired hotel alternatives are no longer selectable.

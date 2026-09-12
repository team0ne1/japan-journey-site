// Shared by the API, CSV export and browser; order follows the journey.
export const FAVORITE_REGIONS = [
  { id: 'osaka', name: '大阪' },
  { id: 'kyoto', name: '京都' },
  { id: 'uji', name: '宇治／城阳' },
  { id: 'nara', name: '奈良' },
  { id: 'kobe', name: '神户／有马' },
  { id: 'wakayama', name: '和歌山' },
  { id: 'other', name: '其他地区' },
  { id: 'unassigned', name: '待分类' },
] as const;

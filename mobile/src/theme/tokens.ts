export const colors = {
  orange: '#F0602E',
  orangeDark: '#E1481F',
  orangeHeader: '#F0431F',
  orangeLight: '#FFF3ED',
  orangeBorder: '#f5d5c4',
  cardBorder: '#f0e2d8',
  signupFrom: '#F5875E',
  signupTo: '#F0602E',
  error: '#B5121B',
  sunsetGradient: ['#FBEFD9', '#F7DFAF', '#F3B36B', '#EE7C3E', '#E8502B'] as const,
  black: '#111',
  textDark: '#111',
  textMuted: '#333',
  textSecondary: '#666',
  textTertiary: '#777',
  textLight: '#888',
  textFaint: '#999',
  textPlaceholder: '#bbb',
  white: '#fff',
  successBg: '#E6F7EA',
  successText: '#166534',
  pendingBg: '#FEF3E2',
  pendingText: '#92400e',
  failedBg: '#FDE8E8',
  failedText: '#991b1b',
  importantBg: '#FFF0D6',
  importantText: '#92400e',
  wave: '#00B4E1',
  orangeMoney: '#FF7900',
  mtn: '#FFCC08',
  moov: '#0057A6',
  card: '#333',
};

export const radii = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  sheet: 55,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const typography = {
  fontFamily: 'System', // Arial-equivalent system sans-serif
  heading: { fontSize: 20, fontWeight: '800' as const },
  subheading: { fontSize: 16, fontWeight: '800' as const },
  label: { fontSize: 13, fontWeight: '700' as const },
  body: { fontSize: 13, fontWeight: '400' as const },
  meta: { fontSize: 11, fontWeight: '400' as const },
  price: { fontSize: 30, fontWeight: '800' as const },
  stat: { fontSize: 22, fontWeight: '800' as const },
};

export const shadow = (color: string) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.3,
  shadowRadius: 18,
  elevation: 6,
});

export const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 14,
  elevation: 2,
};

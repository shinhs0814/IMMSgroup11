// Sunny theme — warm whites, coral brand, rounded
export const Colors = {
  // Brand
  brand:         '#EC6A56',
  brandSoft:     '#FDEAE4',
  brandDark:     '#C94F3B',

  // Surfaces
  bg:            '#FFF8F3',
  surface:       '#FFFFFF',
  surfaceAlt:    '#FFF1E8',
  text:          '#3B2D27',
  textSecondary: '#A2938B',
  textLight:     '#C4B5AE',
  border:        '#F0E6DE',

  // Verdict — safe
  safe:          '#0F9E68',
  safeSolid:     '#1BB377',
  safeBg:        '#E4F6EE',
  safeRing:      '#A7E6CB',
  safeSoft:      '#F0FBF6',

  // Verdict — caution
  caution:       '#C2780A',
  cautionSolid:  '#F0A019',
  cautionBg:     '#FBEFD8',
  cautionRing:   '#F6D38E',
  cautionSoft:   '#FEF8EC',

  // Verdict — unsafe
  unsafe:        '#D3373F',
  unsafeSolid:   '#EE5158',
  unsafeBg:      '#FBE6E7',
  unsafeRing:    '#F4AEB1',
  unsafeSoft:    '#FEF1F2',

  // Legacy aliases — keeps existing screens compiling unchanged
  primary:       '#EC6A56',
  primaryLight:  '#FDEAE4',
  primaryDark:   '#C94F3B',
  primaryBg:     '#FDEAE4',
  background:    '#FFF8F3',
  card:          '#FFFFFF',
  success:       '#1BB377',
  warning:       '#F0A019',
  danger:        '#EE5158',
  heartActive:   '#EC6A56',
  heartInactive: '#CCCCCC',
  tabBar:        '#FFFFFF',
  tabActive:     '#EC6A56',
  tabInactive:   '#A2938B',
};

export function verdictColors(verdict: 'safe' | 'caution' | 'unsafe') {
  return {
    safe:    { fg: Colors.safe,    solid: Colors.safeSolid,    bg: Colors.safeBg,    ring: Colors.safeRing,    soft: Colors.safeSoft },
    caution: { fg: Colors.caution, solid: Colors.cautionSolid, bg: Colors.cautionBg, ring: Colors.cautionRing, soft: Colors.cautionSoft },
    unsafe:  { fg: Colors.unsafe,  solid: Colors.unsafeSolid,  bg: Colors.unsafeBg,  ring: Colors.unsafeRing,  soft: Colors.unsafeSoft },
  }[verdict];
}

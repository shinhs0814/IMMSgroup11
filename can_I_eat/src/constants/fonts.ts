import { AppLanguage } from './translations';

export type FontWeight = '400' | '500' | '600' | '700' | '800';

/**
 * Returns the correct fontFamily string for the current language + weight + role.
 * - Latin (en/es/fr) → Jost (the only Latin font loaded in App.tsx)
 * - Korean (ko)      → NanumGothic (covers CJK glyphs)
 * - Japanese (ja)    → NotoSansJP  (covers CJK glyphs)
 */
export function getFontFamily(language: AppLanguage, weight: FontWeight = '400', display = false): string {
  if (language === 'ko') {
    const w = parseInt(weight);
    if (w >= 800) return 'NanumGothic_800ExtraBold';
    if (w >= 700) return 'NanumGothic_700Bold';
    return 'NanumGothic_400Regular';
  }

  if (language === 'ja') {
    const w = parseInt(weight);
    if (w >= 800) return 'NotoSansJP_800ExtraBold';
    if (w >= 700) return 'NotoSansJP_700Bold';
    if (w >= 600) return 'NotoSansJP_600SemiBold';
    if (w >= 500) return 'NotoSansJP_500Medium';
    return 'NotoSansJP_400Regular';
  }

  // Jost — Latin display & body font (only Latin font loaded in App.tsx)
  switch (weight) {
    case '800': return 'Jost_800ExtraBold';
    case '700': return 'Jost_700Bold';
    case '600': return 'Jost_600SemiBold';
    case '500': return 'Jost_500Medium';
    default:    return 'Jost_400Regular';
  }
}

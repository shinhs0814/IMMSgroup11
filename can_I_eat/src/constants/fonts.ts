import { AppLanguage } from './translations';

export type FontWeight = '400' | '500' | '600' | '700' | '800';

/**
 * Returns the correct fontFamily string for the current language + weight.
 * - Latin scripts (en, es, fr): Jost (Futura-like geometric sans)
 * - Korean (ko): NanumGothic
 * - Japanese (ja): NotoSansJP — Jost has no CJK glyphs
 */
export function getFontFamily(language: AppLanguage, weight: FontWeight = '400'): string {
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

  switch (weight) {
    case '800': return 'Jost_800ExtraBold';
    case '700': return 'Jost_700Bold';
    case '600': return 'Jost_600SemiBold';
    case '500': return 'Jost_500Medium';
    default:    return 'Jost_400Regular';
  }
}

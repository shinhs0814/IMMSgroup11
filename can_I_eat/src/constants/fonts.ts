import { AppLanguage } from './translations';

export type FontWeight = '400' | '500' | '600' | '700' | '800';

/**
 * Returns the correct fontFamily string for the current language + weight + role.
 * - display=true  → Baloo 2 (headings / numbers / big UI labels)
 * - display=false → Nunito (body, captions, UI copy)
 * - Korean (ko)   → NanumGothic (covers CJK glyphs)
 * - Japanese (ja) → NotoSansJP  (covers CJK glyphs)
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

  if (display) {
    // Baloo 2 — rounded display font for headings & numbers
    if (weight === '800') return 'Baloo2_800ExtraBold';
    if (weight === '700') return 'Baloo2_700Bold';
    return 'Baloo2_600SemiBold';
  }

  // Nunito — friendly body font
  switch (weight) {
    case '800': return 'Nunito_800ExtraBold';
    case '700': return 'Nunito_700Bold';
    case '600': return 'Nunito_600SemiBold';
    default:    return 'Nunito_400Regular';
  }
}

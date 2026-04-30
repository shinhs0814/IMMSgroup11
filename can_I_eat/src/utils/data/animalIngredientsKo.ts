/**
 * Korean animal-derived ingredient dictionary.
 *
 * Used by koreanVeganClassifier as a deterministic guardrail for the LLM
 * (Claude Vision) output. The LLM may hallucinate or miss ingredients;
 * this list catches well-known animal-derived terms with high confidence.
 *
 * Sources cross-checked: Korean MFDS food ingredient lists, common
 * Korean convenience store products (라면/스낵/소스), Korean vegan
 * community ingredient guides.
 *
 * Classification:
 * - RED: clearly animal-derived. Vegan = NO.
 * - AMBER: ambiguous source (animal OR plant). Vegan = NEEDS VERIFICATION.
 */

export type IngredientEntry = {
  /** Canonical Korean term as it commonly appears on labels. */
  term: string;
  /** English translation for the result UI. */
  english: string;
  /** Optional alternate Korean spellings/synonyms. */
  aliases?: string[];
};

/**
 * Confirmed animal-derived ingredients.
 * If any of these match, the product is NOT vegan.
 */
export const RED_LIST: IngredientEntry[] = [
  // Meat — 육류
  { term: '쇠고기', english: 'beef', aliases: ['우육', '소고기'] },
  { term: '돼지고기', english: 'pork', aliases: ['돈육', '돈지'] },
  { term: '닭고기', english: 'chicken', aliases: ['계육', '닭'] },
  { term: '오리고기', english: 'duck' },
  { term: '양고기', english: 'lamb' },
  { term: '햄', english: 'ham' },
  { term: '소시지', english: 'sausage' },
  { term: '베이컨', english: 'bacon' },
  { term: '라드', english: 'lard' },
  { term: '동물성유지', english: 'animal fat', aliases: ['동물성 유지', '우지', '돈지'] },

  // Seafood — 해산물
  { term: '어육', english: 'fish meat' },
  { term: '멸치', english: 'anchovy', aliases: ['멸치분말', '멸치액', '멸치엑기스'] },
  { term: '새우', english: 'shrimp', aliases: ['새우분', '건새우'] },
  { term: '게', english: 'crab' },
  { term: '오징어', english: 'squid' },
  { term: '문어', english: 'octopus' },
  { term: '굴', english: 'oyster', aliases: ['굴소스'] },
  { term: '조개', english: 'clam' },
  { term: '액젓', english: 'fish sauce', aliases: ['멸치액젓', '까나리액젓'] },
  { term: '가쓰오부시', english: 'bonito flakes', aliases: ['가다랑어'] },
  { term: '참치', english: 'tuna' },
  { term: '연어', english: 'salmon' },

  // Dairy — 유제품
  { term: '우유', english: 'milk', aliases: ['전지유', '탈지유'] },
  { term: '분유', english: 'milk powder', aliases: ['전지분유', '탈지분유', '우유분말'] },
  { term: '유당', english: 'lactose' },
  { term: '유청', english: 'whey', aliases: ['유청분말', '유청단백'] },
  { term: '카제인', english: 'casein', aliases: ['카제인나트륨', '카세인'] },
  { term: '버터', english: 'butter' },
  { term: '치즈', english: 'cheese', aliases: ['치즈분말'] },
  { term: '생크림', english: 'cream', aliases: ['크림', '연유'] },
  { term: '요구르트', english: 'yogurt' },

  // Eggs — 계란
  { term: '계란', english: 'egg', aliases: ['달걀', '난'] },
  { term: '난백', english: 'egg white' },
  { term: '난황', english: 'egg yolk' },
  { term: '전란', english: 'whole egg' },
  { term: '난백분말', english: 'egg white powder' },

  // Other animal-derived
  { term: '젤라틴', english: 'gelatin' },
  { term: '꿀', english: 'honey', aliases: ['봉밀', '벌꿀'] },
  { term: '로열젤리', english: 'royal jelly' },
  { term: '카민', english: 'carmine', aliases: ['코치닐'] },
  { term: '셀락', english: 'shellac' },
];

/**
 * Ambiguous ingredients — could be plant OR animal-derived.
 * If any of these match (and no RED match), result is "caution":
 * user should verify with manufacturer.
 */
export const AMBER_LIST: IngredientEntry[] = [
  { term: '향료', english: 'flavoring', aliases: ['천연향료', '합성향료'] },
  { term: '유화제', english: 'emulsifier' },
  { term: 'L-시스테인', english: 'L-cysteine', aliases: ['시스테인'] },
  { term: '비타민D3', english: 'vitamin D3' },
  { term: '글리세린', english: 'glycerin', aliases: ['글리세롤'] },
  { term: '모노글리세라이드', english: 'monoglyceride', aliases: ['모노 및 디글리세리드'] },
  { term: '스테아린산', english: 'stearic acid' },
  { term: '콜라겐', english: 'collagen' },
  { term: '효소', english: 'enzyme', aliases: ['렌넷'] },
  { term: '레시틴', english: 'lecithin' }, // usually soy but not always
  { term: '오메가3', english: 'omega-3' }, // could be fish oil
];

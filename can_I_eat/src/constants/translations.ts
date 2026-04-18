export type AppLanguage = 'en' | 'ko' | 'es' | 'fr' | 'ja';

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: '🇺🇸 English',
  ko: '🇰🇷 한국어',
  es: '🇪🇸 Español',
  fr: '🇫🇷 Français',
  ja: '🇯🇵 日本語',
};

export const LANGUAGE_NAMES: Record<AppLanguage, string> = {
  en: 'English',
  ko: 'Korean',
  es: 'Spanish',
  fr: 'French',
  ja: 'Japanese',
};

export type TranslationKeys = {
  hello: string;
  savedFoods: string;
  home: string;
  camera: string;
  search: string;
  settings: string;
  myProfile: string;
  language: string;
  signOut: string;
  newGroup: string;
  uncategorized: string;
  items: string;
  nothingSaved: string;
  nothingSavedSub: string;
  noFoodsYet: string;
  scanYourFood: string;
  scanSubtitle: string;
  takePhoto: string;
  chooseFromAlbum: string;
  tipsTitle: string;
  tipLabel: string;
  tipFood: string;
  tipBlurry: string;
  searchTitle: string;
  searchPlaceholder: string;
  searchButton: string;
  searching: string;
  safeLabel: string;
  cautionLabel: string;
  unsafeLabel: string;
  ingredientAnalysis: string;
  ingredientsTitle: string;
  caloriesTitle: string;
  nutritionTitle: string;
  saveToMyFoods: string;
  savedToLibrary: string;
  saveToGroup: string;
  cancel: string;
  labelType: string;
  foodType: string;
  myProfileTitle: string;
  allergiesTitle: string;
  restrictionsTitle: string;
  preferencesTitle: string;
  saveChanges: string;
  profileUpdated: string;
  selectLanguage: string;
  ok: string;
  delete: string;
  create: string;
  newGroupTitle: string;
  newGroupPlaceholder: string;
  moveToGroup: string;
  deleteGroup: string;
  deleteGroupMsg: string;
  removeFood: string;
  removeFoodMsg: string;
  analysisFailedTitle: string;
  searchTipMultilingual: string;
  searchTipDishes: string;
  searchTipRecipes: string;

  // Survey screen
  surveyTitle: string;
  surveyStep1: string;
  surveyStep2: string;
  surveyStep3: string;
  surveyQ1: string;
  surveyQ2: string;
  surveyQ3: string;
  selectAllApply: string;
  selectOne: string;
  back: string;
  next: string;
  letsGo: string;
  customAllergyPlaceholder: string;
  customAllergyAdd: string;

  // Camera screen
  scanOptionTakePhoto: string;
  scanOptionAlbum: string;
  scanOptionUseCamera: string;
  scanOptionGallery: string;
  analyzingCompressing: string;
  analyzingAI: string;
  analyzingProfile: string;

  // Home screen extras
  createNewGroup: string;
  noFoodsInGroup: string;
  deleteGroupConfirm: string;
  removeFoodConfirm: string;

  // Deactivate / delete account
  deactivateAccount: string;
  deactivateTitle: string;
  deactivateMsg: string;
  deleteEverything: string;
  deactivateConfirmTitle: string;
  deactivateConfirmMsg: string;
  yesDeleteAccount: string;
  reloginRequired: string;
  reloginMsg: string;

  // Dietary item labels (for chips/cards in survey + profile edit)
  allergy_peanuts: string;
  allergy_tree_nuts: string;
  allergy_milk: string;
  allergy_eggs: string;
  allergy_wheat: string;
  allergy_soy: string;
  allergy_fish: string;
  allergy_shellfish: string;
  allergy_sesame: string;
  allergy_sulfites: string;

  restriction_lactose_intolerant: string;
  restriction_celiac: string;
  restriction_diabetic: string;
  restriction_low_sodium: string;
  restriction_low_sugar: string;
  restriction_kidney_disease: string;
  restriction_ibs: string;
  restriction_halal: string;
  restriction_kosher: string;

  pref_vegan: string;
  pref_vegan_desc: string;
  pref_vegetarian: string;
  pref_vegetarian_desc: string;
  pref_pescatarian: string;
  pref_pescatarian_desc: string;
  pref_keto: string;
  pref_keto_desc: string;
  pref_paleo: string;
  pref_paleo_desc: string;
  pref_mediterranean: string;
  pref_mediterranean_desc: string;
  pref_low_carb: string;
  pref_low_carb_desc: string;
  pref_low_fat: string;
  pref_low_fat_desc: string;
  pref_high_protein: string;
  pref_high_protein_desc: string;
  pref_dairy_free: string;
  pref_dairy_free_desc: string;
  pref_gluten_free: string;
  pref_gluten_free_desc: string;
  pref_low_fiber: string;
  pref_low_fiber_desc: string;
  pref_none: string;
  pref_none_desc: string;
};

const en: TranslationKeys = {
  hello: 'Hello',
  savedFoods: 'Your saved foods',
  home: 'Home',
  camera: 'Scan',
  search: 'Search',
  settings: 'Settings',
  myProfile: 'My Profile',
  language: 'Language',
  signOut: 'Sign Out',
  newGroup: 'New Group',
  uncategorized: 'Uncategorized',
  items: 'items',
  nothingSaved: 'Nothing saved yet',
  nothingSavedSub: "Scan food or a package label to check if it's safe for you",
  noFoodsYet: 'No foods yet. Scan something!',
  scanYourFood: 'Scan Your Food',
  scanSubtitle: "Take a photo of a dish or food package label to check if it's safe for you",
  takePhoto: '📷  Take a Photo',
  chooseFromAlbum: '🖼️  Choose from Album',
  tipsTitle: 'Tips for best results:',
  tipLabel: 'For labels: make sure text is clear and well-lit',
  tipFood: 'For food: capture the full dish',
  tipBlurry: 'Avoid blurry or dark photos',
  searchTitle: 'Search Food',
  searchPlaceholder: 'e.g. Kimchi, Croissant, Pad Thai...',
  searchButton: 'Check This Food',
  searching: 'Analyzing...',
  safeLabel: 'Safe for you!',
  cautionLabel: 'Use caution',
  unsafeLabel: 'Not safe for you',
  ingredientAnalysis: 'Ingredient Analysis',
  ingredientsTitle: 'Ingredients',
  caloriesTitle: 'Calories',
  nutritionTitle: 'Nutrition Highlights',
  saveToMyFoods: 'Save to my foods',
  savedToLibrary: 'Saved to library',
  saveToGroup: 'Save to Group',
  cancel: 'Cancel',
  labelType: '📋 Nutrition Label',
  foodType: '🍽️ Food Image',
  myProfileTitle: 'My Profile',
  allergiesTitle: 'Allergies',
  restrictionsTitle: 'Dietary Restrictions',
  preferencesTitle: 'Dietary Preferences',
  saveChanges: 'Save Changes',
  profileUpdated: 'Profile updated!',
  selectLanguage: 'Select Language',
  ok: 'OK',
  delete: 'Delete',
  create: 'Create',
  newGroupTitle: 'Create New Group',
  newGroupPlaceholder: 'e.g. Breakfast, Snacks, Work Lunch...',
  moveToGroup: 'Move to Group',
  deleteGroup: 'Delete Group',
  deleteGroupMsg: 'Delete this group? Foods will move to uncategorized.',
  removeFood: 'Remove Food',
  removeFoodMsg: 'Remove this food from your saved foods?',
  analysisFailedTitle: 'Analysis Failed',
  searchTipMultilingual: 'Search in any language — Korean, Japanese, Spanish and more',
  searchTipDishes: 'Try dish names, packaged food brands, or ingredients',
  searchTipRecipes: 'Results are based on typical recipes for that food',

  // Survey screen
  surveyTitle: "Let's personalize\nyour experience",
  surveyStep1: 'Allergies',
  surveyStep2: 'Restrictions',
  surveyStep3: 'Preferences',
  surveyQ1: 'Do you have any food allergies?',
  surveyQ2: 'Any dietary restrictions?',
  surveyQ3: "What's your dietary preference?",
  selectAllApply: 'Select all that apply',
  selectOne: 'Select one',
  back: 'Back',
  next: 'Next →',
  letsGo: "Let's Go! 🎉",
  customAllergyPlaceholder: 'Add custom allergy (e.g. mango, squid)...',
  customAllergyAdd: 'Add',

  // Camera screen
  scanOptionTakePhoto: 'Take Photo',
  scanOptionAlbum: 'From Album',
  scanOptionUseCamera: 'Use your camera',
  scanOptionGallery: 'Choose from gallery',
  analyzingCompressing: 'Compressing image...',
  analyzingAI: 'Analyzing with AI...',
  analyzingProfile: 'Checking ingredients against your dietary profile...',

  // Home screen extras
  createNewGroup: 'New Group',
  noFoodsInGroup: 'No foods yet. Scan something!',
  deleteGroupConfirm: 'Delete this group? Foods will move to uncategorized.',
  removeFoodConfirm: 'Remove this food from your saved foods?',

  // Deactivate / delete account
  deactivateAccount: '🗑  Deactivate Account',
  deactivateTitle: '⚠️ Deactivate Account',
  deactivateMsg: 'This will permanently delete your account and all your saved foods, groups, and dietary profile from our servers. This cannot be undone.',
  deleteEverything: 'Delete Everything',
  deactivateConfirmTitle: 'Are you absolutely sure?',
  deactivateConfirmMsg: 'Your account and all personal data will be erased permanently.',
  yesDeleteAccount: 'Yes, Delete My Account',
  reloginRequired: 'Re-login Required',
  reloginMsg: 'For security, please sign out and sign back in, then try deleting your account again.',

  // Allergy labels
  allergy_peanuts: 'Peanuts',
  allergy_tree_nuts: 'Tree Nuts',
  allergy_milk: 'Milk / Dairy',
  allergy_eggs: 'Eggs',
  allergy_wheat: 'Wheat / Gluten',
  allergy_soy: 'Soy',
  allergy_fish: 'Fish',
  allergy_shellfish: 'Shellfish',
  allergy_sesame: 'Sesame',
  allergy_sulfites: 'Sulfites',

  // Restriction labels
  restriction_lactose_intolerant: 'Lactose Intolerant',
  restriction_celiac: 'Celiac Disease',
  restriction_diabetic: 'Diabetic',
  restriction_low_sodium: 'Low Sodium',
  restriction_low_sugar: 'Low Sugar',
  restriction_kidney_disease: 'Kidney Disease',
  restriction_ibs: 'IBS / Low FODMAP',
  restriction_halal: 'Halal',
  restriction_kosher: 'Kosher',

  // Preference labels
  pref_vegan: 'Vegan',
  pref_vegan_desc: 'No animal products',
  pref_vegetarian: 'Vegetarian',
  pref_vegetarian_desc: 'No meat or fish',
  pref_pescatarian: 'Pescatarian',
  pref_pescatarian_desc: 'No meat, fish is okay',
  pref_keto: 'Keto',
  pref_keto_desc: 'Low carb, high fat',
  pref_paleo: 'Paleo',
  pref_paleo_desc: 'Whole foods, no processed',
  pref_mediterranean: 'Mediterranean',
  pref_mediterranean_desc: 'Olive oil, fish, whole grains',
  pref_low_carb: 'Low Carb',
  pref_low_carb_desc: 'Reduced carbohydrates',
  pref_low_fat: 'Low Fat',
  pref_low_fat_desc: 'Reduced fat intake',
  pref_high_protein: 'High Protein',
  pref_high_protein_desc: 'Muscle building, fitness',
  pref_dairy_free: 'Dairy-Free',
  pref_dairy_free_desc: 'No dairy, by choice',
  pref_gluten_free: 'Gluten-Free',
  pref_gluten_free_desc: 'No gluten, by choice',
  pref_low_fiber: 'Low Fiber',
  pref_low_fiber_desc: 'Easy on digestion',
  pref_none: 'No Preference',
  pref_none_desc: 'I eat everything',
};

const ko: TranslationKeys = {
  hello: '안녕하세요',
  savedFoods: '저장된 음식',
  home: '홈',
  camera: '스캔',
  search: '검색',
  settings: '설정',
  myProfile: '내 프로필',
  language: '언어',
  signOut: '로그아웃',
  newGroup: '새 그룹',
  uncategorized: '미분류',
  items: '개',
  nothingSaved: '저장된 음식 없음',
  nothingSavedSub: '음식이나 패키지 라벨을 스캔하여 안전한지 확인하세요',
  noFoodsYet: '음식이 없습니다. 스캔해보세요!',
  scanYourFood: '음식 스캔',
  scanSubtitle: '음식 사진이나 패키지 라벨을 찍어 안전한지 확인하세요',
  takePhoto: '📷  사진 촬영',
  chooseFromAlbum: '🖼️  앨범에서 선택',
  tipsTitle: '최상의 결과를 위한 팁:',
  tipLabel: '라벨: 텍스트가 선명하고 잘 보이도록 하세요',
  tipFood: '음식: 전체 요리를 촬영하세요',
  tipBlurry: '흐리거나 어두운 사진은 피하세요',
  searchTitle: '음식 검색',
  searchPlaceholder: '예: 김치, 크루아상, 팟타이...',
  searchButton: '이 음식 확인하기',
  searching: '분석 중...',
  safeLabel: '안전해요!',
  cautionLabel: '주의 필요',
  unsafeLabel: '섭취 불가',
  ingredientAnalysis: '성분 분석',
  ingredientsTitle: '재료',
  caloriesTitle: '칼로리',
  nutritionTitle: '영양 정보',
  saveToMyFoods: '내 음식에 저장',
  savedToLibrary: '라이브러리에 저장됨',
  saveToGroup: '그룹에 저장',
  cancel: '취소',
  labelType: '📋 영양 성분표',
  foodType: '🍽️ 음식 사진',
  myProfileTitle: '내 프로필',
  allergiesTitle: '알레르기',
  restrictionsTitle: '식이 제한',
  preferencesTitle: '식습관 선호',
  saveChanges: '변경사항 저장',
  profileUpdated: '프로필이 업데이트되었습니다!',
  selectLanguage: '언어 선택',
  ok: '확인',
  delete: '삭제',
  create: '만들기',
  newGroupTitle: '새 그룹 만들기',
  newGroupPlaceholder: '예: 아침, 간식, 점심...',
  moveToGroup: '그룹으로 이동',
  deleteGroup: '그룹 삭제',
  deleteGroupMsg: '이 그룹을 삭제하시겠습니까? 음식이 미분류로 이동합니다.',
  removeFood: '음식 제거',
  removeFoodMsg: '이 음식을 저장된 목록에서 제거하시겠습니까?',
  analysisFailedTitle: '분석 실패',
  searchTipMultilingual: '한국어, 일본어, 스페인어 등 어떤 언어로도 검색 가능',
  searchTipDishes: '요리 이름, 식품 브랜드, 재료로 검색해보세요',
  searchTipRecipes: '결과는 해당 음식의 일반적인 레시피를 기반으로 합니다',

  // Survey screen
  surveyTitle: "맞춤 설정을\n시작해볼까요",
  surveyStep1: '알레르기',
  surveyStep2: '식이 제한',
  surveyStep3: '식습관',
  surveyQ1: '음식 알레르기가 있으신가요?',
  surveyQ2: '식이 제한이 있으신가요?',
  surveyQ3: '식습관 선호도는 무엇인가요?',
  selectAllApply: '해당하는 항목을 모두 선택하세요',
  selectOne: '하나를 선택하세요',
  back: '뒤로',
  next: '다음 →',
  letsGo: '시작하기! 🎉',
  customAllergyPlaceholder: '직접 입력 (예: 망고, 오징어)...',
  customAllergyAdd: '추가',

  // Camera screen
  scanOptionTakePhoto: '사진 촬영',
  scanOptionAlbum: '앨범에서',
  scanOptionUseCamera: '카메라 사용',
  scanOptionGallery: '갤러리에서 선택',
  analyzingCompressing: '이미지 압축 중...',
  analyzingAI: 'AI 분석 중...',
  analyzingProfile: '식이 프로필에 따라 성분 확인 중...',

  // Home screen extras
  createNewGroup: '새 그룹',
  noFoodsInGroup: '음식이 없습니다. 스캔해보세요!',
  deleteGroupConfirm: '이 그룹을 삭제하시겠습니까? 음식이 미분류로 이동합니다.',
  removeFoodConfirm: '이 음식을 저장된 목록에서 제거하시겠습니까?',

  // Deactivate / delete account
  deactivateAccount: '🗑  계정 비활성화',
  deactivateTitle: '⚠️ 계정 비활성화',
  deactivateMsg: '계정과 저장된 모든 음식, 그룹, 식이 프로필이 서버에서 영구적으로 삭제됩니다. 되돌릴 수 없습니다.',
  deleteEverything: '모두 삭제',
  deactivateConfirmTitle: '정말 확실하신가요?',
  deactivateConfirmMsg: '계정과 모든 개인 데이터가 영구적으로 삭제됩니다.',
  yesDeleteAccount: '네, 계정을 삭제합니다',
  reloginRequired: '재로그인 필요',
  reloginMsg: '보안을 위해 로그아웃 후 다시 로그인한 다음 계정 삭제를 시도해 주세요.',

  // Allergy labels
  allergy_peanuts: '땅콩',
  allergy_tree_nuts: '견과류',
  allergy_milk: '우유 / 유제품',
  allergy_eggs: '달걀',
  allergy_wheat: '밀 / 글루텐',
  allergy_soy: '대두',
  allergy_fish: '생선',
  allergy_shellfish: '갑각류',
  allergy_sesame: '참깨',
  allergy_sulfites: '아황산염',

  // Restriction labels
  restriction_lactose_intolerant: '유당불내증',
  restriction_celiac: '셀리악병',
  restriction_diabetic: '당뇨',
  restriction_low_sodium: '저염식',
  restriction_low_sugar: '저당식',
  restriction_kidney_disease: '신장 질환',
  restriction_ibs: '과민성대장증후군',
  restriction_halal: '할랄',
  restriction_kosher: '코셔',

  // Preference labels
  pref_vegan: '비건',
  pref_vegan_desc: '동물성 제품 없음',
  pref_vegetarian: '채식주의',
  pref_vegetarian_desc: '육류와 생선 없음',
  pref_pescatarian: '페스카테리언',
  pref_pescatarian_desc: '육류 없음, 생선 가능',
  pref_keto: '키토',
  pref_keto_desc: '저탄수화물, 고지방',
  pref_paleo: '팔레오',
  pref_paleo_desc: '자연식품, 가공식품 없음',
  pref_mediterranean: '지중해식',
  pref_mediterranean_desc: '올리브유, 생선, 통곡물',
  pref_low_carb: '저탄수화물',
  pref_low_carb_desc: '탄수화물 줄이기',
  pref_low_fat: '저지방',
  pref_low_fat_desc: '지방 섭취 줄이기',
  pref_high_protein: '고단백',
  pref_high_protein_desc: '근육 증가, 피트니스',
  pref_dairy_free: '유제품 없음',
  pref_dairy_free_desc: '선택적으로 유제품 제외',
  pref_gluten_free: '글루텐 없음',
  pref_gluten_free_desc: '선택적으로 글루텐 제외',
  pref_low_fiber: '저식이섬유',
  pref_low_fiber_desc: '소화에 부담 없음',
  pref_none: '제한 없음',
  pref_none_desc: '모두 먹을 수 있음',
};

const es: TranslationKeys = {
  hello: 'Hola',
  savedFoods: 'Tus alimentos guardados',
  home: 'Inicio',
  camera: 'Escanear',
  search: 'Buscar',
  settings: 'Configuración',
  myProfile: 'Mi Perfil',
  language: 'Idioma',
  signOut: 'Cerrar sesión',
  newGroup: 'Nuevo Grupo',
  uncategorized: 'Sin categoría',
  items: 'elementos',
  nothingSaved: 'Nada guardado aún',
  nothingSavedSub: 'Escanea comida o etiquetas para saber si son seguras para ti',
  noFoodsYet: '¡Sin alimentos. Escanea algo!',
  scanYourFood: 'Escanea tu Comida',
  scanSubtitle: 'Toma una foto de un plato o etiqueta de paquete para verificar si es seguro',
  takePhoto: '📷  Tomar Foto',
  chooseFromAlbum: '🖼️  Elegir del Álbum',
  tipsTitle: 'Consejos para mejores resultados:',
  tipLabel: 'Para etiquetas: asegúrate de que el texto sea claro',
  tipFood: 'Para comida: captura el plato completo',
  tipBlurry: 'Evita fotos borrosas u oscuras',
  searchTitle: 'Buscar Alimento',
  searchPlaceholder: 'ej. Kimchi, Croissant, Pad Thai...',
  searchButton: 'Verificar este alimento',
  searching: 'Analizando...',
  safeLabel: '¡Seguro para ti!',
  cautionLabel: 'Usa con precaución',
  unsafeLabel: 'No seguro para ti',
  ingredientAnalysis: 'Análisis de Ingredientes',
  ingredientsTitle: 'Ingredientes',
  caloriesTitle: 'Calorías',
  nutritionTitle: 'Aspectos Nutricionales',
  saveToMyFoods: 'Guardar en mis alimentos',
  savedToLibrary: 'Guardado en biblioteca',
  saveToGroup: 'Guardar en Grupo',
  cancel: 'Cancelar',
  labelType: '📋 Etiqueta Nutricional',
  foodType: '🍽️ Imagen de Comida',
  myProfileTitle: 'Mi Perfil',
  allergiesTitle: 'Alergias',
  restrictionsTitle: 'Restricciones Dietéticas',
  preferencesTitle: 'Preferencias Dietéticas',
  saveChanges: 'Guardar Cambios',
  profileUpdated: '¡Perfil actualizado!',
  selectLanguage: 'Seleccionar Idioma',
  ok: 'OK',
  delete: 'Eliminar',
  create: 'Crear',
  newGroupTitle: 'Crear Nuevo Grupo',
  newGroupPlaceholder: 'ej. Desayuno, Snacks, Almuerzo...',
  moveToGroup: 'Mover a Grupo',
  deleteGroup: 'Eliminar Grupo',
  deleteGroupMsg: '¿Eliminar este grupo? Los alimentos pasarán a sin categoría.',
  removeFood: 'Eliminar Alimento',
  removeFoodMsg: '¿Eliminar este alimento de tus guardados?',
  analysisFailedTitle: 'Análisis Fallido',
  searchTipMultilingual: 'Busca en cualquier idioma — coreano, japonés, inglés y más',
  searchTipDishes: 'Prueba nombres de platos, marcas o ingredientes',
  searchTipRecipes: 'Los resultados se basan en recetas típicas de ese alimento',

  // Survey screen
  surveyTitle: "Personalicemos\ntu experiencia",
  surveyStep1: 'Alergias',
  surveyStep2: 'Restricciones',
  surveyStep3: 'Preferencias',
  surveyQ1: '¿Tienes alguna alergia alimentaria?',
  surveyQ2: '¿Tienes restricciones dietéticas?',
  surveyQ3: '¿Cuál es tu preferencia dietética?',
  selectAllApply: 'Selecciona todas las que apliquen',
  selectOne: 'Selecciona una',
  back: 'Atrás',
  next: 'Siguiente →',
  letsGo: '¡Vamos! 🎉',
  customAllergyPlaceholder: 'Agregar alergia personalizada (ej. mango)...',
  customAllergyAdd: 'Agregar',

  // Camera screen
  scanOptionTakePhoto: 'Tomar Foto',
  scanOptionAlbum: 'Del Álbum',
  scanOptionUseCamera: 'Usar la cámara',
  scanOptionGallery: 'Elegir de la galería',
  analyzingCompressing: 'Comprimiendo imagen...',
  analyzingAI: 'Analizando con IA...',
  analyzingProfile: 'Verificando ingredientes según tu perfil...',

  // Home screen extras
  createNewGroup: 'Nuevo Grupo',
  noFoodsInGroup: '¡Sin alimentos. Escanea algo!',
  deleteGroupConfirm: '¿Eliminar este grupo? Los alimentos pasarán a sin categoría.',
  removeFoodConfirm: '¿Eliminar este alimento de tus guardados?',

  // Deactivate / delete account
  deactivateAccount: '🗑  Desactivar Cuenta',
  deactivateTitle: '⚠️ Desactivar Cuenta',
  deactivateMsg: 'Esto eliminará permanentemente tu cuenta y todos tus alimentos guardados, grupos y perfil dietético de nuestros servidores. Esto no se puede deshacer.',
  deleteEverything: 'Eliminar Todo',
  deactivateConfirmTitle: '¿Estás absolutamente seguro?',
  deactivateConfirmMsg: 'Tu cuenta y todos los datos personales serán eliminados permanentemente.',
  yesDeleteAccount: 'Sí, Eliminar Mi Cuenta',
  reloginRequired: 'Re-inicio de Sesión Requerido',
  reloginMsg: 'Por seguridad, cierra sesión y vuelve a iniciarla, luego intenta eliminar tu cuenta nuevamente.',

  // Allergy labels
  allergy_peanuts: 'Maní',
  allergy_tree_nuts: 'Frutos Secos',
  allergy_milk: 'Leche / Lácteos',
  allergy_eggs: 'Huevos',
  allergy_wheat: 'Trigo / Gluten',
  allergy_soy: 'Soya',
  allergy_fish: 'Pescado',
  allergy_shellfish: 'Mariscos',
  allergy_sesame: 'Sésamo',
  allergy_sulfites: 'Sulfitos',

  // Restriction labels
  restriction_lactose_intolerant: 'Intolerante a la Lactosa',
  restriction_celiac: 'Enfermedad Celíaca',
  restriction_diabetic: 'Diabético',
  restriction_low_sodium: 'Bajo en Sodio',
  restriction_low_sugar: 'Bajo en Azúcar',
  restriction_kidney_disease: 'Enfermedad Renal',
  restriction_ibs: 'SII / Bajo FODMAP',
  restriction_halal: 'Halal',
  restriction_kosher: 'Kosher',

  // Preference labels
  pref_vegan: 'Vegano',
  pref_vegan_desc: 'Sin productos animales',
  pref_vegetarian: 'Vegetariano',
  pref_vegetarian_desc: 'Sin carne ni pescado',
  pref_pescatarian: 'Pescetariano',
  pref_pescatarian_desc: 'Sin carne, pescado permitido',
  pref_keto: 'Keto',
  pref_keto_desc: 'Bajo en carbos, alto en grasas',
  pref_paleo: 'Paleo',
  pref_paleo_desc: 'Alimentos naturales, sin procesados',
  pref_mediterranean: 'Mediterránea',
  pref_mediterranean_desc: 'Aceite de oliva, pescado, cereales integrales',
  pref_low_carb: 'Bajo en Carbos',
  pref_low_carb_desc: 'Carbohidratos reducidos',
  pref_low_fat: 'Bajo en Grasa',
  pref_low_fat_desc: 'Ingesta de grasa reducida',
  pref_high_protein: 'Alto en Proteínas',
  pref_high_protein_desc: 'Desarrollo muscular, fitness',
  pref_dairy_free: 'Sin Lácteos',
  pref_dairy_free_desc: 'Sin lácteos, por elección',
  pref_gluten_free: 'Sin Gluten',
  pref_gluten_free_desc: 'Sin gluten, por elección',
  pref_low_fiber: 'Bajo en Fibra',
  pref_low_fiber_desc: 'Fácil de digerir',
  pref_none: 'Sin Preferencia',
  pref_none_desc: 'Como de todo',
};

const fr: TranslationKeys = {
  hello: 'Bonjour',
  savedFoods: 'Vos aliments sauvegardés',
  home: 'Accueil',
  camera: 'Scanner',
  search: 'Chercher',
  settings: 'Paramètres',
  myProfile: 'Mon Profil',
  language: 'Langue',
  signOut: 'Se déconnecter',
  newGroup: 'Nouveau Groupe',
  uncategorized: 'Non classifié',
  items: 'éléments',
  nothingSaved: 'Rien de sauvegardé',
  nothingSavedSub: "Scannez un aliment ou une étiquette pour vérifier s'il est sûr pour vous",
  noFoodsYet: 'Aucun aliment. Scannez quelque chose!',
  scanYourFood: 'Scannez votre Nourriture',
  scanSubtitle: "Prenez une photo d'un plat ou d'une étiquette pour vérifier si c'est sûr",
  takePhoto: '📷  Prendre une Photo',
  chooseFromAlbum: "🖼️  Choisir dans l'Album",
  tipsTitle: 'Conseils pour de meilleurs résultats:',
  tipLabel: 'Pour les étiquettes: assurez-vous que le texte est clair',
  tipFood: 'Pour la nourriture: capturez le plat entier',
  tipBlurry: 'Évitez les photos floues ou sombres',
  searchTitle: 'Rechercher un Aliment',
  searchPlaceholder: 'ex. Kimchi, Croissant, Pad Thai...',
  searchButton: 'Vérifier cet aliment',
  searching: 'Analyse en cours...',
  safeLabel: 'Sûr pour vous!',
  cautionLabel: 'À consommer avec précaution',
  unsafeLabel: 'Pas sûr pour vous',
  ingredientAnalysis: 'Analyse des Ingrédients',
  ingredientsTitle: 'Ingrédients',
  caloriesTitle: 'Calories',
  nutritionTitle: 'Points Nutritionnels',
  saveToMyFoods: 'Sauvegarder dans mes aliments',
  savedToLibrary: 'Sauvegardé dans la bibliothèque',
  saveToGroup: 'Sauvegarder dans un Groupe',
  cancel: 'Annuler',
  labelType: '📋 Étiquette Nutritionnelle',
  foodType: '🍽️ Image de Nourriture',
  myProfileTitle: 'Mon Profil',
  allergiesTitle: 'Allergies',
  restrictionsTitle: 'Restrictions Alimentaires',
  preferencesTitle: 'Préférences Alimentaires',
  saveChanges: 'Sauvegarder les Changements',
  profileUpdated: 'Profil mis à jour!',
  selectLanguage: 'Sélectionner la Langue',
  ok: 'OK',
  delete: 'Supprimer',
  create: 'Créer',
  newGroupTitle: 'Créer un Nouveau Groupe',
  newGroupPlaceholder: 'ex. Petit-déjeuner, Snacks, Déjeuner...',
  moveToGroup: 'Déplacer vers un Groupe',
  deleteGroup: 'Supprimer le Groupe',
  deleteGroupMsg: 'Supprimer ce groupe? Les aliments seront déplacés vers non classifié.',
  removeFood: "Supprimer l'Aliment",
  removeFoodMsg: 'Supprimer cet aliment de vos sauvegardes?',
  analysisFailedTitle: 'Analyse Échouée',
  searchTipMultilingual: "Cherchez dans n'importe quelle langue — coréen, japonais, espagnol et plus",
  searchTipDishes: 'Essayez des noms de plats, marques ou ingrédients',
  searchTipRecipes: 'Les résultats sont basés sur des recettes typiques',

  // Survey screen
  surveyTitle: "Personnalisons\nvotre expérience",
  surveyStep1: 'Allergies',
  surveyStep2: 'Restrictions',
  surveyStep3: 'Préférences',
  surveyQ1: 'Avez-vous des allergies alimentaires?',
  surveyQ2: 'Avez-vous des restrictions alimentaires?',
  surveyQ3: 'Quelle est votre préférence alimentaire?',
  selectAllApply: "Sélectionnez tout ce qui s'applique",
  selectOne: 'Sélectionnez-en un',
  back: 'Retour',
  next: 'Suivant →',
  letsGo: "C'est parti! 🎉",
  customAllergyPlaceholder: 'Ajouter une allergie personnalisée (ex. mangue)...',
  customAllergyAdd: 'Ajouter',

  // Camera screen
  scanOptionTakePhoto: 'Prendre une Photo',
  scanOptionAlbum: "Depuis l'Album",
  scanOptionUseCamera: 'Utiliser la caméra',
  scanOptionGallery: 'Choisir depuis la galerie',
  analyzingCompressing: "Compression de l'image...",
  analyzingAI: 'Analyse par IA en cours...',
  analyzingProfile: 'Vérification des ingrédients selon votre profil...',

  // Home screen extras
  createNewGroup: 'Nouveau Groupe',
  noFoodsInGroup: 'Aucun aliment. Scannez quelque chose!',
  deleteGroupConfirm: 'Supprimer ce groupe? Les aliments seront déplacés vers non classifié.',
  removeFoodConfirm: 'Supprimer cet aliment de vos sauvegardes?',

  // Deactivate / delete account
  deactivateAccount: '🗑  Désactiver le Compte',
  deactivateTitle: '⚠️ Désactiver le Compte',
  deactivateMsg: 'Cela supprimera définitivement votre compte et tous vos aliments, groupes et profil alimentaire de nos serveurs. Cette action est irréversible.',
  deleteEverything: 'Tout Supprimer',
  deactivateConfirmTitle: 'Êtes-vous absolument certain?',
  deactivateConfirmMsg: 'Votre compte et toutes vos données personnelles seront effacés définitivement.',
  yesDeleteAccount: 'Oui, Supprimer Mon Compte',
  reloginRequired: 'Reconnexion Requise',
  reloginMsg: 'Pour des raisons de sécurité, veuillez vous déconnecter et vous reconnecter, puis réessayer de supprimer votre compte.',

  // Allergy labels
  allergy_peanuts: 'Arachides',
  allergy_tree_nuts: 'Noix',
  allergy_milk: 'Lait / Produits laitiers',
  allergy_eggs: 'Œufs',
  allergy_wheat: 'Blé / Gluten',
  allergy_soy: 'Soja',
  allergy_fish: 'Poisson',
  allergy_shellfish: 'Crustacés',
  allergy_sesame: 'Sésame',
  allergy_sulfites: 'Sulfites',

  // Restriction labels
  restriction_lactose_intolerant: 'Intolérant au Lactose',
  restriction_celiac: 'Maladie Cœliaque',
  restriction_diabetic: 'Diabétique',
  restriction_low_sodium: 'Faible en Sodium',
  restriction_low_sugar: 'Faible en Sucre',
  restriction_kidney_disease: 'Maladie Rénale',
  restriction_ibs: 'SII / Faible FODMAP',
  restriction_halal: 'Halal',
  restriction_kosher: 'Casher',

  // Preference labels
  pref_vegan: 'Végétalien',
  pref_vegan_desc: 'Sans produits animaux',
  pref_vegetarian: 'Végétarien',
  pref_vegetarian_desc: 'Sans viande ni poisson',
  pref_pescatarian: 'Pescétarien',
  pref_pescatarian_desc: 'Sans viande, poisson autorisé',
  pref_keto: 'Kéto',
  pref_keto_desc: 'Faible en glucides, riche en graisses',
  pref_paleo: 'Paléo',
  pref_paleo_desc: 'Aliments naturels, sans transformés',
  pref_none: 'Aucune Préférence',
  pref_none_desc: 'Je mange de tout',
};

const ja: TranslationKeys = {
  hello: 'こんにちは',
  savedFoods: '保存した食品',
  home: 'ホーム',
  camera: 'スキャン',
  search: '検索',
  settings: '設定',
  myProfile: 'マイプロフィール',
  language: '言語',
  signOut: 'サインアウト',
  newGroup: '新しいグループ',
  uncategorized: '未分類',
  items: '件',
  nothingSaved: 'まだ保存なし',
  nothingSavedSub: '食品やパッケージラベルをスキャンして安全か確認しましょう',
  noFoodsYet: '食品なし。スキャンしてみて！',
  scanYourFood: '食品をスキャン',
  scanSubtitle: '料理やパッケージラベルの写真を撮って安全か確認',
  takePhoto: '📷  写真を撮る',
  chooseFromAlbum: '🖼️  アルバムから選ぶ',
  tipsTitle: 'ベストな結果のためのヒント:',
  tipLabel: 'ラベル: テキストが鮮明に見えるようにしてください',
  tipFood: '食品: 料理全体を撮影してください',
  tipBlurry: 'ぼやけた・暗い写真は避けてください',
  searchTitle: '食品を検索',
  searchPlaceholder: '例: キムチ、クロワッサン、パッタイ...',
  searchButton: 'この食品を確認',
  searching: '分析中...',
  safeLabel: '安全です！',
  cautionLabel: '注意が必要',
  unsafeLabel: '安全ではありません',
  ingredientAnalysis: '成分分析',
  ingredientsTitle: '材料',
  caloriesTitle: 'カロリー',
  nutritionTitle: '栄養のポイント',
  saveToMyFoods: '食品に保存',
  savedToLibrary: 'ライブラリに保存済み',
  saveToGroup: 'グループに保存',
  cancel: 'キャンセル',
  labelType: '📋 栄養成分表',
  foodType: '🍽️ 食品画像',
  myProfileTitle: 'マイプロフィール',
  allergiesTitle: 'アレルギー',
  restrictionsTitle: '食事制限',
  preferencesTitle: '食事の好み',
  saveChanges: '変更を保存',
  profileUpdated: 'プロフィールが更新されました！',
  selectLanguage: '言語を選択',
  ok: 'OK',
  delete: '削除',
  create: '作成',
  newGroupTitle: '新しいグループを作成',
  newGroupPlaceholder: '例: 朝食、スナック、ランチ...',
  moveToGroup: 'グループに移動',
  deleteGroup: 'グループを削除',
  deleteGroupMsg: 'このグループを削除しますか？食品は未分類に移動します。',
  removeFood: '食品を削除',
  removeFoodMsg: 'この食品を保存済みリストから削除しますか？',
  analysisFailedTitle: '分析失敗',
  searchTipMultilingual: '韓国語、日本語、スペイン語など、どの言語でも検索可能',
  searchTipDishes: '料理名、食品ブランド、材料で検索してみてください',
  searchTipRecipes: '結果はその食品の一般的なレシピに基づいています',

  // Survey screen
  surveyTitle: "あなたの体験を\nカスタマイズしましょう",
  surveyStep1: 'アレルギー',
  surveyStep2: '食事制限',
  surveyStep3: '好み',
  surveyQ1: '食物アレルギーはありますか？',
  surveyQ2: '食事制限はありますか？',
  surveyQ3: '食事の好みを教えてください',
  selectAllApply: '該当するものをすべて選択',
  selectOne: '1つ選択',
  back: '戻る',
  next: '次へ →',
  letsGo: 'さあ始めよう！ 🎉',
  customAllergyPlaceholder: 'カスタムアレルギーを追加 (例: マンゴー)...',
  customAllergyAdd: '追加',

  // Camera screen
  scanOptionTakePhoto: '写真を撮る',
  scanOptionAlbum: 'アルバムから',
  scanOptionUseCamera: 'カメラを使用',
  scanOptionGallery: 'ギャラリーから選ぶ',
  analyzingCompressing: '画像を圧縮中...',
  analyzingAI: 'AIで分析中...',
  analyzingProfile: '食事プロファイルに基づいて成分を確認中...',

  // Home screen extras
  createNewGroup: '新しいグループ',
  noFoodsInGroup: '食品なし。スキャンしてみて！',
  deleteGroupConfirm: 'このグループを削除しますか？食品は未分類に移動します。',
  removeFoodConfirm: 'この食品を保存済みリストから削除しますか？',

  // Deactivate / delete account
  deactivateAccount: '🗑  アカウントを無効化',
  deactivateTitle: '⚠️ アカウントを無効化',
  deactivateMsg: 'アカウントと保存した食品、グループ、食事プロフィールがサーバーから完全に削除されます。この操作は元に戻せません。',
  deleteEverything: 'すべて削除',
  deactivateConfirmTitle: '本当によろしいですか？',
  deactivateConfirmMsg: 'アカウントとすべての個人データが永久に削除されます。',
  yesDeleteAccount: 'はい、アカウントを削除します',
  reloginRequired: '再ログインが必要',
  reloginMsg: 'セキュリティのため、一度サインアウトして再度サインインしてから、アカウント削除を再試行してください。',

  // Allergy labels
  allergy_peanuts: 'ピーナッツ',
  allergy_tree_nuts: 'ナッツ類',
  allergy_milk: '牛乳 / 乳製品',
  allergy_eggs: '卵',
  allergy_wheat: '小麦 / グルテン',
  allergy_soy: '大豆',
  allergy_fish: '魚',
  allergy_shellfish: '甲殻類',
  allergy_sesame: 'ごま',
  allergy_sulfites: '亜硫酸塩',

  // Restriction labels
  restriction_lactose_intolerant: '乳糖不耐症',
  restriction_celiac: 'セリアック病',
  restriction_diabetic: '糖尿病',
  restriction_low_sodium: '低塩分',
  restriction_low_sugar: '低糖分',
  restriction_kidney_disease: '腎臓病',
  restriction_ibs: 'IBS / 低FODMAP',
  restriction_halal: 'ハラール',
  restriction_kosher: 'コーシャー',

  // Preference labels
  pref_vegan: 'ビーガン',
  pref_vegan_desc: '動物性製品なし',
  pref_vegetarian: 'ベジタリアン',
  pref_vegetarian_desc: '肉と魚なし',
  pref_pescatarian: 'ペスカタリアン',
  pref_pescatarian_desc: '肉なし、魚はOK',
  pref_keto: 'ケトジェニック',
  pref_keto_desc: '低炭水化物、高脂肪',
  pref_paleo: 'パレオ',
  pref_paleo_desc: '自然食品、加工食品なし',
  pref_none: '制限なし',
  pref_none_desc: '何でも食べられる',
};

export const TRANSLATIONS: Record<AppLanguage, TranslationKeys> = { en, ko, es, fr, ja };

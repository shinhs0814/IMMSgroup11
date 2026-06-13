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
  modeFood: string;
  modeFoodDesc: string;
  modeLabel: string;
  modeLabelDesc: string;
  modeBarcode: string;
  modeBarcodeDesc: string;
  barcodeScanning: string;
  barcodeNotFound: string;
  barcodeSuccess: string;
  modeMenu: string;
  modeMenuDesc: string;
  menuScanNote: string;
  menuAnalysisTitle: string;
  menuItemCount: string;
  menuNoItems: string;
  menuTapToExpand: string;
  menuTranslation: string;
  analyzingCompressing: string;
  analyzingAI: string;
  analyzingProfile: string;

  // Home screen extras
  createNewGroup: string;
  noFoodsInGroup: string;
  deleteGroupConfirm: string;
  removeFoodConfirm: string;

  // Meal history
  mealHistory: string;
  mealHistoryTitle: string;
  mealHistorySubtitle: string;
  mealHistoryToday: string;
  mealHistoryEmpty: string;
  mealHistoryEmptySub: string;
  mealHistoryDelete: string;
  mealHistoryDeleteConfirm: string;
  logMealBtn: string;
  mealLoggedBtn: string;
  mealLogged: string;
  mealLogFailed: string;
  logMealChooseDate: string;
  logMealDateTitle: string;
  logMealConfirm: string;

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

  // Restaurants feature
  searchFood: string;
  searchRestaurants: string;
  searchAnyLanguage: string;
  restaurantSearchPlaceholder: string;
  restaurantFilterVegetarian: string;
  restaurantFilterHalal: string;
  restaurantFilterGlutenFree: string;
  restaurantAllRegions: string;
  restaurantResults: string;
  restaurantNoResults: string;
  restaurantNoResultsSub: string;
  restaurantInfoNotAvailable: string;
  restaurantWeekdays: string;
  restaurantWeekends: string;
  restaurantPhone: string;
  restaurantDirections: string;
  restaurantAddress: string;
  restaurantHours: string;
  restaurantCouldNotOpenMaps: string;
  errorTitle: string;

  // Auth screens (sign in / sign up / splash)
  authTagline: string;
  splashTagline: string;
  authSignInTab: string;
  authSignUpTab: string;
  authEmailLabel: string;
  authEmailPlaceholder: string;
  authPasswordLabel: string;
  authPasswordPlaceholder: string;
  authRememberMe: string;
  authLoginButton: string;
  authNameLabel: string;
  authNamePlaceholder: string;
  authPasswordPlaceholderSignUp: string;
  authCreateAccount: string;
  authLegalNote: string;
  authMissingInfoTitle: string;
  authMissingInfoMsgSignIn: string;
  authMissingInfoMsgSignUp: string;
  authWeakPasswordTitle: string;
  authWeakPasswordMsg: string;
  authSignInFailedTitle: string;
  authSignInFailedMsg: string;
  authSignUpFailedTitle: string;
  authGenericErrorMsg: string;

  // Permission alerts
  permissionRequiredTitle: string;
  cameraPermissionMsg: string;
  photoLibraryPermissionMsg: string;

// AI disclaimer
  aiDisclaimerText: string;
  // Family profiles
  familyProfiles: string;
  familyProfilesTitle: string;
  familyProfilesSubtitle: string;
  addFamilyMember: string;
  editMember: string;
  deleteMember: string;
  deleteMemberConfirm: string;
  memberNameLabel: string;
  memberNamePlaceholder: string;
  memberAvatarLabel: string;
  saveMember: string;
  memberAdded: string;
  memberUpdated: string;
  noFamilyMembers: string;
  noFamilyMembersSub: string;
  scanningFor: string;
  switchProfile: string;
  meLabel: string;
  // Hero card & diet profile
  heroTitle: string;
  heroSub: string;
  scanNow: string;
  yourDietProfile: string;
  // Sidebar
  editProfile: string;
  myDietaryProfile: string;
  noDietProfile: string;
  setUp: string;
  add: string;
  foodPassport: string;
  myFoodPassport: string;
  passportSub: string;
  family: string;
  // QR Passport
  qrPassportTitle: string;
  dietaryPassport: string;
  scanToView: string;
  noRestrictions: string;
  shareMyProfile: string;
  qrPassportWebOnly: string;
  // Result screen
  checkingFamily: string;
  shareLabel: string;
  familyCheck: string;
  couldNotShareResult: string;
  couldNotShareProfile: string;
  couldNotSaveProfile: string;
  couldNotSaveChanges: string;
  barcodeDetectedTitle: string;
  barcodeNotInDb: string;
  labelScanBtn: string;
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
  modeFood: 'Food Photo',
  modeFoodDesc: 'Identify dish ingredients',
  modeLabel: 'Food Label',
  modeLabelDesc: 'Scan a package label',
  modeBarcode: 'Barcode Scan',
  modeBarcodeDesc: 'Scan a product barcode',
  barcodeScanning: 'Scanning barcode...',
  barcodeNotFound: 'Product not found. Try label scan instead.',
  barcodeSuccess: 'Product found!',
  modeMenu: 'Menu Scan',
  modeMenuDesc: 'Analyze a full menu',
  menuScanNote: '⚠️ Warning: Food or menu photo results are based on typical recipes and may not be exact. Use Food Label search for the most accurate results.',
  menuAnalysisTitle: 'Menu Analysis',
  menuItemCount: 'items found',
  menuNoItems: 'No menu items detected. Try a clearer photo.',
  menuTapToExpand: 'Tap to see ingredients',
  menuTranslation: 'Translation',
  analyzingCompressing: 'Compressing image...',
  analyzingAI: 'Analyzing with AI...',
  analyzingProfile: 'Checking ingredients against your dietary profile...',

  // Home screen extras
  createNewGroup: 'New Group',
  noFoodsInGroup: 'No foods yet. Scan something!',
  deleteGroupConfirm: 'Delete this group? Foods will move to uncategorized.',
  removeFoodConfirm: 'Remove this food from your saved foods?',

  // Meal history
  mealHistory: 'History',
  mealHistoryTitle: 'Meal History',
  mealHistorySubtitle: 'Track what you eat every day',
  mealHistoryToday: 'Today',
  mealHistoryEmpty: 'No meals logged',
  mealHistoryEmptySub: 'Scan or search food and tap\n"I ate this" to log your meal',
  mealHistoryDelete: 'Delete Record',
  mealHistoryDeleteConfirm: 'Remove this meal from your history?',
  logMealBtn: 'I ate this today',
  mealLoggedBtn: 'Logged!',
  mealLogged: 'Meal logged to your history.',
  mealLogFailed: 'Failed to log meal. Please try again.',
  logMealChooseDate: 'Add to Meal History',
  logMealDateTitle: 'Which day did you eat this?',
  logMealConfirm: 'Log Meal',

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

  // Restaurants feature
  searchFood: 'Food',
  searchRestaurants: 'Restaurants',
  searchAnyLanguage: 'Search any food in any language',
  restaurantSearchPlaceholder: 'Search restaurants by name or address...',
  restaurantFilterVegetarian: 'Vegetarian',
  restaurantFilterHalal: 'Halal',
  restaurantFilterGlutenFree: 'Gluten-Free',
  restaurantAllRegions: 'All Regions',
  restaurantResults: 'results',
  restaurantNoResults: 'No restaurants found',
  restaurantNoResultsSub: 'Try adjusting your filters',
  restaurantInfoNotAvailable: 'Not available',
  restaurantWeekdays: 'Weekdays',
  restaurantWeekends: 'Weekends',
  restaurantPhone: 'Phone',
  restaurantDirections: 'Get Directions',
  restaurantAddress: 'Address',
  restaurantHours: 'Hours',
  restaurantCouldNotOpenMaps: 'Could not open maps',
  errorTitle: 'Error',

  // Auth
  authTagline: 'Know before you eat',
  splashTagline: 'Your personal food safety companion',
  authSignInTab: 'Sign In',
  authSignUpTab: 'Sign Up',
  authEmailLabel: 'E-mail address',
  authEmailPlaceholder: 'your@email.com',
  authPasswordLabel: 'Password',
  authPasswordPlaceholder: 'Your password',
  authRememberMe: 'Remember me',
  authLoginButton: 'Login',
  authNameLabel: 'Your Name',
  authNamePlaceholder: 'e.g. Anna',
  authPasswordPlaceholderSignUp: 'At least 6 characters',
  authCreateAccount: 'Create Account',
  authLegalNote: 'By signing up, you agree to our Terms of Service and Privacy Policy.',
  authMissingInfoTitle: 'Missing Info',
  authMissingInfoMsgSignIn: 'Please enter your email and password.',
  authMissingInfoMsgSignUp: 'Please fill in all fields.',
  authWeakPasswordTitle: 'Weak Password',
  authWeakPasswordMsg: 'Password must be at least 6 characters.',
  authSignInFailedTitle: 'Sign In Failed',
  authSignInFailedMsg: 'Incorrect email or password.',
  authSignUpFailedTitle: 'Sign Up Failed',
  authGenericErrorMsg: 'Something went wrong.',

  // Permissions
  permissionRequiredTitle: 'Permission Required',
  cameraPermissionMsg: 'Camera access is needed to take photos.',
  photoLibraryPermissionMsg: 'Photo library access is needed.',
aiDisclaimerText: 'AI analysis may not detect hidden ingredients (e.g. broth, sauces, oils). For severe allergies, always verify directly with restaurant staff.',
  // Family profiles
  familyProfiles: 'Family Profiles',
  familyProfilesTitle: 'Family Profiles',
  familyProfilesSubtitle: 'Manage dietary profiles for your family',
  addFamilyMember: 'Add Family Member',
  editMember: 'Edit Profile',
  deleteMember: 'Delete Member',
  deleteMemberConfirm: 'Delete this family member profile?',
  memberNameLabel: 'Name',
  memberNamePlaceholder: 'e.g. Mom, Dad, Baby...',
  memberAvatarLabel: 'Choose an avatar',
  saveMember: 'Save Member',
  memberAdded: 'Member added!',
  memberUpdated: 'Member updated!',
  noFamilyMembers: 'No family members yet',
  noFamilyMembersSub: 'Add profiles for your family to scan food for them',
  scanningFor: 'Scanning for:',
  switchProfile: 'Switch',
  meLabel: 'Me',
  heroTitle: 'Can I eat it?',
  heroSub: 'Snap a dish, label or menu — get an instant verdict.',
  scanNow: 'Scan now',
  yourDietProfile: 'Your diet profile',
  editProfile: 'Edit profile',
  myDietaryProfile: 'My dietary profile',
  noDietProfile: 'No diet profile set',
  setUp: 'Set up',
  add: 'Add',
  foodPassport: 'Food passport',
  myFoodPassport: 'My food passport',
  passportSub: 'Staff scan your allergies & diet, in any language.',
  family: 'Family',
  qrPassportTitle: 'QR Passport',
  dietaryPassport: 'Dietary Passport',
  scanToView: 'Scan to view my dietary profile',
  noRestrictions: 'No dietary restrictions',
  shareMyProfile: 'Share My Profile',
  qrPassportWebOnly: 'QR Passport is available on the mobile app.',
  checkingFamily: 'Checking family members…',
  shareLabel: 'Share',
  familyCheck: 'Family Check',
  couldNotShareResult: 'Could not share result.',
  couldNotShareProfile: 'Could not share profile.',
  couldNotSaveProfile: 'Could not save your profile. Please try again.',
  couldNotSaveChanges: 'Could not save changes. Please try again.',
  barcodeDetectedTitle: '📦 Barcode Detected',
  barcodeNotInDb: "This product isn't in our database yet. Try the Label Scan mode to photograph the ingredient list instead.",
  labelScanBtn: 'Label Scan',
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
  modeFood: '음식 사진',
  modeFoodDesc: '요리 재료 확인',
  modeLabel: '포장 라벨',
  modeLabelDesc: '포장지 라벨 스캔',
  modeBarcode: '바코드 스캔',
  modeBarcodeDesc: '제품 바코드를 스캔하세요',
  barcodeScanning: '바코드 스캔 중...',
  barcodeNotFound: '제품을 찾을 수 없습니다. 라벨 스캔을 시도해 보세요.',
  barcodeSuccess: '제품을 찾았습니다!',
  modeMenu: '메뉴판 스캔',
  modeMenuDesc: '메뉴 전체 분석',
  menuScanNote: '⚠️ 주의: 음식 또는 메뉴 사진 결과는 일반적인 레시피를 기반으로 하며 정확하지 않을 수 있습니다. 가장 정확한 결과를 위해 식품 라벨 검색을 이용하세요.',
  menuAnalysisTitle: '메뉴 분석',
  menuItemCount: '개 항목 발견',
  menuNoItems: '메뉴 항목을 찾을 수 없습니다. 더 선명한 사진을 찍어주세요.',
  menuTapToExpand: '재료 보기',
  menuTranslation: '번역',
  analyzingCompressing: '이미지 압축 중...',
  analyzingAI: 'AI 분석 중...',
  analyzingProfile: '식이 프로필에 따라 성분 확인 중...',

  // Home screen extras
  createNewGroup: '새 그룹',
  noFoodsInGroup: '음식이 없습니다. 스캔해보세요!',
  deleteGroupConfirm: '이 그룹을 삭제하시겠습니까? 음식이 미분류로 이동합니다.',
  removeFoodConfirm: '이 음식을 저장된 목록에서 제거하시겠습니까?',

  // Meal history
  mealHistory: '기록',
  mealHistoryTitle: '섭취 기록',
  mealHistorySubtitle: '매일 먹은 음식을 기록해보세요',
  mealHistoryToday: '오늘',
  mealHistoryEmpty: '기록된 식사가 없습니다',
  mealHistoryEmptySub: '음식을 스캔하거나 검색한 뒤\n"오늘 먹었어요"를 눌러 기록하세요',
  mealHistoryDelete: '기록 삭제',
  mealHistoryDeleteConfirm: '이 식사 기록을 삭제하시겠습니까?',
  logMealBtn: '오늘 먹었어요',
  mealLoggedBtn: '기록 완료!',
  mealLogged: '식사가 기록되었습니다.',
  mealLogFailed: '기록에 실패했습니다. 다시 시도해주세요.',
  logMealChooseDate: '식사 기록에 추가',
  logMealDateTitle: '언제 드셨나요?',
  logMealConfirm: '기록하기',

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

  // Restaurants feature
  searchFood: '음식',
  searchRestaurants: '식당',
  searchAnyLanguage: '어떤 언어로든 음식을 검색하세요',
  restaurantSearchPlaceholder: '식당 이름이나 주소로 검색...',
  restaurantFilterVegetarian: '채식',
  restaurantFilterHalal: '할랄',
  restaurantFilterGlutenFree: '글루텐 프리',
  restaurantAllRegions: '전체 지역',
  restaurantResults: '개의 결과',
  restaurantNoResults: '식당을 찾을 수 없습니다',
  restaurantNoResultsSub: '필터를 조정해 보세요',
  restaurantInfoNotAvailable: '정보 없음',
  restaurantWeekdays: '평일',
  restaurantWeekends: '주말',
  restaurantPhone: '전화',
  restaurantDirections: '길찾기',
  restaurantAddress: '주소',
  restaurantHours: '영업 시간',
  restaurantCouldNotOpenMaps: '지도를 열 수 없습니다',
  errorTitle: '오류',

  // Auth
  authTagline: '먹기 전에 확인하세요',
  splashTagline: '나만의 식품 안전 도우미',
  authSignInTab: '로그인',
  authSignUpTab: '회원가입',
  authEmailLabel: '이메일 주소',
  authEmailPlaceholder: 'your@email.com',
  authPasswordLabel: '비밀번호',
  authPasswordPlaceholder: '비밀번호를 입력하세요',
  authRememberMe: '이메일 기억하기',
  authLoginButton: '로그인',
  authNameLabel: '이름',
  authNamePlaceholder: '예: 신혜성',
  authPasswordPlaceholderSignUp: '최소 6자 이상',
  authCreateAccount: '계정 만들기',
  authLegalNote: '가입하시면 서비스 약관 및 개인정보 처리방침에 동의하는 것입니다.',
  authMissingInfoTitle: '입력 필요',
  authMissingInfoMsgSignIn: '이메일과 비밀번호를 입력해 주세요.',
  authMissingInfoMsgSignUp: '모든 항목을 입력해 주세요.',
  authWeakPasswordTitle: '비밀번호가 약합니다',
  authWeakPasswordMsg: '비밀번호는 최소 6자 이상이어야 합니다.',
  authSignInFailedTitle: '로그인 실패',
  authSignInFailedMsg: '이메일 또는 비밀번호가 올바르지 않습니다.',
  authSignUpFailedTitle: '회원가입 실패',
  authGenericErrorMsg: '문제가 발생했습니다.',

  // Permissions
  permissionRequiredTitle: '권한 필요',
  cameraPermissionMsg: '사진 촬영을 위해 카메라 접근 권한이 필요합니다.',
  photoLibraryPermissionMsg: '사진 라이브러리 접근 권한이 필요합니다.',
aiDisclaimerText: 'AI 분석은 숨겨진 성분(예: 육수, 소스, 기름 등)을 감지하지 못할 수 있습니다. 심각한 알레르기가 있는 경우 반드시 식당 직원에게 직접 확인하세요.',
  // Family profiles
  familyProfiles: '가족 프로필',
  familyProfilesTitle: '가족 프로필',
  familyProfilesSubtitle: '가족 구성원의 식이 프로필을 관리하세요',
  addFamilyMember: '가족 구성원 추가',
  editMember: '프로필 수정',
  deleteMember: '구성원 삭제',
  deleteMemberConfirm: '이 가족 구성원 프로필을 삭제하시겠습니까?',
  memberNameLabel: '이름',
  memberNamePlaceholder: '예: 엄마, 아빠, 아이...',
  memberAvatarLabel: '아바타 선택',
  saveMember: '구성원 저장',
  memberAdded: '구성원이 추가되었습니다!',
  memberUpdated: '구성원이 업데이트되었습니다!',
  noFamilyMembers: '가족 구성원이 없습니다',
  noFamilyMembersSub: '가족을 위한 프로필을 추가하면 음식을 대신 스캔할 수 있습니다',
  scanningFor: '스캔 대상:',
  switchProfile: '변경',
  meLabel: '나',
  heroTitle: '먹어도 될까요?',
  heroSub: '음식, 라벨, 메뉴를 스캔하면 즉시 결과를 알려드려요.',
  scanNow: '지금 스캔',
  yourDietProfile: '나의 식단 프로필',
  editProfile: '프로필 편집',
  myDietaryProfile: '나의 식단 프로필',
  noDietProfile: '식단 프로필이 없습니다',
  setUp: '설정하기',
  add: '추가',
  foodPassport: '음식 여권',
  myFoodPassport: '나의 음식 여권',
  passportSub: '직원이 어떤 언어로든 알레르기와 식단을 확인할 수 있어요.',
  family: '가족',
  qrPassportTitle: 'QR 여권',
  dietaryPassport: '식단 여권',
  scanToView: '내 식단 프로필을 보려면 스캔하세요',
  noRestrictions: '식단 제한 없음',
  shareMyProfile: '내 프로필 공유',
  qrPassportWebOnly: 'QR 여권은 모바일 앱에서 사용할 수 있습니다.',
  checkingFamily: '가족 구성원 확인 중…',
  shareLabel: '공유',
  familyCheck: '가족 확인',
  couldNotShareResult: '결과를 공유할 수 없습니다.',
  couldNotShareProfile: '프로필을 공유할 수 없습니다.',
  couldNotSaveProfile: '프로필을 저장할 수 없습니다. 다시 시도해 주세요.',
  couldNotSaveChanges: '변경 사항을 저장할 수 없습니다. 다시 시도해 주세요.',
  barcodeDetectedTitle: '📦 바코드 감지됨',
  barcodeNotInDb: '이 제품은 아직 데이터베이스에 없습니다. 라벨 스캔 모드로 성분표를 촬영해 보세요.',
  labelScanBtn: '라벨 스캔',
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
  modeFood: 'Foto de comida',
  modeFoodDesc: 'Identificar ingredientes',
  modeLabel: 'Etiqueta',
  modeLabelDesc: 'Escanear etiqueta del paquete',
  modeBarcode: 'Escanear código de barras',
  modeBarcodeDesc: 'Escanea un código de barras',
  barcodeScanning: 'Escaneando código de barras...',
  barcodeNotFound: 'Producto no encontrado. Intenta escanear la etiqueta.',
  barcodeSuccess: '¡Producto encontrado!',
  modeMenu: 'Escanear menú',
  modeMenuDesc: 'Analizar menú completo',
  menuScanNote: '⚠️ Advertencia: Los resultados de fotos de comida o menú se basan en recetas típicas y pueden no ser exactos. Use la búsqueda de etiquetas para resultados más precisos.',
  menuAnalysisTitle: 'Análisis del menú',
  menuItemCount: 'elementos encontrados',
  menuNoItems: 'No se detectaron elementos. Intenta con una foto más clara.',
  menuTapToExpand: 'Ver ingredientes',
  menuTranslation: 'Traducción',
  analyzingCompressing: 'Comprimiendo imagen...',
  analyzingAI: 'Analizando con IA...',
  analyzingProfile: 'Verificando ingredientes según tu perfil...',

  // Home screen extras
  createNewGroup: 'Nuevo Grupo',
  noFoodsInGroup: '¡Sin alimentos. Escanea algo!',
  deleteGroupConfirm: '¿Eliminar este grupo? Los alimentos pasarán a sin categoría.',
  removeFoodConfirm: '¿Eliminar este alimento de tus guardados?',

  // Meal history
  mealHistory: 'Historial',
  mealHistoryTitle: 'Historial de Comidas',
  mealHistorySubtitle: 'Registra lo que comes cada día',
  mealHistoryToday: 'Hoy',
  mealHistoryEmpty: 'Sin comidas registradas',
  mealHistoryEmptySub: 'Escanea o busca un alimento y toca\n"Lo comí hoy" para registrarlo',
  mealHistoryDelete: 'Eliminar Registro',
  mealHistoryDeleteConfirm: '¿Eliminar este registro de comida?',
  logMealBtn: 'Lo comí hoy',
  mealLoggedBtn: '¡Registrado!',
  mealLogged: 'Comida registrada en tu historial.',
  mealLogFailed: 'Error al registrar. Inténtalo de nuevo.',
  logMealChooseDate: 'Añadir al historial',
  logMealDateTitle: '¿Cuándo lo comiste?',
  logMealConfirm: 'Registrar',

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

  // Restaurants feature
  searchFood: 'Comida',
  searchRestaurants: 'Restaurantes',
  searchAnyLanguage: 'Busca cualquier comida en cualquier idioma',
  restaurantSearchPlaceholder: 'Buscar restaurantes por nombre o dirección...',
  restaurantFilterVegetarian: 'Vegetariano',
  restaurantFilterHalal: 'Halal',
  restaurantFilterGlutenFree: 'Sin Gluten',
  restaurantAllRegions: 'Todas las Regiones',
  restaurantResults: 'resultados',
  restaurantNoResults: 'No se encontraron restaurantes',
  restaurantNoResultsSub: 'Intenta ajustar los filtros',
  restaurantInfoNotAvailable: 'No disponible',
  restaurantWeekdays: 'Entre Semana',
  restaurantWeekends: 'Fin de Semana',
  restaurantPhone: 'Teléfono',
  restaurantDirections: 'Cómo Llegar',
  restaurantAddress: 'Dirección',
  restaurantHours: 'Horario',
  restaurantCouldNotOpenMaps: 'No se pudo abrir el mapa',
  errorTitle: 'Error',

  // Auth
  authTagline: 'Sabe antes de comer',
  splashTagline: 'Tu compañero personal de seguridad alimentaria',
  authSignInTab: 'Iniciar Sesión',
  authSignUpTab: 'Registrarse',
  authEmailLabel: 'Correo electrónico',
  authEmailPlaceholder: 'tu@email.com',
  authPasswordLabel: 'Contraseña',
  authPasswordPlaceholder: 'Tu contraseña',
  authRememberMe: 'Recordarme',
  authLoginButton: 'Entrar',
  authNameLabel: 'Tu Nombre',
  authNamePlaceholder: 'ej. Ana',
  authPasswordPlaceholderSignUp: 'Al menos 6 caracteres',
  authCreateAccount: 'Crear Cuenta',
  authLegalNote: 'Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad.',
  authMissingInfoTitle: 'Falta Información',
  authMissingInfoMsgSignIn: 'Por favor ingresa tu correo y contraseña.',
  authMissingInfoMsgSignUp: 'Por favor completa todos los campos.',
  authWeakPasswordTitle: 'Contraseña Débil',
  authWeakPasswordMsg: 'La contraseña debe tener al menos 6 caracteres.',
  authSignInFailedTitle: 'Error al Iniciar Sesión',
  authSignInFailedMsg: 'Correo o contraseña incorrectos.',
  authSignUpFailedTitle: 'Error al Registrarse',
  authGenericErrorMsg: 'Algo salió mal.',

  // Permissions
  permissionRequiredTitle: 'Permiso Requerido',
  cameraPermissionMsg: 'Se necesita acceso a la cámara para tomar fotos.',
  photoLibraryPermissionMsg: 'Se necesita acceso a la galería de fotos.',
aiDisclaimerText: 'El análisis de IA puede no detectar ingredientes ocultos (p. ej. caldos, salsas, aceites). Para alergias graves, siempre verifique directamente con el personal del restaurante.',
  // Family profiles
  familyProfiles: 'Perfiles Familiares',
  familyProfilesTitle: 'Perfiles Familiares',
  familyProfilesSubtitle: 'Gestiona los perfiles dietéticos de tu familia',
  addFamilyMember: 'Agregar Familiar',
  editMember: 'Editar Perfil',
  deleteMember: 'Eliminar Miembro',
  deleteMemberConfirm: '¿Eliminar este perfil familiar?',
  memberNameLabel: 'Nombre',
  memberNamePlaceholder: 'ej. Mamá, Papá, Bebé...',
  memberAvatarLabel: 'Elige un avatar',
  saveMember: 'Guardar Miembro',
  memberAdded: '¡Miembro agregado!',
  memberUpdated: '¡Miembro actualizado!',
  noFamilyMembers: 'Sin miembros familiares aún',
  noFamilyMembersSub: 'Agrega perfiles para escanear alimentos para tu familia',
  scanningFor: 'Escaneando para:',
  switchProfile: 'Cambiar',
  meLabel: 'Yo',
  heroTitle: '¿Puedo comerlo?',
  heroSub: 'Escanea un plato, etiqueta o menú y obtén un veredicto al instante.',
  scanNow: 'Escanear ahora',
  yourDietProfile: 'Tu perfil dietético',
  editProfile: 'Editar perfil',
  myDietaryProfile: 'Mi perfil dietético',
  noDietProfile: 'Sin perfil dietético',
  setUp: 'Configurar',
  add: 'Añadir',
  foodPassport: 'Pasaporte alimentario',
  myFoodPassport: 'Mi pasaporte alimentario',
  passportSub: 'El personal escanea tus alergias y dieta, en cualquier idioma.',
  family: 'Familia',
  qrPassportTitle: 'Pasaporte QR',
  dietaryPassport: 'Pasaporte Dietético',
  scanToView: 'Escanea para ver mi perfil dietético',
  noRestrictions: 'Sin restricciones dietéticas',
  shareMyProfile: 'Compartir mi perfil',
  qrPassportWebOnly: 'El pasaporte QR está disponible en la app móvil.',
  checkingFamily: 'Comprobando miembros de la familia…',
  shareLabel: 'Compartir',
  familyCheck: 'Verificación familiar',
  couldNotShareResult: 'No se pudo compartir el resultado.',
  couldNotShareProfile: 'No se pudo compartir el perfil.',
  couldNotSaveProfile: 'No se pudo guardar tu perfil. Inténtalo de nuevo.',
  couldNotSaveChanges: 'No se pudieron guardar los cambios. Inténtalo de nuevo.',
  barcodeDetectedTitle: '📦 Código de barras detectado',
  barcodeNotInDb: 'Este producto aún no está en nuestra base de datos. Prueba el modo Escaneo de etiqueta para fotografiar la lista de ingredientes.',
  labelScanBtn: 'Escaneo de etiqueta',
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
  modeFood: 'Photo de plat',
  modeFoodDesc: 'Identifier les ingrédients',
  modeLabel: 'Étiquette',
  modeLabelDesc: 'Scanner une étiquette',
  modeBarcode: 'Scanner le code-barres',
  modeBarcodeDesc: 'Scannez un code-barres produit',
  barcodeScanning: 'Scan du code-barres...',
  barcodeNotFound: "Produit introuvable. Essayez le scan d'étiquette.",
  barcodeSuccess: 'Produit trouvé !',
  modeMenu: 'Scanner le menu',
  modeMenuDesc: 'Analyser un menu complet',
  menuScanNote: '⚠️ Avertissement: Les résultats des photos de plats ou de menus sont basés sur des recettes typiques et peuvent ne pas être exacts. Utilisez la recherche par étiquette pour de meilleurs résultats.',
  menuAnalysisTitle: 'Analyse du menu',
  menuItemCount: 'plats trouvés',
  menuNoItems: 'Aucun plat détecté. Essayez une photo plus nette.',
  menuTapToExpand: 'Voir les ingrédients',
  menuTranslation: 'Traduction',
  analyzingCompressing: "Compression de l'image...",
  analyzingAI: 'Analyse par IA en cours...',
  analyzingProfile: 'Vérification des ingrédients selon votre profil...',

  // Home screen extras
  createNewGroup: 'Nouveau Groupe',
  noFoodsInGroup: 'Aucun aliment. Scannez quelque chose!',
  deleteGroupConfirm: 'Supprimer ce groupe? Les aliments seront déplacés vers non classifié.',
  removeFoodConfirm: 'Supprimer cet aliment de vos sauvegardes?',

  // Meal history
  mealHistory: 'Historique',
  mealHistoryTitle: 'Historique des Repas',
  mealHistorySubtitle: 'Suivez ce que vous mangez chaque jour',
  mealHistoryToday: "Aujourd'hui",
  mealHistoryEmpty: 'Aucun repas enregistré',
  mealHistoryEmptySub: 'Scannez ou cherchez un aliment et appuyez\nsur "Je l\'ai mangé" pour le noter',
  mealHistoryDelete: 'Supprimer le Repas',
  mealHistoryDeleteConfirm: 'Supprimer ce repas de votre historique?',
  logMealBtn: "Je l'ai mangé aujourd'hui",
  mealLoggedBtn: 'Noté!',
  mealLogged: 'Repas enregistré dans votre historique.',
  mealLogFailed: "Échec de l'enregistrement. Veuillez réessayer.",
  logMealChooseDate: "Ajouter à l'historique",
  logMealDateTitle: 'Quand avez-vous mangé ceci ?',
  logMealConfirm: 'Enregistrer',

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
  pref_mediterranean: 'Méditerranéen',
  pref_mediterranean_desc: "Huile d'olive, poisson, céréales complètes",
  pref_low_carb: 'Faible en Glucides',
  pref_low_carb_desc: 'Glucides réduits',
  pref_low_fat: 'Faible en Matières Grasses',
  pref_low_fat_desc: 'Apport en gras réduit',
  pref_high_protein: 'Riche en Protéines',
  pref_high_protein_desc: 'Développement musculaire, fitness',
  pref_dairy_free: 'Sans Produits Laitiers',
  pref_dairy_free_desc: 'Sans lactose, par choix',
  pref_gluten_free: 'Sans Gluten',
  pref_gluten_free_desc: 'Sans gluten, par choix',
  pref_low_fiber: 'Faible en Fibres',
  pref_low_fiber_desc: 'Facile à digérer',
  pref_none: 'Aucune Préférence',
  pref_none_desc: 'Je mange de tout',

  // Restaurants feature
  searchFood: 'Nourriture',
  searchRestaurants: 'Restaurants',
  searchAnyLanguage: "Cherchez n'importe quel aliment dans n'importe quelle langue",
  restaurantSearchPlaceholder: 'Rechercher par nom ou adresse...',
  restaurantFilterVegetarian: 'Végétarien',
  restaurantFilterHalal: 'Halal',
  restaurantFilterGlutenFree: 'Sans Gluten',
  restaurantAllRegions: 'Toutes les Régions',
  restaurantResults: 'résultats',
  restaurantNoResults: 'Aucun restaurant trouvé',
  restaurantNoResultsSub: "Essayez d'ajuster les filtres",
  restaurantInfoNotAvailable: 'Non disponible',
  restaurantWeekdays: 'En Semaine',
  restaurantWeekends: 'Week-end',
  restaurantPhone: 'Téléphone',
  restaurantDirections: 'Itinéraire',
  restaurantAddress: 'Adresse',
  restaurantHours: 'Horaires',
  restaurantCouldNotOpenMaps: "Impossible d'ouvrir la carte",
  errorTitle: 'Erreur',

  // Auth
  authTagline: 'Savoir avant de manger',
  splashTagline: 'Votre compagnon personnel de sécurité alimentaire',
  authSignInTab: 'Se Connecter',
  authSignUpTab: "S'Inscrire",
  authEmailLabel: 'Adresse e-mail',
  authEmailPlaceholder: 'votre@email.com',
  authPasswordLabel: 'Mot de passe',
  authPasswordPlaceholder: 'Votre mot de passe',
  authRememberMe: 'Se souvenir de moi',
  authLoginButton: 'Connexion',
  authNameLabel: 'Votre Nom',
  authNamePlaceholder: 'ex. Anna',
  authPasswordPlaceholderSignUp: 'Au moins 6 caractères',
  authCreateAccount: 'Créer un Compte',
  authLegalNote: "En vous inscrivant, vous acceptez nos Conditions d'Utilisation et notre Politique de Confidentialité.",
  authMissingInfoTitle: 'Informations Manquantes',
  authMissingInfoMsgSignIn: "Veuillez entrer votre e-mail et votre mot de passe.",
  authMissingInfoMsgSignUp: 'Veuillez remplir tous les champs.',
  authWeakPasswordTitle: 'Mot de Passe Faible',
  authWeakPasswordMsg: 'Le mot de passe doit comporter au moins 6 caractères.',
  authSignInFailedTitle: 'Échec de la Connexion',
  authSignInFailedMsg: 'E-mail ou mot de passe incorrect.',
  authSignUpFailedTitle: "Échec de l'Inscription",
  authGenericErrorMsg: "Une erreur s'est produite.",

  // Permissions
  permissionRequiredTitle: 'Autorisation Requise',
  cameraPermissionMsg: "L'accès à la caméra est nécessaire pour prendre des photos.",
  photoLibraryPermissionMsg: "L'accès à la galerie de photos est nécessaire.",
aiDisclaimerText: "L'analyse IA peut ne pas détecter les ingrédients cachés (ex. bouillons, sauces, huiles). En cas d'allergie grave, vérifiez toujours directement auprès du personnel du restaurant.",
  // Family profiles
  familyProfiles: 'Profils Familiaux',
  familyProfilesTitle: 'Profils Familiaux',
  familyProfilesSubtitle: 'Gérez les profils alimentaires de votre famille',
  addFamilyMember: 'Ajouter un Membre',
  editMember: 'Modifier le Profil',
  deleteMember: 'Supprimer le Membre',
  deleteMemberConfirm: 'Supprimer ce profil familial?',
  memberNameLabel: 'Nom',
  memberNamePlaceholder: 'ex. Maman, Papa, Bébé...',
  memberAvatarLabel: 'Choisir un avatar',
  saveMember: 'Enregistrer le Membre',
  memberAdded: 'Membre ajouté!',
  memberUpdated: 'Membre mis à jour!',
  noFamilyMembers: 'Aucun membre familial',
  noFamilyMembersSub: 'Ajoutez des profils pour scanner des aliments pour votre famille',
  scanningFor: 'Scan pour:',
  switchProfile: 'Changer',
  meLabel: 'Moi',
  heroTitle: 'Puis-je le manger ?',
  heroSub: 'Scannez un plat, une étiquette ou un menu pour un verdict instantané.',
  scanNow: 'Scanner',
  yourDietProfile: 'Votre profil alimentaire',
  editProfile: 'Modifier le profil',
  myDietaryProfile: 'Mon profil alimentaire',
  noDietProfile: 'Aucun profil alimentaire',
  setUp: 'Configurer',
  add: 'Ajouter',
  foodPassport: 'Passeport alimentaire',
  myFoodPassport: 'Mon passeport alimentaire',
  passportSub: 'Le personnel scanne vos allergies et votre régime, en toute langue.',
  family: 'Famille',
  qrPassportTitle: 'Passeport QR',
  dietaryPassport: 'Passeport Alimentaire',
  scanToView: 'Scannez pour voir mon profil alimentaire',
  noRestrictions: 'Aucune restriction alimentaire',
  shareMyProfile: 'Partager mon profil',
  qrPassportWebOnly: 'Le passeport QR est disponible sur l\'app mobile.',
  checkingFamily: 'Vérification des membres de la famille…',
  shareLabel: 'Partager',
  familyCheck: 'Vérification familiale',
  couldNotShareResult: 'Impossible de partager le résultat.',
  couldNotShareProfile: 'Impossible de partager le profil.',
  couldNotSaveProfile: 'Impossible d\'enregistrer votre profil. Veuillez réessayer.',
  couldNotSaveChanges: 'Impossible d\'enregistrer les modifications. Veuillez réessayer.',
  barcodeDetectedTitle: '📦 Code-barres détecté',
  barcodeNotInDb: "Ce produit n'est pas encore dans notre base de données. Essayez le mode Scan d'étiquette pour photographier la liste des ingrédients.",
  labelScanBtn: "Scan d'étiquette",
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
  modeFood: '料理写真',
  modeFoodDesc: '料理の食材を確認',
  modeLabel: 'ラベルスキャン',
  modeLabelDesc: 'パッケージラベルをスキャン',
  modeBarcode: 'バーコードスキャン',
  modeBarcodeDesc: '商品のバーコードをスキャン',
  barcodeScanning: 'バーコードをスキャン中...',
  barcodeNotFound: '商品が見つかりません。ラベルスキャンをお試しください。',
  barcodeSuccess: '商品が見つかりました！',
  modeMenu: 'メニュースキャン',
  modeMenuDesc: 'メニュー全体を分析',
  menuScanNote: '⚠️ 注意: 料理やメニュー写真の結果は一般的なレシピに基づいており、正確でない場合があります。最も正確な結果はフードラベル検索をご利用ください。',
  menuAnalysisTitle: 'メニュー分析',
  menuItemCount: '件のメニューを検出',
  menuNoItems: 'メニューが検出されませんでした。鮮明な写真をお試しください。',
  menuTapToExpand: '食材を見る',
  menuTranslation: '翻訳',
  analyzingCompressing: '画像を圧縮中...',
  analyzingAI: 'AIで分析中...',
  analyzingProfile: '食事プロファイルに基づいて成分を確認中...',

  // Home screen extras
  createNewGroup: '新しいグループ',
  noFoodsInGroup: '食品なし。スキャンしてみて！',
  deleteGroupConfirm: 'このグループを削除しますか？食品は未分類に移動します。',
  removeFoodConfirm: 'この食品を保存済みリストから削除しますか？',

  // Meal history
  mealHistory: '記録',
  mealHistoryTitle: '食事記録',
  mealHistorySubtitle: '毎日の食事を記録しましょう',
  mealHistoryToday: '今日',
  mealHistoryEmpty: '記録がありません',
  mealHistoryEmptySub: '食品をスキャンまたは検索して\n「今日食べた」を押して記録してください',
  mealHistoryDelete: '記録を削除',
  mealHistoryDeleteConfirm: 'この食事記録を削除しますか？',
  logMealBtn: '今日食べた',
  mealLoggedBtn: '記録済み！',
  mealLogged: '食事が記録されました。',
  mealLogFailed: '記録に失敗しました。もう一度お試しください。',
  logMealChooseDate: '食事履歴に追加',
  logMealDateTitle: 'いつ食べましたか？',
  logMealConfirm: '記録する',

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
  pref_mediterranean: '地中海式',
  pref_mediterranean_desc: 'オリーブオイル、魚、全粒穀物',
  pref_low_carb: '低炭水化物',
  pref_low_carb_desc: '炭水化物を減らす',
  pref_low_fat: '低脂肪',
  pref_low_fat_desc: '脂肪摂取を減らす',
  pref_high_protein: '高タンパク',
  pref_high_protein_desc: '筋肉増強、フィットネス',
  pref_dairy_free: '乳製品なし',
  pref_dairy_free_desc: '選択的に乳製品を除外',
  pref_gluten_free: 'グルテンフリー',
  pref_gluten_free_desc: '選択的にグルテンを除外',
  pref_low_fiber: '低食物繊維',
  pref_low_fiber_desc: '消化に優しい',
  pref_none: '制限なし',
  pref_none_desc: '何でも食べられる',

  // Restaurants feature
  searchFood: '食品',
  searchRestaurants: 'レストラン',
  searchAnyLanguage: 'どの言語でも食品を検索できます',
  restaurantSearchPlaceholder: '名前や住所で検索...',
  restaurantFilterVegetarian: 'ベジタリアン',
  restaurantFilterHalal: 'ハラール',
  restaurantFilterGlutenFree: 'グルテンフリー',
  restaurantAllRegions: 'すべての地域',
  restaurantResults: '件の結果',
  restaurantNoResults: 'レストランが見つかりません',
  restaurantNoResultsSub: 'フィルターを調整してみてください',
  restaurantInfoNotAvailable: '情報なし',
  restaurantWeekdays: '平日',
  restaurantWeekends: '週末',
  restaurantPhone: '電話',
  restaurantDirections: '経路を表示',
  restaurantAddress: '住所',
  restaurantHours: '営業時間',
  restaurantCouldNotOpenMaps: '地図を開けませんでした',
  errorTitle: 'エラー',

  // Auth
  authTagline: '食べる前に知る',
  splashTagline: 'あなたのための食品安全アシスタント',
  authSignInTab: 'サインイン',
  authSignUpTab: '新規登録',
  authEmailLabel: 'メールアドレス',
  authEmailPlaceholder: 'your@email.com',
  authPasswordLabel: 'パスワード',
  authPasswordPlaceholder: 'パスワードを入力',
  authRememberMe: 'メールを記憶する',
  authLoginButton: 'ログイン',
  authNameLabel: 'お名前',
  authNamePlaceholder: '例: 田中',
  authPasswordPlaceholderSignUp: '6文字以上',
  authCreateAccount: 'アカウントを作成',
  authLegalNote: '登録すると、利用規約とプライバシーポリシーに同意したものとみなされます。',
  authMissingInfoTitle: '入力が必要です',
  authMissingInfoMsgSignIn: 'メールアドレスとパスワードを入力してください。',
  authMissingInfoMsgSignUp: 'すべての項目を入力してください。',
  authWeakPasswordTitle: 'パスワードが弱いです',
  authWeakPasswordMsg: 'パスワードは6文字以上である必要があります。',
  authSignInFailedTitle: 'サインインに失敗しました',
  authSignInFailedMsg: 'メールアドレスまたはパスワードが正しくありません。',
  authSignUpFailedTitle: '登録に失敗しました',
  authGenericErrorMsg: '問題が発生しました。',

  // Permissions
  permissionRequiredTitle: '権限が必要です',
  cameraPermissionMsg: '写真を撮影するためにカメラへのアクセスが必要です。',
  photoLibraryPermissionMsg: '写真ライブラリへのアクセスが必要です。',
aiDisclaimerText: 'AI分析では隠れた成分（例：だし、ソース、油など）を検出できない場合があります。重篤なアレルギーがある場合は、必ずレストランのスタッフに直接確認してください。',
  // Family profiles
  familyProfiles: '家族プロフィール',
  familyProfilesTitle: '家族プロフィール',
  familyProfilesSubtitle: '家族の食事プロフィールを管理',
  addFamilyMember: '家族を追加',
  editMember: 'プロフィール編集',
  deleteMember: 'メンバーを削除',
  deleteMemberConfirm: 'この家族プロフィールを削除しますか？',
  memberNameLabel: '名前',
  memberNamePlaceholder: '例: お母さん、お父さん、子供...',
  memberAvatarLabel: 'アバターを選択',
  saveMember: 'メンバーを保存',
  memberAdded: 'メンバーが追加されました！',
  memberUpdated: 'メンバーが更新されました！',
  noFamilyMembers: '家族メンバーがいません',
  noFamilyMembersSub: '家族のプロフィールを追加して、食品をスキャンしましょう',
  scanningFor: 'スキャン対象:',
  switchProfile: '切替',
  meLabel: '自分',
  heroTitle: '食べても大丈夫？',
  heroSub: '料理・ラベル・メニューをスキャンして、すぐに判定。',
  scanNow: 'スキャン',
  yourDietProfile: '食事プロフィール',
  editProfile: 'プロフィール編集',
  myDietaryProfile: '私の食事プロフィール',
  noDietProfile: '食事プロフィール未設定',
  setUp: '設定する',
  add: '追加',
  foodPassport: 'フードパスポート',
  myFoodPassport: '私のフードパスポート',
  passportSub: 'スタッフがどの言語でもアレルギーと食事を確認できます。',
  family: '家族',
  qrPassportTitle: 'QRパスポート',
  dietaryPassport: '食事パスポート',
  scanToView: 'スキャンして食事プロフィールを表示',
  noRestrictions: '食事制限なし',
  shareMyProfile: 'プロフィールを共有',
  qrPassportWebOnly: 'QRパスポートはモバイルアプリで利用できます。',
  checkingFamily: '家族メンバーを確認中…',
  shareLabel: '共有',
  familyCheck: '家族チェック',
  couldNotShareResult: '結果を共有できませんでした。',
  couldNotShareProfile: 'プロフィールを共有できませんでした。',
  couldNotSaveProfile: 'プロフィールを保存できませんでした。もう一度お試しください。',
  couldNotSaveChanges: '変更を保存できませんでした。もう一度お試しください。',
  barcodeDetectedTitle: '📦 バーコードを検出',
  barcodeNotInDb: 'この製品はまだデータベースにありません。ラベルスキャンモードで原材料表を撮影してみてください。',
  labelScanBtn: 'ラベルスキャン',
};

export const TRANSLATIONS: Record<AppLanguage, TranslationKeys> = { en, ko, es, fr, ja };

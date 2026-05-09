/**
 * Shape of a single restaurant in `data/restaurants.json`.
 *
 * Source: 한국문화정보원 전국 세계 음식점 데이터 (2022-11-30).
 * Generated from `data/raw_restaurants.csv`.
 *
 * Empty / missing string fields are stored as `''` or `'정보없음'`
 * (the dataset's own "no info" sentinel). The detail screen's
 * `isInfoAvailable()` helper handles both.
 */
export type Restaurant = {
  /** Restaurant name (시설명). */
  name: string;

  /** Cuisine category (카테고리3 if specific, else 카테고리2). */
  category: string;

  /** Road-name address (도로명주소). */
  address: string;

  /** District within the region (시군구 명칭) — e.g. "안산시 단원구". */
  district: string;

  /** Top-level region (시도 명칭) — e.g. "경기도", "서울특별시". */
  region: string;

  /** Weekday opening hours (평일 운영시간). May be '정보없음'. */
  weekdayHours: string;

  /** Weekend opening hours (주말 운영시간). May be '정보없음'. */
  weekendHours: string;

  /** Phone number (전화번호). May be empty string. */
  phone: string;

  /** Has vegetarian menu (채식메뉴 보유여부). */
  vegetarian: boolean;

  /** Halal-certified or halal menu (할랄음식 여부). */
  halal: boolean;

  /** Gluten-free menu (글루텐프리 음식여부). */
  glutenFree: boolean;
};

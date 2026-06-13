/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * Bu fayl Product (mahsulot) uchun TypeScript enum larini saqlaydi.
 * Enum — bir guruh doimiy qiymatlarni nomlash usuli. Bu yerda
 * mahsulotning o'lchami, hajmi, holati va kategoriyasi belgilanadi.
 * Schema va Service qatlamlari shu enumlardan foydalanadi.
 * ──────────────────────────────────────────────────────────────────
 */

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * ProductSize — mahsulotning fizik o'lchamini belgilaydi.
 * SMALL, NORMAL, LARGE, SET — to'rt xil o'lcham varianti.
 * Schema da enum: ProductSize deb ko'rsatiladi.
 * ──────────────────────────────────────────────────────────────────
 */
export enum ProductSize {
  SMALL = 'SMALL',
  NORMAL = 'NORMAL',
  LARGE = 'LARGE',
  SET = 'SET',
}

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * ProductVolume — mahsulotning hajmini litrda belgilaydi.
 * Raqamli enum: qiymatlari string emas, float son (0.5, 1, 1.2...).
 * Asosan ichimliklar uchun ishlatiladi.
 * ──────────────────────────────────────────────────────────────────
 */
export enum ProductVolume {
  HALF = 0.5,
  ONE = 1,
  ONE_POINT_TWO = 1.2,
  ONE_POINT_FIVE = 1.5,
  TWO = 2,
}

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * ProductStatus — mahsulotning hozirgi holatini belgilaydi.
 * PAUSE: ko'rsatilmaydi, PROCESS: aktiv, DELETE: o'chirilgan.
 * Schema da default: ProductStatus.PAUSE deb belgilangan.
 * ──────────────────────────────────────────────────────────────────
 */
export enum ProductStatus {
  PAUSE = 'PAUSE',
  PROCESS = 'PROCESS',
  DELETE = 'DELETE',
}

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * ProductCollection — mahsulotning kategoriyasini belgilaydi.
 * DISH: taom, SALAD: salat, DESSERT: shirinlik,
 * DRINK: ichimlik, OTHER: boshqa. Schema da required: true.
 * ──────────────────────────────────────────────────────────────────
 */
export enum ProductCollection {
  DISH = 'DISH',
  SALAD = 'SALAD',
  DESSERT = 'DESSERT',
  DRINK = 'DRINK',
  OTHER = 'OTHER',
}

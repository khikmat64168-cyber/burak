/**
 * ┌─────────┐
 *  │ PHASE 5 │ ─── KOD KETMA-KETLIK OQIMI
 *  └─────────┘
 *  ─── KOD TAHLILI ──────────────────────────────────────────────────
 *  Bu fayl Product uchun Service qatlamini ifodalaydi.
 *  Controller dan kelgan ma'lumotlarni qayta ishlaydi va
 *  ProductModel (schema) orqali MongoDB bilan muloqot qiladi.
 *  Oqim: router-admin.ts → product.controller.ts → [Product.service.ts] → Product.model.ts
 *  ──────────────────────────────────────────────────────────────────
 */

import ProductModel from '../schema/Product.model';

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * ProductService — class ko'rinishida tashkil etilgan service qatlami.
 * private readonly productModel — faqat constructor ichida bir marta
 * qiymat olib, keyinchalik o'zgartirib bo'lmaydi (readonly).
 * constructor() da ProductModel (Mongoose modeli) inject qilinadi.
 * ──────────────────────────────────────────────────────────────────
 */
class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  }
}

export default ProductService;

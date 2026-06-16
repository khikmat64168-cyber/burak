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

import { shapeIntoMongooseObjectId } from '../libs/types/config';
import Errors, { HttpCode, Message } from '../libs/types/Errors';
import {
  Product,
  ProductInput,
  ProductUpdateInput,
} from '../libs/types/product';
import ProductModel from '../schema/Product.model';

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * ProductService — class ko'rinishida tashkil etilgan service qatlami.
 * private readonly productModel — faqat constructor ichida bir marta
 * qiymat olib, keyinchalik o'zgartirib bo'lmaydi (readonly).
 * constructor() da ProductModel (Mongoose modeli) inject qilinadi.
 * ──────────────────────────────────────────────────────────────────
 */
class ProductService { // #define — product.controllers.ts da new ProductService() qilib chaqiriladi
  private readonly productModel; // #define — faqat shu class ichida ishlatiladi (private)

  constructor() {
    this.productModel = ProductModel; // #call — Product.model.ts dan import qilingan model
  }

  /** SPA */

  /** SPA */
  public async getAllProducts(): Promise<Product[]> { // #define — #call: product.controllers.ts getAllProducts da chaqiriladi
    const result = await this.productModel.find().exec(); // #call — Product.model.ts (MongoDB): barcha mahsulotlarni qaytaradi
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND); // #call — Errors.ts dan

    console.log('result:', result);
    return result;
  }

  public async createNewProduct(input: ProductInput): Promise<Product> { // #define — #call: product.controllers.ts createNewProduct da chaqiriladi
    try {
      return await this.productModel.create(input); // #call — Product.model.ts (MongoDB): yangi mahsulot yozadi
    } catch (err) {
      console.error('ERROR, model: createNewProduct: ', err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED); // #call — Errors.ts dan
    }
  }

  public async updateChosenProduct( // #define — #call: product.controllers.ts updateChosenProduct da chaqiriladi
    id: string,
    input: ProductUpdateInput,
  ): Promise<Product> {
    id = shapeIntoMongooseObjectId(id); // #call — config.ts dan: string → ObjectId ga aylantiradi
    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, input, { new: true }) // #call — Product.model.ts (MongoDB): topib yangilaydi
      .exec();
    if (!result) throw new Errors(HttpCode.BAD_REQUEST, Message.UPDATE_FAILED); // #call — Errors.ts dan

    console.log('result:', result);
    return result;
  }
}

export default ProductService;

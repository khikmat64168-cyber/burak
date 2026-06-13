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
class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  }

  /** SPA */

  /** SPA */

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input);
    } catch (err) {
      console.error('ERROR, model: createNewProduct: ', err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateChosenProduct(
    id: string,
    input: ProductUpdateInput,
  ): Promise<Product> {
    //string => objectid
    id = shapeIntoMongooseObjectId(id);
    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.BAD_REQUEST, Message.UPDATE_FAILED);

    console.log('result:', result);
    return result;
  }
}

export default ProductService;

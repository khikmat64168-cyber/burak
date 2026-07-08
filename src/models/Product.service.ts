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

import { T } from '../libs/types/common';
import { shapeIntoMongooseObjectId } from '../libs/types/config';
import { ProductStatus } from '../libs/types/enums/product.enum';
import Errors, { HttpCode, Message } from '../libs/types/Errors';
import {
  Product,
  ProductInput,
  ProductInquery,
  ProductUpdateInput,
} from '../libs/types/product';
import ProductModel from '../schema/Product.model';
import { ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import ViewService from './View.service';
import { View, ViewInput } from '../libs/types/view';
import { ViewGroup } from '../libs/types/enums/view.enum';

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * ProductService — class ko'rinishida tashkil etilgan service qatlami.
 * private readonly productModel — faqat constructor ichida bir marta
 * qiymat olib, keyinchalik o'zgartirib bo'lmaydi (readonly).
 * constructor() da ProductModel (Mongoose modeli) inject qilinadi.
 * ──────────────────────────────────────────────────────────────────
 */
class ProductService {
  // #define — product.controllers.ts da new ProductService() qilib chaqiriladi
  private readonly productModel; // #define — faqat shu class ichida ishlatiladi (private)
  public viewService;

  constructor() {
    this.productModel = ProductModel; // #call — Product.model.ts dan import qilingan model
    this.viewService = new ViewService();
  }

  /** SPA */
  public async getProducts(inquery: ProductInquery): Promise<Product[]> {
    console.log('inquery:', inquery);
    const match: T = { productStatus: ProductStatus.PROCESS }; // #define — MongoDB match: productStatus bo'yicha filter
    if (inquery.productCollection)
      match.productCollection = inquery.productCollection; // #call — MongoDB match: productCollection bo'yicha filter
    if (inquery.search) {
      match.productName = { $regex: inquery.search, $options: 'i' }; // #call — MongoDB regex: case-insensitive search
    }
    const sort: T =
      inquery.order === 'fproductPrice'
        ? { [inquery.order]: 1 }
        : { [inquery.order]: -1 }; // #define — MongoDB sort: productPrice bo'yicha o'sish tartibi, boshqa maydonlar bo'yicha kamayish tartibi

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquery.page * 1 - 1) * inquery.limit }, // 1 => 0, 2 => 3, 3 => 6
        { $limit: inquery.limit * 1 }, // 3  => 4,5,6
      ])
      .exec(); // #call — Product.model.ts (MongoDB): barcha mahsulotlarni qaytaradi
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND); // #call — Errors.ts dan
    return result;
  }

  public async getProduct(
    memberId: ObjectId | null,
    id: string,
  ): Promise<void> {
    const productId = shapeIntoMongooseObjectId(id);
    let result = await this.productModel
      .findOne({
        _id: productId,
        productStatus: ProductStatus.PROCESS,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (memberId) {
      //Check existence

      const input: ViewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
      const existView = await this.viewService.checkViewExistence(input);

      console.log('exist:', !!existView);
      if (!existView) {
        //Insert New view log

        console.log('PLANNING TO INSERT A NEW VIEW  ');
        await this.viewService.insertMemberView(input);
      }

      //Increase Counts
      result = await this.productModel
        .findByIdAndUpdate(
          productId,
          { $inc: { productViews: +1 } },
          { new: true },
        )
        .exec();
    }

    //TO DO : If authenticated users => first => view log creation

    return result;
  }

  /** SSR */
  public async getAllProducts(): Promise<Product[]> {
    // #define — #call: product.controllers.ts getAllProducts da chaqiriladi
    const result = await this.productModel.find().exec(); // #call — Product.model.ts (MongoDB): barcha mahsulotlarni qaytaradi
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND); // #call — Errors.ts dan

    console.log('result:', result);
    return result;
  }

  public async createNewProduct(input: ProductInput): Promise<Product> {
    // #define — #call: product.controllers.ts createNewProduct da chaqiriladi
    try {
      return await this.productModel.create(input); // #call — Product.model.ts (MongoDB): yangi mahsulot yozadi
    } catch (err) {
      console.error('ERROR, model: createNewProduct: ', err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED); // #call — Errors.ts dan
    }
  }

  public async updateChosenProduct(
    // #define — #call: product.controllers.ts updateChosenProduct da chaqiriladi
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

/**
 * ┌─────────┐
 *  │ PHASE 4 │ ─── KOD KETMA-KETLIK OQIMI
 *  └─────────┘
 *  ─── KOD TAHLILI ──────────────────────────────────────────────────
 *  Bu fayl Product (mahsulot) uchun Controller vazifasini bajaradi.
 *  Router dan kelgan so'rovlarni qabul qilib, biznes logikani
 *  ProductService ga uzatadi va natijani clientga qaytaradi.
 *  Oqim: router-admin.ts → [product.controllers.ts] → Product.service.ts → schema
 *  ──────────────────────────────────────────────────────────────────
 */

import { Request, Response } from 'express';

import Errors, { HttpCode, Message } from '../libs/types/Errors';
import { T } from '../libs/types/common';
import ProductService from '../models/Product.service';
import { AdminRequest } from '../libs/types/members';
import { ProductInput } from '../libs/types/product';

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * productService — ProductService classidan instance yaratiladi.
 * productController — T tipidagi bo'sh object. Unga metodlar
 * property sifatida assign qilinadi (restaurantController bilan
 * bir xil pattern).
 * ──────────────────────────────────────────────────────────────────
 */
const productService = new ProductService();

const productController: T = {};
/** SPA */

/** SSR */

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * getAllProducts — GET /admin/product/all so'rovini qayta ishlaydi.
 * verifyRestaurant middleware dan o'tib kelgan req da req.member
 * mavjud bo'ladi (kim so'rov qilayotgani ma'lum).
 * res.render('products') — products.ejs sahifasini render qiladi.
 * ──────────────────────────────────────────────────────────────────
 */
productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log('getAllProducts');
    const data = await productService.getAllProducts();
    console.log('data:', data);

    res.render('products', { products: data });
  } catch (err) {
    console.log('Error, getAllProducts:', err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json;
  }
};

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * createNewProduct — POST /admin/product/create so'rovini qayta
 * ishlaydi. makeUploader('products').any() middleware dan keyin
 * ishlaydi — ya'ni req.files ichida yuklangan rasm ma'lumotlari
 * mavjud bo'ladi. Hozircha faqat 'DONE' qaytaradi (TODO).
 * ──────────────────────────────────────────────────────────────────
 */
productController.createNewProduct = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log('createNewProduct');
    console.log('req.files:', req.files);
    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const data: ProductInput = req.body;
    data.productImages = req.files?.map((ele) => {
      return ele.path.replace(/\\/g, '/');
    });

    await productService.createNewProduct(data);
    console.log('date:', data);
    res.send(
      `<script> alert ("Successful creation"); window.location.replace('admin/product/all') </script>`,
    );
  } catch (err) {
    console.log('Error, createNewProduct:', err);

    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    // if (err instanceof Errors) res.status(err.code).json(err);
    // else res.status(Errors.standard.code).json;
    res.send(
      `<script> alert ("${message}"); window.location.replace('admin/product/all') </script>`,
    );
  }
};

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * updateChosenProduct — POST /admin/product/:id so'rovini qayta
 * ishlaydi. makeUploader('products').any() orqali bir nechta
 * rasm yuklash imkoni bor. req.params.id dan mahsulot IDsi olinadi.
 * ──────────────────────────────────────────────────────────────────
 */
productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    console.log('updateChosenProduct');
    const id = req.params.id as string;
    console.log('id:', id);

    const result = await productService.updateChosenProduct(id, req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log('Error, updateChosenProduct:', err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json;
  }
};

export default productController;

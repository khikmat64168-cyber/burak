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
import { ProductInput, ProductInquery } from '../libs/types/product';
import { ProductCollection } from '../libs/types/enums/product.enum';

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * productService — ProductService classidan instance yaratiladi.
 * productController — T tipidagi bo'sh object. Unga metodlar
 * property sifatida assign qilinadi (restaurantController bilan
 * bir xil pattern).
 * ──────────────────────────────────────────────────────────────────
 */
const productService = new ProductService(); // #call — Product.service.ts dan instance yaratildi

const productController: T = {}; // #define — router-admin.ts da import qilib ishlatiladi
/** SPA */
productController.getProducts = async (req: Request, res: Response) => {
  try {
    console.log('getProducts');
    // const query = req.query;
    // console.log('req.query:', query);

    // const params = req.params;
    // console.log('req.params:', params);

    const { page, limit, order, productCollection, search } = req.query;

    const inquery: ProductInquery = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };
    if (productCollection)
      inquery.productCollection = productCollection as ProductCollection;
    if (search) inquery.search = String(search);

    const result = await productService.getProducts(inquery); // #call — Product.service.ts getProducts metodini chaqiradi

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log('Error, getProducts:', err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json;
  }
};
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
  // #define — #call: router-admin.ts GET '/product/all' da chaqiriladi
  try {
    console.log('getAllProducts');
    const data = await productService.getAllProducts(); // #call — Product.service.ts getAllProducts metodini chaqiradi
    console.log('data:', data);

    res.render('products', { products: data }); // #call — products.ejs sahifasini render qiladi
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
  // #define — #call: router-admin.ts POST '/product/create' da chaqiriladi
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

    await productService.createNewProduct(data); // #call — Product.service.ts createNewProduct metodini chaqiradi
    console.log('date:', data);
    /**
     * ─── KOD TAHLILI ──────────────────────────────────────────────────
     * Muvaffaqiyatli yaratilgach, brauzerga alert + redirect skripti
     * yuboriladi. window.location.replace('/admin/product/all') —
     * yo'l '/' bilan boshlangani uchun ABSOLYUT: domen ildizidan
     * hisoblanadi. Agar '/' bo'lmasa (nisbiy 'admin/product/all'), u
     * joriy /admin/product/create sahifasiga qo'shilib,
     * /admin/product/admin/product/all → 404 xatosini berardi.
     * ──────────────────────────────────────────────────────────────────
     */
    res.send(
      `<script> alert ("Successful creation"); window.location.replace('/admin/product/all') </script>`,
    );
  } catch (err) {
    console.log('Error, createNewProduct:', err);

    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    // if (err instanceof Errors) res.status(err.code).json(err);
    // else res.status(Errors.standard.code).json;
    res.send(
      `<script> alert ("${message}"); window.location.replace('/admin/product/all') </script>`,
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
  // #define — #call: router-admin.ts POST '/product/:id' da chaqiriladi
  try {
    console.log('updateChosenProduct');
    const id = req.params.id as string; // URL dagi :id parametrini string sifatida oladi
    console.log('id:', id);

    const result = await productService.updateChosenProduct(id, req.body); // #call — Product.service.ts updateChosenProduct metodini chaqiradi

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log('Error, updateChosenProduct:', err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json;
  }
};

export default productController;

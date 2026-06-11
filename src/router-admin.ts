/**
 * ┌─────────┐
 *  │ PHASE 3 │ ─── KOD KETMA-KETLIK OQIMI
 *  └─────────┘
 *  ─── KOD TAHLILI ──────────────────────────────────────────────────
 *  Bu fayl /admin prefiksli so'rovlarni boshqaradi (SSR — EJS).
 *  app.ts dan kelgan so'rovlarni qabul qilib, tegishli
 *  controller metodlariga yo'naltiradi.
 *  Oqim: server.ts → app.ts → [router-admin.ts] → controller → service → schema
 *  ──────────────────────────────────────────────────────────────────
 */

import express, { Request, Response } from 'express';
const routerAdmin = express.Router();
import restaurantController from './controllers/restaurant.controller';
import productController from './controllers/product.controllers';
import makeUploader from './libs/types/utils/uploader';

/****************** Restaurant   ********************/

routerAdmin.get(
  '/',
  //    (req: Request, res: Response) => {
  //   res.send('Home page');
  // });
  restaurantController.goHome,
);

routerAdmin
  .get(
    '/signup',

    //   (req: Request, res: Response) => {
    //   res.send('Login page');
    // });
    restaurantController.getSignup,
  )
  .post(
    '/signup',
    makeUploader('members').any(),
    restaurantController.processSignup,
  );

routerAdmin
  .get(
    '/login',

    //   (req: Request, res: Response) => {
    //   res.send('Login page');
    // });
    restaurantController.getLogin,
  )
  .post(
    '/login',
    //    (req: Request, res: Response) => {
    //   res.send('Signup page');
    // });
    restaurantController.processLogin,
  );

routerAdmin.get('/logout', restaurantController.logout);

routerAdmin.get('/check-me', restaurantController.checkAuthSession);

/** Product   */

routerAdmin.get(
  '/product/all',
  restaurantController.verifyRestaurant,
  productController.getAllProducts,
);

routerAdmin.post(
  '/product/create',
  restaurantController.verifyRestaurant,
  // uploadProductImage.single('productImage'),
  makeUploader('products').any(),
  productController.createNewProduct,
);

routerAdmin.post(
  '/product/:id ',
  restaurantController.verifyRestaurant,
  makeUploader('products').any(),
  productController.updateChosenProduct,
);

/** User */
export default routerAdmin;

/**
 * ┌─────────┐
 *  │ PHASE 3 │ ─── KOD KETMA-KETLIK OQIMI
 *  └─────────┘
 *  ─── KOD TAHLILI ──────────────────────────────────────────────────
 *  Bu fayl / prefiksli so'rovlarni boshqaradi (SPA — React uchun).
 *  app.ts dan kelgan foydalanuvchi so'rovlarini qabul qilib,
 *  memberController metodlariga yo'naltiradi.
 *  Oqim: server.ts → app.ts → [router.ts] → controller → service → schema
 *  ──────────────────────────────────────────────────────────────────
 */

import express, { Request, Response } from 'express';
import uploader from './libs/types/utils/uploader';
const router = express.Router();
import memberController from './controllers/member.controller';
import productController from './controllers/product.controllers';
import orderController from './controllers/order.controller';
// router.get(
//   '/',
//   //    (req: Request, res: Response) => {
//   //   res.send('Home page');
//   // });
//   memberController.goHome,
// );

// router.get(
//   '/login',

//   //   (req: Request, res: Response) => {
//   //   res.send('Login page');
//   // });
//   memberController.getLogin,
// );

// router.get(
//   '/signup',
//   //    (req: Request, res: Response) => {
//   //   res.send('Signup page');
//   // });
//   memberController.getSignup,
// );

/** Member */
router.get('/member/restaurant', memberController.getRestaurant);
router.post('/member/signup', memberController.signup);

router.post('/member/login', memberController.login);

router.post(
  '/member/logout',
  memberController.verifyAuth,
  memberController.logout,
);

router.get(
  '/member/detail',
  memberController.verifyAuth,
  memberController.getMemberDetail,
);

router.post(
  '/member/update',
  memberController.verifyAuth,
  uploader('members').single('memberImage'),
  memberController.updateMember,
);

router.get('/member/top-users', memberController.getTopUsers);

/**. Product */

router.get('/product/all', productController.getProducts);
router.get(
  '/product/:id',
  memberController.retrieveAuth,
  productController.getProduct,
);

/**. Order */

router.post(
  '/order/create',
  memberController.verifyAuth,
  orderController.createOrder,
);

router.get(
  '/order/all',
  memberController.verifyAuth,
  orderController.getMyOrders,
);

export default router;

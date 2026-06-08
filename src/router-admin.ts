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
  .post('/signup', restaurantController.processSignup);

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

routerAdmin.get('/check-me', restaurantController.checkAuthSession);

/** Product   */
/** User */
export default routerAdmin;

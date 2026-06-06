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
const router = express.Router();
import memberController from './controllers/member.controller';

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

router.post('/signup', memberController.signup);

router.post('/login', memberController.login);

export default router;

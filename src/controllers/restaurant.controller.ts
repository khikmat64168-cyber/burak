/**
 * ┌─────────┐
 *  │ PHASE 4 │ ─── KOD KETMA-KETLIK OQIMI
 *  └─────────┘
 *  ─── KOD TAHLILI ──────────────────────────────────────────────────
 *  Bu fayl restaurant uchun Controller vazifasini bajaradi.
 *  Router dan kelgan so'rovlarni qabul qilib, biznes logikani
 *  MemberService ga uzatadi va natijani clientga qaytaradi.
 *  Oqim: server.ts → app.ts → router-admin.ts → [restaurant.controller.ts] → service → schema
 *  ──────────────────────────────────────────────────────────────────
 */

//controllerlar objectlar orqali hosil qilinadi

import { NextFunction, Request, Response } from 'express';

import { T } from '../libs/types/common';

import MemberService from '../models/Member.service';
import { AdminRequest, MemberInput, LoginInput } from '../libs/types/members';
import { MemberType } from '../libs/types/enums/member.enum';
import Errors, { HttpCode, Message } from '../libs/types/Errors';

const memberService = new MemberService();

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * restaurantController — T tipidagi bo'sh object sifatida e'lon
 * qilinadi. T interface { [key: string]: any } ko'rinishida bo'lib,
 * objectga ixtiyoriy kalit va qiymat qo'shish imkonini beradi.
 * Keyingi qatorlarda shu objectga metodlar property sifatida
 * assign qilinadi.
 * ──────────────────────────────────────────────────────────────────
 */
const restaurantController: T = {};

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * goHome — GET so'rovini qayta ishlaydi. req (Request) va
 * res (Response) parametrlarini qabul qilib, res.send() orqali
 * clientga oddiy matn javob qaytaradi. try-catch orqali xatolar
 * ushlanadi va console.log ga chiqariladi.
 * ──────────────────────────────────────────────────────────────────
 */
restaurantController.goHome = (req: Request, res: Response) => {
  try {
    res.render('home');
    //response turlari : send , json , render , redirect ,  end
  } catch (err) {
    console.log('Error. goHome:', err);
    res.redirect('/admin');
  }
};
/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * getSignup — GET /admin/signup so'rovini qayta ishlaydi.
 * Bu metod faqat signup sahifasini ko'rsatish uchun mo'ljallangan.
 * res.send() orqali clientga matn qaytaradi.
 * ──────────────────────────────────────────────────────────────────
 */
restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    console.log('getSignup');
    res.render('signup');
  } catch (err) {
    console.log('Error. getSignup:', err);
    res.redirect('/admin');
  }
};
/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * getLogin — GET /admin/login so'rovini qayta ishlaydi.
 * Bu metod faqat login sahifasini ko'rsatish uchun mo'ljallangan
 * (SSR yondashuvi). res.send() orqali clientga matn qaytaradi.
 * ──────────────────────────────────────────────────────────────────
 */
restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    console.log('getLogin');
    res.render('login');
  } catch (err) {
    console.log('Error. getLogin:', err);
    res.redirect('/admin');
  }
};

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * processSignup — async arrow function bo'lib, POST /admin/signup
 * so'rovini qayta ishlaydi. req.body dan MemberInput tipidagi
 * ma'lumotlar olinadi. newMember.memberType ga MemberType.RESTAURANT
 * qiymati assign qilinadi — ya'ni bu foydalanuvchi restaurant
 * ekanligini belgilaydi. MemberService instance yaratiladi va
 * processSignup metodi chaqiriladi. Natija res.send() bilan
 * clientga qaytariladi.
 * ──────────────────────────────────────────────────────────────────
 */
restaurantController.processSignup = async (req: Request, res: Response) => {
  try {
    console.log('processSignup');
    const files = req.files as Express.Multer.File[];
    const file = files?.[0];
    if (!file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

    console.log('body:', req.body);
    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path.replace(/\\/g, '/');

    newMember.memberType = MemberType.RESTAURANT;
    const result = await memberService.processSignup(newMember);
    // TODO: SESSIONS Authentification

    req.session.member = result;

    req.session.save(function () {
      res.redirect('/admin/product/all');
    });
  } catch (err) {
    console.log('Error. processSignup:', err);
    const message =
      err instanceof Error ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert ("${message}"); window.location.replace('admin/signup ') </script>`,
    );
    // res.status(500).json({ message: 'Server error', error: err });
  }
};

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * processLogin — async arrow function bo'lib, POST /admin/login
 * so'rovini qayta ishlaydi. req.body dan LoginInput tipidagi
 * ma'lumotlar olinadi. MemberService instance yaratiladi va
 * processLogin metodi chaqiriladi. await orqali natija result ga
 * saqlanib, res.send() bilan clientga qaytariladi.
 * ──────────────────────────────────────────────────────────────────
 */
restaurantController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log('logout');
    req.session.destroy(() => {
      res.redirect('/admin');
    });
  } catch (err) {
    console.log('Error. logout:', err);
    res.redirect('/admin');
  }
};

restaurantController.processLogin = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log('processLogin');
    console.log('body:', req.body);
    const input: LoginInput = req.body;

    const result = await memberService.processLogin(input);

    // TODO: SESSIONS Authentification

    req.session.member = result;

    req.session.save(function () {
      res.redirect('/admin/product/all');
    });
  } catch (err) {
    console.log('Error. processLogin:', err);
    const message =
      err instanceof Error ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert ("${message}"); window.location.replace('admin/login') </script>`,
    );
  }
};

restaurantController.checkAuthSession = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log('checkAuthSession');
    if (req.session?.member)
      res.send(`<script> alert ("${req.session.member.memberNick}")</script>`);
    else res.send(`<script> alert ("${Message.NOT_AUTHENTICATED}")</script>`);
    // console.log('body:', req.body);
    // const input: LoginInput = req.body;

    // const result = await memberService.processLogin(input);

    // // TODO: SESSIONS Authentification

    // req.session.member = result;

    // req.session.save(function () {
    //   res.send(result);
    // });

    // res.send(result);
  } catch (err) {
    console.log('Error. processLogin:', err);
    res.send(err);
  }
};

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * verifyRestaurant — Express middleware funksiyasi (req, res, next).
 * next: NextFunction — keyingi middleware yoki controllerni chaqiradi.
 * req.session?.member?.memberType === MemberType.RESTAURANT tekshiruvi:
 *   ✅ To'g'ri → req.member ga session dagi foydalanuvchi assign qilinadi
 *      va next() chaqiriladi — so'rov davom etadi.
 *   ❌ Noto'g'ri → alert bilan /admin/login ga redirect qilinadi.
 * Router da: verifyRestaurant → controller tartibida ulanadi.
 * ──────────────────────────────────────────────────────────────────
 */
restaurantController.verifyRestaurant = (
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.session?.member?.memberType === MemberType.RESTAURANT) {
    req.member = req.session.member;
    next();
  } else {
    const message = Message.NOT_AUTHENTICATED;
    res.send(
      `<script> alert ("${message}");window.location.replace('/admin/login');</script>`,
    );
  }
};

export default restaurantController;

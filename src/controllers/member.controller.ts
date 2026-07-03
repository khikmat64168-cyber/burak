/**
 * ┌─────────┐
 *  │ PHASE 4 │ ─── KOD KETMA-KETLIK OQIMI
 *  └─────────┘
 *  ─── KOD TAHLILI ──────────────────────────────────────────────────
 *  Bu fayl foydalanuvchi (user/SPA) uchun Controller vazifasini
 *  bajaradi. router.ts dan kelgan so'rovlarni qabul qiladi.
 *  Hozircha React SPA uchun mo'ljallangan, metodlar keyinchalik
 *  to'ldiriladi.
 *  Oqim: server.ts → app.ts → router.ts → [member.controller.ts] → service → schema
 *  ──────────────────────────────────────────────────────────────────
 */

//controllerlar objectlar orqali hosil qilinadi

//////// REACT

import { Request, Response } from 'express';

import { T } from '../libs/types/common';
import { LoginInput, Member } from '../libs/types/members';
import MemberService from '../models/Member.service';
import { MemberInput } from '../libs/types/members';
import Errors, { HttpCode } from '../libs/types/Errors';
import AuthService from '../models/Auth.service';
import { AUTH_TIMER } from '../libs/types/config';

const memberService = new MemberService();
const authService = new AuthService(); // #call — Auth.service.ts dan instance yaratildi

const memberController: T = {};

memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log('signup');
    console.log('body:', req.body);
    const input: MemberInput = req.body,
      result: Member = await memberService.signup(input),
      token = await authService.createToken(result);

    res.cookie('accessToken', token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });
    //TODO: TOKENS
    res.status(HttpCode.OK).json({ member: result, accessToken: token });
  } catch (err) {
    console.log('Error, signup:', err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
    // res.status(500).json({ message: 'Server error', error: err });
  }
};

memberController.login = async (req: Request, res: Response) => {
  try {
    console.log('login');
    console.log('body:', req.body);
    const input: LoginInput = req.body,
      result = await memberService.login(input),
      token = await authService.createToken(result);
    res.cookie('accessToken', token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });
    //TODO: TOKENS
    res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
  } catch (err) {
    console.log('Error, login:', err);

    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// memberController.goHome = (req: Request, res: Response) => {
//   try {
//     res.send('Home page');
//   } catch (err) {
//     console.log('Error. goHome:', err);
//   }
// };
// /////////nega routerdagi mantiq controllerga ko'chirildi ??????
// ///////// export bilan export defaut farqi nimada ?

// memberController.getLogin = (req: Request, res: Response) => {
//   try {
//     res.send('Login page');
//   } catch (err) {
//     console.log('Error. getLogin:', err);
//   }
// };

// memberController.getSignup = (req: Request, res: Response) => {
//   try {
//     res.send('Signup page');
//   } catch (err) {
//     console.log('Error. getSignup:', err);
//   }
// };

// // //memberControllerri  routerni ichida chaqrib olishimiz uchun export qilishimiz kerak

export default memberController;

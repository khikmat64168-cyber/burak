//controllerlar objectlar orqali hosil qilinadi

import { Request, Response } from 'express';

import { T } from '../libs/types/common';

const memberController: T = {};
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

// //memberControllerri  routerni ichida chaqrib olishimiz uchun export qilishimiz kerak

export default memberController;

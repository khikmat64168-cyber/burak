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

export default router;

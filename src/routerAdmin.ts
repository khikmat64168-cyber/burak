import express, { Request, Response } from 'express';
const routerAdmin = express.Router();
import restaurantController from './controllers/restaurant.controller';

routerAdmin.get(
  '/',
  //    (req: Request, res: Response) => {
  //   res.send('Home page');
  // });
  restaurantController.goHome,
);

routerAdmin.get(
  '/login',

  //   (req: Request, res: Response) => {
  //   res.send('Login page');
  // });
  restaurantController.getLogin,
);

routerAdmin.get(
  '/signup',
  //    (req: Request, res: Response) => {
  //   res.send('Signup page');
  // });
  restaurantController.getSignup,
);

export default routerAdmin;

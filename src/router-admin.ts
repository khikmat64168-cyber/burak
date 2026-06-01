import express, { Request, Response } from 'express';
const routerAdmin = express.Router();
import restaurantController from './controllers/restaurant.controller';

/** Restaurant   */

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
    '/login/process',
    //    (req: Request, res: Response) => {
    //   res.send('Signup page');
    // });
    restaurantController.processLogin,
  );

/** Product   */
/** User */
export default routerAdmin;

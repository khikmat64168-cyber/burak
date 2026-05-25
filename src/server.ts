// console.log('EXECUTED!');

// import moment from 'moment';

// const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
// console.log(currentTime);

// const person: string = ' Matt';
// const count: number = 100;

// Artichectural pattern :MVC , DI -dependency injection ,MVP backend dagi malummotlar oqimini tartibga soladi

// MVC = MODEL VIEW CONTROLLER

//Design pattern : Middleware , Decoratorlar   malum bo'laklarini  butun backend emas balkim strukturalrini  yechishga hizmat qiladi

/////////////////////////////////

//import moment from 'moment'; //  const moment = require('moment') ;

import dotenv from 'dotenv';
dotenv.config();

// console.log('PORT:', process.env.PORT);

// console.log('MONGO_URL:', process.env.MONGO_URL);

import mongoose from 'mongoose';

import app from './app';

mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then((data) => {
    console.log('MongoDb connection succeeded');
    const PORT = process.env.PORT ?? 3003;
    app.listen(PORT, function () {
      console.log(`The server is running successfully on port: ${PORT}`);
    });
  })
  .catch((err) => console.log('ERROR on conection MongoDb, err'));

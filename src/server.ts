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

console.log('PORT:', process.env.PORT);

console.log('MONGO_URL:', process.env.MONGO_URL);

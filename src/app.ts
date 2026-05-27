////// Express ning integratsiyasini amalga oshirish////

//MVC -- client -> controller -> Model (service module:controllerlar bilan ; schema module database bilan ishlidi ) -> database ->views

import express from 'express';
import path from 'path';
import router from './router';

// Express 4 qisimdan iborat

/** 1-ENTERANCE **/
const app = express();
// console.log('__dirname:', __dirname);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // formadan kelgan malumotlarni qabul qilish uchun

app.use(express.json()); // json formatdagi malumotlarni qabul qilish uchun
/** 2-SESSIONS **/

/** 3-VIEWS **/
app.set('views', path.join(__dirname, 'views')); // views papkasini ko'rsatamiz
app.set('view engine', 'ejs'); // ejs ni view engine sifatida ishlatamiz

/** 4-ROOTERS **/
app.use('/', router); // Kelayotgan so'rovlarni routerga yuborish uchun kerak MIDDLEWARE DESIGN PATTERN

export default app;

////// Express ning integratsiyasini amalga oshirish////

//MVC -- client -> controller -> Model (service module:controllerlar bilan ; schema module database bilan ishlidi ) -> database ->views

import express from 'express';
import path from 'path';
import router from './router';
import routerAdmin from './routerAdmin';
import morgan from 'morgan';
import { MORGAN_FORMAT } from './libs/types/config';
// Express 4 qisimdan iborat

// Express 4 qisimdan iborat

/** 1-ENTERANCE **/
const app = express();
// console.log('__dirname:', __dirname);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // formadan kelgan malumotlarni qabul qilish uchun

app.use(express.json()); // json formatdagi malumotlarni qabul qilish uchun

app.use(morgan(MORGAN_FORMAT));
/** 2-SESSIONS **/

/** 3-VIEWS **/
app.set('views', path.join(__dirname, 'views')); // views papkasini ko'rsatamiz
app.set('view engine', 'ejs'); // ejs ni view engine sifatida ishlatamiz

/** 4-ROOTERS **/

//SSR : EJS
app.use('/admin', routerAdmin);

//SPA: REACT  uchun burak loyihamizni ishlatamiz
app.use('/', router); // Kelayotgan so'rovlarni routerga yuborish uchun kerak MIDDLEWARE DESIGN PATTERN

export default app;
/// nega biz morganni entrancega middlware integration qilamiz
//Morganni entrancega middleware integration qilishimizning sababi shundaki, biz har bir requestni loglashni xohlaymiz va bu loglarni tahlil qilish uchun kerak bo'ladi. Morgan middleware ni entrancega qo'shish orqali, biz har bir requestni loglashni ta'minlaymiz va bu loglarni tahlil qilish imkonini yaratamiz. Bu esa bizga requestlarni tahlil qilish va loglash imkonini beradi, bu esa bizga serverimizning ishlashini yaxshilash va muammolarni aniqlashda yordam beradi.

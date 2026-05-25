////// Express ning integratsiyasini amalga oshirish////

import express from 'express';
import path from 'path';

// Express 4 qisimdan iborat

/** 1-ENTERANCE **/
const app = express();
// console.log('__dirname:', __dirname);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // formadan kelgan malumotlarni qabul qilish uchun

app.use(express.json()); // json formatdagi malumotlarni qabul qilish uchun
/** 2-SESSIONS **/

/** 3-VIEWS **/

/** 4-ROOTERS **/

export default app;

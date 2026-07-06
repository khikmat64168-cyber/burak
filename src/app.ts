/**
 * ┌─────────┐
 *  │ PHASE 2 │ ─── KOD KETMA-KETLIK OQIMI
 *  └─────────┘
 *  ─── KOD TAHLILI ──────────────────────────────────────────────────
 *  Bu fayl Express applicationni sozlaydi. server.ts dan keyin
 *  ishga tushadi. Barcha middleware lar (static, urlencoded,
 *  json, morgan) va routelar shu yerda app ga ulanadi.
 *  Oqim: server.ts → [app.ts] → router → controller → service → schema
 *  ──────────────────────────────────────────────────────────────────
 */

////// Express ning integratsiyasini amalga oshirish////

//MVC -- client -> controller -> Model (service module:controllerlar bilan ; schema module database bilan ishlidi ) -> database ->views

import express from 'express';
import path from 'path';
import router from './router';
import routerAdmin from './router-admin';
import morgan from 'morgan';
import { MORGAN_FORMAT } from './libs/types/config';

import session from 'express-session';
import ConnectMongoDb from 'connect-mongodb-session';
import { T } from './libs/types/common';
import cookieParser from 'cookie-parser';
const MongoDBStore = ConnectMongoDb(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: 'sessions',
});
/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * express() — Express framework ning asosiy instance ini yaratadi
 * va uni app o'zgaruvchisiga assign qiladi. Keyingi barcha
 * middleware va routelar shu app orqali ulangani kerak.
 * ──────────────────────────────────────────────────────────────────
 */

/** 1-ENTERANCE **/
const app = express();

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * app.use(express.static()) — public papkasidagi statik fayllarni
 * (CSS, JS, rasm) clientga uzatish uchun middleware ulaydi.
 * path.join(__dirname, 'public') — joriy fayl joylashgan
 * papkadan public papkasiga absolyut yo'lni tuzadi.
 * ──────────────────────────────────────────────────────────────────
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * express.urlencoded({ extended: true }) — HTML form orqali
 * yuborilgan x-www-form-urlencoded formatidagi ma'lumotlarni
 * parse qiladi va req.body ga joylaydi.
 * express.json() — application/json formatidagi so'rovlar
 * body sini parse qilib req.body ga joylaydi.
 * ──────────────────────────────────────────────────────────────────
 */

app.use('/uploads', express.static('./uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * morgan(MORGAN_FORMAT) — HTTP so'rovlarini loglash uchun
 * middleware ulaydi. MORGAN_FORMAT — config.ts dan import
 * qilingan custom format string bo'lib, har bir so'rovning
 * metodi, URL, status kodi va javob vaqtini chiqaradi.
 * ──────────────────────────────────────────────────────────────────
 */
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

/** 2-SESSIONS **/
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 60 * 3, // 3 housr
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * app.set('views') — EJS template fayllar joylashgan papkani
 * Express ga bildiradi. app.set('view engine', 'ejs') — Express ga
 * template engine sifatida EJS ishlatishni buyuradi. Bu SSR
 * (Server Side Rendering) uchun kerak.
 * ──────────────────────────────────────────────────────────────────
 */
/** 3-VIEWS **/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * app.use('/admin', routerAdmin) — /admin prefiksi bilan kelgan
 * barcha so'rovlarni routerAdmin ga yo'naltiradi (SSR — EJS uchun).
 * app.use('/', router) — qolgan barcha so'rovlarni asosiy
 * router ga uzatadi (SPA — React uchun). Bu Middleware
 * Design Pattern asosida ishlaydi.
 * ──────────────────────────────────────────────────────────────────
 */
/** 4-ROOTERS **/

//SSR : EJS
app.use('/admin', routerAdmin);

//SPA: REACT  uchun burak loyihamizni ishlatamiz
app.use('/', router);

export default app;

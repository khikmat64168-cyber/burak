import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { v4 } from 'uuid';

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * getTargetImageStorage — multer.diskStorage() konfiguratsiyasini
 * yaratib qaytaradi. address parametri orqali qaysi papkaga
 * saqlanishi belgilanadi: "products" → uploads/products,
 * "members" → uploads/members. Bu factory pattern — har safar
 * yangi storage ob'ekti yaratiladi.
 * ──────────────────────────────────────────────────────────────────
 */
function getTargetImageStorage(address: any) {
  return multer.diskStorage({
    /**
     * ─── KOD TAHLILI ──────────────────────────────────────────────────
     * destination — yuklangan fayl saqlanadigan papkani belgilaydi.
     * multer mavjud bo'lmagan papkaga yoza olmaydi va
     * "ENOENT: no such file or directory" xatosini beradi. Shuning uchun
     * cb() ga yo'l berishdan oldin fs.mkdirSync(dir, { recursive: true })
     * bilan papkani avtomatik yaratamiz:
     *   recursive: true → papka bo'lsa hech narsa qilmaydi (xato bermaydi),
     *   bo'lmasa (hatto uploads/ ham yo'q bo'lsa) ketma-ket hammasini yaratadi.
     * Natijada qo'lda papka yaratish yoki .gitkeep kerak bo'lmaydi.
     * ──────────────────────────────────────────────────────────────────
     */
    destination: function (req, file, cb) {
      const dir = `./uploads/${address}`;
      fs.mkdirSync(dir, { recursive: true }); // papka bo'lmasa avtomatik yaratadi (ENOENT oldini oladi)
      cb(null, dir);
    },

    /**
     * ─── KOD TAHLILI ──────────────────────────────────────────────────
     * filename — yuklangan faylning serverda qanday nomlanishini
     * belgilaydi. path.parse().ext — asl fayl kengaytmasini oladi
     * (.png, .jpg). v4() — UUID generatsiya qilib tasodifiy noyob
     * nom beradi. Natija: "a1b2c3d4-...-uuid.png" ko'rinishida.
     * ──────────────────────────────────────────────────────────────────
     */
    filename: function (_req, file, cb) {
      const extension = path.parse(file.originalname).ext;
      const random_name = v4() + extension;
      cb(null, random_name);
    },
  });
}

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * makeUploader — address (papka nomi) qabul qilib, tayyor multer
 * middleware instance qaytaradi. Router da quyidagicha ishlatiladi:
 *   makeUploader("products").any()   → barcha fieldlarni qabul qiladi
 *   makeUploader("members").any()    → members papkasiga saqlaydi
 * export default — bu funksiya loyiha bo'yicha yagona uploader.
 * ──────────────────────────────────────────────────────────────────
 */
const makeUploader = (address: string) => {
  const storage = getTargetImageStorage(address);
  return multer({ storage: storage });
};

export default makeUploader;

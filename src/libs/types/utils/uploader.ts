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

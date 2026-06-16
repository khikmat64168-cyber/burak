# PPT Taqdimot Prompti — Burak Loyihasi (13 Iyun 2026)

> Bu faylni to'liq nusxalab Claude App ga bering.

---

## VAZIFA

Men **Node.js + TypeScript + Express + MongoDB + EJS** texnologiyalari bilan
**"Burak"** nomli restaurant boshqaruv tizimini qurmoqdaman.

Quyida **13 iyun 2026** kuni qilingan 4 ta commit bo'yicha barcha ishlar
batafsil tasvirlangan. Shu asosda menga:

1. **Professional PowerPoint taqdimot** yasa (8–12 slayd)
2. Har bir slaydda **Request → Response flow diagrammasi** bo'lsin
3. **MVC arxitektura chartlari** chiz
4. Texnik terminlarni oddiy so'zlar bilan ham tushuntir
5. Har bir kod bloki uchun **qator-qator tushuntirish** yoz

---

## LOYIHA ARXITEKTURASI (umumiy)

```
CLIENT (Postman / Browser)
        │
        ▼
   server.ts  (PORT: 3003)
        │
        ▼
   app.ts  ──── express-session ──► MongoDB "sessions"
        │
        ├── /admin  ──► router-admin.ts
        │                    │
        │         ┌──────────┼────────────────┐
        │         ▼          ▼                ▼
        │  restaurant    product          makeUploader
        │  .controller   .controllers     (multer)
        │         │          │
        │         ▼          ▼
        │   MemberService  ProductService
        │         │          │
        │         ▼          ▼
        │   Member.model  Product.model
        │         │          │
        └─────────┴──────────┴──► MongoDB
```

---

## COMMIT 1 — (14:41) `fix: modify restaurant controller processSignup and processLogin`

### A) processSignup — Rasm yuklash qo'shildi

**Oldin (rasm yo'q edi):**
```typescript
restaurantController.processSignup = async (req: Request, res: Response) => {
  const newMember: MemberInput = req.body;         // faqat matn ma'lumotlar
  newMember.memberType = MemberType.RESTAURANT;
  const result = await memberService.processSignup(newMember);
  req.session.member = result;
  req.session.save(() => res.send(result));        // JSON qaytarardi
};
```

**Keyin (rasm qo'shildi):**
```typescript
restaurantController.processSignup = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[]; // (1)
  const file = files?.[0];                          // (2)
  if (!file) throw new Errors(...);                 // (3)

  const newMember: MemberInput = req.body;          // (4)
  newMember.memberImage = file?.path;               // (5)
  newMember.memberType = MemberType.RESTAURANT;     // (6)
  const result = await memberService.processSignup(newMember); // (7)
  req.session.member = result;                      // (8)
  req.session.save(() => res.redirect('/admin/product/all')); // (9)
};
```

**Qator tushuntirishlari:**
- **(1)** `req.files` — multer `.any()` saqlagan fayllar massivi. `as Express.Multer.File[]` — TypeScript ga tipini aniq aytish
- **(2)** `files?.[0]` — massivdan birinchi faylni olish (`?.` — agar massiv bo'sh bo'lsa xato chiqmaydi)
- **(3)** Agar fayl yuborilmagan bo'lsa — xato chiqariladi, keyingi kod ishlamaydi
- **(4)** `req.body` — Postman da matn sifatida yuborilgan maydonlar (nick, phone, password)
- **(5)** `file?.path` — multer saqlagan fayl yo'li, masalan: `uploads/members/uuid.png`
- **(6)** `memberType` ni `RESTAURANT` ga majburan belgilaymiz — admin panelda faqat restaurant egasi ro'yxatdan o'tadi
- **(7)** `memberService.processSignup()` — bcrypt bilan parolni hash qiladi va MongoDB ga yozadi
- **(8)** Yangi foydalanuvchini session ga saqlaymiz — keyingi so'rovlarda kim ekanini bilamiz
- **(9)** Session MongoDB ga saqlanganidan keyin mahsulotlar sahifasiga redirect qilinadi

**processSignup Request → Response Flow:**
```
POST /admin/signup  (form-data: memberImage + body fields)
        │
        ▼
makeUploader('members').any()  ──► uploads/members/uuid.png  (disk)
        │
        ▼
processSignup controller
   ├── req.files[0] → file.path → newMember.memberImage
   ├── req.body → newMember (nick, phone, password...)
   └── memberService.processSignup(newMember)
              │
              ▼
         bcrypt.hash(password)  → "$2b$10$..."
              │
              ▼
         MemberModel.create(newMember) ──► MongoDB "members"
              │
              ▼
         req.session.member = result ──► MongoDB "sessions"
              │
              ▼
         res.redirect('/admin/product/all')
```

---

### B) verifyRestaurant Middleware yaratildi

```typescript
restaurantController.verifyRestaurant = (
  req: AdminRequest,   // (1)
  res: Response,
  next: NextFunction   // (2)
) => {
  if (req.session?.member?.memberType === MemberType.RESTAURANT) { // (3)
    req.member = req.session.member;  // (4)
    next();                           // (5)
  } else {
    res.send(`<script>alert("NOT_AUTHENTICATED");
              window.location.replace('/admin/login');</script>`); // (6)
  }
};
```

**Qator tushuntirishlari:**
- **(1)** `AdminRequest` — oddiy `Request` dan kengaytirilgan tip, `req.member` va `req.session.member` mavjud
- **(2)** `NextFunction` — Express da "keyingi qadam" funksiyasi. Chaqirilsa so'rov davom etadi, chaqirilmasa to'xtaydi
- **(3)** `req.session?.member?.memberType` — uch qavatli xavfsiz tekshiruv: session bor? → member bor? → u RESTAURANT mi?
- **(4)** Session dagi member ma'lumotini `req.member` ga ko'chiramiz — keyingi controller dan osonroq foydalanish uchun
- **(5)** `next()` — "hammasi yaxshi, davom et" signali. Keyingi middleware yoki controller ishga tushadi
- **(6)** Agar tekshiruv muvaffaqiyatsiz bo'lsa — brauzerda JavaScript alert chiqariladi va login sahifasiga redirect qilinadi

**verifyRestaurant Flow:**
```
Client so'rovi
      │
      ▼
verifyRestaurant middleware
      │
      ├── req.session?.member?.memberType === 'RESTAURANT' ?
      │          │                    │
      │         YES                   NO
      │          │                    │
      │          ▼                    ▼
      │   req.member = result    alert("NOT_AUTHENTICATED")
      │   next()                 redirect → /admin/login
      │          │
      │          ▼
      │   keyingi controller ishlaydi
      │   (getAllProducts, createNewProduct...)
```

---

### C) makeUploader — Factory Pattern ga o'tkazildi

**Oldin (har bir papka uchun alohida kod yozilardi):**
```typescript
const product_storage = multer.diskStorage({
  destination: './uploads/products',  // faqat products — boshqa papka uchun boshqa kod kerak
  filename: (req, file, cb) => { ... }
});
export const uploadProductImage = multer({ storage: product_storage });
```

**Keyin (bitta funksiya — istalgan papka uchun):**
```typescript
function getTargetImageStorage(address: string) { // (1)
  return multer.diskStorage({
    destination: `./uploads/${address}`,  // (2)
    filename: (_req, file, cb) => {       // (3)
      const ext = path.parse(file.originalname).ext; // (4)
      cb(null, v4() + ext);               // (5)
    }
  });
}

const makeUploader = (address: string) => {   // (6)
  const storage = getTargetImageStorage(address);
  return multer({ storage: storage });        // (7)
};
```

**Qator tushuntirishlari:**
- **(1)** `getTargetImageStorage` — multer storage konfiguratsiyasini yaratib qaytaruvchi yordamchi funksiya
- **(2)** `` `./uploads/${address}` `` — `address` parametriga qarab papka tanlanadi: `products` yoki `members`
- **(3)** `_req` — `_` prefiksi "bu parametr kerak emas, lekin signature saqlanishi kerak" degan ma'no
- **(4)** `path.parse(file.originalname).ext` — asl fayl nomidan kengaytmani ajratib oladi: `cheesecake.jpg` → `.jpg`
- **(5)** `v4()` — UUID (universally unique identifier) generatsiya qiladi → `a1b2c3d4-...-uuid.jpg` — takrorlanmas nom
- **(6)** `makeUploader(address)` — tashqi chaqiriladigan asosiy funksiya. Router da: `makeUploader('products').any()`
- **(7)** Tayyor multer instansiyasini qaytaradi — router da bevosita middleware sifatida ishlatiladi

**Ishlatilishi:**
```
makeUploader('members').any()   → uploads/members/ papkasiga saqlaydi
makeUploader('products').any()  → uploads/products/ papkasiga saqlaydi
```

---

## COMMIT 2 — (16:40) `feat: createNewProduct business logic by restaurant member`

### A) Product TypeScript Interfacelari yaratildi

```typescript
// src/libs/types/product.ts

export interface Product {              // (1)
  _id: ObjectId;                        // (2)
  productStatus: ProductStatus;         // (3) PAUSE | PROCESS | DELETE
  productCollection: ProductCollection; // (4) DISH | SALAD | DESSERT | DRINK | OTHER
  productName: string;
  productPrice: number;
  productLeftCount: number;             // (5)
  productSize?: ProductSize;            // (6) SMALL | NORMAL | LARGE | SET
  productVolume?: number;               // litr: 0.5, 1, 1.2, 1.5, 2
  productDesc?: string;
  productImages: string[];              // (7) bir nechta rasm yo'llari
  productViews: number;
}

export interface ProductInput {         // (8)
  productCollection: ProductCollection; // majburiy
  productName: string;                  // majburiy
  productPrice: number;                 // majburiy
  productLeftCount: number;             // majburiy
  productImages?: string[];             // ixtiyoriy
}
```

**Qator tushuntirishlari:**
- **(1)** `Product` — MongoDB dan qaytadigan to'liq mahsulot ob'ekti tiplari
- **(2)** `ObjectId` — MongoDB ning o'ziga xos ID tipi (`string` emas)
- **(3)** `productStatus` — mahsulot ko'rinaversinmi? PAUSE = yashirilgan, PROCESS = aktiv
- **(4)** `productCollection` — kategoriya: taom, salat, dessert, ichimlik yoki boshqa
- **(5)** `productLeftCount` — ombordagi qoldiq miqdori
- **(6)** `?` belgisi — bu maydon ixtiyoriy (optional), bo'lmasa ham bo'ladi
- **(7)** `string[]` — massiv: `['uploads/products/a.jpg', 'uploads/products/b.jpg']`
- **(8)** `ProductInput` — faqat yangi mahsulot yaratish uchun kerakli maydonlar (MongoDB `_id` va `productViews` avtomatik qo'shiladi)

### B) Product Schema tuzatildi

| Maydon | Oldin (xato) | Keyin (to'g'ri) | Sabab |
|---|---|---|---|
| `productImages` | `type: String` | `type: [String]` | Bir nechta rasm yo'llari massiv sifatida saqlanadi |
| `productSize` | `type: Number` | `type: String` | `ProductSize` enum qiymatlari `'SMALL'`, `'NORMAL'` — string |

### C) createNewProduct — Kod va Tushuntirish

```typescript
productController.createNewProduct = async (req: AdminRequest, res: Response) => {
  if (!req.files?.length)                           // (1)
    throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

  const data: ProductInput = req.body;              // (2)
  data.productImages = req.files?.map((ele) => {    // (3)
    return ele.path.replace(/\\/g, '/');            // (4)
  });

  await productService.createNewProduct(data);      // (5)
  res.send(`<script>alert("Successful creation")...</script>`); // (6)
};
```

**Qator tushuntirishlari:**
- **(1)** `req.files?.length` — hech bo'lmasa 1 ta rasm yuborilganmi tekshiriladi. Agar yo'q — xato chiqariladi
- **(2)** `req.body` — Postman dan kelgan matn ma'lumotlar: productName, productPrice, productCollection...
- **(3)** `req.files.map()` — har bir yuklangan fayl uchun faqat yo'lni olamiz
- **(4)** `.replace(/\\/g, '/')` — Windows da `\` bilan yozilgan yo'lni `/` ga o'zgartirish (Linux/Mac uchun)
- **(5)** Service metodini chaqiramiz — u MongoDB ga yozadi
- **(6)** JavaScript alert brauzerda ko'rsatiladi va sahifa yo'naltiriladi

**createNewProduct Flow:**
```
POST /admin/product/create
        │
        ▼
verifyRestaurant → session tekshiruvi
        │
        ▼
makeUploader('products').any() → rasmlar diskka saqlanadi
   req.files = [
     { path: 'uploads/products/uuid1.jpeg', ... },
     { path: 'uploads/products/uuid2.jpg', ... }
   ]
        │
        ▼
createNewProduct controller
   data.productImages = ['uploads/products/uuid1.jpeg', 'uploads/products/uuid2.jpg']
   data = { productName, productPrice, productImages, ... }
        │
        ▼
ProductService.createNewProduct(data)
        │
        ▼
ProductModel.create(data) ──► MongoDB "products" kolleksiyasi
        │
        ▼
res.send → alert("Successful creation")
```

---

## COMMIT 3 — (17:22) `fix: modify updateChosenProduct business logic`

### A) shapeIntoMongooseObjectId — Nima uchun kerak?

```typescript
export function shapeIntoMongooseObjectId(id: string): any {
  return new mongoose.Types.ObjectId(id); // (1)
}
```

**Tushuntirish:**
- **(1)** MongoDB da `_id` maydoni `ObjectId` tipida saqlanadi. Postman dan `"6a2d0a86..."` — bu oddiy **string**. `findOneAndUpdate({ _id: "6a2d..." })` topilmaydi chunki tip mos emas. `new mongoose.Types.ObjectId(id)` — stringni MongoDB tushunydigan `ObjectId` ga convert qiladi

```
Postman yuboradi:  "6a2d0a862b899aec6d0c5a15"  (string)
MongoDB saqlaydi:  ObjectId("6a2d0a862b899aec6d0c5a15")  (ObjectId)
                                    ↑
                   shapeIntoMongooseObjectId() shu ishni qiladi
```

### B) updateChosenProduct Service — Kod va Tushuntirish

```typescript
public async updateChosenProduct(id: string, input: ProductUpdateInput): Promise<Product> {
  id = shapeIntoMongooseObjectId(id);        // (1)

  const result = await this.productModel
    .findOneAndUpdate(                        // (2)
      { _id: id },                           // (3)
      input,                                 // (4)
      { new: true }                          // (5)
    ).exec();

  if (!result)                               // (6)
    throw new Errors(HttpCode.BAD_REQUEST, Message.UPDATE_FAILED);

  return result;                             // (7)
}
```

**Qator tushuntirishlari:**
- **(1)** String ID → ObjectId ga aylantiriladi (MongoDB uchun)
- **(2)** `findOneAndUpdate` — bitta hujjatni topib, yangilaydi va qaytaradi
- **(3)** `{ _id: id }` — qaysi hujjatni yangilash kerakligini belgilaydi
- **(4)** `input` — Postman dan kelgan yangi qiymatlar (`productName`, `productPrice`...)
- **(5)** `{ new: true }` — yangilanishdan OLDINGI emas, yangilanganDAN KEYIN gi hujjatni qaytaradi
- **(6)** Agar topilmasa yoki yangilanmasa — xato chiqariladi
- **(7)** Yangilangan mahsulot ob'ekti qaytariladi

**updateChosenProduct Flow:**
```
POST /admin/product/6a2d0a862b899aec6d0c5a15
  Body: { productName: "Cheesecake", productPrice: 25000 }
        │
        ▼
verifyRestaurant
        │
        ▼
updateChosenProduct controller
  req.params.id = "6a2d0a862b899aec6d0c5a15"  (string)
        │
        ▼
ProductService.updateChosenProduct(id, req.body)
  shapeIntoMongooseObjectId("6a2d...") → ObjectId("6a2d...")
        │
        ▼
ProductModel.findOneAndUpdate(
  { _id: ObjectId("6a2d...") },         ← topildi
  { productName: "Cheesecake", ... },   ← yangilandi
  { new: true }                         ← yangi holat qaytarildi
)
        │
        ▼
res.status(200).json({ data: result })
```

### C) Router Trailing Space Xatosi

```
❌ routerAdmin.post('/product/:id ', ...)
               ↑ bu bo'sh joy bor! Express route ni topa olmadi

✅ routerAdmin.post('/product/:id', ...)
```

---

## COMMIT 4 — (17:39) `fix: getAllProducts api and passing data into ejs`

### A) getAllProducts Service — Kod va Tushuntirish

```typescript
public async getAllProducts(): Promise<Product[]> {  // (1)
  const result = await this.productModel
    .find()       // (2)
    .exec();      // (3)

  if (!result)    // (4)
    throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

  return result;  // (5)
}
```

**Qator tushuntirishlari:**
- **(1)** `Promise<Product[]>` — bu metod `Product` ob'ektlari massivini qaytaradi
- **(2)** `.find()` — filter yo'q, barcha mahsulotlarni oladi (SQL da `SELECT * FROM products` ga teng)
- **(3)** `.exec()` — Mongoose query ni ishga tushiradi va Promise qaytaradi
- **(4)** Agar mahsulotlar bo'lmasa — `NOT_FOUND` xatosi chiqariladi
- **(5)** Barcha mahsulotlar ro'yxati controller ga qaytariladi

### B) EJS Template — Kod va Tushuntirish

```html
<!-- products.ejs -->
<% products.map(function(value, key) { %>   <!-- (1) -->
  <p>
    <%= value.productName %>                 <!-- (2) -->
    <%= value.productSize %>                 <!-- (3) -->
  </p>
<% }) %>                                     <!-- (4) -->
```

**Qator tushuntirishlari:**
- **(1)** `<% %>` — EJS tegi: ichidagi JavaScript kodi **ishga tushiriladi** lekin HTML ga chiqarilmaydi. `products.map()` — massivni aylanib chiqadi
- **(2)** `<%= %>` — EJS tegi: qiymat **HTML ga chiqariladi**. `value.productName` — har bir mahsulotning nomi
- **(3)** `value.productSize` — mahsulot o'lchami: SMALL / NORMAL / LARGE / SET
- **(4)** Map funksiyasini yopamiz

**SSR (Server Side Rendering) tushuntirishi:**
```
Server:                          Brauzer:
products.ejs + { products: [...] }
         │
         ▼                       ← tayyor HTML yuboriladi
    EJS render qiladi
         │                       Brauzer faqat HTML ko'radi,
         ▼                       JavaScript kodi ko'rinmaydi
    <p>Cheesecake NORMAL</p>
    <p>Tiramisu SMALL</p>   ────► ko'rsatadi
```

**getAllProducts Flow:**
```
GET /admin/product/all
        │
        ▼
verifyRestaurant → session.member mavjud?
        │
        ▼
getAllProducts controller
        │
        ▼
ProductService.getAllProducts()
        │
        ▼
ProductModel.find().exec() ──► MongoDB "products"
        │
        ▼
result = [ {productName: "Cheesecake",...}, {productName: "Tiramisu",...} ]
        │
        ▼
res.render('products', { products: result })
        │
        ▼
EJS: products.map() → har bir product uchun <p> tegi
        │
        ▼
Brauzer: tayyor HTML sahifa
```

---

## BUGUNGI TO'LIQ API JADVALI

| Method | URL | Middleware zanjiri | Natija |
|---|---|---|---|
| GET | /admin/ | — | home.ejs |
| GET | /admin/signup | — | signup.ejs |
| POST | /admin/signup | makeUploader('members') → processSignup | MongoDB + redirect |
| GET | /admin/login | — | login.ejs |
| POST | /admin/login | processLogin | session + redirect |
| GET | /admin/logout | logout | session o'chadi |
| GET | /admin/check-me | checkAuthSession | memberNick alert |
| GET | /admin/product/all | verifyRestaurant → getAllProducts | products.ejs |
| POST | /admin/product/create | verifyRestaurant → makeUploader → createNewProduct | MongoDB + alert |
| POST | /admin/product/:id | verifyRestaurant → makeUploader → updateChosenProduct | JSON |

---

## MIDDLEWARE ZANJIRI — TO'LIQ TUSHUNTIRISH

```
Har bir /admin/product/* so'rovi uchun:

Request (Postman / Browser)
   │
   ▼
[1] express-session middleware (app.ts da o'rnatilgan)
    ├── Cookie dan session ID o'qiladi
    ├── MongoDB "sessions" dan session ma'lumoti yuklanadi
    └── req.session ob'ekti to'ldiriladi
   │
   ▼
[2] verifyRestaurant (restaurant.controller.ts)
    ├── req.session?.member — session da member bormi?
    ├── memberType === 'RESTAURANT' — u restaurant egasimi?
    ├── HA → req.member = session.member; next() — davom etadi
    └── YO'Q → alert + /admin/login ga redirect
   │
   ▼
[3] makeUploader('products').any()  (faqat POST uchun)
    ├── form-data dagi fayllarni qabul qiladi
    ├── UUID nom bilan uploads/products/ papkasiga saqlaydi
    └── req.files = [{ filename, path, size, ... }]
   │
   ▼
[4] Controller (createNewProduct / updateChosenProduct / getAllProducts)
    ├── req.body → matn ma'lumotlar
    ├── req.files → yuklangan fayllar
    ├── req.member → kim so'rov qilayotgani
    └── Service → MongoDB → Response
   │
   ▼
Response (JSON / HTML / redirect / alert)
```

---

## MVC QATLAMLAR DIAGRAMMASI

```
┌─────────────────────────────────────────────────┐
│                   CLIENT                         │
│  Postman: form-data yuboradi                     │
│  Browser: forma to'ldirib submit bosadi          │
└───────────────────────┬─────────────────────────┘
                        │ HTTP Request
                        ▼
┌─────────────────────────────────────────────────┐
│               ROUTER LAYER                       │
│           (router-admin.ts)                      │
│  URL pattern ni middleware va controller bilan   │
│  birlashtiradi. Middleware tartibini belgilaydi. │
└───────────────────────┬─────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│             CONTROLLER LAYER                     │
│  restaurant.controller.ts | product.controllers  │
│  req va res bilan ishlaydi.                      │
│  Service dan natija oladi va clientga yuboradi.  │
└───────────────────────┬─────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│              SERVICE LAYER                       │
│    MemberService | ProductService                │
│  Biznes logika: bcrypt hash, ObjectId convert,  │
│  validatsiya. Schema (model) ni chaqiradi.       │
└───────────────────────┬─────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│              SCHEMA LAYER                        │
│    Member.model.ts | Product.model.ts            │
│  Mongoose orqali MongoDB bilan muloqot.          │
│  create(), find(), findOneAndUpdate()            │
└───────────────────────┬─────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│                 MongoDB                          │
│   members | products | sessions collections      │
└─────────────────────────────────────────────────┘
```

---

## UMUMIY NATIJA (13 Iyun)

| Soha | Qilingan ish |
|---|---|
| Middleware | verifyRestaurant — authentication himoya qatlami |
| File Upload | makeUploader factory — members va products uchun universal |
| Product CRUD | create, update, getAll — to'liq amalga oshirildi |
| TypeScript | Product, ProductInput, ProductUpdateInput interfacelari |
| Schema | productImages: [String], productSize: String tuzatildi |
| EJS | products.ejs da mahsulotlar ro'yxati SSR bilan render |
| Router | trailing space xatosi tuzatildi |
| Utility | shapeIntoMongooseObjectId — string → ObjectId |

---

## PPT KO'RSATMALARI

1. **Har bir commit uchun alohida slayd** yasa
2. **Flow diagrammalarini vizual** qilib chiz (strelkalar, rang kodlar)
3. **Kod bloklarini** monospace font bilan ko'rsat, har bir qator raqami bilan
4. **Qator tushuntirishlarni** kod yonida yoki ostida ko'rsat
5. **MVC diagrammasini** bitta butun slayd qil
6. **Middleware zanjirini** alohida slaydda ko'rsat
7. **API jadvalni** ranglar bilan (GET=yashil, POST=ko'k)
8. **Ranglar sxemasi**: qoramtir fon (#1e1e1e), yashil accent (#4ec9b0), ko'k (#569cd6)
9. Oxirgi slayd: **O'rganilgan narsalar va keyingi maqsadlar**

---

*Loyiha: Burak Restaurant Management System*
*Muallif: matt | Sana: 13 Iyun 2026*
*Stack: Node.js + TypeScript + Express + MongoDB + EJS + Multer*

# PPT Prompt — Burak Loyihasi: Barcha API Endpointlar Tahlili

> Bu faylni Claude App ga nusxalab tashlang.
> Quyidagi fayllarni ham birga yuklang:
> - src/router-admin.ts
> - src/controllers/restaurant.controller.ts
> - src/controllers/product.controllers.ts
> - src/models/Member.service.ts
> - src/models/Product.service.ts
> - src/schema/Member.model.ts
> - src/schema/Product.model.ts
> - src/libs/types/members.ts
> - src/libs/types/product.ts
> - src/libs/types/Errors.ts

---

## VAZIFA

Men **Node.js + TypeScript + Express + MongoDB + EJS** bilan qurilgan
**"Burak"** restaurant boshqaruv tizimini o'qiyman.

Quyidagi **12 ta API endpoint** uchun menga **PowerPoint taqdimot** yasa.

**HAR BIR ENDPOINT UCHUN SLAYD** quyidagi formatda bo'lsin:

```
[METHOD] /endpoint/url

ROUTER (router-admin.ts)
  → bu yerda route qanday yozilgan, middleware zanjiri nima

    ↓ #call

CONTROLLER (restaurant.controller.ts YOKI product.controllers.ts)
  → controller metodi nima qiladi, req.body / req.params / req.files dan nima oladi

    ↓ #call

SERVICE (Member.service.ts YOKI Product.service.ts)
  → service metodi nima qiladi, qanday biznes logika bor (bcrypt, shapeIntoMongooseObjectId...)

    ↓ #call

SCHEMA/MODEL (Member.model.ts YOKI Product.model.ts)
  → MongoDB ga qaysi Mongoose metodi bilan murojaat qilinadi
  → find() / create() / findOne() / findOneAndUpdate() / findByIdAndUpdate()

    ↓

RESPONSE
  → res.render() / res.json() / res.redirect() / res.send(script)
  → SSR (EJS) mi yoki SPA (JSON) mi
```

---

## FORMAT NAMUNASI (getAllProducts dan o'rgan)

```
GET /admin/product/all

ROUTER:
  verifyRestaurant middleware → productController.getAllProducts
  #call: restaurant.controller.ts → verifyRestaurant
  #call: product.controllers.ts → getAllProducts

CONTROLLER (product.controllers.ts):
  productService.getAllProducts() ni await bilan chaqiradi
  natijani products nomi ostida EJS ga uzatadi
  #call: Product.service.ts → getAllProducts

SERVICE (Product.service.ts):
  ProductModel.find().exec() — barcha mahsulotlarni oladi
  if(!result) → NOT_FOUND xatosi
  #call: Product.model.ts → find()

MODEL (Product.model.ts):
  Mongoose schema — MongoDB "products" kolleksiyasidan so'raydi
  #define: productName, productPrice, productImages:[String]...

RESPONSE:
  res.render('products', { products: data }) → SSR → products.ejs
```

---

## TAHLIL QILINADIGAN 12 TA ENDPOINT

### 1. GET /admin/
- Router → goHome controller → res.render('home')
- Session tekshiruvi yo'q (himoyalanmagan)

### 2. GET /admin/signup
- Router → getSignup controller → res.render('signup')

### 3. POST /admin/signup
- Router → makeUploader('members').any() → processSignup controller
- req.files[0] → fayl olinadi, path saqlananadi
- memberService.processSignup() → bcrypt.genSalt() + bcrypt.hash()
- MemberModel.create() → MongoDB ga yoziladi
- req.session.member = result → session yaratiladi
- res.redirect('/admin/product/all')

### 4. GET /admin/login
- Router → getLogin controller → res.render('login')

### 5. POST /admin/login
- Router → processLogin controller
- memberService.processLogin() →
  - MemberModel.findOne({ memberNick }).select('+memberPassword')
  - bcrypt.compare(inputPassword, hashedPassword)
  - MemberModel.findById(member._id)
- req.session.member = result → session yaratiladi
- res.redirect('/admin/product/all')

### 6. GET /admin/logout
- Router → logout controller
- req.session.destroy() → MongoDB sessions dan o'chiriladi
- res.redirect('/admin')

### 7. GET /admin/check-me
- Router → checkAuthSession controller
- req.session?.member mavjudmi tekshiradi
- res.send(alert script) — memberNick yoki NOT_AUTHENTICATED

### 8. GET /admin/product/all
- Router → verifyRestaurant → getAllProducts controller
- productService.getAllProducts() → ProductModel.find().exec()
- res.render('products', { products: data }) → SSR

### 9. POST /admin/product/create
- Router → verifyRestaurant → makeUploader('products').any() → createNewProduct
- req.files.map(ele => ele.path.replace(/\\/g, '/')) → productImages massivi
- productService.createNewProduct(data) → ProductModel.create(input)
- res.send(alert script) → redirect

### 10. POST /admin/product/:id
- Router → verifyRestaurant → makeUploader → updateChosenProduct
- req.params.id as string → shapeIntoMongooseObjectId(id)
- productService.updateChosenProduct(id, req.body)
- ProductModel.findOneAndUpdate({ _id }, input, { new: true })
- res.status(200).json({ data: result }) → SPA/JSON

### 11. GET /admin/user/all
- Router → verifyRestaurant → getUsers controller
- memberService.getUsers() → MemberModel.find({ memberType: 'USER' })
- res.render('users', { users: result }) → SSR

### 12. POST /admin/user/edit
- Router → verifyRestaurant → updateChosenUser controller
- req.body → MemberUpdateInput { _id, memberStatus, ... }
- memberService.updateChosenUser(input)
- shapeIntoMongooseObjectId(input._id)
- MemberModel.findByIdAndUpdate({ _id }, input, { new: true })
- res.status(200).json({ data: result }) → SPA/JSON

---

## PPT DA KO'RSATILADIGAN QOʻSHIMCHA TUSHUNCHALAR

### verifyRestaurant middleware nima?
```
Har bir himoyalangan endpointdan oldin ishlaydi.
req.session?.member?.memberType === 'RESTAURANT' ?
  YES → req.member = session.member; next() → keyingi controller
  NO  → alert("NOT_AUTHENTICATED") + redirect('/admin/login')
```

### shapeIntoMongooseObjectId nima uchun kerak?
```
Postman yuboradi:  "6a2d0a86..." (string)
MongoDB saqlaydi:  ObjectId("6a2d0a86...") (ObjectId tip)
findOneAndUpdate({ _id: "string" }) → topilmaydi!
findOneAndUpdate({ _id: ObjectId("...") }) → topiladi ✅
```

### { new: true } nima uchun kerak?
```
findOneAndUpdate(filter, update, { new: false }) → YANGILANISHDAN OLDINGI doc
findOneAndUpdate(filter, update, { new: true })  → YANGILANGANIDAN KEYIN gi doc ✅
```

### bcrypt jarayoni (processSignup va processLogin):
```
SIGNUP:
  "password123" → bcrypt.genSalt() → "$2b$10$randomsalt"
               → bcrypt.hash("password123", salt) → "$2b$10$hashstring"
               → MongoDB ga hash saqlanadi

LOGIN:
  "password123" (user yozgan) vs "$2b$10$hashstring" (MongoDB da)
  bcrypt.compare() → true yoki false
  Hash ni qayta ochib bo'lmaydi — faqat solishtiriladi
```

### SSR vs SPA farqi:
```
SSR (Server Side Rendering):
  res.render('products', { products: data })
  → Server HTML yasaydi → Brauzer tayyor HTML oladi
  → Endpointlar: getAllProducts, getUsers, goHome, getSignup, getLogin

SPA (Single Page Application) / API:
  res.status(200).json({ data: result })
  → Server JSON qaytaradi → Frontend JavaScript qayta ishlaydi
  → Endpointlar: updateChosenProduct, updateChosenUser
```

---

## PPT KO'RSATMALARI

1. **Har endpoint uchun alohida slayd** — 12 ta asosiy slayd
2. **Har slaydda oqim diagrammasi**: Router → Controller → Service → Model → Response
3. **#call** va **#define** belgilarini ishlating — qaysi fayl chaqiradi, qaysi fayl ta'riflaydi
4. **Muhim tushunchalar uchun alohida slaydlar**: verifyRestaurant, bcrypt, shapeIntoMongooseObjectId, SSR vs SPA, { new: true }
5. **Ranglar**:
   - Router: `#569cd6` (ko'k)
   - Controller: `#4ec9b0` (yashil)
   - Service: `#dcdcaa` (sariq)
   - Model/Schema: `#ce9178` (to'q sariq)
   - MongoDB: `#6a9955` (yashil)
   - Xato yo'li: `#f44747` (qizil)
   - Muvaffaqiyat: `#4ec9b0` (yashil)
6. **Har slaydda**: fayl nomi + qator raqami ko'rsatilsin
7. **Oxirgi slayd**: barcha 12 endpoint bir jadvalda (Method, URL, Auth kerakmi, Response turi)

---

## UMUMIY API JADVALI (oxirgi slayd uchun)

| # | Method | URL | Auth | Response |
|---|---|---|---|---|
| 1 | GET | /admin/ | YO'Q | HTML (home.ejs) |
| 2 | GET | /admin/signup | YO'Q | HTML (signup.ejs) |
| 3 | POST | /admin/signup | YO'Q | redirect |
| 4 | GET | /admin/login | YO'Q | HTML (login.ejs) |
| 5 | POST | /admin/login | YO'Q | redirect |
| 6 | GET | /admin/logout | YO'Q | redirect |
| 7 | GET | /admin/check-me | YO'Q | alert script |
| 8 | GET | /admin/product/all | HA | HTML (products.ejs) |
| 9 | POST | /admin/product/create | HA | alert script |
| 10 | POST | /admin/product/:id | HA | JSON |
| 11 | GET | /admin/user/all | HA | HTML (users.ejs) |
| 12 | POST | /admin/user/edit | HA | JSON |

---

*Loyiha: Burak Restaurant Management System*
*Stack: Node.js + TypeScript + Express + MongoDB + EJS + Multer + bcrypt*
*Arxitektura: MVC (Model-View-Controller)*

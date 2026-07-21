# Kahoot Quiz Prompt — Burak (8, 9, 11 Iyul: API va Middleware)

> **Qanday ishlatish:**
> 1. Pastdagi **ASOSIY PROMPT** ni + undan keyingi **SAVOLLAR** bo'limini to'liq nusxalab Claude App'ga tashlang.
> 2. Claude Kahoot formatidagi `.xlsx` fayl yasab beradi.
> 3. Uni Kahoot'ga "Import spreadsheet" orqali yuklaysiz.

---

## 🎯 ASOSIY PROMPT (nusxalab Claude App'ga tashlang)

````
Menga Kahoot uchun tayyor .xlsx (Excel) fayl yasab ber. Quyidagi savollarni Kahoot'ning
rasmiy import shabloniga joyla. Fayl aynan shu ustunlar tartibida bo'lsin (1-qator sarlavha):

  | Question | Answer 1 | Answer 2 | Answer 3 | Answer 4 | Time limit | Correct answer(s) |

QOIDALAR (Kahoot talablari):
- Question ustuni: maksimum 120 belgi.
- Har bir Answer: maksimum 75 belgi.
- Har savolда 4 ta javob (Answer 1–4) to'ldirilsin.
- Time limit: har savolga 30 (soniya).
- Correct answer(s): to'g'ri javob RAQAMI (1, 2, 3 yoki 4). Har savolда bitta to'g'ri javob.
- Jami 48 ta savol (8 mavzu × 6 savol).
- Savollar va javoblar pastdagi ro'yxatdan olinsin. Men to'g'ri javobni ✅ bilan belgiladim —
  uni "Correct answer(s)" ustuniga raqam qilib yoz, javob matnidan ✅ belgisini OLIB TASHLA.
- Sana/mavzuni o'zgartirma, savol matnini qisqartirsang ham ma'nosini saqla.

Natija: bitta yuklab olinadigan .xlsx fayl.
````

---

## 📋 SAVOLLAR (to'g'ri javob ✅ bilan belgilangan)

### 🟦 MAVZU 1 — getProducts API (8 iyul, GET /product/all)

**1.** getProducts qaysi HTTP method va URL bilan ishlaydi?
- ✅ GET /product/all
- POST /product/create
- GET /product/:id
- POST /order/create

**2.** getProducts controllerда ma'lumot qaysi req obyektidan olinadi?
- ✅ req.query
- req.params
- req.body
- req.member

**3.** getProducts service'da MongoDB'ning qaysi usuli ishlatiladi?
- ✅ aggregate()
- findById()
- create()
- deleteOne()

**4.** Aggregation'da sahifalash (pagination) uchun qaysi bosqichlar ishlatiladi?
- ✅ $skip va $limit
- $lookup va $match
- $group va $sort
- $push va $pull

**5.** $skip formulasi qanday?
- ✅ (page - 1) * limit
- page * limit
- page + limit
- limit / page

**6.** getProducts filtri (match) qaysi productStatus'ni qidiradi?
- ✅ PROCESS
- PAUSE
- ACTIVE
- DELETE

---

### 🟦 MAVZU 2 — getProduct API (9 iyul, GET /product/:id)

**1.** getProduct mahsulot id'sini qayerdan oladi?
- ✅ req.params
- req.query
- req.body
- req.cookies

**2.** getProduct routerда qaysi middleware bilan bog'langan?
- ✅ retrieveAuth
- verifyAuth
- makeUploader
- morgan

**3.** getProduct service'da bitta mahsulotni topish uchun nima ishlatiladi?
- ✅ findOne()
- aggregate()
- find()
- create()

**4.** Ko'rishlar sonini oshirish uchun qaysi MongoDB operatori ishlatiladi?
- ✅ $inc
- $set
- $push
- $add

**5.** getProduct'da view hisoblash qachon bajariladi?
- ✅ memberId mavjud bo'lsa (login user)
- har doim
- faqat mehmon bo'lsa
- hech qachon

**6.** String id'ni ObjectId'ga qaysi funksiya aylantiradi?
- ✅ shapeIntoMongooseObjectId
- parseInt
- String()
- JSON.parse

---

### 🟦 MAVZU 3 — View Service (9 iyul)

**1.** checkViewExistence nima uchun kerak?
- ✅ Foydalanuvchi mahsulotni avval ko'rganini tekshirish
- Parolni tekshirish
- Buyurtma yaratish
- Rasm yuklash

**2.** checkViewExistence qaysi ikki maydon bo'yicha qidiradi?
- ✅ memberId va viewRefId
- memberNick va memberPassword
- orderId va productId
- page va limit

**3.** insertMemberView nima qiladi?
- ✅ Yangi ko'rish (view) logini yaratadi
- Ko'rishni o'chiradi
- Mahsulotni yangilaydi
- Foydalanuvchini bloklaydi

**4.** View schema'da memberId qaysi kolleksiyaga ref qiladi?
- ✅ Member
- Product
- Order
- View

**5.** ViewGroup enum'ida qaysi qiymat mavjud?
- ✅ PRODUCT
- ORDER
- MEMBER
- ARTICLE

**6.** insertMemberView'da MongoDB'ning qaysi usuli ishlatiladi?
- ✅ create()
- findOne()
- aggregate()
- deleteOne()

---

### 🟩 MAVZU 4 — createOrder API (11 iyul, POST /order/create)

**1.** createOrder qaysi method va URL bilan ishlaydi?
- ✅ POST /order/create
- GET /order/all
- POST /order/update
- GET /product/all

**2.** createOrder service'ga nimalar uzatiladi?
- ✅ req.member va req.body
- faqat req.query
- faqat req.params
- req.cookies

**3.** Buyurtma jami summasi (amount) qanday hisoblanadi?
- ✅ reduce bilan (itemPrice × itemQuantity) yig'indisi
- faqat itemPrice
- map bilan
- filter bilan

**4.** Yetkazib berish (delivery) narxi qanday aniqlanadi?
- ✅ amount < 100 bo'lsa 5, aks holda 0
- doim 5
- doim 0
- amount ning 10%

**5.** createOrder avval nimani yaratadi?
- ✅ Order (buyurtma sarlavhasi)
- OrderItem
- Product
- Member

**6.** recordOrderItem har bir mahsulotni parallel yozish uchun nimadan foydalanadi?
- ✅ Promise.all
- for loop
- setTimeout
- while

---

### 🟩 MAVZU 5 — getMyOrders API (11 iyul, GET /order/all)

**1.** getMyOrders ma'lumotni qayerdan oladi?
- ✅ req.query (page, limit, orderStatus)
- req.body
- req.params
- req.cookies

**2.** getMyOrders qaysi MongoDB usulini ishlatadi?
- ✅ aggregate()
- findById()
- create()
- updateMany()

**3.** Birinchi $lookup nimani birlashtiradi?
- ✅ orders va orderItems
- orders va members
- products va members
- views va orders

**4.** Ikkinchi $lookup natijasi qaysi nom ostida saqlanadi?
- ✅ productData
- orderItems
- memberData
- viewData

**5.** orders va orderItems qaysi maydon orqali bog'lanadi?
- ✅ orderId
- memberId
- productId
- viewRefId

**6.** getMyOrders faqat kimning buyurtmalarini qaytaradi?
- ✅ Login bo'lgan foydalanuvchining (memberId bo'yicha)
- Barcha foydalanuvchilarning
- Faqat restaurantning
- Hech kimning

---

### 🟩 MAVZU 6 — updateOrder API (11 iyul, POST /order/update)

**1.** updateOrder input'ni qayerdan oladi?
- ✅ req.body (OrderUpdateInput)
- req.query
- req.params
- req.cookies

**2.** updateOrder service'da qaysi usul ishlatiladi?
- ✅ findOneAndUpdate
- aggregate
- create
- deleteOne

**3.** findOneAndUpdate qaysi ikki shart bo'yicha buyurtmani topadi?
- ✅ memberId va _id (orderId)
- productId va orderId
- memberNick va memberPassword
- page va limit

**4.** { new: true } nimani anglatadi?
- ✅ Yangilangandan KEYINgi hujjatni qaytaradi
- Yangi hujjat yaratadi
- Yangilanishdan oldingi hujjatni qaytaradi
- Hujjatni o'chiradi

**5.** Buyurtma statusi PROCESS bo'lganda nima sodir bo'ladi?
- ✅ Foydalanuvchiga +1 ball beriladi (addUserPoint)
- Buyurtma o'chiriladi
- Hech narsa
- Parol o'zgaradi

**6.** addUserPoint metodi qaysi service'da joylashgan?
- ✅ Member.service
- Order.service
- View.service
- Product.service

---

### 🟥 MAVZU 7 — verifyAuth Middleware

**1.** verifyAuth token'ni qayerdan oladi?
- ✅ req.cookies['accessToken']
- req.body
- req.query
- req.params

**2.** Token yo'q yoki xato bo'lsa verifyAuth nima qiladi?
- ✅ 401 xato beradi va so'rovni to'xtatadi
- next() chaqiradi
- redirect qiladi
- rasm yuklaydi

**3.** Token to'g'ri bo'lsa verifyAuth nima qiladi?
- ✅ req.member ni to'ldiradi va next() chaqiradi
- so'rovni to'xtatadi
- 404 beradi
- logout qiladi

**4.** verifyAuth token'ni qanday tekshiradi?
- ✅ jwt.verify orqali (checkAuth)
- bcrypt.compare
- findOne
- aggregate

**5.** verifyAuth qaysi turdagi route'lar uchun ishlatiladi?
- ✅ Himoyalangan (login majburiy)
- Ochiq mehmon sahifalar
- Faqat static fayllar
- Faqat GET so'rovlar

**6.** Order API'larining (create/getMy/update) qaysilarida verifyAuth bor?
- ✅ Uchalasida ham
- Faqat createOrder'da
- Faqat getMyOrders'da
- Hech qaysida

---

### 🟥 MAVZU 8 — retrieveAuth Middleware

**1.** retrieveAuth token yo'q bo'lsa nima qiladi?
- ✅ next() chaqiradi (so'rovni o'tkazadi)
- 401 xato beradi
- so'rovni to'xtatadi
- redirect qiladi

**2.** retrieveAuth qanday turdagi middleware?
- ✅ Yumshoq (ixtiyoriy autentifikatsiya)
- Qattiq qo'riqchi
- Fayl yuklovchi
- Xato ishlovchi

**3.** retrieveAuth qaysi API'da ishlatiladi?
- ✅ getProduct (GET /product/:id)
- createOrder
- login
- signup

**4.** verifyAuth va retrieveAuth ikkalasi ham qaysi service metodini chaqiradi?
- ✅ checkAuth
- createToken
- login
- addUserPoint

**5.** retrieveAuth qanday sahifalar uchun mos?
- ✅ Ochiq, lekin shaxsiylashtirilgan sahifalar
- Faqat admin panel
- To'lov sahifalari
- Login majburiy joylar

**6.** retrieveAuth ichida xato yuz bersa (catch) nima bo'ladi?
- ✅ next() chaqiriladi (davom etadi)
- 500 xato beradi
- so'rov to'xtaydi
- logout qiladi

---

## 💡 MASLAHATLAR
1. **Prompt + Savollar** ni birga tashlang — Claude to'g'ri javoblarni raqamга aylantiradi.
2. Excel tayyor bo'lgach, Kahoot'da: **Create → Import spreadsheet** orqali yuklang.
3. Vaqtni o'zgartirmoqchi bo'lsangiz, promptда "Time limit: 20" deб yozing.
4. Savol ko'p bo'lsa: "faqat 4, 5, 6-mavzularni (Order API) olib xlsx qil" deб so'rashingiz mumkin.

---

*Mavzu: 8, 9, 11 Iyul — getProducts, getProduct, View, createOrder, getMyOrders, updateOrder + verifyAuth/retrieveAuth*
*Jami: 8 mavzu × 6 savol = 48 savol · Format: Kahoot import .xlsx*

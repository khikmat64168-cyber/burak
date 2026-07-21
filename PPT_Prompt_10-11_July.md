# PPT Prompt — Burak Loyihasi: 10–11 Iyul (Order tizimi)

> **Qanday ishlatish:**
> 1. Pastdagi **ASOSIY PROMPT** ni to'liq nusxalab Claude App'ga tashlang.
> 2. **Biriktiriladigan fayllar** ni yuklang.
> 3. ERD (baza sxemasi) **skrinshotini** ham yuklang — order↔orderItems↔products aloqasi uchun.
> 4. Claude chartlar bilan `.pptx` yasab beradi.

---

## 📎 BIRIKTIRILADIGAN FAYLLAR

```
src/controllers/order.controller.ts
src/models/Order.service.ts
src/models/Member.service.ts          (addUserPoint uchun)
src/schema/Order.model.ts
src/schema/OrderItem.model.ts
src/libs/types/order.ts
src/libs/types/enums/order.enum.ts
src/router.ts
```
+ ERD skrinshoti (orders, orderItems, products, members jadvallari ko'rinadigan).

---

## 🎯 ASOSIY PROMPT (nusxalab Claude App'ga tashlang)

````
Men "Burak" restaurant loyihasida (Node.js + TypeScript + Express + MongoDB + Mongoose)
10–11 iyul kunlari BUYURTMA (Order) tizimini yozdim: schema modellar va 3 ta REST API.
Menga bularni to'liq, MOHIYATI bilan tushuntiruvchi PowerPoint yasab ber. Ichida CHARTLAR,
req→res FLOW diagrammalari va baza ALOQA (relationship) diagrammasi bo'lsin.

Biriktirilgan fayllardan va ERD skrinshotidan aniq kod/nomlardan foydalan. Xato qilma.

## 10–11 IYULDA QILINGAN ISHLAR (git commitlar)
- 10 iyul — feat: create order related Schema models
    fayllar: order.enum.ts, Order.model.ts, OrderItem.model.ts
- 11 iyul — feat: develop createOrder rest api
    fayllar: order.controller.ts, order.ts (types), Order.service.ts, router.ts
- 11 iyul — feat: develop getMyOrders rest API
    fayllar: order.controller.ts, order.ts (OrderInquiry), Order.service.ts, router.ts
- 11 iyul — feat: develop updateOrder rest Api
    fayllar: order.controller.ts, order.ts, Member.service.ts (addUserPoint), Order.service.ts, router.ts

## TAQDIMOT TUZILISHI (slaydlar)

### 1. Sarlavha
"Burak — 10–11 Iyul: Buyurtma (Order) Tizimi va REST API'lar"

### 2. Umumiy ko'rinish + CHARTLAR
- CHART (BAR): kun bo'yicha commitlar → 10 iyul: 1 ta (schema), 11 iyul: 3 ta (API).
- CHART (DOUGHNUT): qatlamlar → Schema (2), Enum/Types, Controller, Service.
- Qisqa jadval: qaysi fayl qaysi commitда.

### 3. Baza ALOQA diagrammasi (ERD asosida — MUHIM)
Uchta kolleksiya o'rtasidagi bog'liqlikni chiz (skrinshotга asoslanib):
    members  ←──(memberId)── orders  ──(orderId)──→ orderItems ──(productId)──→ products
Tushuntir:
- orders.memberId  → members._id   (kim buyurtma berdi)
- orderItems.orderId → orders._id   (bu qator qaysi buyurtmaga tegishli)
- orderItems.productId → products._id (bu qator qaysi mahsulot)
"1 order → ko'p orderItems → har biri 1 productga ishora qiladi" g'oyasini strelka bilan ko'rsat.

### 4. order  VS  orderItems — FARQI (MUHIM slayd)
Ikki ustunli solishtirish:
  ORDER (orders) — buyurtmaning UMUMIY sarlavhasi:
    orderTotal, orderDelivery, orderStatus (PAUSE/PROCESS/FINISH/DELETE), memberId
    → "1 ta buyurtma = 1 ta order hujjati"
  ORDER ITEM (orderItems) — buyurtma ICHIDAGI har bir mahsulot qatori:
    itemQuantity, itemPrice, productId, orderId
    → "1 buyurtmada nechta xil mahsulot bo'lsa — shuncha orderItem"
Analogiya: order = kassa cheki (jami, sana), orderItems = chekdagi har bir mahsulot qatori.

### 5. order.ts INTERFACElari qaysi STAGE'da ishga tushadi (MUHIM slayd)
Har interfeys QAYERDA ishlatilishini jadval + oqim bilan ko'rsat:
  | Interfeys          | Qayerda (stage)                    | Vazifasi                         |
  | OrderItemInput[]   | createOrder → req.body             | KIRISH: yangi buyurtma mahsulotlari |
  | OrderInquiry       | getMyOrders → req.query'dan yasaladi| KIRISH: page/limit/orderStatus   |
  | OrderUpdateInput   | updateOrder → req.body             | KIRISH: orderId + yangi status   |
  | Order / OrderItem  | Service qaytaradigan tur (return)  | CHIQISH: javob tuzilishi         |
  | Order.orderItems[] va Order.productData[] | FAQAT aggregation ($lookup) natijasida | bazada yo'q — so'rov paytida qo'shiladi |
MUHIM ta'kid: Order interfeysidagi `orderItems` va `productData` maydonlari BAZADA saqlanmaydi —
ular getMyOrders'dagi $lookup natijasida "runtime"да paydo bo'ladi (order.ts:24 "From Aggregation" izohi).

### 6. API-1: createOrder  [req→res FLOW]
- ROUTER: POST /order/create,  verifyAuth (→ req.member ni to'ldiradi)
- CONTROLLER: orderService.createOrder(req.member, req.body)
    → req.member (kim) + req.body (OrderItemInput[] — nima sotib olyapti)
- SERVICE (Order.service.ts createOrder):
    1) memberId = shapeIntoMongooseObjectId(member._id)
    2) amount = Σ(itemPrice × itemQuantity)   ← reduce bilan jami hisoblanadi
    3) delivery = amount < 100 ? 5 : 0        ← yetkazib berish narxi
    4) orderModel.create({ orderTotal, orderDelivery, memberId })  → yangi ORDER
    5) recordOrderItem(orderId, input) → har bir item uchun orderId+productId qo'yib,
       orderItemModel.create() (Promise.all bilan parallel)
- RESPONSE: res.status(201).json(newOrder)
- Kichik diagramma: 1 order yaratiladi → N ta orderItem yoziladi.

### 7. API-2: getMyOrders  [req→res FLOW + aggregation diagrammasi]
- ROUTER: GET /order/all,  verifyAuth
- CONTROLLER: req.query'dan { page, limit, orderStatus } → OrderInquiry yasaydi
    → orderService.getMyOrders(req.member, inquiry)   (req.member + inquiry)
- SERVICE (getMyOrders) — AGGREGATION quvuri:
    $match { memberId, orderStatus }  → $sort updatedAt  → $skip → $limit (pagination)
    → $lookup #1: orders._id = orderItems.orderId  → "orderItems" massivi
    → $lookup #2: orderItems.productId = products._id → "productData" massivi
- RESPONSE: res.status(...).json({ data: result })  — har order ichida orderItems + productData
- ETIBOR: $lookup nom mosligi — as:'orderItems' bilan keyingi localField:'orderItems.productId'
  AYNAN bir xil (katta I) bo'lishi shart; from:'orderItems' schema'dagi collection nomi bilan mos.

### 8. API-3: updateOrder  [req→res FLOW]
- ROUTER: POST /order/update,  verifyAuth
- CONTROLLER: input = req.body (OrderUpdateInput) → orderService.updateOrder(req.member, input)
    → req.member + input (orderId + yangi orderStatus)
- SERVICE (updateOrder):
    memberId + orderId(input.orderId) → findOneAndUpdate({memberId, _id:orderId}, {orderStatus}, {new:true})
    AGAR yangi status === PROCESS  →  memberService.addUserPoint(member, +1)  ← ball beriladi!
- RESPONSE: res.json(result)
- Kichik qaror diagrammasi: status PROCESS bo'lsa → foydalanuvchiga +1 ball.

### 9. req + MEMBER / req + INPUT / req + MEMBERID — qayerda qo'shiladi (MUHIM slayd)
Jadval bilan aniq ko'rsat:
  | Bosqich | Nima qo'shiladi | Qayerda |
  | verifyAuth (middleware) | req.member | token'dan (member.controller) |
  | createOrder controller  | req.member + req.body        | service'ga uzatiladi |
  | getMyOrders controller  | req.member + inquiry(req.query) | service'ga |
  | updateOrder controller  | req.member + input(req.body)  | service'ga |
  | HAR service ichida      | memberId = shapeIntoMongooseObjectId(member._id) | req.member → memberId ga aylanadi |
Ya'ni oqim: token → verifyAuth → req.member → controller (req.member + input) → service → memberId (ObjectId).

### 10. API'lar SAYTDA qanday ko'rinadi (mockup + vazifa)
Uchtasi uchun oddiy wireframe (quti+matn) chiz:
  - createOrder → "SAVAT / Buyurtma berish" sahifasi: tanlangan mahsulotlar ro'yxati,
    jami narx + yetkazib berish, "Buyurtma berish" tugmasi → items massivini yuboradi.
  - getMyOrders → "MENING BUYURTMALARIM": status bo'yicha tablar (PAUSE/PROCESS/FINISH),
    har order kartochkasi (mahsulot rasmlari + jami), pastda sahifalash.
  - updateOrder → order kartochkasidagi tugmalar: "To'lash" (PAUSE→PROCESS, +1 ball),
    "Bekor qilish" (→DELETE), "Yakunlash" (→FINISH).

### 11. ETIBORLI JOYLAR / nozik nuqtalar (ikonkalar bilan)
- order.orderItems va productData — BAZADA yo'q, faqat aggregation'da paydo bo'ladi.
- $lookup ikki bosqichli: order→orderItems→products (nom mosligi juda muhim).
- amount/delivery hisobi createOrder service'da (reduce).
- updateOrder PROCESS'da +1 ball (addUserPoint) — service'lar bir-birini chaqiradi.
- verifyAuth barcha 3 API'da bor → faqat login user buyurtma qila oladi.
- memberId har doim shapeIntoMongooseObjectId bilan string→ObjectId ga aylantiriladi.

### 12. Yakuniy jadval + CHART
Jadval: | API | Method | URL | req (nima) | input turi | Response |
  createOrder | POST | /order/create | req.member + req.body | OrderItemInput[] | order
  getMyOrders | GET  | /order/all    | req.member + req.query | OrderInquiry | orders[] + lookups
  updateOrder | POST | /order/update | req.member + req.body | OrderUpdateInput | order
CHART (BAR): har API uchun qo'shilgan kod qatorlari (createOrder ~128, getMyOrders ~74, updateOrder ~82).

## DIZAYN
- VS Code dark mavzu, fon #1E1E1E
- Router #569CD6, Controller #4EC9B0, Service #DCDCAA, Model/Schema #CE9178,
  MongoDB #6A9955, Xato yo'li #F44747
- Kod bloklari Consolas (monospace)
- Har slaydда fayl nomi + qator raqami
- FLOW'larda: muvaffaqiyat yashil, xato qizil strelka
- ERD/aloqa diagrammasini quti (jadval) + strelka (foreign key) ko'rinishida chiz
- Saytdagi ko'rinishlarni oddiy wireframe qilib chiz
````

---

## 🎨 QO'SHIMCHA PROMPTLAR (kerak bo'lsa)

**ERD aloqasini chuqurlashtirish:**
```
3-slayddagi baza aloqa diagrammasini kengaytir: har kolleksiya (orders, orderItems,
products, members) uchun kalit maydonlarni ko'rsatib, foreign key strelkalarini
(orders.memberId→members._id, orderItems.orderId→orders._id, orderItems.productId→products._id)
rangli qilib chiz. "1 → ko'p" munosabatlarini belgila.
```

**createOrder ichki oqimini chuqurlashtirish:**
```
createOrder uchun alohida slayd: input massivi → amount hisobi (reduce misoli bilan:
2 mahsulot × narx × son) → delivery (amount<100?5:0) → order yaratish → recordOrderItem
(Promise.all bilan N ta orderItem parallel yozilishi). Buni qadamli diagramma qil.
```

**getMyOrders aggregation'ini chuqurlashtirish:**
```
getMyOrders aggregation quvurini alohida slaydда bosqichma-bosqich chiz:
match → sort → skip → limit → $lookup(orderItems) → $lookup(productData).
Har bosqichda ma'lumot qanday o'zgarishini (order → +orderItems → +productData) ko'rsat.
```

---

## 💡 MASLAHATLAR
1. **Fayllarni + ERD skrinshotini albatta biriktiring** — aniq nom va aloqa uchun.
2. **Bir promptда so'rang** — kontekst yo'qolmasligi uchun.
3. Og'ir bo'lsa: "slaydlar sonini 9 taga tushir" deб so'rang.
4. Saytdagi ko'rinish — Claude wireframe chizadi (real skrinshot emas). Haqiqiy frontend bo'lsa, uni ham yuklang.

---

## 📌 ETIBORLI JOYLAR (siz so'ragan — prompt ichiga singdirilgan)
- ✅ **order vs orderItems farqi** → 4-slayd
- ✅ **order.ts interfeyslari qaysi stage'da ishga tushishi** → 5-slayd (OrderItemInput/OrderInquiry/OrderUpdateInput = kirish; Order/OrderItem = chiqish; orderItems/productData = aggregation)
- ✅ **order, orderInput, products aloqasi (ERD)** → 3-slayd
- ✅ **API'lar saytда ko'rinishi, vazifasi, farqi, input, req, res** → 6,7,8,10,12-slaydlar
- ✅ **req+member / req+input / req+memberId qayerda qo'shiladi** → 9-slayd

*Mavzu: 10–11 Iyul — Order tizimi (schema + createOrder/getMyOrders/updateOrder)*
*Loyiha: Burak Restaurant Management System · MongoDB aggregation + $lookup*

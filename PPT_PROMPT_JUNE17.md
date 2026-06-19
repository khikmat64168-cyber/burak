# PPT Taqdimot Prompti — Burak Loyihasi (17 Iyun 2026)

> Bu faylni to'liq nusxalab Claude App ga bering.

---

## VAZIFA

Men **Node.js + TypeScript + Express + MongoDB + EJS** texnologiyalari bilan
**"Burak"** nomli restaurant boshqaruv tizimini qurmoqdaman.

**17 iyun 2026** kuni quyidagi **3 ta commit** qilindi:

1. `75d6af0` — `feat: develop getUsers business logic`
2. `520f201` — `feat: develop updateChosenUser api`
3. `0cc5561` — `fix: admin frontend publishing`

Shu asosda menga:
1. **Professional PowerPoint taqdimot** yasa (10–14 slayd)
2. Har bir slaydda **Request → Response flow diagrammasi** bo'lsin
3. Har bir kod bloki uchun **qator-qator tushuntirish** yoz
4. **MVC zanjiri** ko'rinishida diagrammalar chiz
5. Texnik terminlarni oddiy so'zlar bilan ham izohlа

---

## COMMIT 1 — `getUsers` business logic

### Nima qilindi:

**1. Member.service.ts** — `getUsers()` metodi qo'shildi:

```typescript
public async getUsers(): Promise<Member[]> {
  const result = await this.memberModel
    .find({ memberType: MemberType.USER })
    .exec();

  if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
  return result;
}
```

**Qator tushuntirishlari:**
- `Promise<Member[]>` — bu metod foydalanuvchilar **massivini** qaytaradi
- `.find({ memberType: MemberType.USER })` — MongoDB dan faqat `USER` tipidagi memberlarni oladi (RESTAURANT tipdagilar kirmaydi — ular admin)
- `.exec()` — Mongoose query ni ishga tushiradi
- `if (!result) throw` — hech narsa topilmasa `NOT_FOUND` xatosi chiqariladi
- `return result` — foydalanuvchilar ro'yxati controller ga qaytariladi

---

**2. restaurant.controller.ts** — `getUsers` controller qo'shildi:

```typescript
restaurantController.getUsers = async (req: Request, res: Response) => {
  try {
    const result = await memberService.getUsers();
    res.render('users', { users: result });
  } catch (err) {
    res.redirect('/admin/login');
  }
};
```

**Qator tushuntirishlari:**
- `await memberService.getUsers()` — Member.service.ts dagi `getUsers` ni chaqiradi
- `res.render('users', { users: result })` — **SSR**: `users.ejs` sahifasiga `users` massivi uzatiladi
- `catch` da `redirect('/admin/login')` — xato bo'lsa login sahifasiga yo'naltiriladi

---

**3. router-admin.ts** — yangi route qo'shildi:

```typescript
routerAdmin.get(
  '/user/all',
  restaurantController.verifyRestaurant,
  restaurantController.getUsers,
);
```

**Qator tushuntirishlari:**
- `GET /user/all` — barcha foydalanuvchilarni ko'rsatish sahifasi
- `verifyRestaurant` — birinchi middleware: session tekshiriladi (faqat RESTAURANT tipi kira oladi)
- `restaurantController.getUsers` — tekshiruv o'tsa, getUsers controller ishlaydi

---

**getUsers Request → Response Flow:**

```
GET /admin/user/all
        │
        ▼
verifyRestaurant middleware
  req.session?.member?.memberType === 'RESTAURANT' ?
        │
       YES → next()          NO → redirect /admin/login
        │
        ▼
getUsers controller
  memberService.getUsers()
        │
        ▼
Member.service.ts
  MemberModel.find({ memberType: 'USER' }).exec()
        │
        ▼
MongoDB "members" kolleksiyasi
  faqat memberType: USER bo'lganlar qaytariladi
        │
        ▼
res.render('users', { users: result })
        │
        ▼
users.ejs → HTML sahifa → Brauzer
```

---

## COMMIT 2 — `updateChosenUser` API

### Nima qilindi:

**1. members.ts** — `MemberUpdateInput` interface qo'shildi:

```typescript
export interface MemberUpdateInput {
  _id: Objectid;        // majburiy — qaysi foydalanuvchini yangilash kerak

  memberStatus?: MemberStatus;   // ixtiyoriy maydonlar
  memberNick?: string;
  memberPhone?: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
}
```

**Tushuntirish:**
- `MemberUpdateInput` — `MemberInput` dan farqli: `_id` majburiy (qaysi user ni yangilash kerakligini bilish uchun)
- `?` belgisi — barcha maydonlar ixtiyoriy, faqat o'zgartiriladigan maydonlar yuboriladi
- `memberType` va `memberPoints` yo'q — ular update qilinmasin deb ataylab qo'shilmagan

---

**2. Member.service.ts** — `updateChosenUser()` metodi qo'shildi:

```typescript
public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
  input._id = shapeIntoMongooseObjectId(input._id);  // (1)
  const result = await this.memberModel
    .findByIdAndUpdate(                               // (2)
      { _id: input._id },                            // (3)
      input,                                         // (4)
      { new: true }                                  // (5)
    ).exec();

  if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED); // (6)
  return result;                                     // (7)
}
```

**Qator tushuntirishlari:**
- **(1)** `shapeIntoMongooseObjectId` — Postman dan kelgan string `"68..." `ni MongoDB ObjectId ga aylantiradi. Aks holda MongoDB topib bera olmaydi
- **(2)** `findByIdAndUpdate` — ID bo'yicha topib, yangilaydigan Mongoose metodi
- **(3)** `{ _id: input._id }` — qaysi hujjatni yangilash kerakligini ko'rsatadi
- **(4)** `input` — Postman dan kelgan yangi qiymatlar (nick, phone, address...)
- **(5)** `{ new: true }` — yangilanishdan KEYIN gi hujjatni qaytaradi (oldingi emas)
- **(6)** Topilmasa yoki yangilanmasa — xato chiqariladi
- **(7)** Yangilangan foydalanuvchi ob'ekti qaytariladi

---

**3. restaurant.controller.ts** — `updateChosenUser` controller to'ldirildi:

```typescript
restaurantController.updateChosenUser = async (req: Request, res: Response) => {
  try {
    const result = await memberService.updateChosenUser(req.body);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
```

**Qator tushuntirishlari:**
- `req.body` — Postman dan kelgan `{ _id, memberNick, ... }` ob'ekt
- `res.status(HttpCode.OK).json({ data: result })` — **JSON** qaytaradi (EJS emas) — bu **SPA** endpoint
- `err instanceof Errors` — biz yozgan xato bo'lsa uning kodi va matni qaytariladi
- `Errors.standard` — noma'lum xato bo'lsa `500 INTERNAL_SERVER_ERROR` qaytariladi

---

**4. router-admin.ts** — yangi route:

```typescript
routerAdmin.post(
  '/user/edit',
  restaurantController.verifyRestaurant,
  restaurantController.updateChosenUser,
);
```

---

**updateChosenUser Request → Response Flow:**

```
POST /admin/user/edit
  Body: { _id: "68a2d...", memberNick: "newNick", memberPhone: "9901234567" }
        │
        ▼
verifyRestaurant → session tekshiruvi → next()
        │
        ▼
updateChosenUser controller
  req.body = { _id: "68a2d...", memberNick: "newNick" }
        │
        ▼
memberService.updateChosenUser(req.body)
        │
        ▼
shapeIntoMongooseObjectId("68a2d...") → ObjectId("68a2d...")
        │
        ▼
MemberModel.findByIdAndUpdate(
  { _id: ObjectId("68a2d...") },   ← topildi
  { memberNick: "newNick", ... },  ← yangilandi
  { new: true }                    ← yangi holat qaytarildi
)
        │
        ▼
res.status(200).json({ data: result })
```

---

## COMMIT 3 — Admin Frontend Publishing

### Nima qilindi:

**Yangi fayllar qo'shildi:**

| Fayl | Vazifa |
|---|---|
| `src/public/css/home.css` | Bosh sahifa dizayni |
| `src/public/css/login.css` | Login sahifa dizayni |
| `src/public/css/signup.css` | Signup sahifa dizayni |
| `src/public/css/products.css` | Mahsulotlar sahifa dizayni |
| `src/public/css/users.css` | Foydalanuvchilar sahifa dizayni |
| `src/public/css/main.css` | Umumiy stillar |
| `src/public/js/home.js` | Bosh sahifa animatsiya (anime.js) |
| `src/public/img/default.jpeg` | Default profil rasmi |
| `src/public/img/favicon.png` | Browser tab ikonkasi |

---

**home.ejs — Session asosida shartli navigatsiya:**

```html
<% if(!member) { %>
  <a href="/admin/signup">Signup</a>
  <a href="/admin/login">Login</a>
<% } else { %>
  <a href="/admin/product/all">Menu</a>
  <a href="/admin/user/all">Users</a>
  <a href="/admin/logout">Logout</a>
<% } %>
```

**Tushuntirish:**
- `<% if(!member) { %>` — EJS shartli blok: `member` session da yo'qmi?
- Login qilmagan → `Signup` va `Login` havolalari ko'rinadi
- Login qilgan → `Menu`, `Users`, `Logout` havolalari ko'rinadi
- Bu ma'lumot `res.locals.member` orqali EJS ga uzatiladi (app.ts da middleware)

---

**users.ejs — Foydalanuvchilar ro'yxati:**

```html
<% if(!member) { %>
  <div>Please login first!</div>
<% } else { %>
  <% users.map(function(value) { %>
    <tr>
      <td><%= value.memberNick %></td>
      <td><%= value.memberPhone %></td>
      <td><%= value.memberStatus %></td>
    </tr>
  <% }) %>
<% } %>
```

**Tushuntirish:**
- Login qilinmagan bo'lsa — "Please login first!" xabari
- Login qilingan bo'lsa — `users` massivi aylanib chiqiladi
- `value.memberNick`, `value.memberPhone` — har bir foydalanuvchi ma'lumotlari jadvalda ko'rsatiladi

---

## 17 IYUN UMUMIY API JADVALI

| Method | URL | Middleware | Natija |
|---|---|---|---|
| GET | /admin/user/all | verifyRestaurant → getUsers | users.ejs (SSR) |
| POST | /admin/user/edit | verifyRestaurant → updateChosenUser | JSON |

---

## BUGUNGI TO'LIQ MVC ZANJIRI

```
┌──────────────────────────────────────────────────────┐
│                  CLIENT                               │
│  GET /admin/user/all  →  barcha userlarni ko'rish    │
│  POST /admin/user/edit →  userni yangilash           │
└──────────────────────────┬───────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────┐
│              router-admin.ts (ROUTER)                 │
│  /user/all  → verifyRestaurant → getUsers            │
│  /user/edit → verifyRestaurant → updateChosenUser    │
└──────────────────────────┬───────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────┐
│         restaurant.controller.ts (CONTROLLER)         │
│  getUsers         → memberService.getUsers()         │
│  updateChosenUser → memberService.updateChosenUser() │
└──────────────────────────┬───────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────┐
│           Member.service.ts (SERVICE)                 │
│  getUsers()         → .find({ memberType: USER })    │
│  updateChosenUser() → .findByIdAndUpdate(...)        │
│                        shapeIntoMongooseObjectId()   │
└──────────────────────────┬───────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────┐
│           Member.model.ts (SCHEMA)                    │
│  Mongoose ↔ MongoDB "members" kolleksiyasi           │
└──────────────────────────────────────────────────────┘
```

---

## FRONTEND ARXITEKTURASI

```
src/public/          ← statik fayllar (Express static middleware)
    css/
      home.css       ← /css/home.css URL bilan chaqiriladi
      users.css
      products.css
    js/
      home.js        ← anime.js bilan sfera animatsiyasi
    img/
      default.jpeg   ← default profil rasmi

src/views/           ← EJS template lar (SSR)
    home.ejs         ← session ga qarab navigatsiya o'zgaradi
    users.ejs        ← users[] massivini jadvalda ko'rsatadi
    products.ejs     ← products[] massivini ko'rsatadi
```

---

## getUsers vs updateChosenUser FARQI

| | getUsers | updateChosenUser |
|---|---|---|
| Method | GET | POST |
| Response | `res.render()` → HTML | `res.json()` → JSON |
| Yondashuv | SSR | SPA/API |
| MongoDB | `.find()` — massiv | `.findByIdAndUpdate()` — bitta |
| Input | yo'q | `req.body` → MemberUpdateInput |

---

## PPT KO'RSATMALARI

1. **3 commit uchun 3 asosiy bo'lim** — har biri 3-4 slayd
2. **Flow diagrammalarni vizual** chiz — strelkalar, rang kodlar
3. **Kod bloklarini** monospace font, har qator raqami bilan
4. **`getUsers` vs `updateChosenUser`** farqini alohida slaydda solishtir
5. **EJS shartli render** (`<% if(member) %>`) ni alohida tushuntir
6. **Frontend arxitektura** — `public/` va `views/` papkalar diagrammasi
7. **Ranglar:** qoramtir fon `#1e1e1e`, yashil `#4ec9b0`, ko'k `#569cd6`, sariq `#dcdcaa`
8. Oxirgi slayd: **O'rganilgan narsalar** — SSR vs SPA, `findByIdAndUpdate`, MemberUpdateInput

---

*Loyiha: Burak Restaurant Management System*
*Muallif: matt | Sana: 17 Iyun 2026*
*Stack: Node.js + TypeScript + Express + MongoDB + EJS*

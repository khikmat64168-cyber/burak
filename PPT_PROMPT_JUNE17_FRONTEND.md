# Excalidraw Prompt — Burak Frontend (17 Iyun 2026)

> Bu promptni Claude browser extension ga nusxalab tashlang.
> Excalidraw da chizib bersin.

---

## VAZIFA

Men Node.js + Express + EJS + CSS + JavaScript bilan qurilgan
**"Burak"** restaurant admin panelining **frontend qismini** tushunmoqchiman.

Quyida frontend fayllar va ular qanday ishlashi batafsil berilgan.
Iltimos **Excalidraw** da quyidagi **4 ta diagramma** chiz:

1. **Fayl tuzilmasi diagrammasi** — qaysi fayl qayerda
2. **Brauzer yuklash jarayoni** — sahifa ochilganda nima sodir bo'ladi
3. **EJS shartli render diagrammasi** — `member` bor/yo'q holatlari
4. **anime.js animatsiya diagrammasi** — home.js qanday ishlaydi

---

## FAYL TUZILMASI

```
src/
├── views/                    ← SERVER tomonida render qilinadigan HTML shablonlar
│   ├── includes/
│   │   ├── header.ejs        ← har sahifaga include qilinadi (Bootstrap, jQuery, axios)
│   │   └── footer.ejs        ← har sahifaga include qilinadi
│   ├── home.ejs              ← bosh sahifa (animatsiya + navigatsiya)
│   ├── users.ejs             ← foydalanuvchilar ro'yxati
│   ├── products.ejs          ← mahsulotlar ro'yxati
│   ├── login.ejs             ← login forma
│   └── signup.ejs            ← ro'yxatdan o'tish forma
│
└── public/                   ← BRAUZER tomonida yuklatiladigan STATIK fayllar
    ├── css/
    │   ├── main.css          ← global stil (html, body: padding/margin 0)
    │   ├── home.css          ← faqat home sahifasi uchun
    │   ├── users.css         ← faqat users sahifasi uchun
    │   ├── products.css      ← faqat products sahifasi uchun
    │   ├── login.css
    │   └── signup.css
    ├── js/
    │   ├── main.js           ← har sahifaga yuklanadi (header orqali)
    │   ├── home.js           ← faqat home sahifasida ishlaydi (anime.js)
    │   ├── users.js          ← faqat users sahifasida ishlaydi
    │   └── products.js       ← faqat products sahifasida ishlaydi
    └── img/
        ├── default.jpeg      ← default profil rasmi
        └── favicon.png       ← browser tab ikonkasi
```

---

## DIAGRAMMA 1 — BRAUZER YUKLASH JARAYONI

Foydalanuvchi `GET /admin` (bosh sahifa) ga kirganda:

```
BRAUZER                    SERVER (Node.js/Express)
   │                                │
   │── GET /admin ─────────────────►│
   │                                │
   │                         app.ts: res.locals.member = req.session.member
   │                                │
   │                         router: restaurantController.goHome
   │                                │
   │                         res.render('home', { member })
   │                                │
   │                     EJS ENGINE ishlaydi:
   │                       1. header.ejs birlashtiradi
   │                       2. if(!member) shartini tekshiradi
   │                       3. HTML generatsiya qiladi
   │                       4. footer.ejs birlashtiradi
   │                                │
   │◄── tayyor HTML (string) ───────│
   │
   │  Brauzer HTML ni oladi va parse qiladi:
   │
   ├── <link href="/css/main.css">     → GET /css/main.css ──► public/css/main.css
   ├── <link href="/css/home.css">     → GET /css/home.css ──► public/css/home.css
   ├── Bootstrap CDN                   → CDN dan yuklanadi
   ├── jQuery CDN                      → CDN dan yuklanadi
   ├── anime.js CDN                    → CDN dan yuklanadi
   └── <script src="/js/home.js">      → GET /js/home.js ───► public/js/home.js
                                                 │
                                          home.js ishlaydi →
                                          sfera animatsiyasi
                                          boshlanadi
```

**Muhim:** Server faqat **bir marta HTML yuboradi**. Keyingi CSS, JS, rasm fayllar brauzer tomonidan **alohida-alohida** so'rov yuborish orqali olinadi.

---

## DIAGRAMMA 2 — header.ejs VA STATIK FAYLLAR

```
HAR BIR SAHIFA YUKLANISHIDA:

home.ejs / users.ejs / products.ejs
         │
         ▼
<%- include('includes/header') %>   ← shu qator boshida bajariladi
         │
         ▼
header.ejs ichida:
┌─────────────────────────────────────────────┐
│  <link href="/css/main.css" />              │  ← global stil
│  Bootstrap CSS (CDN)                        │  ← grid, button, table
│  jQuery (CDN)                               │  ← $ funksiyasi
│  Popper.js (CDN)                            │  ← Bootstrap dropdown
│  Bootstrap JS (CDN)                         │  ← modal, collapse
│  axios (CDN)                                │  ← AJAX so'rovlar uchun
│  <script src="/js/main.js" />               │  ← loyiha global JS
└─────────────────────────────────────────────┘
         │
         ▼
Keyin sahifaning o'z CSS va JS fayllari qo'shiladi:
┌─────────────────────────────────────────────┐
│  home.ejs:  + home.css  + anime.js + home.js│
│  users.ejs: + users.css + users.js          │
│  login.ejs: + login.css                     │
└─────────────────────────────────────────────┘
```

---

## DIAGRAMMA 3 — EJS SHARTLI RENDER (`if member`)

```
SERVER: res.render('home', { member: req.session.member })
                                    │
                              member = ?
                    ┌───────────────┴───────────────┐
                    │                               │
               member = null               member = { memberNick, ... }
            (login qilinmagan)              (login qilingan)
                    │                               │
                    ▼                               ▼
         ┌──────────────────┐           ┌───────────────────────┐
         │  NAVIGATSIYA:    │           │  NAVIGATSIYA:         │
         │  • Home          │           │  • Home               │
         │  • Signup        │           │  • Menu               │
         │  • Login         │           │  • Users              │
         └──────────────────┘           │  • Logout             │
                                        └───────────────────────┘

EJS kodi:
<% if(!member) { %>           ← SERVER bu shartni tekshiradi
  <a href="/admin/signup">    ← Signup havola
  <a href="/admin/login">     ← Login havola
<% } else { %>
  <a href="/admin/product/all">  ← Menu
  <a href="/admin/user/all">     ← Users
  <a href="/admin/logout">       ← Logout
<% } %>

MUHIM: Bu JavaScript emas — EJS server tomonida ishlaydi.
Brauzer faqat tayyor <a> teglarini ko'radi, <% %> teglarini ko'rmaydi.
```

---

## DIAGRAMMA 4 — home.js / anime.js ANIMATSIYA

```
home.ejs yuklanganda:

1. SVG sfera HTML ichida bor:
   <svg class="sphere">
     <path d="M361.604..."/>   ← 21 ta path elementi
     <path d="M360.72..."/>
     ... (jami 21 ta)
   </svg>

2. home.js ishlaydi:

   fitElementToParent(sphereEl)
   ├── sphereEl.offsetWidth o'lchanadi
   ├── parentEl.offsetWidth o'lchanadi
   ├── ratio = parent / element
   └── anime.set(el, { scale: ratio })  ← o'lcham moslanadi
       window.addEventListener('resize') ← oyna o'zgarganda qayta hisoblaydi

3. 3 ta animatsiya parallel ishga tushadi:

   introAnimation (anime.timeline)
   ├── har bir path uchun strokeDashoffset: [setDashoffset → 0]
   ├── 3900ms davomida
   └── stagger(190ms) — har path bir-biridan kechikib chiziladi
          │
          ▼  (chiziq chizilish effekti)

   breathAnimation (anime loop)
   ├── har path ni sin() funksiyasi bilan harakatlantiradi
   ├── stroke rangi: qizil ↔ kulrang
   ├── translateX/Y: [2, -4] — titroq harakat
   └── duration: Infinity — doim ishlaydi
          │
          ▼  (nafas olish effekti)

   shadowAnimation
   ├── #sphereGradient gradient pozitsiyasi o'zgaradi
   ├── x1: 5% → 25%, y2: 15% → 75%
   └── 30000ms — sekin soya siljishi
          │
          ▼  (soya effekti)

NATIJA: Sfera brauzerda paydo bo'lib, nafas olayotgandek
        harakat qiladi va soya siljiydi.
```

---

## DIAGRAMMA 5 — users.ejs BRAUZERDA QANDAY KO'RINADI

```
HOLAT 1: login qilinmagan
┌─────────────────────────────────┐
│  Burak Admin                    │  ← favicon.png (tab da)
├─────────────────────────────────┤
│  Home | SignUp | Login          │  ← navigatsiya
├─────────────────────────────────┤
│                                 │
│   Please login first!           │  ← katta matn
│                                 │
└─────────────────────────────────┘

HOLAT 2: login qilingan
┌─────────────────────────────────┐
│  Burak Admin                    │
├─────────────────────────────────┤
│  Home | Menu | Users | Logout   │  ← to'liq navigatsiya
├─────────────────────────────────┤
│  All Users List                 │
│ ┌──────────────────────────────┐│
│ │ No │ Name  │ Phone │ Status  ││  ← Bootstrap jadval
│ ├────┼───────┼───────┼─────────┤│
│ │ 1  │ David │ 82... │[ACTIVE▼]││  ← select dropdown
│ └──────────────────────────────┘│
└─────────────────────────────────┘

member-status select:
<select class="spec-select member-status">
  <option value="ACTIVE">ACTIVE</option>   ← tanlangan
  <option value="BLOCK">BLOCK</option>
  <option value="DELETE">DELETE</option>
</select>
→ users.js bu selectni tinglaydi va POST /admin/user/edit ga yuboradi
```

---

## STATIK FAYLLAR QANDAY YUBORILADI?

```
app.ts da:
app.use(express.static(path.join(__dirname, 'public')));

Bu nima qiladi:
public/ papkasidagi BARCHA fayllarni URL orqali ochiq qiladi

Misol:
public/css/home.css   →  http://localhost:3003/css/home.css
public/js/home.js     →  http://localhost:3003/js/home.js
public/img/favicon.png → http://localhost:3003/img/favicon.png

EJS da chaqirilishi:
<link href="/css/home.css" />    ← brauzer bu URL ga GET so'rov yuboradi
<script src="/js/home.js" />     ← brauzer bu URL ga GET so'rov yuboradi

Express bu so'rovni ushlab, public/ papkasidan faylni topib yuboradi.
Controller ham, router ham ishlamaydi — faqat static middleware.
```

---

## EXCALIDRAW CHIZISH KO'RSATMALARI

1. **Diagramma 1** (Brauzer yuklash) — chapda SERVER, o'ngda BRAUZER, o'rtada strelkalar
2. **Diagramma 2** (header.ejs) — vertikal zanjir, har blok ranglar bilan
3. **Diagramma 3** (EJS shartli) — ikki yo'nalishli fork diagrammasi (member bor/yo'q)
4. **Diagramma 4** (anime.js) — 3 parallel animatsiya oqimi
5. **Diagramma 5** (brauzer oynasi) — haqiqiy brauzer oynasini chiz, ichida UI

**Ranglar:**
- Server bloklar: `#2d2d2d` (qoramtir)
- Brauzer bloklar: `#1a3a5c` (ko'k)
- EJS bloklar: `#4ec9b0` (yashil)
- JS bloklar: `#dcdcaa` (sariq)
- CSS bloklar: `#569cd6` (ko'k)
- CDN bloklar: `#ce9178` (to'q sariq)
- Xato yo'li: `#f44747` (qizil)
- Muvaffaqiyat yo'li: `#4ec9b0` (yashil)

**Har bir blokda:**
- Fayl nomi (yuqorida kichik)
- Asosiy funksiya (katta)
- Qaysi sahifada ishlashi

---

*Loyiha: Burak Restaurant Management System*
*Frontend: EJS (SSR) + CSS + anime.js + Bootstrap + axios*
*Sana: 17 Iyun 2026*

# PPT Taqdimot Prompti — Burak Loyihasi (7–8 Iyun 2026)

> Bu faylni to'liq nusxalab browser Claude ga bering.

---

## VAZIFA

Men Node.js + TypeScript + Express + MongoDB texnologiyalari bilan
**"Burak"** nomli restaurant boshqaruv tizimini qurmoqdaman.

Quyida 7-iyun va 8-iyun 2026 kunlari qilgan ishlarim batafsil tasvirlangan.
Shu ma'lumotlar asosida menga **professional PowerPoint taqdimot** yasa.

---

## LOYIHA HAQIDA UMUMIY MA'LUMOT

| Parametr | Qiymat |
|---|---|
| Loyiha nomi | Burak — Restaurant Management System |
| Backend | Node.js + TypeScript |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| View Engine | EJS (Server Side Rendering) |
| Arxitektura | MVC (Model → Service → Controller → Router) |
| Paket menejeri | npm |

---

## 7-IYUN 2026 — Commit: `feat: integrate middleware sessions`

### Nima qilindi:
- `express-session` va `connect-mongodb-session` paketlari o'rnatildi
- `src/app.ts` faylida MongoDB ga ulanadigan **persistent session store** yaratildi
- Session middleware butun Express ilovaga ulandi (`app.use(session(...))`)

### Texnik tafsilotlar:
```
Session sozlamalari:
  - maxAge     → 3 soat (1000 × 3600 × 60 × 3 ms)
  - secret     → .env faylidan o'qiladi (SESSION_SECRET)
  - store      → MongoDB, "sessions" kolleksiyasi
  - resave     → true
  - saveUninitialized → true
```

### Texnik ma'no:
Foydalanuvchi login qilgandan keyin uning ma'lumotlari MongoDB dagi
`sessions` kolleksiyasida saqlanadi. Server qayta ishga tushsa ham
session yo'qolmaydi — bu **persistent session** deyiladi.

---

## 8-IYUN 2026

### Commit 1 — `fix: create sessions on login and signup process` (02:58)

**Nima qilindi:**
- `src/libs/types/members.ts` da TypeScript **module augmentation** yozildi:
  `express-session` ning `SessionData` interfeysiga `member` property qo'shildi
- `AdminRequest` interfeysi yaratildi — Express `Request` dan `extend` qilinib,
  `member` va `session` propertylarini o'z ichiga oladi
- `processLogin` va `processSignup` metodlarida `req.session.member = result`
  orqali foydalanuvchi ma'lumoti sessionga saqlanmoqda
- `ERRORS.md` faylida barcha xatolar va yechimlar hujjatlashtirildi

**Kod namunasi:**
```typescript
// members.ts
declare module 'express-session' {
  interface SessionData {
    member: Member;
  }
}

export interface AdminRequest extends Request {
  member: Member;
  session: Session & { member: Member };
}
```

**Texnik ma'no:**
Login yoki Signup muvaffaqiyatli bo'lganda foydalanuvchi ob'ekti
serverda session orqali saqlanadi. Keyingi har bir so'rovda
kim ekanini bilish mumkin bo'ladi.

---

### Commit 2 — `feat: create checkAuthSession api` (14:08)

**Nima qilindi:**
- `restaurantController.checkAuthSession` metodi yozildi
- `GET /admin/check-me` route ulandi
- Session tekshiruvi: `req.session?.member` mavjud bo'lsa —
  foydalanuvchi nomi (memberNick) alertda ko'rsatiladi
- Session yo'q bo'lsa — `NOT_AUTHENTICATED` xabari qaytariladi

**Kod namunasi:**
```typescript
if (req.session?.member)
  res.send(`<script>alert("${req.session.member.memberNick}")</script>`);
else
  res.send(`<script>alert("NOT_AUTHENTICATED")</script>`);
```

**Texnik ma'no:**
Foydalanuvchi hozir tizimga kirganligi yoki kirmaganligini
tekshirish uchun maxsus API endpoint yaratildi — bu **authentication check** deyiladi.

---

### Commit 3 — `feat: develop logout process` (15:15)

**Nima qilindi:**
- `restaurantController.logout` metodi yozildi
- `req.session.destroy()` orqali MongoDB dagi session hujjati o'chiriladi
- Session o'chgandan so'ng `/admin` sahifasiga redirect qilinadi
- `GET /admin/logout` route ulandi

**Kod namunasi:**
```typescript
req.session.destroy(() => {
  res.redirect('/admin');
});
```

**Texnik ma'no:**
Foydalanuvchi tizimdan chiqishi (logout) to'liq amalga oshirildi.
MongoDB dagi session hujjati o'chib, foydalanuvchi anonim holatga qaytadi.

---

### Commit 4 — `feat: R taskni qildim` (15:33)

**Nima qilindi:**
- `train.py` faylida Python mashqi (R-TASK) bajarildi
- `calculate("1 + 3")` → `4` qaytaradigan funksiya yozildi
- String ko'rinishidagi matematik ifodani parse qilib hisoblaydi
- `split(" ")` bilan 3 qismga ajratiladi: son → operator → son

**Kod namunasi:**
```python
def calculate(expression: str) -> int:
    parts = expression.split()
    a, operator, b = int(parts[0]), parts[1], int(parts[2])
    if operator == "+": return a + b
    elif operator == "-": return a - b
    elif operator == "*": return a * b
    elif operator == "/": return a // b
```

---

## UMUMIY NATIJA (2 KUN ICHIDA)

| Soha | Natija |
|---|---|
| Session yaratish | Login va Signup da avtomatik session saqlanadi |
| Session tekshirish | `/admin/check-me` endpoint orqali auth holati aniqlanadi |
| Session o'chirish | `/admin/logout` orqali to'liq logout amalga oshirildi |
| TypeScript | `AdminRequest` interfeysi va module augmentation yozildi |
| Xatolar hujjati | 9 ta xato `ERRORS.md` faylida qayd etildi |
| Python mashqi | R-TASK: string expression calculator yozildi |

### Yangi API Endpointlar:

| Method | URL | Vazifasi |
|---|---|---|
| POST | /admin/signup | Ro'yxatdan o'tish + session yaratish |
| POST | /admin/login | Tizimga kirish + session yaratish |
| GET | /admin/logout | Tizimdan chiqish + session o'chirish |
| GET | /admin/check-me | Authentication holatini tekshirish |

---

## SO'ROV OQIMI DIAGRAMMASI

```
Client (Browser)
     │
     ▼
Express Middleware (app.ts)
     │
     ├── express-session ──► MongoDB "sessions" kolleksiyasi
     │
     ▼
Router-Admin (router-admin.ts)
     │
     ▼
Restaurant Controller
     │
     ├── processSignup → MemberService → MongoDB "members"
     │        └── req.session.member = result
     │
     ├── processLogin  → MemberService → bcrypt.compare()
     │        └── req.session.member = result
     │
     ├── checkAuthSession → req.session?.member tekshiradi
     │
     └── logout → req.session.destroy() → redirect
```

---

## PPT UCHUN KO'RSATMALAR

1. **Har bir commit uchun alohida slayd** yasa
2. Slaydlarda **kod bloklarini** qo'sh (monospace font bilan)
3. **So'rov oqimi diagrammasini** vizual ko'rinishda chiz (strelkalar bilan)
4. Texnik terminlarni **oddiy so'zlar bilan** ham tushuntir
5. Har bir slaydda **"Texnik ma'no"** qismi bo'lsin
6. **Ranglar sxemasi**: qoramtir fon, yashil yoki ko'k aksent (developer uslubi)
7. Oxirgi slaydda: **O'rganilgan narsalar va keyingi reja**
8. Jami slaydlar soni: **8–10 ta**

---

*Loyiha: Burak Restaurant Management System*
*Muallif: matt*
*Sana: 7–8 Iyun 2026*

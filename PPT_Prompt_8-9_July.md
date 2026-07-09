# PPT Prompt — Burak Loyihasi: 8–9 Iyul Ishlari

> **Qanday ishlatish:**
> 1. Quyidagi **ASOSIY PROMPT** ni to'liq nusxalab Claude App'ga tashlang.
> 2. Pastdagi **"Biriktiriladigan fayllar"** ro'yxatidagi fayllarni ham yuklang.
> 3. Claude `.pptx` fayl yasab beradi (chartlar bilan).
> 4. Kerak bo'lsa **Qo'shimcha promptlar** dan foydalaning.

---

## 📎 BIRIKTIRILADIGAN FAYLLAR

```
src/controllers/product.controllers.ts
src/models/Product.service.ts
src/models/View.service.ts
src/schema/View.model.ts
src/libs/types/product.ts
src/libs/types/view.ts
src/libs/types/enums/view.enum.ts
src/router.ts
```

---

## 🎯 ASOSIY PROMPT (nusxalab Claude App'ga tashlang)

````
Men "Burak" restaurant loyihasida (Node.js + TypeScript + Express + MongoDB + EJS/React)
8–9 iyul kunlari REST API'lar va View (ko'rishlarni kuzatish) tizimini yozdim.
Shu ishlarni, ularning ISHLASH FLOW'ini va MANTIG'INI tushuntiruvchi PowerPoint
taqdimot yasab ber. Ichida CHARTLAR va req→res FLOW diagrammalari bo'lsin.

Biriktirilgan fayllardan aniq kod va qator raqamlarini o'qib foydalan.

## 8–9 IYULDA QILINGAN ISHLAR (git commitlar)

- 8 iyul — feat: develop getProducts rest API
    fayllar: product.controllers.ts, product.ts (ProductInquery), Product.service.ts, router.ts
- 9 iyul — feat: develop getProduct business logic
    fayllar: product.controllers.ts, Product.service.ts, router.ts (/product/:id)
- 9 iyul — feat: create view schema and service Models
    fayllar: view.enum.ts, View.service.ts, View.model.ts
- 9 iyul — fix: modify getProducts business logic
    fayllar: view.ts, Product.service.ts, View.service.ts

## TAQDIMOT TUZILISHI (slaydlar)

### 1. Sarlavha slaydi
"Burak — 8–9 Iyul: getProducts / getProduct REST API va View tizimi"

### 2. Umumiy ko'rinish + CHART
- CHART (BAR): kun bo'yicha commitlar → 8 iyul: 1 ta, 9 iyul: 3 ta.
- CHART (DOUGHNUT): ish turlari → API (getProducts, getProduct), Schema/Model (View), Fix.
- Qisqa jadval: qaysi fayl qaysi commitда o'zgargan.

### 3. Arxitektura eslatmasi (oqim)
Browser → router.ts → controller → service → MongoDB → Response
(Ranglar bilan: Router ko'k, Controller yashil, Service sariq, Model to'q sariq, MongoDB yashil)

### 4. getProducts — REST API (RO'YXAT)  [req→res FLOW diagrammasi]
- ROUTER: GET /product/all
- CONTROLLER (product.controllers.ts, getProducts): req.query dan { page, limit, order,
  productCollection, search } olib, ProductInquery obyektini yasaydi.
- SERVICE (Product.service.ts, getProducts): MongoDB aggregation:
    $match (productStatus: PROCESS + collection + search regex)
    → $sort → $skip → $limit  (ya'ni SAHIFALASH / pagination)
- RESPONSE: res.json(mahsulotlar massivi)
- Alohida kichik CHART/diagramma: aggregation pipeline bosqichlari
  (match → sort → skip → limit) va $skip formulasi: (page-1) * limit

### 5. getProduct — bitta mahsulot + VIEW hisoblash  [req→res FLOW diagrammasi]
- ROUTER: GET /product/:id  (retrieveAuth middleware bilan — token bo'lsa kim ekanini biladi)
- CONTROLLER (getProduct): req.params.id (as string) + req.member?._id (bo'lmasa null)
- SERVICE (getProduct):
    1) findOne({_id, productStatus: PROCESS})  → bitta mahsulot
    2) AGAR login (memberId bor):
        - viewService.checkViewExistence  → bu user avval ko'rganmi?
        - ko'rmagan bo'lsa → insertMemberView (yangi view log)
        - productViews ni +1 oshiradi ($inc)
- RESPONSE: res.json(bitta mahsulot)
- Bu slaydда "faqat login bo'lgan user ko'rishni oshiradi" mantig'ini ta'kidla.

### 6. View tizimi — Schema & Service  [diagramma]
- View.model.ts: viewGroup (PRODUCT), memberId (ref: Member), viewRefId, timestamps
- View.service.ts: checkViewExistence (takrorni tekshiradi), insertMemberView (yozadi)
- MANTIQ: bir user bir mahsulotni necha marta ochsa ham — ko'rish faqat BIR marta
  sanaladi (checkViewExistence buni ta'minlaydi). "Kim nimani ko'rgan" jurnali.
- Kichik diagramma: Member —(ko'rdi)→ View log —(ref)→ Product

### 7. getProducts vs getProduct — FARQI (MUHIM slayd)
Ikki ustunli solishtirish + har biri uchun FRONTEND ko'rinishi (mockup rasm):

  getProducts (ko'plik):
    - Vazifa: KATALOG / ro'yxat — ko'p mahsulot
    - Kirish: req.query (?page, limit, search, productCollection)
    - Natija: mahsulotlar massivi
    - FRONTEND ko'rinishi: mahsulot kartochkalari GRID'i (3-4 ustun), qidiruv qatori,
      "Dish/Drink" filtr tugmalari, pastda sahifalash (1,2,3...)
    - MOCKUP chiz: kartochkalar to'ri (rasm + nom + narx), tepada search+filter

  getProduct (birlik):
    - Vazifa: BITTA mahsulot batafsil sahifasi
    - Kirish: req.params.id (URL'dan)
    - Natija: bitta mahsulot + ko'rishlar soni oshadi
    - FRONTEND ko'rinishi: bitta mahsulot sahifasi — katta rasm, nom, narx, tavsif,
      "ko'rishlar: N", "savatga" tugmasi
    - MOCKUP chiz: chapda katta rasm, o'ngda nom/narx/tavsif/tugma

### 8. Frontendda qanday ishlaydi (foydalanuvchi oqimi)  [diagramma]
Katalog (getProducts) → foydalanuvchi bitta kartochkani bosadi
   → mahsulot sahifasi (getProduct) → ko'rishlar +1
Bu oqimni strelkalar bilan ko'rsat (list → detail).

### 9. Muhim tushunchalar (ikonkalar bilan)
- Aggregation pipeline nima (match/sort/skip/limit)
- Pagination formulasi: skip = (page - 1) * limit
- retrieveAuth: token bo'lsa kim ekanini biladi, bo'lmasa ham o'tkazadi (mehmon)
- View dedupe: checkViewExistence bir userni bir marta sanaydi
- ObjectId: shapeIntoMongooseObjectId (string → ObjectId)

### 10. Yakuniy jadval + CHART
Jadval: | API | Method | URL | Kirish | Natija | Auth |
CHART (BAR): har API endpoint uchun qo'shilgan kod qatorlari soni.

## DIZAYN
- VS Code dark mavzu, fon #1E1E1E
- Router #569CD6 (ko'k), Controller #4EC9B0 (yashil), Service #DCDCAA (sariq),
  Model/Schema #CE9178 (to'q sariq), MongoDB #6A9955 (yashil), Xato yo'li #F44747 (qizil)
- Kod bloklari Consolas (monospace)
- Har slaydda fayl nomi + qator raqami ko'rsatilsin
- req→res flow'larda: muvaffaqiyat yo'li yashil, xato yo'li qizil strelka
- getProducts va getProduct frontend mockuplarini oddiy wireframe (quti + matn) ko'rinishida chiz
````

---

## 🎨 QO'SHIMCHA PROMPTLAR (kerak bo'lsa)

**Frontend mockuplarini kuchaytirish:**
```
7 va 8-slaydlardagi frontend ko'rinishlarni yanada aniq wireframe qilib chiz:
- getProducts: 3x2 mahsulot kartochkalari to'ri, har kartochkada [rasm] + nom + narx,
  tepada qidiruv input va DISH/DRINK filtr tugmalari, pastda 1 2 3 sahifalash.
- getProduct: chapda katta mahsulot rasmi (katta quti), o'ngda nom (katta), narx,
  tavsif matni, "👁 ko'rishlar: 42", "Savatga qo'shish" tugmasi.
Ikkalasini yonma-yon bitta slaydда solishtir.
```

**Aggregation / pagination chartini kuchaytirish:**
```
getProducts aggregation pipeline uchun alohida slayd: match → sort → skip → limit
bosqichlarini quvur (pipeline) ko'rinishida chiz. Pastda misol:
page=2, limit=3 → skip = (2-1)*3 = 3 → 4,5,6-mahsulotlar. Buni jadval bilan ko'rsat.
```

**View tizimi flow'ini kuchaytirish:**
```
View hisoblash mantig'i uchun alohida flow slaydi:
getProduct → login bormi? → YO'Q: shunchaki mahsulot qaytadi.
→ HA: checkViewExistence → avval ko'rganmi? → YO'Q: insertMemberView + productViews +1;
HA: hech narsa qo'shilmaydi. Buni qaror daraxti (decision tree) ko'rinishida chiz.
```

---

## 💡 MASLAHATLAR

1. **Fayllarni albatta biriktiring** — Claude aniq kod va qator raqamlarini o'qiб slayd yasaydi.
2. **Bir promptda so'rang** — bo'lib yuborsangiz kontekst yo'qolishi mumkin.
3. Natija og'ir bo'lsa: *"slaydlar sonini 8 taga tushir"* deб so'rang.
4. Frontend rasm uchun Claude wireframe (quti+matn) chizadi — real skrinshot emas.
   Agar sizda haqiqiy frontend sahifa bo'lsa, uning skrinshotini ham yuklang.

---

*Mavzu: 8–9 Iyul — getProducts / getProduct REST API va View tizimi*
*Loyiha: Burak Restaurant Management System*
*Stack: Node.js + TypeScript + Express + MongoDB + Mongoose (aggregation)*

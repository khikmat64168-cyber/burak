# Loyihadagi Xatolar va Sabablari

## 1. `Session` noto'g'ri importlangan
**Fayl:** `src/libs/types/members.ts`  
**Xato:** `import { Session } from 'inspector'`  
**Sabab:** `Session` tipi `inspector` modulidan emas, `express-session` dan import qilinishi kerak.  
**Yechim:** `import { Session } from 'express-session'`

---

## 2. `req.session.member` TypeScript tomonidan tanilmadi
**Fayl:** `src/controllers/restaurant.controller.ts:130`  
**Xato:** `Property 'member' does not exist on type 'Session & Partial<SessionData>'`  
**Sabab:** `express-session` ning `SessionData` interfacei `member` propertyni bilmaydi.  
**Yechim:** `members.ts` da module augmentation yozildi:
```ts
declare module 'express-session' {
  interface SessionData {
    member: Member;
  }
}
```

---

## 3. `processSignup` yangi foydalanuvchini qo'shmadi
**Fayl:** `src/models/Member.service.ts:114`  
**Xato:** `Errors: Create failed`  
**Sabab:** Kodda bazada birorta `RESTAURANT` tipdagi member bor-yo'qligi tekshiriladi. `Burak` allaqachon bazada bo'lgani uchun yangi foydalanuvchi qo'shilmadi.  
**Yechim:** Tekshiruv vaqtincha commentga olindi.

---

## 4. `memberPassword` `select: false` muammosi
**Fayl:** `src/models/Member.service.ts`  
**Xato:** `isMatch: false` — parol to'g'ri bo'lsa ham xato berdi.  
**Sabab:** `Member.model.ts` da `memberPassword` maydoni `select: false` deb belgilangan. Oddiy projection `{ memberPassword: 1 }` bu maydonni qaytarmaydi.  
**Yechim:** `.select('+memberPassword')` ishlatildi.

---

## 5. `class` tashqarisida metod yozildi
**Fayl:** `src/models/Member.service.ts`  
**Xato:** `Module has no default export`  
**Sabab:** `signup` va `login` metodlari `class MemberService {}` ning yopuvchi `}` dan tashqarisiga yozildi.  
**Yechim:** Metodlar class ichiga ko'chirildi.

---

## 6. `bcryptjs` type deklaratsiyasi topilmadi
**Fayl:** `src/models/Member.service.ts:7`  
**Xato:** `Could not find a declaration file for module 'bcryptjs'`  
**Sabab:** `@types/bcryptjs` o'rnatilgan bo'lsa ham `index.d.ts` fayli to'liq yuklanmagan edi.  
**Yechim:** `npm remove @types/bcryptjs && npm install -D @types/bcryptjs`

---

## 7. Router da noto'g'ri metod nomi
**Fayl:** `src/router.ts:42`  
**Xato:** `Route.post() requires a callback function but got [object Undefined]`  
**Sabab:** `memberController.Signup` — bosh harf bilan yozilgan, lekin controller da `signup` (kichik harf).  
**Yechim:** `memberController.signup` va `memberController.login` deb tuzatildi.

---

## 8. `tsconfig.json` yo'q edi
**Xato:** `SyntaxError: Unexpected token 'export'`  
**Sabab:** `ts-node` TypeScript fayllarni `tsconfig.json` siz oddiy JS sifatida o'qidi.  
**Yechim:** `tsconfig.json` yaratildi.

---

## 9. `AdminRequest` da `req.body` tanilmadi
**Fayl:** `src/controllers/restaurant.controller.ts:130`  
**Xato:** `Property 'body' does not exist on type 'AdminRequest'` (TS2339)  
**Sabab:** `AdminRequest` interfacei Express ning `Request` dan extend qilinmagan edi. Shu sababli `req.body`, `req.params`, `req.query` kabi Express standart propertylari TypeScript tomonidan tanilmadi.  
**Yechim:** `src/libs/types/members.ts` da `AdminRequest` ga `extends Request` qo'shildi:
```ts
import { Request } from 'express';

export interface AdminRequest extends Request {
  member: Member;
  session: Session & { member: Member };
}
```

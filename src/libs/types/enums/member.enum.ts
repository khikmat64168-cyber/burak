/**
 * ┌─────────┐
 *  │ PHASE 0 │ ─── KOD KETMA-KETLIK OQIMI
 *  └─────────┘
 *  ─── KOD TAHLILI ──────────────────────────────────────────────────
 *  Bu fayl Member uchun enum ta'riflarini saqlaydi. MemberType
 *  va MemberStatus enumlari schema, service va controllerlarda
 *  ishlatiladi. PHASE 0 — barcha qatlamlar uchun asosiy
 *  ma'lumotnoma bo'lib xizmat qiladi.
 *  ──────────────────────────────────────────────────────────────────
 */

export enum MemberType {
  USER = 'USER',
  RESTAURANT = 'RESTAURANT',
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  BLOCK = 'BLOCK',
  DELETE = 'DELETE',
}

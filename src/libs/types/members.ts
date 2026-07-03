/**
 * ┌─────────┐
 *  │ PHASE 0 │ ─── KOD KETMA-KETLIK OQIMI
 *  └─────────┘
 *  ─── KOD TAHLILI ──────────────────────────────────────────────────
 *  Bu fayl Member, MemberInput va LoginInput TypeScript
 *  interfacelarini ta'riflaydi. Controller, service va schema
 *  qatlamlari bu tiplardan foydalanadi. PHASE 0 — type safety
 *  ta'minlash uchun barcha qatlamlardan oldin tayyor turadi.
 *  ──────────────────────────────────────────────────────────────────
 */

// If @types/mongodb is not installed, fall back to any to avoid TS errors.
// When @types/mongodb is available, replace this with: import { ObjectId } from 'mongodb';
type ObjectId = any;
import { MemberType, MemberStatus } from './enums/member.enum';
import { Request } from 'express';
import { Session } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    member: Member;
  }
}

export interface Member {
  // #define — Member.service.ts, restaurant.controller.ts, members.ts da ishlatiladi
  _id: ObjectId;
  memberType: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberInput {
  // #define — processSignup da req.body tipi sifatida ishlatiladi
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints?: number;
}

export interface LoginInput {
  // #define — processLogin da req.body tipi sifatida ishlatiladi
  memberNick: string;
  memberPassword: string;
}

export interface MemberUpdateInput {
  _id: ObjectId;

  memberStatus?: MemberStatus;
  memberNick?: string;
  memberPhone?: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
}

export interface AdminRequest extends Request {
  // #define — controller larda req tipi sifatida ishlatiladi
  member: Member;
  session: Session & { member: Member };
  file: Express.Multer.File;
  files: Express.Multer.File[];
}

export interface ExtendedRequest extends Request {
  member: Member;
  file: Express.Multer.File;
  files: Express.Multer.File[];
}

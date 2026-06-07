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

import { Objectid } from 'mongodb';
import { MemberType, MemberStatus } from './enums/member.enum';
import { Request } from 'express';
import { Session } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    member: Member;
  }
}

export interface Member {
  _id: Objectid;
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
  memberNick: string;
  memberPassword: string;
}

export interface AdminRequest extends Request {
  member: Member;
  session: Session & { member: Member };
}

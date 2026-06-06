/**
 * ┌─────────┐
 *  │ PHASE 6 │ ─── KOD KETMA-KETLIK OQIMI
 *  └─────────┘
 *  ─── KOD TAHLILI ──────────────────────────────────────────────────
 *  Bu fayl MongoDB uchun Member schema va modelini ta'riflaydi.
 *  Oqimning oxirgi nuqtasi — service bu model orqali database
 *  bilan to'g'ridan-to'g'ri muloqot qiladi. Barcha maydonlar,
 *  validatsiya qoidalari va indekslar shu yerda belgilanadi.
 *  Oqim: server.ts → app.ts → router → controller → service → [Member.model.ts]
 *  ──────────────────────────────────────────────────────────────────
 */

import mongoose, { Schema } from 'mongoose';
import { MemberStatus, MemberType } from '../libs/types/enums/member.enum';

// Schema based & Code based hosil qilish usullari bor

const memberSchema = new Schema(
  {
    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.USER,
    },

    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },

    memberNick: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPhone: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPassword: {
      type: String,
      select: false,
      required: true,
    },

    memberAddress: {
      type: String,
    },

    memberDec: {
      type: String,
    },

    memberImage: {
      type: String,
    },

    memberPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }, // updated at va deleted at ni qo'yib beradi
);

export default mongoose.model('Member', memberSchema);

/**
 * ┌─────────┐
 *  │ PHASE 0 │ ─── KOD KETMA-KETLIK OQIMI
 *  └─────────┘
 *  ─── KOD TAHLILI ──────────────────────────────────────────────────
 *  Bu fayl loyiha konfiguratsiya konstantalarini saqlaydi.
 *  MORGAN_FORMAT — app.ts da morgan middleware ga uzatiladigan
 *  log format satri. PHASE 0 — dastur ishga tushishidan oldin
 *  tayyor turadi.
 *  ──────────────────────────────────────────────────────────────────
 */

import mongoose from 'mongoose';

export const MORGAN_FORMAT = ':method :url :response-time [:status] \n';

export const shapeIntoMongooseObjectId = (target: any) => {
  return typeof target === 'string'
    ? new mongoose.Types.ObjectId(target)
    : target;
};

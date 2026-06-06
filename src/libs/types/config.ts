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

export const MORGAN_FORMAT =
  ':method :url  :res[content-length] - :response-time  [:status] \n';

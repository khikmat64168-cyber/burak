/**
 * ┌─────────┐
 *  │ PHASE 5 │ ─── KOD KETMA-KETLIK OQIMI
 *  └─────────┘
 *  ─── KOD TAHLILI ──────────────────────────────────────────────────
 *  Bu fayl biznes logika qatlamini (Service Layer) ifodalaydi.
 *  Controller dan kelgan ma'lumotlarni qayta ishlaydi: validatsiya,
 *  bcrypt hashing, database bilan muloqot. MemberModel (schema)
 *  ni inject qilib, MongoDB ga so'rov yuboradi.
 *  Oqim: server.ts → app.ts → router → controller → [Member.service.ts] → schema
 *  ──────────────────────────────────────────────────────────────────
 */

///// Modullar :schema yoki service farqi yo'q classdan tashkil topga n bo'ladi

import { MemberInput, Member, LoginInput } from '../libs/types/members';
import MemberModel from '../schema/Member.model';
import Errors, { HttpCode, Message } from '../libs/types/Errors';
import { MemberType } from '../libs/types/enums/member.enum';
import * as bcrypt from 'bcryptjs';

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * Bu yerda MemberService nomli class e'lon qilinmoqda. Uning ichida
 * private readonly memberModel property mavjud — bu property faqat
 * constructor ichida bir marta qiymat olib, keyinchalik o'zgartirib
 * bo'lmaydi (readonly). constructor() ichida esa MemberModel (Mongoose
 * schema modeli) this.memberModel ga assign qilinmoqda.
 * ──────────────────────────────────────────────────────────────────
 */
class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  ////////// ======  SPA   ========////////////

  /**
   * ─── KOD TAHLILI ──────────────────────────────────────────────────
   * signup — public async metod bo'lib, MemberInput tipidagi
   * input argumentini qabul qiladi va Promise<Member> qaytaradi.
   * ──────────────────────────────────────────────────────────────────
   */
  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    // const exist = await this.memberModel
    //   .findOne({ memberType: MemberType.RESTAURANT })
    //   .exec();

    // console.log('exist:', exist);
    // if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

    // console.log(' before:', input.memberPassword);
    // console.log(' after:', input.memberPassword);

    try {
      const result = await this.memberModel.create(input);
      console.log('Passed here');

      result.memberPassword = '';
      return result.toJSON();
    } catch (err) {
      console.error('Error, model:signup', err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }
  }

  /**
   * ─── KOD TAHLILI ──────────────────────────────────────────────────
   * login — public async metod bo'lib, LoginInput tipidagi
   * input argumentini qabul qiladi va Promise<Member> qaytaradi.
   * ──────────────────────────────────────────────────────────────────
   */
  public async login(input: LoginInput): Promise<Member> {
    //TODO: Consider Member status later
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick },
        { memberPassword: 1, memberNick: 1 },
      )
      .exec();
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword,
    );
    console.log('isMatch:', isMatch);

    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);

    return await this.memberModel.findById(member._id).lean().exec();
  }

  ////////// ======  SSR  ========////////////

  /**
   * ─── KOD TAHLILI ──────────────────────────────────────────────────
   * processSignup — public async metod bo'lib, MemberInput tipidagi
   * input argumentini qabul qiladi va Promise<Member> qaytaradi.
   * ──────────────────────────────────────────────────────────────────
   */
  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel
      .findOne({ memberType: MemberType.RESTAURANT })
      .exec();

    console.log('exist:', exist);
    if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

    /**
     * ─── KOD TAHLILI ──────────────────────────────────────────────────
     * bcrypt.genSalt() — tasodifiy salt (tuz) generatsiya qiladi.
     * bcrypt.hash() — input.memberPassword ni shu salt yordamida
     * bir tomonlama hash ga aylantiradi va natijani input.memberPassword
     * ga reassignment qiladi.
     * ──────────────────────────────────────────────────────────────────
     */
    console.log(' before:', input.memberPassword);
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    console.log(' after:', input.memberPassword);

    /**
     * ─── KOD TAHLILI ──────────────────────────────────────────────────
     * this.memberModel.create(input) — Mongoose ning statik create
     * metodiga input argumentini uzatib, yangi hujjat yaratamiz.
     * result.memberPassword bo'sh stringga reassignment qilinadi —
     * response qaytishidan oldin parol yashiriladi.
     * ──────────────────────────────────────────────────────────────────
     */
    try {
      const result = await this.memberModel.create(input);
      console.log('Passed here');

      result.memberPassword = '';
      return result;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  /**
   * ─── KOD TAHLILI ──────────────────────────────────────────────────
   * processLogin — public async metod bo'lib, LoginInput tipidagi
   * input argumentini qabul qiladi va Promise<Member> qaytaradi.
   * findOne() orqali memberNick bo'yicha bazadan foydalanuvchi
   * qidiriladi. bcrypt.compare() bilan parol taqqoslanadi.
   * ──────────────────────────────────────────────────────────────────
   */
  public async processLogin(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne({ memberNick: input.memberNick })
      .select('+memberPassword')
      .exec();
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

    /**
     * ─── KOD TAHLILI ──────────────────────────────────────────────────
     * bcrypt.compare() — foydalanuvchi kiritgan ochiq parolni
     * bazadagi hash qilingan parol bilan taqqoslaydi va boolean
     * natija qaytaradi.
     * ──────────────────────────────────────────────────────────────────
     */
    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword,
    );
    console.log('isMatch:', isMatch);

    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);

    /**
     * ─── KOD TAHLILI ──────────────────────────────────────────────────
     * findById(member._id) — avval topilgan memberning _id si orqali
     * to'liq hujjatni bazadan qayta so'raymiz va await orqali qaytaramiz.
     * ──────────────────────────────────────────────────────────────────
     */
    return await this.memberModel.findById(member._id).exec();
  }
}

export default MemberService;

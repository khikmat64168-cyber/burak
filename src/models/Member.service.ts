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

import {
  MemberInput,
  Member,
  LoginInput,
  MemberUpdateInput,
} from '../libs/types/members';
import MemberModel from '../schema/Member.model';
import Errors, { HttpCode, Message } from '../libs/types/Errors';
import { MemberStatus, MemberType } from '../libs/types/enums/member.enum';
import * as bcrypt from 'bcryptjs';
import { shapeIntoMongooseObjectId } from '../libs/types/config';

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
  // #define — restaurant.controller.ts da new MemberService() qilib chaqiriladi
  private readonly memberModel; // #define — faqat shu class ichida ishlatiladi (private)

  constructor() {
    this.memberModel = MemberModel; // #call — Member.model.ts dan import qilingan model
  }

  ////////// ======  SPA   ========////////////

  public async getRestaurant(): Promise<Member> {
    const result = await this.memberModel
      .findOne({ memberType: MemberType.RESTAURANT })
      .lean()
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  /**
   * ─── KOD TAHLILI ──────────────────────────────────────────────────
   * signup — public async metod bo'lib, MemberInput tipidagi
   * input argumentini qabul qiladi va Promise<Member> qaytaradi.
   * ──────────────────────────────────────────────────────────────────
   */
  public async signup(input: MemberInput): Promise<Member> {
    // #define — #call: restaurant.controller.ts signup metodida chaqiriladi
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
    // #define — #call: restaurant.controller.ts login metodida chaqiriladi
    //TODO: Consider Member status later
    const member = await this.memberModel
      .findOne(
        // #call — Member.model.ts (MongoDB) ga so'rov yuboradi
        {
          memberNick: input.memberNick,
          memberStatus: { $ne: MemberStatus.DELETE },
        },
        { memberPassword: 1, memberNick: 1, memberStatus: 1 }, // memberStatus ham qaytarilishi shart (blok tekshiruvi uchun)
      )
      .exec();
    /**
     * ─── KOD TAHLILI ──────────────────────────────────────────────────
     * Status tekshiruvi (yangi mantiq):
     *   1. Nick topilmasa → NOT_FOUND (NO_MEMBER_NICK).
     *   2. Topilgan a'zoning memberStatus === BLOCK bo'lsa → login rad
     *      etiladi: 403 FORBIDDEN (BLOCKED_USER).
     * MUHIM: yuqoridagi findOne projection da memberStatus AYNAN shu nom
     * bilan (kichik m) so'ralishi shart. Inclusion projection { x: 1 } da
     * maydon nomi xato yozilsa (masalan MemberStatus), MongoDB uni jim
     * e'tiborsiz qoldiradi → member.memberStatus = undefined bo'lib,
     * "undefined === 'BLOCK'" har doim false → blok tekshiruvi ishlamaydi.
     * Yana findOne filtrida memberStatus !== DELETE — o'chirilgan a'zolar
     * umuman qidiruvga tushmaydi.
     * ──────────────────────────────────────────────────────────────────
     */
    if (!member)
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK); // #call — Errors.ts dan
    else if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }

    console.log('member:', member);

    const isMatch = await bcrypt.compare(
      // #call — bcryptjs kutubxonasidan
      input.memberPassword,
      member.memberPassword,
    );
    console.log('isMatch:', isMatch);

    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD); // #call — Errors.ts dan

    return await this.memberModel.findById(member._id).lean().exec(); // #call — Member.model.ts (MongoDB)
  }

  public async getAllMembers(member: Member): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async updateMember(
    memmber: Member,
    input: MemberUpdateInput,
  ): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(memmber._id);
    const result = await this.memberModel
      .findOneAndUpdate({ _id: memberId }, input, { new: true })
      .exec();
    return result;
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  public async getTopUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({ memberStatus: MemberStatus.ACTIVE, memberPoints: { $gt: 1 } })
      .sort({ memberPoints: +1 })
      .limit(4)
      .exec();
    return result;
  }
  ////////// ======  SSR  ========////////////

  /**
   * ─── KOD TAHLILI ──────────────────────────────────────────────────
   * processSignup — public async metod bo'lib, MemberInput tipidagi
   * input argumentini qabul qiladi va Promise<Member> qaytaradi.
   * ──────────────────────────────────────────────────────────────────
   */
  public async processSignup(input: MemberInput): Promise<Member> {
    // #define — #call: restaurant.controller.ts processSignup da chaqiriladi
    // const exist = await this.memberModel
    //   .findOne({ memberType: MemberType.RESTAURANT })
    //   .exec();
    // console.log('exist:', exist);
    // if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

    /**
     * ─── KOD TAHLILI ──────────────────────────────────────────────────
     * bcrypt.genSalt() — tasodifiy salt (tuz) generatsiya qiladi.
     * bcrypt.hash() — input.memberPassword ni shu salt yordamida
     * bir tomonlama hash ga aylantiradi va natijani input.memberPassword
     * ga reassignment qiladi.
     * ──────────────────────────────────────────────────────────────────
     */
    console.log(' before:', input.memberPassword);
    const salt = await bcrypt.genSalt(); // #call — bcryptjs: tasodifiy "tuz" generatsiya qiladi
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt); // #call — bcryptjs: parolni hash ga aylantiradi
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
      const result = await this.memberModel.create(input); // #call — Member.model.ts (MongoDB) ga yozadi
      console.log('Passed here');

      result.memberPassword = ''; // parol response ga chiqmasin deb tozalanadi
      return result;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED); // #call — Errors.ts dan
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
    // #define — #call: restaurant.controller.ts processLogin da chaqiriladi
    const member = await this.memberModel
      .findOne({ memberNick: input.memberNick }) // #call — Member.model.ts (MongoDB): nick bo'yicha qidiradi
      .select('+memberPassword') // memberPassword schema da select:false, shuning uchun qo'lda so'rash kerak
      .exec();
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK); // #call — Errors.ts dan

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
    return await this.memberModel.findById(member._id).exec(); // #call — Member.model.ts (MongoDB): to'liq profil qaytaradi
  }

  public async getUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({ memberType: MemberType.USER })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }
  public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
    input._id = shapeIntoMongooseObjectId(input._id);
    const result = await this.memberModel
      .findByIdAndUpdate({ _id: input._id }, input, { new: true })
      .exec();

    if (!result) throw new Errors(HttpCode.BAD_REQUEST, Message.UPDATE_FAILED);
    return result;
  }
}

export default MemberService;

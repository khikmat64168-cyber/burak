/**
 * ┌─────────┐
 *  │ PHASE 0 │ ─── KOD KETMA-KETLIK OQIMI
 *  └─────────┘
 *  ─── KOD TAHLILI ──────────────────────────────────────────────────
 *  Bu fayl loyiha bo'ylab ishlatiladigan xato tizimidir.
 *  HttpCode va Message enumlari barcha qatlamlarda (controller,
 *  service) import qilinadi. PHASE 0 — chunki bu yordamchi
 *  modul bo'lib, oqim boshlanishidan oldin tayyor turadi.
 *  ──────────────────────────────────────────────────────────────────
 */

export enum HttpCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
  SOMETHING_WENT_WRONG = 'Something went wrong',
  NO_DATA_FOUND = 'No data found',
  CREATED_AT = 'Created at',
  UPDATED_AT = 'Updated at',
  CREATE_FAILED = 'Create failed',
  UPDATE_FAILED = 'Update failed',

  USED_NICK_PHONE = ' You are inserting already used nick or phone',
  NO_MEMBER_NICK = 'No member with this nick',
  BLOCKED_USER = 'You have been blocked , contact restaurant',
  WRONG_PASSWORD = 'Wrong password, please try again',
  NOT_AUTHENTICATED = 'You are not authenticated , please login first ',
  TOKEN_CREATION_FAILED = 'Token creation error',
}

class Errors extends Error {
  public code: HttpCode;
  public message: Message;

  static standard = {
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
  };

  constructor(statusCode: HttpCode, statusMessage: Message) {
    super();
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;

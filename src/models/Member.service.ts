///// Modullar :schema yoki service farqi yo'q classdan tashkil topga n bo'ladi

import { MemberInput, Member } from '../libs/types/members';
import MemberModel from '../schema/Member.model';
import Errors, { HttpCode, Message } from '../libs/types/Errors';
import { MemberType } from '../libs/types/enums/member.enum';

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }
  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel
      .findOne({ memberType: MemberType.RESTAURANT })
      .exec();

    console.log('exist:', exist);
    if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

    try {
      const result = await this.memberModel.create(input);
      console.log('Passed here');

      // const tempResult = new this.memberModel(input);
      // const result = await tempResult.save();

      result.memberPassword = '';
      return result;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default MemberService;

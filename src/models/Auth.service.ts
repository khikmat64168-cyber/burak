import { Member } from '../libs/types/members';
import { AUTH_TIMER } from '../libs/types/config';
import jwt from 'jsonwebtoken';
import Errors from '../libs/types/Errors';
import { HttpCode, Message } from '../libs/types/Errors';

class AuthService {
  retrieveAuth(token: any): any {
    throw new Error('Method not implemented.');
  }
  private readonly secretToken;
  constructor() {
    this.secretToken = process.env.SECRET_TOKEN as string;
  }

  public async createToken(payload: Member) {
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIMER}h`;
      jwt.sign(
        payload,
        process.env.SECRET_TOKEN as string,
        { expiresIn: duration },
        (err, token) => {
          if (err)
            reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED),
            );
          else resolve(token as string);
        },
      );
    });
  }

  public async checkAuth(token: string): Promise<Member> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretToken, (err, decoded) => {
        if (err)
          return reject(
            new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED),
          );
        console.log('err:', err);
        const result = decoded as Member;
        console.log(`----- [AUTH] memberNick: ${result.memberNick} -----`);
        resolve(result);
      });
    });
  }
}

export default AuthService;

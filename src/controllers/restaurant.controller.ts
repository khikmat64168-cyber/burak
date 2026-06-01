//controllerlar objectlar orqali hosil qilinadi

import { Request, Response } from 'express';

import { T } from '../libs/types/common';

import MemberService from '../models/Member.service';
import { MemberInput } from '../libs/types/members';
import { MemberType } from '../libs/types/enums/member.enum';

const restaurantController: T = {};
restaurantController.goHome = (req: Request, res: Response) => {
  try {
    res.send('Home page');
    //response turlari : send , json , render , redirect ,  end
  } catch (err) {
    console.log('Error. goHome:', err);
  }
};
/////////nega routerdagi mantiq controllerga ko'chirildi ??????
///////// export bilan export defaut farqi nimada ?

restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    console.log('getLogin');
    res.send('Login page');
  } catch (err) {
    console.log('Error. getLogin:', err);
  }
};

restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    console.log('getSignup');
    res.send('Signup page');
  } catch (err) {
    console.log('Error. getSignup:', err);
  }
};

restaurantController.processLogin = (req: Request, res: Response) => {
  try {
    console.log('processLogin');
    res.send('DONE');
  } catch (err) {
    console.log('Error. processLogin:', err);
  }
};

restaurantController.processSignup = async (req: Request, res: Response) => {
  try {
    console.log('processSignup');
    console.log('body:', req.body);
    const newMember: MemberInput = req.body;
    newMember.memberType = MemberType.RESTAURANT;

    const memberService = new MemberService();
    const result = await memberService.processSignup(newMember);

    res.send(result);
  } catch (err) {
    console.log('Error. processSignup:', err);
    res.send(err);
    // res.status(500).json({ message: 'Server error', error: err });
  }
};

//memberControllerri  routerni ichida chaqrib olishimiz uchun export qilishimiz kerak

//Loyihamizda controller va service larni alohida fayllarda saqlaymiz , chunki controller faqatgina request va response bilan ishlaydi , service esa biznes logikani amalga oshiradi , bu esa kodni yanada toza va tartibli qiladi

// Loyihamizda requestlarni turini chop etish uchun Morgan middleware ni ishlatamiz , bu esa bizga requestlarni tahlil qilish va loglash imkonini beradi

export default restaurantController;

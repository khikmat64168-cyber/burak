import OrderItemModel from '../schema/OrderItem.model';

import OrderModel from '../schema/Order.model';
import { Member } from '../libs/types/members';
import { Order, OrderItemInput } from '../libs/types/order';
import { shapeIntoMongooseObjectId } from '../libs/types/config';
import Errors, { HttpCode, Message } from '../libs/types/Errors';
import { ObjectId } from 'mongoose';
class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
  }

  public async createOrder(
    member: Member,
    input: OrderItemInput[],
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
      return accumulator + item.itemPrice * item.itemQuantity;
    }, 0);
    const delivery = amount < 100 ? 5 : 0;
    // console.log('values:', amount, delivery);
    try {
      const newOrder: Order = await this.orderModel.create({
        orderTotal: amount + delivery,
        orderDelivery: delivery,
        memberId: memberId,
      });

      const orderId = newOrder._id;

      console.log('orderId:', newOrder._id);
      ///.  TODO : create order tems

      await this.recordOrderItem(orderId, input);
      return newOrder;
    } catch (err) {
      console.log('Error, model: createOrder:', err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  private async recordOrderItem(
    orderId: ObjectId,
    _input: OrderItemInput[],
  ): Promise<void> {
    const promisedList = _input.map(async (item: OrderItemInput) => {
      item.orderId = orderId;
      item.productId = shapeIntoMongooseObjectId(item.productId);
      await this.orderItemModel.create(item);
      return 'INSERTED';
    });

    console.log('promisedList', promisedList);
    const orderItemState = await Promise.all(promisedList);

    console.log('orderItemsState:', orderItemState);
  }
}

export default OrderService;

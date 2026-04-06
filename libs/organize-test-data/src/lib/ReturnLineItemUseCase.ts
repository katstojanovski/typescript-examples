import { Order, ReturnReason } from './Order';
import { OrderRepository } from './OrderRepository';

export class ReturnLineItemUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(params: {
    orderId: string;
    lineItemId: number;
    returnQuantity: number;
    reason: ReturnReason;
  }): Promise<Order> {
    const order = await this.orderRepository.get(params.orderId);

    const updatedOrder = order.returnLineItem(
      params.lineItemId,
      params.returnQuantity,
      params.reason,
    );

    return this.orderRepository.save(updatedOrder);
  }
}

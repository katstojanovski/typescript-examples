import { Order, ReturnReason } from './Order';
import { OrderRepository } from './OrderRepository';

export class ReturnLineItemUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(
    orderId: string,
    lineItemId: number,
    returnQuantity: number,
    reason: ReturnReason,
  ): Promise<Order> {
    const order = await this.orderRepository.get(orderId);

    const updatedOrder = order.returnLineItem(
      lineItemId,
      returnQuantity,
      reason,
    );

    return this.orderRepository.save(updatedOrder);
  }
}

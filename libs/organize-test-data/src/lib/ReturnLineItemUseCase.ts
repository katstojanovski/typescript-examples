import { LineItem, Order, ReturnReason } from './Order';
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

    const lineItemTest = new LineItem({
      id: 1,
      orderedQuantity: 5,
      returned: [],
    });

    const lineItemTest2 = new LineItem({
      id: 1,
      orderedQuantity: 100,
      returned: [],
    });

    const mapTest = new Map<number, LineItem>();
    mapTest.set(1, lineItemTest);

    const orderTest = new Order({
      id: '2',
      lineItems: mapTest,
    });

    console.log('Order Test:', orderTest);

    (orderTest.lineItems as any).set(1, lineItemTest2);

    console.log('Updated Order Test', orderTest);

    console.log(Object.isFrozen(orderTest));
    console.log(Object.isFrozen(orderTest.lineItems));
    console.log(Object.isFrozen(orderTest.lineItems.get(1)));

    const updatedOrder = order.returnLineItem(
      lineItemId,
      returnQuantity,
      reason,
    );

    return this.orderRepository.save(updatedOrder);
  }
}

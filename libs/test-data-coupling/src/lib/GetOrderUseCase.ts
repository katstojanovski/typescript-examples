import { formatAddress } from './FormatAddress';
import { OrderRepository } from './OrderRepository';

export type GetOrderResponse = {
  orderId: string;
  deliveryAddress: string;
};

export class GetOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(params: { orderId: string }): Promise<GetOrderResponse> {
    const { orderId } = params;

    const order = await this.orderRepository.get(orderId);

    return {
      orderId: order.id,
      deliveryAddress: formatAddress(order.address),
    };
  }
}

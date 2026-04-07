import { Order } from './Order';

export interface OrderRepository {
  get(orderId: string): Promise<Order>;
  save(order: Order): Promise<Order>;
}

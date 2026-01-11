import { Order } from './Order';
import { TypedOrder } from './TypedOrder';

export interface OrderRepository {
  get(orderId: string): Promise<Order>;
  save(order: Order): Promise<Order>;

  getType(orderId: string): Promise<TypedOrder>;
  saveType(order: TypedOrder): Promise<TypedOrder>;
}

import { Order } from './Order';

export interface OrderRepository {
  get(id: string): Promise<Order>;
}

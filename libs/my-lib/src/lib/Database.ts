import { Order } from './Order';

export interface Database {
  get(id: string): Promise<Order>;
}

import { Order } from './Order';

export interface Database {
  getAll(): Promise<Order[]>;
}

import { Database } from './Database';
import { Order } from './Order';

export class OrderRepository {
  constructor(private readonly database: Database) {}

  get(id: string): Promise<Order> {
    return this.database.get(id);
  }
}

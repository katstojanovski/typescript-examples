import { Database } from './Database';
import { Order } from './Order';

export class OrderRepository {
  constructor(private readonly database: Database) {}

  async get(id: string): Promise<Order> {
    const order = await this.database.get(id);
    // Uncomment this line to see the test results change
    // order.customerId = '3fcfab8b-0340-4af9-ac5b-6f06ced2607f';
    return order;
  }
}

import { Database } from './Database';
import { Order } from './Order';

export class OrderRepository {
  constructor(private readonly database: Database) {}

  async getAll(): Promise<Order[]> {
    const orders = await this.database.getAll();

    // Uncomment these lines to see the test results change

    // collection size
    // orders[0] = { id: '9999999999' };

    // single collection element
    // orders.push({ id: '8888888888' });

    // expected same as given
    // orders[0].id = '7777777777';

    return orders;
  }
}

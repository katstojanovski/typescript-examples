import { LineItem, Order } from './Order';

describe('immutability', () => {
  it('should not mutate line items', () => {
    const lineItem = new LineItem({
      id: 1,
      orderedQuantity: 5,
      returned: [],
    });

    const lineItems = new Map<number, LineItem>();
    lineItems.set(1, lineItem);

    const order = new Order({
      id: '1234567890',
      lineItems,
    });

    const lineItemUpdated = new LineItem({
      id: 1,
      orderedQuantity: 100,
      returned: [],
    });

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (order.lineItems as any).set(1, lineItemUpdated);
    }).toThrow('Cannot modify a frozen Map');
  });

  it('should not mutate line items when changing constructor parameter objects', () => {
    const lineItem = new LineItem({
      id: 1,
      orderedQuantity: 5,
      returned: [],
    });

    const lineItems = new Map<number, LineItem>();
    lineItems.set(1, lineItem);

    const order = new Order({
      id: '1234567890',
      lineItems,
    });

    const lineItemUpdated = new LineItem({
      id: 1,
      orderedQuantity: 100,
      returned: [],
    });

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (order.lineItems as any).set(1, lineItemUpdated);
    }).toThrow('Cannot modify a frozen Map');
  });
});

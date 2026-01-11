import { createTypedLineItem, createTypedOrder } from './TypedOrder';

describe('immutability', () => {
  it('should not mutate line items', () => {
    const order = createTypedOrder({
      id: '1234567890',
      lineItems: [{ 1: { id: 1, orderedQuantity: 5, returned: [] } }],
    });

    const lineItemUpdated = createTypedLineItem({
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

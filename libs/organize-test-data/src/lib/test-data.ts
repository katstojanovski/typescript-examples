import { LineItem, Order } from './Order';

export const orderId = '1234567890';
export const lineItemId = 1;
export const returnQuantity = 2;
export const reason = 'DAMAGED';
export const orderedQuantity = 5;

export const order: Order = new Order({
  id: orderId,
  lineItems: new Map([
    [
      lineItemId,
      new LineItem({
        id: lineItemId,
        orderedQuantity,
        returned: [{ quantity: returnQuantity, reason }],
      }),
    ],
  ]),
});

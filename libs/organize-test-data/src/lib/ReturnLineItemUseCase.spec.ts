import { LineItem, Order } from './Order';
import { OrderRepository } from './OrderRepository';
import { ReturnLineItemUseCase } from './ReturnLineItemUseCase';
import { mock } from 'jest-mock-extended';
import { when } from '@lib/test-helpers';

const systemUnderTest = () => {
  const repositoryMock = mock<OrderRepository>();
  const useCase = new ReturnLineItemUseCase(repositoryMock);

  return {
    repositoryMock,
    useCase,
  };
};

describe('ReturnLineItemUseCase', () => {
  it('should return a line item from an order - VERBOSE', async () => {
    const { repositoryMock, useCase } = systemUnderTest();

    const orderId = 'order123';
    const lineItemId = 1;
    const returnQuantity = 2;
    const reason = 'DAMAGED';

    const initialOrder = new Order({
      id: orderId,
      lineItems: new Map([
        [
          lineItemId,
          new LineItem({
            id: lineItemId,
            orderedQuantity: 5,
            returned: [],
          }),
        ],
      ]),
    });

    const updatedOrder = new Order({
      id: orderId,
      lineItems: new Map([
        [
          lineItemId,
          new LineItem({
            id: lineItemId,
            orderedQuantity: 5,
            returned: [{ quantity: returnQuantity, reason }],
          }),
        ],
      ]),
    });

    when(repositoryMock.get)
      .calledWith(orderId)
      .mockResolvedValue(initialOrder);

    when(repositoryMock.save)
      .calledWith(updatedOrder)
      .mockResolvedValue(updatedOrder);

    const expected = new Order({
      id: orderId,
      lineItems: new Map([
        [
          lineItemId,
          new LineItem({
            id: lineItemId,
            orderedQuantity: 5,
            returned: [{ quantity: returnQuantity, reason }],
          }),
        ],
      ]),
    });

    const actual = await useCase.execute(
      orderId,
      lineItemId,
      returnQuantity,
      reason,
    );

    expect(actual).toEqual(expected);
  });

  it('mutation succeeds at runtime if not frozen', () => {
    const items = new Map<number, LineItem>();
    items.set(1, new LineItem({ id: 1, orderedQuantity: 2, returned: [] }));
    const order = new Order({ id: 'order1', lineItems: items });
    console.log(order);

    // You cannot mutate item properties, but you *can replace the reference* in the map:
    (order.lineItems as any).set(
      1,
      new LineItem({ id: 1, orderedQuantity: 100, returned: [] }),
    );

    console.log(order);

    // Now the order contains a completely new LineItem
  });
});

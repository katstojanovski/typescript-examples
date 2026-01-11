import { LineItem, Order } from './Order';
import { OrderRepository } from './OrderRepository';
import { ReturnLineItemUseCase } from './ReturnLineItemUseCase';
import {
  createTypedLineItem,
  createTypedOrder,
  normalizeTypedOrder,
} from './TypedOrder';
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

    expect(actual.normalize()).toEqual(expected.normalize());
  });

  it('should return a line item from a typed order - VERBOSE', async () => {
    const { repositoryMock, useCase } = systemUnderTest();

    const orderId = 'order123';
    const lineItemId = 1;
    const returnQuantity = 2;
    const reason = 'DAMAGED';

    const initialOrder = createTypedOrder({
      id: orderId,
      lineItems: new Map([
        [
          lineItemId,
          createTypedLineItem({
            id: lineItemId,
            orderedQuantity: 5,
            returned: [],
          }),
        ],
      ]),
    });

    const updatedOrder = createTypedOrder({
      id: orderId,
      lineItems: new Map([
        [
          lineItemId,
          createTypedLineItem({
            id: lineItemId,
            orderedQuantity: 5,
            returned: [{ quantity: returnQuantity, reason }],
          }),
        ],
      ]),
    });

    when(repositoryMock.getType)
      .calledWith(orderId)
      .mockResolvedValue(initialOrder);

    when(repositoryMock.saveType)
      .calledWith(updatedOrder)
      .mockResolvedValue(updatedOrder);

    const expected = createTypedOrder({
      id: orderId,
      lineItems: new Map([
        [
          lineItemId,
          createTypedLineItem({
            id: lineItemId,
            orderedQuantity: 5,
            returned: [{ quantity: returnQuantity, reason }],
          }),
        ],
      ]),
    });

    const actual = await useCase.executeTyped(
      orderId,
      lineItemId,
      returnQuantity,
      reason,
    );

    expect(normalizeTypedOrder(actual)).toEqual(normalizeTypedOrder(expected));
  });
});

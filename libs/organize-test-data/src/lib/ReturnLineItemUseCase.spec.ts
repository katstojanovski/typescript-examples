import { Order } from './Order';
import { OrderRepository } from './OrderRepository';
import { ReturnLineItemUseCase } from './ReturnLineItemUseCase';
import { mock } from 'jest-mock-extended';
import { when } from '@lib/test-helpers';
import { orderFixture, LINE_ITEM_ID, ORDER_ID } from './test-data';

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
    const customerId = 'customer123';
    const unitPrice = 10.35;

    const initialOrder = Order.create({
      id: orderId,
      customerId,
      lineItems: [
        {
          id: lineItemId,
          orderedQuantity: 5,
          returned: [],
          unitPrice,
        },
      ],
    });

    const updatedOrder = Order.create({
      id: orderId,
      customerId,
      lineItems: [
        {
          id: lineItemId,
          orderedQuantity: 5,
          returned: [{ quantity: returnQuantity, reason }],
          unitPrice,
        },
      ],
    });

    when(repositoryMock.get)
      .calledWith(orderId)
      .mockResolvedValue(initialOrder);

    when(repositoryMock.save)
      .calledWith(updatedOrder)
      .mockResolvedValue(updatedOrder);

    const expected = Order.create({
      id: orderId,
      customerId,
      lineItems: [
        {
          id: lineItemId,
          orderedQuantity: 5,
          returned: [{ quantity: returnQuantity, reason }],
          unitPrice,
        },
      ],
    });

    const actual = await useCase.execute(
      orderId,
      lineItemId,
      returnQuantity,
      reason,
    );

    expect(actual).toEqual(expected);
  });

  it('should return a line item from an order - CONCISE', async () => {
    const { repositoryMock, useCase } = systemUnderTest();

    const returnQuantity = 2;
    const reason = 'DAMAGED';

    const initialOrder = orderFixture();

    const updatedOrder = orderFixture({
      lineItems: [
        {
          returned: [{ quantity: returnQuantity, reason }],
        },
      ],
    });

    when(repositoryMock.get)
      .calledWith(ORDER_ID)
      .mockResolvedValue(initialOrder);

    when(repositoryMock.save)
      .calledWith(updatedOrder)
      .mockResolvedValue(updatedOrder);

    const expected = orderFixture({
      lineItems: [
        {
          returned: [{ quantity: returnQuantity, reason }],
        },
      ],
    });

    const actual = await useCase.execute(
      ORDER_ID,
      LINE_ITEM_ID,
      returnQuantity,
      reason,
    );

    expect(actual).toEqual(expected);
  });
});

import {
  ExceedsOrderedQuantityError,
  LineItemNotFoundError,
  Order,
} from './Order';
import { OrderRepository } from './OrderRepository';
import { ReturnLineItemUseCase } from './ReturnLineItemUseCase';
import { mock } from 'jest-mock-extended';
import { when } from '@lib/test-helpers';
import { orderFixture } from './TestData';

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

    const initialOrder = Order.create({
      id: '1234567890',
      customerId: '95446fe0-5177-427b-bac4-bd8b7cc7f4ab',
      lineItems: [
        {
          id: 1,
          orderedQuantity: 5,
          returned: [{ quantity: 1, reason: 'DAMAGED' }],
          unitPrice: 10.35,
          sku: 'SKU123',
          name: 'Product Name',
        },
      ],
    });

    const updatedOrder = Order.create({
      id: '1234567890',
      customerId: '95446fe0-5177-427b-bac4-bd8b7cc7f4ab',
      lineItems: [
        {
          id: 1,
          orderedQuantity: 5,
          returned: [{ quantity: 3, reason: 'DAMAGED' }],
          unitPrice: 10.35,
          sku: 'SKU123',
          name: 'Product Name',
        },
      ],
    });

    when(repositoryMock.get)
      .calledWith('1234567890')
      .mockResolvedValue(initialOrder);

    when(repositoryMock.save)
      .calledWith(updatedOrder)
      .mockResolvedValue(updatedOrder);

    const expected = Order.create({
      id: '1234567890',
      customerId: '95446fe0-5177-427b-bac4-bd8b7cc7f4ab',
      lineItems: [
        {
          id: 1,
          orderedQuantity: 5,
          returned: [{ quantity: 3, reason: 'DAMAGED' }],
          unitPrice: 10.35,
          sku: 'SKU123',
          name: 'Product Name',
        },
      ],
    });

    const actual = await useCase.execute({
      orderId: '1234567890',
      lineItemId: 1,
      returnQuantity: 2,
      reason: 'DAMAGED',
    });

    expect(actual).toEqual(expected);
  });

  it('should return a line item from an order - CONCISE', async () => {
    // Arrange

    const { repositoryMock, useCase } = systemUnderTest();

    const initialOrder = orderFixture({
      lineItems: [
        {
          returned: [{ quantity: 1, reason: 'DAMAGED' }],
        },
      ],
    });
    const orderId = initialOrder.id;
    const lineItemId = initialOrder.lineItems[0].id;

    const updatedOrder = orderFixture({
      lineItems: [
        {
          returned: [{ quantity: 3, reason: 'DAMAGED' }],
        },
      ],
    });

    when(repositoryMock.get)
      .calledWith(orderId)
      .mockResolvedValue(initialOrder);

    when(repositoryMock.save)
      .calledWith(updatedOrder)
      .mockResolvedValue(updatedOrder);

    // Act

    const actual = await useCase.execute({
      orderId,
      lineItemId,
      returnQuantity: 2,
      reason: 'DAMAGED',
    });

    // Assert

    const expected = orderFixture({
      lineItems: [
        {
          returned: [{ quantity: 3, reason: 'DAMAGED' }],
        },
      ],
    });

    expect(actual).toEqual(expected);
  });

  it('should return a line item with a new return reason - CONCISE', async () => {
    // Arrange

    const { repositoryMock, useCase } = systemUnderTest();

    const initialOrder = orderFixture({
      lineItems: [
        {
          returned: [{ quantity: 1, reason: 'DAMAGED' }],
        },
      ],
    });

    const orderId = initialOrder.id;
    const lineItemId = initialOrder.lineItems[0].id;

    const updatedOrder = orderFixture({
      lineItems: [
        {
          returned: [
            { quantity: 1, reason: 'DAMAGED' },
            { quantity: 2, reason: 'NOT_AS_DESCRIBED' },
          ],
        },
      ],
    });

    when(repositoryMock.get)
      .calledWith(orderId)
      .mockResolvedValue(initialOrder);

    when(repositoryMock.save)
      .calledWith(updatedOrder)
      .mockResolvedValue(updatedOrder);

    // Act

    const actual = await useCase.execute({
      orderId,
      lineItemId,
      returnQuantity: 2,
      reason: 'NOT_AS_DESCRIBED',
    });

    // Assert

    const expected = orderFixture({
      lineItems: [
        {
          returned: [
            { quantity: 1, reason: 'DAMAGED' },
            { quantity: 2, reason: 'NOT_AS_DESCRIBED' },
          ],
        },
      ],
    });

    expect(actual).toEqual(expected);
  });

  it('should throw an error if returned quantity is greater than ordered quantity - CONCISE', async () => {
    // Arrange

    const { repositoryMock, useCase } = systemUnderTest();

    const initialOrder = orderFixture({
      lineItems: [
        {
          orderedQuantity: 5,
          returned: [{ quantity: 1, reason: 'DAMAGED' }],
        },
      ],
    });

    const orderId = initialOrder.id;
    const lineItemId = initialOrder.lineItems[0].id;

    when(repositoryMock.get)
      .calledWith(orderId)
      .mockResolvedValue(initialOrder);

    // Act & Assert

    await expect(
      useCase.execute({
        orderId,
        lineItemId,
        returnQuantity: 5,
        reason: 'DAMAGED',
      }),
    ).rejects.toThrow(ExceedsOrderedQuantityError);
  });

  it('should throw an error if line item is not found in order - CONCISE', async () => {
    // Arrange

    const { repositoryMock, useCase } = systemUnderTest();

    const initialOrder = orderFixture();

    const orderId = initialOrder.id;

    when(repositoryMock.get)
      .calledWith(orderId)
      .mockResolvedValue(initialOrder);

    // Act & Assert

    await expect(
      useCase.execute({
        orderId,
        lineItemId: 999,
        returnQuantity: 1,
        reason: 'DAMAGED',
      }),
    ).rejects.toThrow(LineItemNotFoundError);
  });

  it('should preserve other returns when adding to existing reason - CONCISE', async () => {
    // Arrange

    const { repositoryMock, useCase } = systemUnderTest();

    const initialOrder = orderFixture({
      lineItems: [
        {
          returned: [
            { quantity: 1, reason: 'DAMAGED' },
            { quantity: 2, reason: 'NOT_AS_DESCRIBED' },
          ],
        },
      ],
    });

    const orderId = initialOrder.id;
    const lineItemId = initialOrder.lineItems[0].id;

    const updatedOrder = orderFixture({
      lineItems: [
        {
          returned: [
            { quantity: 3, reason: 'DAMAGED' },
            { quantity: 2, reason: 'NOT_AS_DESCRIBED' },
          ],
        },
      ],
    });

    when(repositoryMock.get)
      .calledWith(orderId)
      .mockResolvedValue(initialOrder);

    when(repositoryMock.save)
      .calledWith(updatedOrder)
      .mockResolvedValue(updatedOrder);

    // Act

    const actual = await useCase.execute({
      orderId,
      lineItemId,
      returnQuantity: 2,
      reason: 'DAMAGED',
    });

    // Assert

    const expected = orderFixture({
      lineItems: [
        {
          returned: [
            { quantity: 3, reason: 'DAMAGED' },
            { quantity: 2, reason: 'NOT_AS_DESCRIBED' },
          ],
        },
      ],
    });

    expect(actual).toEqual(expected);
  });
});

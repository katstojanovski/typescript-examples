import { mock } from 'jest-mock-extended';
import { when } from '@lib/test-helpers';

import { type OrderRepository } from './OrderRepository';
import { GetOrderUseCase } from './GetOrderUseCase';
import { Address, Order } from './Order';
import { formatAddress } from './FormatAddress';

const systemUnderTest = () => {
  const repositoryMock = mock<OrderRepository>();
  const useCase = new GetOrderUseCase(repositoryMock);

  return {
    repositoryMock,
    useCase,
  };
};

describe('GetOrderUseCase', () => {
  it('should get an order - BAD', async () => {
    const { repositoryMock, useCase } = systemUnderTest();

    const address = Address.create({
      street: 'Baker Street',
      number: '221B',
      city: 'London',
      zipCode: '12345',
    });

    const order = Order.create({+
      id: '1234567890',
      address,
    });

    const expected = {
      orderId: '1234567890',
      deliveryAddress: formatAddress(address),
    };

    when(repositoryMock.get).calledWith('1234567890').mockResolvedValue(order);

    const result = await useCase.execute({
      orderId: '1234567890',
    });

    expect(result).toEqual(expected);
  });

  it('should get an order - GOOD', async () => {
    const { repositoryMock, useCase } = systemUnderTest();

    const address = Address.create({
      street: 'Baker Street',
      number: '221B',
      city: 'London',
      zipCode: '12345',
    });

    const order = Order.create({
      id: '1234567890',
      address,
    });

    const expected = {
      orderId: '1234567890',
      deliveryAddress: 'Baker Street 221B, London, 12345',
    };

    when(repositoryMock.get).calledWith('1234567890').mockResolvedValue(order);

    const result = await useCase.execute({
      orderId: '1234567890',
    });

    expect(result).toEqual(expected);
  });
});

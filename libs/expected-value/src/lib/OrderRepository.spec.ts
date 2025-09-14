import { mock } from 'jest-mock-extended';
import { Database } from './Database';
import { OrderRepository } from './OrderRepository';
import { when } from './when';

const systemUnderTest = () => {
  const databaseMock = mock<Database>();
  const repository = new OrderRepository(databaseMock);

  return {
    databaseMock,
    repository,
  };
};

describe('OrderRepository', () => {
  it('should return order successfully - BAD', async () => {
    const { databaseMock, repository } = systemUnderTest();
    const orderId = '1234567890';
    const customerId = 'c2afd554-25bc-4db7-90e6-fda488eb19ff';
    const order = {
      id: orderId,
      customerId,
    };

    when(databaseMock.get).calledWith(orderId).mockResolvedValue(order);

    const actual = await repository.get(orderId);

    expect(actual).toEqual(order);
  });

  it('should return order successfully - GOOD', async () => {
    const { databaseMock, repository } = systemUnderTest();
    const orderId = '1234567890';
    const customerId = 'c2afd554-25bc-4db7-90e6-fda488eb19ff';
    const order = {
      id: orderId,
      customerId,
    };
    when(databaseMock.get).calledWith(orderId).mockResolvedValue(order);

    const actual = await repository.get(orderId);

    const expected = {
      id: orderId,
      customerId,
    };
    expect(actual).toEqual(expected);
  });
});

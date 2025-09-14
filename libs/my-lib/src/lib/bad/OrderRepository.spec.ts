import { mock } from 'jest-mock-extended';
import { Database } from './Database';
import { OrderRepository } from './OrderRepository';
import { when } from '../when';

const systemUnderTest = () => {
  const databaseMock = mock<Database>();
  const repository = new OrderRepository(databaseMock);

  return {
    databaseMock,
    repository,
  };
};

describe('OrderRepository', () => {
  it('should return order successfully', async () => {
    const { databaseMock, repository } = systemUnderTest();
    const orderId = '1234567890';
    const customerId = 'c2afd554-25bc-4db7-90e6-fda488eb19ff';
    const order = {
      id: orderId,
      customerId,
    };
    when(databaseMock.get).calledWith(orderId).mockResolvedValue(order);

    const result = await repository.get(orderId);

    expect(result).toEqual(order);
  });
});

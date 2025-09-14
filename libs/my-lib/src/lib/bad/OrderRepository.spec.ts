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
  it('should return order successfully', () => {
    const { databaseMock, repository } = systemUnderTest();
    const orderId = '1234567890';
    const order = { id: orderId, customerId: '' };
    when(databaseMock.get).calledWith(orderId).mockResolvedValue(order);

    expect(repository.get(orderId)).resolves.toEqual(order);
  });
});

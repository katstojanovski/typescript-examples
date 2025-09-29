import { mock } from 'jest-mock-extended';
import { Database } from './Database';
import { OrderRepository } from './OrderRepository';
import { when } from '@lib/test-helpers';
import e = require('express');

const systemUnderTest = () => {
  const databaseMock = mock<Database>();
  const repository = new OrderRepository(databaseMock);

  return {
    databaseMock,
    repository,
  };
};
describe('OrderRepository', () => {
  it('should get all orders from the database - collection size - BAD', async () => {
    const { databaseMock, repository } = systemUnderTest();
    const orderId = '1234567890';
    const orders = [
      {
        id: orderId,
      },
    ];
    when(databaseMock.getAll).calledWith().mockResolvedValue(orders);

    const actual = await repository.getAll();

    expect(actual.length).toEqual(1);
  });

  it('should get all orders from the database - single collection element - BAD', async () => {
    const { databaseMock, repository } = systemUnderTest();
    const orderId = '1234567890';
    const orders = [
      {
        id: orderId,
      },
    ];
    when(databaseMock.getAll).calledWith().mockResolvedValue(orders);

    const actual = await repository.getAll();

    expect(actual[0].id).toEqual(orderId);
  });

  it('should get all orders from the database - expected same as given - BAD', async () => {
    const { databaseMock, repository } = systemUnderTest();
    const orderId = '1234567890';
    const orders = [
      {
        id: orderId,
      },
    ];
    when(databaseMock.getAll).calledWith().mockResolvedValue(orders);

    const actual = await repository.getAll();

    expect(actual).toEqual(orders);
  });

  it('should get all orders from the database - GOOD', async () => {
    const { databaseMock, repository } = systemUnderTest();
    const orderId = '1234567890';
    const orders = [
      {
        id: orderId,
      },
    ];
    when(databaseMock.getAll).calledWith().mockResolvedValue(orders);

    const expected = [
      {
        id: orderId,
      },
    ];
    const actual = await repository.getAll();

    expect(actual).toEqual(expected);
  });
});

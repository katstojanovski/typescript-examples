import { when } from './when';
import { mock } from 'jest-mock-extended';

interface Order {
  id: string;
}

interface Database {
  get(id: string): Promise<Order>;
}

describe('when', () => {
  it('should force the type on the mock', () => {
    const orderId = 'orderId';
    const order = { id: orderId };
    const databaseMock = mock<Database>();
    const mockFunction = databaseMock.get;

    when(mockFunction).calledWith(orderId).mockResolvedValue(order);

    expect(mockFunction(orderId)).resolves.toEqual(order);
  });
});

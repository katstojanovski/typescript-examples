import { CreateOrderProps, Order } from './Order';
import merge from 'lodash.merge';
import { PartialDeep } from '@lib/test-helpers';

export const orderFixture = (
  overrides?: PartialDeep<CreateOrderProps>,
): Order => {
  const defaults: CreateOrderProps = {
    id: '1234567890',
    customerId: '95446fe0-5177-427b-bac4-bd8b7cc7f4ab',
    lineItems: [
      {
        id: 1,
        orderedQuantity: 5,
        returned: [],
        unitPrice: 10.35,
        sku: 'SKU123',
        name: 'Product Name',
      },
      {
        id: 2,
        orderedQuantity: 10,
        returned: [],
        unitPrice: 20.5,
        sku: 'SKU456',
        name: 'Another Product',
      },
    ],
  };

  const merged = merge({}, defaults, overrides) as CreateOrderProps;
  return Order.create(merged);
};

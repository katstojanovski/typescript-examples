import { CreateOrderProps, Order } from './Order';
import merge from 'lodash.merge';
import { PartialDeep } from 'type-fest';

export const ORDER_ID = '1234567890';
export const LINE_ITEM_ID = 1;
export const RETURN_QUANTITY = 2;
export const REASON = 'DAMAGED';
export const ORDERED_QUANTITY = 5;
export const UNIT_PRICE = 10.35;
export const CUSTOMER_ID = '95446fe0-5177-427b-bac4-bd8b7cc7f4ab';

export const orderFixture = (
  overrides?: PartialDeep<CreateOrderProps, { recurseIntoArrays: true }>,
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
      },
    ],
  };

  const merged = merge({}, defaults, overrides) as CreateOrderProps;
  return Order.create(merged);
};

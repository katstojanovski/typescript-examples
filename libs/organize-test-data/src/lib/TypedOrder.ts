const TypedOrderBrand = Symbol('TypedOrderBrand');

export type TypedOrder = Readonly<{
  id: string;
  lineItems: ReadonlyMap<number, TypedLineItem>;
}> & {
  readonly [TypedOrderBrand]: 'TypedOrder';
};

const TypedLineItemBrand = Symbol('TypedLineItemBrand');

export type TypedLineItem = Readonly<{
  id: number;
  orderedQuantity: number;
  returned: ReadonlyArray<{
    quantity: number;
    reason: TypedReturnReason;
  }>;
}> & {
  readonly [TypedLineItemBrand]: 'TypedLineItem';
};

export type TypedReturnReason = 'DAMAGED' | 'UNWANTED' | 'OTHER';

export const createTypedOrder = (props: {
  id: string;
  lineItems: Map<number, TypedLineItem>;
}): TypedOrder => {
  return Object.freeze({
    id: props.id,
    lineItems: props.lineItems,
    [TypedOrderBrand]: 'TypedOrder',
  }) as TypedOrder;
};

export const createTypedLineItem = (props: {
  id: number;
  orderedQuantity: number;
  returned: Array<{ quantity: number; reason: TypedReturnReason }>;
}): TypedLineItem => {
  return Object.freeze({
    id: props.id,
    orderedQuantity: props.orderedQuantity,
    returned: props.returned,
    [TypedLineItemBrand]: 'TypedLineItem',
  }) as TypedLineItem;
};

export const returnLineItem = (
  lineItem: TypedLineItem,
  returnQuantity: number,
  reason: TypedReturnReason,
): TypedLineItem => {
  const totalReturnedQuantity = lineItem.returned.reduce(
    (sum, ret) => sum + ret.quantity,
    0,
  );

  if (totalReturnedQuantity + returnQuantity > lineItem.orderedQuantity) {
    throw new Error('Return quantity exceeds ordered quantity');
  }

  return createTypedLineItem({
    id: lineItem.id,
    orderedQuantity: lineItem.orderedQuantity,
    returned: [
      ...lineItem.returned,
      {
        quantity: returnQuantity,
        reason,
      },
    ],
  });
};

export const returnLineItemInOrder = (
  order: TypedOrder,
  lineItemId: number,
  returnQuantity: number,
  reason: TypedReturnReason,
): TypedOrder => {
  const lineItem = order.lineItems.get(lineItemId);
  if (!lineItem) {
    throw new Error('Line item not found in order');
  }

  const updatedLineItem = returnLineItem(lineItem, returnQuantity, reason);

  const updatedLineItems = new Map(order.lineItems);
  updatedLineItems.set(lineItemId, updatedLineItem);

  return createTypedOrder({
    id: order.id,
    lineItems: updatedLineItems,
  });
};

export const normalizeTypedOrder = (order: TypedOrder) => {
  return {
    id: order.id,
    lineItems: Object.fromEntries(order.lineItems),
  };
};

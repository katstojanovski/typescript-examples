import { createFrozenMap } from './immutability';

export class Order {
  public readonly id: string;
  public readonly lineItems: ReadonlyMap<number, LineItem>;

  constructor(props: { id: string; lineItems: Map<number, LineItem> }) {
    this.id = props.id;

    const newMap = new Map(props.lineItems);
    this.lineItems = createFrozenMap(newMap);

    Object.freeze(this);
  }

  returnLineItem(
    lineItemId: number,
    returnQuantity: number,
    reason: ReturnReason,
  ): Order {
    const lineItem = this.lineItems.get(lineItemId);
    if (!lineItem) {
      throw new Error('Line item not found');
    }

    const updatedLineItem = lineItem.return(returnQuantity, reason);

    const updatedLineItems = new Map(this.lineItems);
    updatedLineItems.set(lineItemId, updatedLineItem);

    return new Order({ id: this.id, lineItems: updatedLineItems });
  }

  normalize() {
    return {
      id: this.id,
      lineItems: Object.fromEntries(this.lineItems),
    };
  }
}

export class LineItem {
  public readonly id: number;
  public readonly orderedQuantity: number;
  public readonly returned: {
    quantity: number;
    reason: ReturnReason;
  }[];

  constructor(props: {
    id: number;
    orderedQuantity: number;
    returned: {
      quantity: number;
      reason: ReturnReason;
    }[];
  }) {
    this.id = props.id;
    this.orderedQuantity = props.orderedQuantity;
    this.returned = props.returned;

    Object.freeze(this);
  }

  return(returnQuantity: number, reason: ReturnReason): LineItem {
    const totalReturnedQuantity = this.returned.reduce(
      (sum, ret) => sum + ret.quantity,
      0,
    );

    if (totalReturnedQuantity + returnQuantity > this.orderedQuantity) {
      throw new Error('Return quantity exceeds ordered quantity');
    }

    return new LineItem({
      id: this.id,
      orderedQuantity: this.orderedQuantity,
      returned: [
        ...this.returned,
        {
          quantity: returnQuantity,
          reason,
        },
      ],
    });
  }
}

export type ReturnReason = 'DAMAGED' | 'UNWANTED' | 'OTHER';

export type CreateOrderProps = {
  id: string;
  customerId: string;
  lineItems: CreateLineItemProps[];
};

export class Order {
  public readonly id: string;
  public readonly customerId: string;
  public readonly lineItems: readonly LineItem[];

  private constructor(props: {
    id: string;
    customerId: string;
    lineItems: LineItem[];
  }) {
    this.id = props.id;
    this.customerId = props.customerId;
    this.lineItems = [...props.lineItems];
  }

  static create(props: CreateOrderProps): Order {
    const lineItems = props.lineItems.map((li) => LineItem.create(li));
    return new Order({ ...props, lineItems });
  }

  returnLineItem(
    lineItemId: number,
    returnQuantity: number,
    reason: ReturnReason,
  ): Order {
    const lineItem = this.lineItems.find((li) => li.id === lineItemId);
    if (!lineItem) throw new Error('Line item not found');

    const updatedLineItem = lineItem.return(returnQuantity, reason);

    const updatedLineItems = this.lineItems.map((li) =>
      li.id === lineItemId ? updatedLineItem : li,
    );

    return new Order({
      id: this.id,
      customerId: this.customerId,
      lineItems: updatedLineItems,
    });
  }
}

export class LineItem {
  public readonly id: number;
  public readonly orderedQuantity: number;
  public readonly returned: readonly {
    quantity: number;
    reason: ReturnReason;
  }[];
  public readonly unitPrice: number;

  private constructor(props: CreateLineItemProps) {
    this.id = props.id;
    this.orderedQuantity = props.orderedQuantity;
    this.returned = [...props.returned];
    this.unitPrice = props.unitPrice;
  }

  static create(props: CreateLineItemProps): LineItem {
    return new LineItem(props);
  }

  return(returnQuantity: number, reason: ReturnReason): LineItem {
    const totalReturned = this.returned.reduce((sum, r) => sum + r.quantity, 0);
    if (totalReturned + returnQuantity > this.orderedQuantity) {
      throw new Error('Return quantity exceeds ordered quantity');
    }

    return new LineItem({
      id: this.id,
      orderedQuantity: this.orderedQuantity,
      unitPrice: this.unitPrice,
      returned: [...this.returned, { quantity: returnQuantity, reason }],
    });
  }
}

export type CreateLineItemProps = {
  id: number;
  orderedQuantity: number;
  returned: { quantity: number; reason: ReturnReason }[];
  unitPrice: number;
};

export type ReturnReason = 'DAMAGED' | 'NOT_AS_DESCRIBED' | 'OTHER';

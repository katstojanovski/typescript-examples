export type CreateOrderProps = {
  id: string;
  customerId: string;
  lineItems: CreateLineItemProps[];
};

export class ExceedsOrderedQuantityError extends Error {
  constructor() {
    super('Return quantity exceeds ordered quantity');
    this.name = 'ExceedsOrderedQuantityError';
  }
}

export class LineItemNotFoundError extends Error {
  constructor() {
    super('Line item not found in order');
    this.name = 'LineItemNotFoundError';
  }
}

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
    if (!lineItem) throw new LineItemNotFoundError();

    const updatedLineItem = lineItem.return(returnQuantity, reason);

    const updatedLineItems = this.lineItems.map((li) =>
      li.id === lineItemId ? updatedLineItem : li,
    );

    return new Order({
      ...this,
      lineItems: updatedLineItems,
    });
  }
}

type ReturnEntry = { quantity: number; reason: ReturnReason };

export class LineItem {
  public readonly id: number;
  public readonly sku: string;
  public readonly orderedQuantity: number;
  public readonly name: string;
  public readonly returned: readonly ReturnEntry[];
  public readonly unitPrice: number;

  private constructor(props: CreateLineItemProps) {
    this.id = props.id;
    this.sku = props.sku;
    this.orderedQuantity = props.orderedQuantity;
    this.returned = [...props.returned];
    this.unitPrice = props.unitPrice;
    this.name = props.name;
  }

  static create(props: CreateLineItemProps): LineItem {
    return new LineItem(props);
  }

  return(returnQuantity: number, reason: ReturnReason): LineItem {
    const totalReturned = this.returned.reduce((sum, r) => sum + r.quantity, 0);
    if (totalReturned + returnQuantity > this.orderedQuantity) {
      throw new ExceedsOrderedQuantityError();
    }

    const updatedReturned = this.addOrUpdateReturn(returnQuantity, reason);

    return new LineItem({
      ...this,
      returned: updatedReturned,
    });
  }

  private addOrUpdateReturn(
    quantity: number,
    reason: ReturnReason,
  ): ReturnEntry[] {
    return this.returned.some((r) => r.reason === reason)
      ? this.returned.map((r) =>
          r.reason === reason ? { ...r, quantity: r.quantity + quantity } : r,
        )
      : [...this.returned, { quantity, reason }];
  }
}

export type CreateLineItemProps = {
  id: number;
  orderedQuantity: number;
  returned: ReturnEntry[];
  unitPrice: number;
  sku: string;
  name: string;
};

export type ReturnReason = 'DAMAGED' | 'NOT_AS_DESCRIBED' | 'OTHER';

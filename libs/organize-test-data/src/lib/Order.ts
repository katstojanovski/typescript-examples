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
    // always copy array to preserve immutability
    this.lineItems = [...props.lineItems];
  }

  static create(props: CreateOrderProps): Order {
    // Map raw DTOs to LineItem instances
    const lineItems = props.lineItems.map((li) => LineItem.create(li));
    return new Order({ ...props, lineItems });
  }

  /** Safe method to return a line item */
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

    // Use explicit fields instead of spreading `this`
    return new Order({
      id: this.id,
      customerId: this.customerId,
      lineItems: updatedLineItems,
    });
  }

  /** Optional helper to expose DTO for fixtures or serialization */
  toProps(): CreateOrderProps {
    return {
      id: this.id,
      customerId: this.customerId,
      lineItems: this.lineItems.map((li) => li.toProps()),
    };
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
      ...this.toProps(),
      returned: [...this.returned, { quantity: returnQuantity, reason }],
    });
  }

  /** Helper to convert to DTO */
  toProps(): CreateLineItemProps {
    return {
      id: this.id,
      orderedQuantity: this.orderedQuantity,
      returned: [...this.returned],
      unitPrice: this.unitPrice,
    };
  }
}

export type CreateLineItemProps = {
  id: number;
  orderedQuantity: number;
  returned: { quantity: number; reason: ReturnReason }[];
  unitPrice: number;
};

export type ReturnReason = 'DAMAGED' | 'NOT_AS_DESCRIBED' | 'OTHER';

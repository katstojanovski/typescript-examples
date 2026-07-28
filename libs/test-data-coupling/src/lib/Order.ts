export class Order {
  public readonly id: string;
  public readonly address: Address;

  private constructor(props: { id: string; address: Address }) {
    this.id = props.id;
    this.address = props.address;
  }

  static create(props: { id: string; address: Address }): Order {
    return new Order({
      id: props.id,
      address: props.address,
    });
  }
}

export class Address {
  public readonly street: string;
  public readonly number: string;
  public readonly city: string;
  public readonly zipCode: string;

  private constructor(props: {
    street: string;
    number: string;
    city: string;
    zipCode: string;
  }) {
    this.street = props.street;
    this.number = props.number;
    this.city = props.city;
    this.zipCode = props.zipCode;
  }

  static create(props: CreateAddressProps): Address {
    return new Address(props);
  }
}

export type CreateAddressProps = {
  street: string;
  number: string;
  city: string;
  zipCode: string;
};

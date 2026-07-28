import { Address } from './Order';

export const formatAddress = (address: Address): string => {
  const { street, number, city, zipCode } = address;

  // Uncomment this line to see the test results change
  // const formattedAddress = `${street} ${number}, ${city}, ${zipCode} DO NOT USE`;

  // Comment this line to see the test results change
  const formattedAddress = `${street} ${number}, ${city}, ${zipCode}`;

  return formattedAddress;
};

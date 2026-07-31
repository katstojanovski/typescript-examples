import { Address } from './Order';

export const formatAddress = (address: Address): string => {
  const { street, houseNumber, city, zipCode } = address;

  // Uncomment this line to see the test results change
  // return `${street} ${houseNumber}, ${city}, ${zipCode} DO NOT USE`;

  // Comment this line to see the test results change
  return `${street} ${houseNumber}, ${city}, ${zipCode}`;
};

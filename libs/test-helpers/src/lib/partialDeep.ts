import { PartialDeep as TypeFestPartialDeep } from 'type-fest';

export type PartialDeep<T> = TypeFestPartialDeep<
  T,
  { recurseIntoArrays: true }
>;

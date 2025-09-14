import { when as jestWhen } from 'jest-when';

export const when = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
) => jestWhen(fn as jest.MockedFunction<(...args: Args) => Return>);

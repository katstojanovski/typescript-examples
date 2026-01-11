export function createFrozenMap<K, V>(map: Map<K, V>): ReadonlyMap<K, V> {
  return new Proxy(map, {
    get: (target, prop) => {
      if (prop === 'set' || prop === 'delete' || prop === 'clear') {
        return () => {
          throw new Error('Cannot modify a frozen Map');
        };
      }

      const value = Reflect.get(target, prop);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}

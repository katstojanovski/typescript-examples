// export function deepFreeze<T>(obj: T): T {
//   if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
//     if (obj instanceof Map) {
//       // Freeze each key and value in the Map
//       obj.forEach((value, key) => {
//         deepFreeze(key);
//         deepFreeze(value);
//       });
//     } else if (obj instanceof Set) {
//       // Freeze each value in the Set
//       obj.forEach((value) => deepFreeze(value));
//     } else if (Array.isArray(obj)) {
//       // Freeze each element in the array
//       obj.forEach((item) => deepFreeze(item));
//     } else {
//       // Plain object: freeze all properties
//       (Object.getOwnPropertyNames(obj) as (keyof T)[]).forEach((prop) => {
//         deepFreeze(obj[prop]);
//       });
//     }

//     Object.freeze(obj);
//   }
//   return obj;
// }

export function createFrozenMap<K, V>(map: Map<K, V>): ReadonlyMap<K, V> {
  return new Proxy(map, {
    set: () => {
      throw new Error('Cannot modify a frozen Map');
    },
    deleteProperty: () => {
      throw new Error('Cannot delete properties of a frozen Map');
    },
    get: (target, prop) => {
      if (prop === 'set' || prop === 'delete' || prop === 'clear') {
        return () => {
          throw new Error('Cannot modify a frozen Map');
        };
      }
      return Reflect.get(target, prop);
    },
  } as ProxyHandler<Map<K, V>>);
}

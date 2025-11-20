

// Immutably update nested state
export function updateFieldImmutable(obj: any, path: string[], value: any) {
  const clone = structuredClone(obj);
  let current = clone;

  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]];
  }

  current[path[path.length - 1]] = value;
  return clone;
}

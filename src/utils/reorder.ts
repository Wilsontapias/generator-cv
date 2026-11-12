// Utilidades para reordenar listas

export function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...items];
  const [removed] = result.splice(fromIndex, 1);
  if (removed !== undefined) {
    result.splice(toIndex, 0, removed);
  }
  return result;
}

export function moveItemUp<T>(items: T[], index: number): T[] {
  if (index <= 0) return items;
  return moveItem(items, index, index - 1);
}

export function moveItemDown<T>(items: T[], index: number): T[] {
  if (index >= items.length - 1) return items;
  return moveItem(items, index, index + 1);
}

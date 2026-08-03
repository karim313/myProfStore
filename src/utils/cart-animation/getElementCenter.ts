/**
 * Calculates the exact center coordinate (x, y) of a given DOM element
 * relative to the viewport.
 */
export function getElementCenter(element: HTMLElement | null): { x: number; y: number } | null {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

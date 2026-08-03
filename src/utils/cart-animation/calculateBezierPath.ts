/**
 * Calculates a cubic bezier path string for an SVG or framer-motion path
 * given a start point and end point.
 * This gives the flying product a nice arc instead of a straight line.
 */
export function calculateBezierPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): string {
  // Distance between points
  const dx = endX - startX;
  const dy = endY - startY;

  // We want the control points to arc slightly upwards.
  // The control points are placed horizontally between start and end,
  // but their vertical position is raised to create a smooth curve.
  const controlPoint1X = startX + dx * 0.25;
  const controlPoint1Y = startY - Math.abs(dy) * 0.5 - 100; // Pull up

  const controlPoint2X = startX + dx * 0.75;
  const controlPoint2Y = startY - Math.abs(dy) * 0.5 - 50; // Pull up less than cp1

  return `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;
}

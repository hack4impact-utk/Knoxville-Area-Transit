const ROUTE_COLORS: string[] = [
  "#1976D2", // blue
  "#D32F2F", // red
  "#388E3C", // green
  "#F57C00", // orange
  "#7B1FA2", // purple
  "#0097A7", // teal
  "#C2185B", // pink
  "#AFB42B", // lime
  "#5D4037", // brown
  "#455A64", // blue-grey
  "#E64A19", // deep orange
  "#00838F", // dark cyan
  "#6A1B9A", // deep purple
  "#2E7D32", // dark green
  "#AD1457", // dark pink
  "#4527A0", // indigo
  "#00695C", // dark teal
  "#FF8F00", // amber
  "#283593", // dark indigo
  "#558B2F", // light green
];

export function getRouteColor(index: number, colorOverride?: string): string {
  if (colorOverride) return colorOverride;
  return ROUTE_COLORS[index % ROUTE_COLORS.length];
}

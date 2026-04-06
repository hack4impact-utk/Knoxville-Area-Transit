/**
 * Local formatter utilities for monthly service summary metrics.
 * All functions accept a number (or undefined/null) and return a display string.
 */

const intFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const ratioFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const FALLBACK = "—";

export function formatPassengers(value: number | undefined | null): string {
  if (value == null || isNaN(value)) return FALLBACK;
  return intFormatter.format(value);
}

export function formatRevenueMiles(value: number | undefined | null): string {
  if (value == null || isNaN(value)) return FALLBACK;
  return decimalFormatter.format(value);
}

export function formatRevenueHours(value: number | undefined | null): string {
  if (value == null || isNaN(value)) return FALLBACK;
  return decimalFormatter.format(value);
}

export function formatPassengersPerMile(
  passengers: number | undefined | null,
  miles: number | undefined | null
): string {
  if (passengers == null || miles == null || miles === 0) return FALLBACK;
  return ratioFormatter.format(passengers / miles);
}

export function formatPassengersPerHour(
  passengers: number | undefined | null,
  hours: number | undefined | null
): string {
  if (passengers == null || hours == null || hours === 0) return FALLBACK;
  return ratioFormatter.format(passengers / hours);
}
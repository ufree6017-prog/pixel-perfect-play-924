import { pricingPlaceholders } from "./brand";
import type { VehicleCategory } from "./mock/types";

export interface FareBreakdown {
  baseFare: number;
  distanceCharge: number;
  helperFee: number;
  insurancePremium: number;
  subtotal: number;
  distanceKm: number;
}

/**
 * MOCK fare calculation for display only.
 * Real distance/routing and rate cards arrive in a later build pass.
 */
export function estimateFare(options: {
  vehicle: VehicleCategory;
  distanceKm: number;
  helperRequested: boolean;
  insuranceOptedIn: boolean;
  declaredGoodsValue: number;
}): FareBreakdown {
  const { vehicle, distanceKm, helperRequested, insuranceOptedIn, declaredGoodsValue } = options;
  const distanceCharge = Math.round(vehicle.perKmRate * distanceKm);
  const helperFee = helperRequested ? pricingPlaceholders.loadingHelperFee : 0;
  const insurancePremium = insuranceOptedIn
    ? Math.round(declaredGoodsValue * pricingPlaceholders.insuranceRateOfDeclaredValue)
    : 0;

  return {
    baseFare: vehicle.baseFare,
    distanceCharge,
    helperFee,
    insurancePremium,
    distanceKm,
    subtotal: vehicle.baseFare + distanceCharge + helperFee + insurancePremium,
  };
}

/** Deterministic pseudo-distance so the mock estimate feels stable per address pair. */
export function mockDistanceKm(pickup: string, drop: string): number {
  const seed = `${pickup}|${drop}`
    .toLowerCase()
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return Number((6 + (seed % 340) / 10).toFixed(1));
}

export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function mockDriverEtaMinutes(pickup: string): number {
  const seed = pickup.toLowerCase().split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return 4 + (seed % 12);
}

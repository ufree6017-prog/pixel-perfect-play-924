export type BookingFlow = "retail" | "business";

export type VehicleSegment = "intracity" | "intercity";

export interface VehicleCategory {
  id: string;
  name: string;
  localName?: string;
  capacityLabel: string;
  capacityKg: number;
  segment: VehicleSegment;
  /** Which booking flows may show this category. */
  flows: BookingFlow[];
  perKmRate: number;
  baseFare: number;
  bestFor: string;
}

export type BookingStatus =
  | "driver_assigned"
  | "en_route"
  | "arrived"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "online" | "pay_driver";

export interface Booking {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  dropAddress: string;
  city: string;
  route: string;
  vehicleCategoryId: string;
  vehicleCategoryName: string;
  distanceKm: number;
  fareEstimate: number;
  tollsAndTaxesExtra: boolean;
  helperRequested: boolean;
  insuranceOptedIn: boolean;
  declaredGoodsValue: number | null;
  eWayBillNumber: string | null;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  flow: BookingFlow;
  driverId: string | null;
  podUploaded: boolean;
  createdAt: string;
}

export type DriverVerificationStatus = "pending" | "approved" | "rejected";

export interface DriverDocument {
  type: "id_proof" | "driving_license" | "vehicle_rc" | "insurance";
  label: string;
  fileName: string;
  documentExpiryDate: string | null;
  uploadedAt: string;
}

export interface Driver {
  id: string;
  name: string;
  photoUrl: string;
  phone: string;
  city: string;
  vehicleNumber: string;
  vehicleCategoryId: string;
  vehicleCategoryName: string;
  rating: number;
  totalTrips: number;
  walletBalance: number;
  verificationStatus: DriverVerificationStatus;
  documents: DriverDocument[];
  joinedAt: string;
}

export interface WalletTransaction {
  id: string;
  driverId: string;
  type: "commission" | "topup" | "trip_earning" | "penalty";
  label: string;
  amount: number;
  bookingReference: string | null;
  createdAt: string;
}

export interface RideRequest {
  id: string;
  pickupArea: string;
  dropArea: string;
  distanceKm: number;
  payout: number;
  vehicleCategoryName: string;
  goodsType: string;
  minutesAway: number;
}

export interface ReturnTripLoad {
  id: string;
  fromCity: string;
  toCity: string;
  vehicleCategoryName: string;
  weightTons: number;
  standardRate: number;
  discountedRate: number;
  pickupWindow: string;
}

export interface DriverTrip {
  id: string;
  bookingReference: string;
  route: string;
  completedAt: string;
  fareCollected: number;
  commissionDeducted: number;
  netEarning: number;
  podUploaded: boolean;
}

export type InvoiceStatus = "pending_pod" | "ready" | "issued" | "paid";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingReference: string;
  businessName: string;
  gstin: string;
  taxableValue: number;
  gstAmount: number;
  total: number;
  status: InvoiceStatus;
  podUploaded: boolean;
  issuedAt: string | null;
}

export interface BusinessEnquiry {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  route: string;
  monthlyLoads: string;
  vehicleCategoryName: string;
  message: string;
  submittedAt: string;
  status: "new" | "contacted" | "closed";
}

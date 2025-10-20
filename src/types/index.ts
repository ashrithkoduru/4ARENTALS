export interface User {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  name: string;
  category: 'economy' | 'suv' | 'luxury';
  price: number;                                    // ✅ Maps to price_per_unit
  priceUnit: 'month';                               // ✅ CHANGED: Only 'month' allowed now
  image: string;
  features: string[];
  
  // ✅ REMOVED: available (boolean) - no longer exists in DB
  // ✅ REMOVED: manualStatus - no longer exists in DB
  
  status: 'available' | 'reserved' | 'rented' | 'inspection' | 'maintenance' | 'sold' | 'in-stock';  // ✅ UPDATED: All possible statuses
  
  specifications: {
    seats: number;
    transmission: 'automatic' | 'manual';
    fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    year: number;
    brand: string;
    model: string;
    color: string;
    interior: string;
    interiorColor: string;
    driveTrain: string;
    cylinders: number;
    vin: string;
    engine: string;
    mileage: string;
    stockNumber: string;
    fuelEconomy: string;
  };
  
  // ✅ NEW FIELDS (from updated schema - optional for customer portal)
  stockNumber?: string;
  licensePlate?: string;
  currentMileage?: number;
  lastServiceDate?: Date | null;
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  pickupLocation: string;
  pickupDate: string;                          // ✅ Changed from Date to string (matches database)
  returnDate: string;                          // ✅ Changed from Date to string (matches database)
  
  // ✅ NEW: Pricing breakdown
  rentalAmount: number;                        // ✅ NEW: Actual rental fee (months × rate)
  securityDeposit: number;                     // ✅ NEW: Deposit amount (1 month)
  totalPrice: number;                          // Total charged (rental + deposit)
  
  status: 'pending' | 'confirmed' | 'active' | 'inspection' | 'completed' | 'cancelled';
  
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  
  // Optional fields for pickup/return tracking
  actualPickupDate?: string | null;            // ✅ Changed from Date to string
  actualReturnDate?: string | null;            // ✅ Changed from Date to string
  extensionCount?: number;
  pickupMileage?: number | null;
  returnMileage?: number | null;
  adminNotes?: string;
  
  // ✅ NEW: Deposit refund tracking
  securityDepositDeduction?: number;           // ✅ NEW: Amount deducted for damages
  securityDepositAmountReturned?: number;      // ✅ NEW: Actual amount refunded
  securityDepositReturned?: boolean;           // ✅ NEW: Whether deposit was refunded
  securityDepositReturnDate?: string | null;   // ✅ NEW: When deposit was refunded
  deductionReason?: string;                    // ✅ NEW: Why deposit was deducted
  
  // Pickup photos (from PickupModal)
  driversLicense?: string;                     // ✅ NEW: Driver's license number
  pickupPhotos?: {                             // ✅ NEW: Photos taken at pickup
    front: string | null;
    back: string | null;
    leftSide: string | null;
    rightSide: string | null;
    odometer: string | null;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt: Date;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  icon: string;
  iconColor: string;
  buttonText: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ✅ NEW INTERFACES (for workers portal - add these if needed later)

export interface VehicleInspection {
  id: string;
  bookingId: string;
  vehicleId: string;
  inspectorName: string;
  exteriorCondition: number;
  interiorCondition: number;
  mechanicalCondition: number;
  damagesFound: any; // jsonb
  requiresMaintenance: boolean;
  approvedForRental: boolean;
  notes?: string;
  createdAt: Date;
}

export interface VehicleMaintenance {
  id: string;
  vehicleId: string;
  inspectionId?: string;
  maintenanceType: 'routine' | 'repair' | 'damage' | 'inspection' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  description: string;
  scheduledDate?: Date;
  completedDate?: Date;
  assignedTo?: string;
  laborCost?: number;
  partsCost?: number;
  totalCost?: number;
  partsReplaced?: any; // jsonb
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
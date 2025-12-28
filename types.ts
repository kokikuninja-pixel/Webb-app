
export enum MotorStatus {
  READY = 'Ready',
  BOOKED = 'Booked',
  RENTED = 'Rented',
  MAINTENANCE = 'Maintenance'
}

export enum PaymentType {
  CASH = 'Cash',
  TRANSFER = 'Transfer'
}

export enum HTGStatus {
  SAFE = 'Safe',
  OVERTIME = 'Overtime',
  PAID = 'Paid'
}

export interface Motor {
  id: string;
  plateNumber: string;
  type: string;
  status: MotorStatus;
  lastService?: string;
}

export interface Rental {
  id: string;
  createdAt: string;
  motorId: string;
  startDate: string;
  endDate: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  locationDetails: string; // "Antar Jemput" or "Ambil Sendiri"
  basePrice: number;
  outOfTownFee: number;
  pickupDropoffFee: number;
  totalPrice: number;
  dpAmount: number;
  settlementAmount: number;
  paymentType: PaymentType;
  bankName?: string;
  htgAmount: number;
  htgNotes: string;
  htgStatus: HTGStatus;
  officerName: string;
  accessories: {
    helmets: number;
    raincoats: number;
  };
  travelDetails?: {
    ticketSchedule?: string;
    transportType?: string;
  };
  signatures: {
    customer?: string;
    admin?: string;
  };
}

export interface Transaction {
  id: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  notes: string;
}

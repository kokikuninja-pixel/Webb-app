
import { Motor, MotorStatus, Rental, HTGStatus, PaymentType, Transaction } from '../types';

export const INITIAL_MOTORS: Motor[] = [
  { id: 'M1', plateNumber: 'B 1234 ABC', type: 'Honda Vario 160', status: MotorStatus.READY },
  { id: 'M2', plateNumber: 'B 5678 DEF', type: 'Honda Gear 125', status: MotorStatus.RENTED },
  { id: 'M3', plateNumber: 'B 9012 GHI', type: 'Yamaha NMAX', status: MotorStatus.READY },
  { id: 'M4', plateNumber: 'B 3456 JKL', type: 'Honda Beat', status: MotorStatus.BOOKED },
  { id: 'M5', plateNumber: 'B 7890 MNO', type: 'Honda PCX 160', status: MotorStatus.READY },
];

export const INITIAL_RENTALS: Rental[] = [
  {
    id: 'R1',
    createdAt: '2023-11-20T10:00:00',
    motorId: 'M2',
    startDate: '2023-11-20T11:00:00',
    endDate: '2023-11-22T11:00:00',
    customerName: 'Budi Santoso',
    customerPhone: '081234567890',
    customerAddress: 'Jl. Merdeka No. 1, Jakarta Selatan',
    locationDetails: 'Antar Jemput ke Apartemen Sudirman',
    basePrice: 200000,
    outOfTownFee: 0,
    pickupDropoffFee: 50000,
    totalPrice: 250000,
    dpAmount: 100000,
    settlementAmount: 150000,
    paymentType: PaymentType.TRANSFER,
    bankName: 'BCA',
    htgAmount: 0,
    htgNotes: '',
    htgStatus: HTGStatus.PAID,
    officerName: 'Andi (Jakarta)',
    accessories: { helmets: 2, raincoats: 1 },
    signatures: {}
  },
  {
    id: 'R2',
    createdAt: '2023-11-21T14:00:00',
    motorId: 'M4',
    startDate: '2023-11-23T08:00:00',
    endDate: '2023-11-24T08:00:00',
    customerName: 'Siti Aminah',
    customerPhone: '089988776655',
    customerAddress: 'Hotel Grand Indonesia',
    locationDetails: 'Ambil Sendiri',
    basePrice: 100000,
    outOfTownFee: 50000,
    pickupDropoffFee: 0,
    totalPrice: 150000,
    dpAmount: 50000,
    settlementAmount: 0,
    paymentType: PaymentType.CASH,
    htgAmount: 100000,
    htgNotes: 'Pelunasan saat pengambilan motor',
    htgStatus: HTGStatus.SAFE,
    officerName: 'Siska (Jakarta)',
    accessories: { helmets: 1, raincoats: 0 },
    signatures: {}
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'T1',
    date: '2023-11-20T10:05:00',
    type: 'INCOME',
    category: 'Sewa Motor',
    amount: 100000,
    notes: 'DP Rental R1 - Budi Santoso'
  },
  {
    id: 'T2',
    date: '2023-11-20T11:00:00',
    type: 'INCOME',
    category: 'Pelunasan',
    amount: 150000,
    notes: 'Pelunasan R1 - Budi Santoso'
  },
  {
    id: 'T3',
    date: '2023-11-21T09:00:00',
    type: 'EXPENSE',
    category: 'Service',
    amount: 120000,
    notes: 'Ganti Oli Vario B 1234 ABC'
  }
];

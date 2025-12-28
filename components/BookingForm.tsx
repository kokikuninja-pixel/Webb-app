
import React, { useState } from 'react';
import { X, Save, Bike, User, MapPin, Calendar, CreditCard, Package } from 'lucide-react';
import { Motor, Rental, MotorStatus, PaymentType, HTGStatus } from '../types';

interface BookingFormProps {
  motors: Motor[];
  onClose: () => void;
  onSubmit: (rental: Rental) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ motors, onClose, onSubmit }) => {
  const readyMotors = motors.filter(m => m.status === MotorStatus.READY);
  
  const [formData, setFormData] = useState({
    motorId: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    locationDetails: 'Ambil Sendiri',
    startDate: '',
    endDate: '',
    basePrice: 0,
    outOfTownFee: 0,
    pickupDropoffFee: 0,
    dpAmount: 0,
    paymentType: PaymentType.CASH,
    bankName: '',
    helmets: 2,
    raincoats: 1,
    ticketSchedule: '',
    transportType: ''
  });

  const totalPrice = Number(formData.basePrice) + Number(formData.outOfTownFee) + Number(formData.pickupDropoffFee);
  const htgAmount = totalPrice - Number(formData.dpAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.motorId || !formData.customerName) return alert('Data Belum Lengkap');

    const newRental: Rental = {
      id: `R-${Date.now()}`,
      createdAt: new Date().toISOString(),
      motorId: formData.motorId,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      locationDetails: formData.locationDetails,
      startDate: formData.startDate,
      endDate: formData.endDate,
      basePrice: Number(formData.basePrice),
      outOfTownFee: Number(formData.outOfTownFee),
      pickupDropoffFee: Number(formData.pickupDropoffFee),
      totalPrice: totalPrice,
      dpAmount: Number(formData.dpAmount),
      settlementAmount: 0,
      paymentType: formData.paymentType,
      bankName: formData.bankName,
      htgAmount: htgAmount,
      htgNotes: htgAmount > 0 ? 'Booking DP' : 'Lunas Awal',
      htgStatus: htgAmount > 0 ? HTGStatus.SAFE : HTGStatus.PAID,
      officerName: 'Admin Jakarta',
      accessories: {
        helmets: formData.helmets,
        raincoats: formData.raincoats
      },
      travelDetails: {
        ticketSchedule: formData.ticketSchedule,
        transportType: formData.transportType
      },
      signatures: {}
    };

    onSubmit(newRental);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Input Booking Baru</h3>
            <p className="text-sm text-gray-500">Isi data penyewaan motor cabang Jakarta</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-gray-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Section 1: Customer & Motor */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-wider">
                  <User size={16} /> Data Pelanggan
                </h4>
                <input 
                  type="text" required placeholder="Nama Lengkap Penyewa"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.customerName}
                  onChange={e => setFormData({...formData, customerName: e.target.value})}
                />
                <input 
                  type="tel" required placeholder="Nomor WhatsApp"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.customerPhone}
                  onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                />
                <textarea 
                  placeholder="Alamat / Keterangan Lokasi"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24"
                  value={formData.customerAddress}
                  onChange={e => setFormData({...formData, customerAddress: e.target.value})}
                />
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.locationDetails}
                  onChange={e => setFormData({...formData, locationDetails: e.target.value})}
                >
                  <option value="Ambil Sendiri">Ambil Sendiri</option>
                  <option value="Antar Jemput">Antar Jemput</option>
                </select>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-wider">
                  <Bike size={16} /> Armada & Waktu
                </h4>
                <select 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.motorId}
                  onChange={e => setFormData({...formData, motorId: e.target.value})}
                >
                  <option value="">Pilih Motor Ready</option>
                  {readyMotors.map(m => (
                    <option key={m.id} value={m.id}>{m.plateNumber} - {m.type}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Mulai Sewa</label>
                    <input 
                      type="datetime-local" required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Selesai Sewa</label>
                    <input 
                      type="datetime-local" required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Financials */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-wider">
                  <CreditCard size={16} /> Rincian Biaya
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Harga Sewa Dasar</label>
                    <input 
                      type="number" placeholder="Rp"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={formData.basePrice}
                      onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Fee Luar Kota</label>
                    <input 
                      type="number" placeholder="Rp"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={formData.outOfTownFee}
                      onChange={e => setFormData({...formData, outOfTownFee: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Fee Antar Jemput</label>
                  <input 
                    type="number" placeholder="Rp"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={formData.pickupDropoffFee}
                    onChange={e => setFormData({...formData, pickupDropoffFee: Number(e.target.value)})}
                  />
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                  <span className="text-blue-700 font-bold">Total Harga</span>
                  <span className="text-xl font-black text-blue-800">Rp {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-wider">
                  <Package size={16} /> Kelengkapan & Pembayaran
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="number" placeholder="Jumlah Helm"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.helmets}
                    onChange={e => setFormData({...formData, helmets: Number(e.target.value)})}
                  />
                  <input 
                    type="number" placeholder="Jumlah Jas Hujan"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.raincoats}
                    onChange={e => setFormData({...formData, raincoats: Number(e.target.value)})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">DP Dibayar</label>
                    <input 
                      type="number" placeholder="Rp"
                      className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-black text-green-700"
                      value={formData.dpAmount}
                      onChange={e => setFormData({...formData, dpAmount: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Sisa HTG</label>
                    <div className="w-full px-4 py-3 bg-red-50 border-2 border-red-100 rounded-xl font-black text-red-600">
                      Rp {htgAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.paymentType}
                    onChange={e => setFormData({...formData, paymentType: e.target.value as PaymentType})}
                  >
                    <option value={PaymentType.CASH}>Cash</option>
                    <option value={PaymentType.TRANSFER}>Transfer</option>
                  </select>
                  {formData.paymentType === PaymentType.TRANSFER && (
                    <input 
                      type="text" placeholder="Nama Bank"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.bankName}
                      onChange={e => setFormData({...formData, bankName: e.target.value})}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2 transition-transform active:scale-95"
          >
            <Save size={20} />
            Simpan Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;

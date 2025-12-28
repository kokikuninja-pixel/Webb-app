
import React, { useState } from 'react';
// Added Bike to imports
import { Search, Filter, MoreVertical, Send, FileText, PlusCircle, ExternalLink, Bike } from 'lucide-react';
import { Rental, Motor, MotorStatus, PaymentType, HTGStatus } from '../types';
import { formatCurrency, getWAUrl } from '../utils/helpers';
import InvoiceDetail from './InvoiceDetail';

interface BookingListProps {
  rentals: Rental[];
  setRentals: React.Dispatch<React.SetStateAction<Rental[]>>;
  motors: Motor[];
  setMotors: React.Dispatch<React.SetStateAction<Motor[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
}

const BookingList: React.FC<BookingListProps> = ({ rentals, setRentals, motors, setMotors, setTransactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const filteredRentals = rentals.filter(r => 
    r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.customerPhone.includes(searchTerm)
  );

  const handlePelunasan = (rentalId: string) => {
    setRentals(prev => prev.map(r => {
      if (r.id === rentalId) {
        const remaining = r.htgAmount;
        // Record transaction
        setTransactions(txs => [{
          id: `tx-${Date.now()}`,
          date: new Date().toISOString(),
          type: 'INCOME',
          category: 'Pelunasan',
          amount: remaining,
          notes: `Pelunasan sisa sewa ${r.customerName}`
        }, ...txs]);

        return {
          ...r,
          settlementAmount: r.settlementAmount + remaining,
          htgAmount: 0,
          htgStatus: HTGStatus.PAID
        };
      }
      return r;
    }));
  };

  const handleExtend = (rentalId: string) => {
    const extensionDays = 1;
    const extraCharge = 100000;

    setRentals(prev => prev.map(r => {
      if (r.id === rentalId) {
        const newEndDate = new Date(r.endDate);
        newEndDate.setDate(newEndDate.getDate() + extensionDays);
        
        return {
          ...r,
          endDate: newEndDate.toISOString(),
          totalPrice: r.totalPrice + extraCharge,
          htgAmount: r.htgAmount + extraCharge,
          htgStatus: HTGStatus.SAFE
        };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari Nama / HP Penyewa..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl flex items-center gap-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredRentals.map((r) => {
          const motor = motors.find(m => m.id === r.motorId);
          return (
            <div key={r.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${r.htgStatus === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                  <Bike size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{r.customerName}</h4>
                  <p className="text-sm text-gray-500">{r.customerPhone}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded uppercase tracking-wider">
                      {motor?.plateNumber} - {motor?.type}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded uppercase tracking-wider">
                      {new Date(r.startDate).toLocaleDateString()} s/d {new Date(r.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Total Sewa</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(r.totalPrice)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Status HTG</p>
                  <p className={`text-sm font-bold ${r.htgAmount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                    {r.htgAmount > 0 ? `Sisa ${formatCurrency(r.htgAmount)}` : 'Lunas'}
                  </p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Tipe</p>
                  <p className="text-sm text-gray-600 italic">"{r.locationDetails}"</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                <button 
                  onClick={() => window.open(getWAUrl(r.customerPhone, `Halo ${r.customerName}, mengingatkan masa sewa motor ${motor?.plateNumber} akan berakhir pada ${new Date(r.endDate).toLocaleString()}.`), '_blank')}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-100"
                  title="Kirim WA Pengingat"
                >
                  <Send size={18} />
                </button>
                <button 
                  onClick={() => {
                    setSelectedRental(r);
                    setShowInvoice(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                  title="Cetak Invoice"
                >
                  <FileText size={18} />
                </button>
                {r.htgAmount > 0 && (
                  <button 
                    onClick={() => handlePelunasan(r.id)}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Pelunasan
                  </button>
                )}
                <button 
                  onClick={() => handleExtend(r.id)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Extend (+1hr)
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showInvoice && selectedRental && (
        <InvoiceDetail 
          rental={selectedRental} 
          motor={motors.find(m => m.id === selectedRental.motorId)!}
          onClose={() => setShowInvoice(false)} 
        />
      )}
    </div>
  );
};

export default BookingList;

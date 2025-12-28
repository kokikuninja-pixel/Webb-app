
import React, { useState, useMemo } from 'react';
import { Search, AlertTriangle, CheckCircle, Clock, Filter, Phone } from 'lucide-react';
import { Rental, HTGStatus } from '../types';
import { formatCurrency, getWAUrl } from '../utils/helpers';

interface HTGManagerProps {
  rentals: Rental[];
  setRentals: React.Dispatch<React.SetStateAction<Rental[]>>;
}

const HTGManager: React.FC<HTGManagerProps> = ({ rentals, setRentals }) => {
  const [filter, setFilter] = useState<'ALL' | 'OVERTIME' | 'SAFE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const htgList = useMemo(() => {
    return rentals
      .filter(r => r.htgAmount > 0)
      .filter(r => {
        if (filter === 'OVERTIME') return r.htgStatus === HTGStatus.OVERTIME;
        if (filter === 'SAFE') return r.htgStatus === HTGStatus.SAFE;
        return true;
      })
      .filter(r => r.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [rentals, filter, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari HTG Pelanggan..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-gray-200 gap-1">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === 'ALL' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Semua
          </button>
          <button 
            onClick={() => setFilter('OVERTIME')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === 'OVERTIME' ? 'bg-red-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Overtime
          </button>
          <button 
            onClick={() => setFilter('SAFE')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === 'SAFE' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Aman
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 text-left border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Penyewa</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu Sewa</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Jumlah HTG</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {htgList.map((h) => (
              <tr key={h.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">{h.customerName}</p>
                  <p className="text-xs text-gray-500">{h.customerPhone}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-gray-600 font-medium">{new Date(h.startDate).toLocaleDateString()}</p>
                  <p className="text-[10px] text-gray-400">Sampai {new Date(h.endDate).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-black text-red-600">{formatCurrency(h.htgAmount)}</p>
                  <p className="text-[10px] text-gray-400 italic">"{h.htgNotes}"</p>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    h.htgStatus === HTGStatus.OVERTIME ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {h.htgStatus === HTGStatus.OVERTIME ? <Clock size={12} /> : <AlertTriangle size={12} />}
                    {h.htgStatus}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => window.open(getWAUrl(h.customerPhone, `Halo ${h.customerName}, kami mengingatkan ada tagihan HTG motor sebesar ${formatCurrency(h.htgAmount)} yang belum terlunasi. Mohon segera diselesaikan. Terima kasih.`), '_blank')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-100"
                    >
                      <Phone size={16} />
                    </button>
                    <button className="px-3 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-lg hover:bg-black transition-colors">
                      Lunasi
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {htgList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <CheckCircle size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">Tidak ada data HTG ditemukan</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HTGManager;

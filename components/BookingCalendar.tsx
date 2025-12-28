
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, User, Phone, Bike, Calendar as CalendarIcon, MessageCircle } from 'lucide-react';
import { Rental, Motor } from '../types.ts';
import { getWAUrl } from '../utils/helpers.ts';

interface BookingCalendarProps {
  rentals: Rental[];
  motors: Motor[];
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ rentals, motors }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const days = useMemo(() => {
    const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const daysArr = [];
    for (let i = 1; i <= totalDays; i++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toISOString().split('T')[0];
      const dayRentals = rentals.filter(r => {
        const start = r.startDate.split('T')[0];
        const end = r.endDate.split('T')[0];
        return dayDate >= start && dayDate <= end;
      });
      daysArr.push({ day: i, date: dayDate, rentals: dayRentals });
    }
    return daysArr;
  }, [currentDate, rentals]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">
              {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </h3>
            <p className="text-sm text-gray-400">Jadwal Penyewaan RMJ Jakarta</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 hover:bg-gray-100 rounded-xl border border-gray-200 text-sm font-bold">
            Hari Ini
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
            <div key={d} className="py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-32 md:h-40 border-r border-b border-gray-50 bg-gray-50/20" />
          ))}
          {days.map((d) => (
            <div key={d.day} className="h-32 md:h-40 border-r border-b border-gray-50 p-2 overflow-y-auto hover:bg-gray-50/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-black ${d.date === new Date().toISOString().split('T')[0] ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-gray-400'}`}>
                  {d.day}
                </span>
                {d.rentals.length > 0 && (
                  <span className="text-[10px] font-bold text-blue-600 px-1.5 py-0.5 bg-blue-50 rounded-md">
                    {d.rentals.length} Book
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {d.rentals.map(r => {
                  const motor = motors.find(m => m.id === r.motorId);
                  return (
                    <div 
                      key={r.id} 
                      className="group relative cursor-pointer"
                    >
                      <div className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-1 rounded-md truncate hover:bg-blue-700 transition-colors flex flex-col gap-0.5">
                        <span className="truncate">{r.customerName}</span>
                        <span className="opacity-80 text-[8px] font-mono leading-none">{motor?.plateNumber}</span>
                      </div>
                      <div className="hidden group-hover:block absolute z-20 top-full left-0 mt-1 w-52 bg-white shadow-2xl rounded-xl border border-gray-100 p-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                            {r.customerName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900 leading-none">{r.customerName}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{r.customerPhone}</p>
                          </div>
                        </div>
                        <div className="space-y-2 mb-4 border-t border-gray-50 pt-2">
                          <div className="flex items-center gap-2 text-[10px] text-gray-600">
                            <Bike size={12} className="text-blue-500" /> 
                            <span className="font-bold">{motor?.plateNumber}</span> ({motor?.type})
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-600">
                            <CalendarIcon size={12} className="text-gray-400" /> 
                            <span>{new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(getWAUrl(r.customerPhone, `Halo ${r.customerName}, konfirmasi booking motor ${motor?.type} (${motor?.plateNumber}) Anda untuk tanggal ${new Date(r.startDate).toLocaleDateString()}.`), '_blank');
                          }}
                          className="w-full py-2 bg-green-500 hover:bg-green-600 text-white text-[10px] font-black rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <MessageCircle size={12} />
                          Kirim WhatsApp
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
          <h4 className="text-sm font-black text-blue-800 uppercase tracking-widest mb-4">Motor Siap Disewa Kembali</h4>
          <div className="space-y-3">
            {motors.map(m => {
              const activeRentals = rentals.filter(r => r.motorId === m.id).sort((a,b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
              const lastEndDate = activeRentals.length > 0 ? new Date(activeRentals[0].endDate) : null;
              
              return (
                <div key={m.id} className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Bike size={16} /></div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{m.plateNumber}</p>
                      <p className="text-[10px] text-gray-400">{m.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {lastEndDate && lastEndDate > new Date() ? (
                      <div>
                        <p className="text-[9px] font-black text-amber-600 uppercase">Tersedia Pada</p>
                        <p className="text-[11px] font-bold text-gray-700">{lastEndDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-lg uppercase tracking-wider">READY NOW</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Informasi Tambahan</h4>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-4 h-4 rounded-full bg-blue-600 shrink-0" />
              <p className="text-xs text-slate-600 leading-relaxed">
                Blok biru pada kalender menunjukkan motor sedang <span className="font-bold">Disewa</span> atau <span className="font-bold">Dibooking</span>. Klik untuk melihat detail penyewa dan plat motor.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-4 h-4 rounded-full bg-green-500 shrink-0" />
              <p className="text-xs text-slate-600 leading-relaxed">
                Gunakan tombol <span className="font-bold text-green-600">WhatsApp</span> di tooltip kalender untuk pengingat otomatis ke pelanggan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;


import React, { useState } from 'react';
import { MoreHorizontal, Plus, Settings, ShieldCheck, Activity, Calendar, X, Save } from 'lucide-react';
import { Motor, MotorStatus, Rental } from '../types';

interface InventoryProps {
  motors: Motor[];
  setMotors: React.Dispatch<React.SetStateAction<Motor[]>>;
  rentals: Rental[];
  onAddMotor: (motor: Motor) => void;
}

const Inventory: React.FC<InventoryProps> = ({ motors, setMotors, rentals, onAddMotor }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMotor, setNewMotor] = useState({ plateNumber: '', type: '' });

  const toggleStatus = (id: string) => {
    setMotors(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === MotorStatus.READY ? MotorStatus.MAINTENANCE : MotorStatus.READY;
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  const handleSubmitMotor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMotor.plateNumber || !newMotor.type) return;

    const motor: Motor = {
      id: `M-${Date.now()}`,
      plateNumber: newMotor.plateNumber.toUpperCase(),
      type: newMotor.type,
      status: MotorStatus.READY
    };

    onAddMotor(motor);
    setNewMotor({ plateNumber: '', type: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Armada Motor Jakarta</h3>
          <p className="text-sm text-gray-500">Monitoring status ketersediaan armada real-time</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors shadow-lg shadow-gray-200 font-bold"
        >
          <Plus size={18} />
          Tambah Unit Baru
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {motors.map((m) => {
          const motorRentals = rentals.filter(r => r.motorId === m.id).sort((a,b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
          const latestRental = motorRentals[0];
          const isOccupied = m.status === MotorStatus.RENTED || m.status === MotorStatus.BOOKED;

          return (
            <div key={m.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
              <div className="h-44 bg-gray-100 relative overflow-hidden">
                 <img 
                  src={`https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&q=80&w=400`} 
                  alt={m.type}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                    m.status === MotorStatus.READY ? 'bg-green-500 text-white border-green-400' :
                    m.status === MotorStatus.RENTED ? 'bg-blue-600 text-white border-blue-500' :
                    m.status === MotorStatus.BOOKED ? 'bg-amber-500 text-white border-amber-400' :
                    'bg-slate-500 text-white border-slate-400'
                  }`}>
                    {m.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-black text-gray-900 text-lg leading-tight mb-1">{m.type}</h4>
                  <p className="text-xs text-blue-600 font-black tracking-widest uppercase">{m.plateNumber}</p>
                </div>

                <div className="space-y-3 mb-6">
                  {isOccupied && latestRental ? (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                      <Calendar size={16} className="text-blue-600" />
                      <div>
                        <p className="text-[10px] font-black text-blue-700 uppercase">Estimasi Tersedia</p>
                        <p className="text-xs font-bold text-gray-700">{new Date(latestRental.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                  ) : m.status === MotorStatus.READY ? (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-2xl border border-green-100">
                      <ShieldCheck size={16} className="text-green-600" />
                      <div>
                        <p className="text-[10px] font-black text-green-700 uppercase">Kondisi Prima</p>
                        <p className="text-xs font-bold text-gray-700">Siap Untuk Disewakan</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-2xl border border-red-100">
                      <Activity size={16} className="text-red-600" />
                      <div>
                        <p className="text-[10px] font-black text-red-700 uppercase">Sedang Perbaikan</p>
                        <p className="text-xs font-bold text-gray-700">Cek Mekanik Jakarta</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => toggleStatus(m.id)}
                      className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Mulai Maintenance"
                    >
                      <Settings size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">LIVE</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tambah Unit */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Tambah Unit Armada</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitMotor} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nomor Polisi</label>
                <input 
                  type="text" required placeholder="Contoh: B 1234 XYZ"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold uppercase"
                  value={newMotor.plateNumber}
                  onChange={e => setNewMotor({...newMotor, plateNumber: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipe / Merk Motor</label>
                <input 
                  type="text" required placeholder="Contoh: Honda Vario 160"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newMotor.type}
                  onChange={e => setNewMotor({...newMotor, type: e.target.value})}
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Save size={20} />
                  Simpan Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

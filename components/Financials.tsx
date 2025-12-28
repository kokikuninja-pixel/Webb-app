
import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Printer, 
  Download, 
  Calendar as CalendarIcon, 
  Wallet, 
  CreditCard,
  History,
  TrendingUp,
  Receipt,
  ArrowRightCircle,
  Plus
} from 'lucide-react';
import { Transaction } from '../types.ts';
import { formatCurrency } from '../utils/helpers.ts';

interface FinancialsProps {
  transactions: Transaction[];
  stats: any;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const Financials: React.FC<FinancialsProps> = ({ transactions, stats, setTransactions }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSetoranForm, setShowSetoranForm] = useState(false);
  const [setoranAmount, setSetoranAmount] = useState('');
  const [setoranNotes, setSetoranNotes] = useState('');

  // Filter transaksi berdasarkan tanggal yang dipilih
  const dailyTransactions = useMemo(() => {
    return transactions.filter(t => t.date.startsWith(selectedDate));
  }, [transactions, selectedDate]);

  // Hitung metrik untuk tanggal yang dipilih
  const dailyMetrics = useMemo(() => {
    const income = dailyTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = dailyTransactions
      .filter(t => t.type === 'EXPENSE' && t.category !== 'Setoran')
      .reduce((acc, t) => acc + t.amount, 0);

    const setoran = dailyTransactions
      .filter(t => t.type === 'EXPENSE' && t.category === 'Setoran')
      .reduce((acc, t) => acc + t.amount, 0);

    const cashIncome = dailyTransactions
      .filter(t => t.type === 'INCOME' && !t.notes.toLowerCase().includes('transfer'))
      .reduce((acc, t) => acc + t.amount, 0);
    
    const transferIncome = dailyTransactions
      .filter(t => t.type === 'INCOME' && t.notes.toLowerCase().includes('transfer'))
      .reduce((acc, t) => acc + t.amount, 0);

    return { 
      income, 
      expense, 
      setoran,
      netCash: income - expense - setoran, 
      cashIncome, 
      transferIncome 
    };
  }, [dailyTransactions]);

  const handleAddSetoran = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setoranAmount || Number(setoranAmount) <= 0) return;

    const newTransaction: Transaction = {
      id: `SET-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'EXPENSE',
      category: 'Setoran',
      amount: Number(setoranAmount),
      notes: setoranNotes || 'Setoran harian Jakarta'
    };

    setTransactions([newTransaction, ...transactions]);
    setSetoranAmount('');
    setSetoranNotes('');
    setShowSetoranForm(false);
    alert('Setoran berhasil dicatat!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm no-print">
        <div>
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <History className="text-blue-600" /> Rekap Keuangan Harian
          </h3>
          <p className="text-sm text-gray-500">Monitoring arus kas harian cabang Jakarta</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="date" 
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700 w-full"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowSetoranForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200"
          >
            <ArrowRightCircle size={18} />
            Catat Setoran
          </button>
          <button 
            onClick={handlePrint}
            className="p-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
            title="Cetak Rekap"
          >
            <Printer size={20} />
          </button>
        </div>
      </div>

      {/* Setoran Recording Form (Modalish) */}
      {showSetoranForm && (
        <div className="bg-blue-900 p-6 rounded-3xl text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-lg flex items-center gap-2">
              <Wallet className="text-blue-300" /> Pencatatan Setoran Jakarta
            </h4>
            <button onClick={() => setShowSetoranForm(false)} className="text-blue-300 hover:text-white">
              <Plus size={24} className="rotate-45" />
            </button>
          </div>
          <form onSubmit={handleAddSetoran} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-blue-300 tracking-widest">Nominal Setoran</label>
              <input 
                type="number" required placeholder="Rp 0"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:bg-white/20 outline-none text-white font-black"
                value={setoranAmount}
                onChange={e => setSetoranAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-blue-300 tracking-widest">Keterangan (Opsional)</label>
              <input 
                type="text" placeholder="Catatan setoran..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:bg-white/20 outline-none text-white text-sm"
                value={setoranNotes}
                onChange={e => setSetoranNotes(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-white text-blue-900 font-black rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Simpan Setoran
            </button>
          </form>
          <p className="mt-4 text-[10px] text-blue-300 italic">
            * Mencatat setoran akan mengurangi saldo "Uang Kas Jakarta" Anda saat ini.
          </p>
        </div>
      )}

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-slate-800 p-6 rounded-3xl text-white shadow-xl lg:col-span-1">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Kas Jakarta (Cash in Hand)</p>
          <h3 className="text-3xl font-black mb-4">{formatCurrency(dailyMetrics.netCash)}</h3>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-2xl w-fit">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-[10px] font-bold text-slate-200">Siap Setor / Sisa Saldo</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Pemasukan</p>
            <div className="p-2 bg-green-50 text-green-600 rounded-xl"><ArrowUpRight size={20} /></div>
          </div>
          <h3 className="text-2xl font-black text-gray-900">{formatCurrency(dailyMetrics.income)}</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-gray-400">VIA CASH</span>
              <span className="text-gray-900">{formatCurrency(dailyMetrics.cashIncome)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-gray-400">VIA TRANSFER</span>
              <span className="text-gray-900">{formatCurrency(dailyMetrics.transferIncome)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Pengeluaran Ops</p>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl"><ArrowDownRight size={20} /></div>
          </div>
          <h3 className="text-2xl font-black text-gray-900">{formatCurrency(dailyMetrics.expense)}</h3>
          <p className="mt-4 text-[10px] font-bold text-gray-400 italic">Maintenance & Operasional</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Telah Disetor</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><ArrowRightCircle size={20} /></div>
          </div>
          <h3 className="text-2xl font-black text-blue-600">{formatCurrency(dailyMetrics.setoran)}</h3>
          <p className="mt-4 text-[10px] font-bold text-gray-400 italic">Diserahkan ke Pusat/Bank</p>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Receipt className="text-gray-400" size={20} />
            <h4 className="font-bold text-gray-900">Rincian Transaksi Tanggal {new Date(selectedDate).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</h4>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Jam</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dailyTransactions.length > 0 ? (
                dailyTransactions.map((t) => (
                  <tr key={t.id} className={`hover:bg-gray-50/50 transition-colors ${t.category === 'Setoran' ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{new Date(t.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        t.type === 'INCOME' ? 'bg-green-100 text-green-700' : 
                        t.category === 'Setoran' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {t.notes}
                      {t.notes.toLowerCase().includes('transfer') && (
                        <span className="ml-2 inline-flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-1.5 py-0.5 rounded">
                          <CreditCard size={10} /> Trf
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4 text-right text-sm font-black ${
                      t.type === 'INCOME' ? 'text-green-600' : 
                      t.category === 'Setoran' ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm font-medium">
                    Tidak ada transaksi pada tanggal ini
                  </td>
                </tr>
              )}
            </tbody>
            {dailyTransactions.length > 0 && (
              <tfoot className="bg-gray-50/80 font-black">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right text-[10px] text-gray-400 uppercase tracking-widest">Sisa Kas Jakarta</td>
                  <td className="px-6 py-4 text-right text-blue-600">{formatCurrency(dailyMetrics.netCash)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Printable Report Only */}
      <div className="hidden print-only mt-12 p-8 border-2 border-dashed border-gray-300 rounded-3xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black">LAPORAN SETORAN HARIAN</h2>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">CABANG JAKARTA - {selectedDate}</p>
        </div>
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="space-y-2 border p-4 rounded-2xl">
            <p className="text-xs font-bold text-gray-400">TOTAL PEMASUKAN</p>
            <p className="text-lg font-black">{formatCurrency(dailyMetrics.income)}</p>
          </div>
          <div className="space-y-2 border p-4 rounded-2xl">
            <p className="text-xs font-bold text-gray-400">TOTAL PENGELUARAN OPS</p>
            <p className="text-lg font-black">{formatCurrency(dailyMetrics.expense)}</p>
          </div>
          <div className="space-y-2 border p-4 rounded-2xl bg-gray-50">
            <p className="text-xs font-bold text-gray-400">TOTAL SETORAN</p>
            <p className="text-lg font-black text-blue-600">{formatCurrency(dailyMetrics.setoran)}</p>
          </div>
        </div>
        <div className="text-center border-t pt-8 mt-12 grid grid-cols-2 gap-20">
          <div>
            <p className="text-[10px] font-black uppercase mb-12">Admin Cabang Jakarta</p>
            <div className="border-t w-full"></div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase mb-12">Kepala Kantor Bandung</p>
            <div className="border-t w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financials;

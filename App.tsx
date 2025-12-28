
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Bike, 
  ClipboardList, 
  AlertCircle, 
  Wallet, 
  Menu, 
  X, 
  Bell,
  Search,
  Plus,
  Calendar as CalendarIcon,
  Database,
  RefreshCw
} from 'lucide-react';
import Dashboard from './components/Dashboard.tsx';
import Inventory from './components/Inventory.tsx';
import BookingList from './components/BookingList.tsx';
import HTGManager from './components/HTGManager.tsx';
import Financials from './components/Financials.tsx';
import BookingForm from './components/BookingForm.tsx';
import BookingCalendar from './components/BookingCalendar.tsx';
import DataCenter from './components/DataCenter.tsx';
import { Motor, Rental, Transaction, MotorStatus, HTGStatus } from './types.ts';

// Global declaration for Google Apps Script environment
declare const google: any;

const callGAS = (funcName: string, ...args: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)[funcName](...args);
    } else {
      console.warn(`GAS not found. Mocking ${funcName}`);
      resolve(null);
    }
  });
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sheetUrl, setSheetUrl] = useState<string>('');

  const [motors, setMotors] = useState<Motor[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await callGAS('getAllData');
      if (data && !data.error) {
        setMotors(data.motors || []);
        setRentals(data.rentals || []);
        setTransactions(data.transactions || []);
        if (data.settings) setSheetUrl(data.settings.url);
      } else if (data?.error) {
        console.error("GAS Error:", data.error);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalHTG = rentals.reduce((acc, r) => acc + Number(r.htgAmount || 0), 0);
    const rentedCount = motors.filter(m => m.status === MotorStatus.RENTED).length;
    const readyCount = motors.filter(m => m.status === MotorStatus.READY).length;
    const bookedCount = motors.filter(m => m.status === MotorStatus.BOOKED).length;
    
    const today = new Date().toISOString().split('T')[0];
    const dailyIncome = transactions
      .filter(t => t.date.startsWith(today) && t.type === 'INCOME')
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const dailyExpense = transactions
      .filter(t => t.date.startsWith(today) && t.type === 'EXPENSE' && t.category !== 'Setoran')
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const dailySetoran = transactions
      .filter(t => t.date.startsWith(today) && t.type === 'EXPENSE' && t.category === 'Setoran')
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);
    
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const totalExpense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    return { 
      totalHTG, 
      rentedCount, 
      readyCount, 
      bookedCount, 
      dailyIncome, 
      dailyExpense, 
      dailySetoran,
      totalIncome, 
      totalExpense 
    };
  }, [motors, rentals, transactions]);

  const handleAddBooking = async (newRental: Rental) => {
    setIsLoading(true);
    try {
      await callGAS('addRecord', 'Rentals', {
        ...newRental,
        helmets: newRental.accessories.helmets,
        raincoats: newRental.accessories.raincoats,
        ticketSchedule: newRental.travelDetails?.ticketSchedule,
        transportType: newRental.travelDetails?.transportType
      });
      await callGAS('updateRecord', 'Motors', newRental.motorId, { status: MotorStatus.BOOKED });
      if (newRental.dpAmount > 0) {
        await callGAS('addRecord', 'Transactions', {
          id: `tx-${Date.now()}`,
          date: newRental.createdAt,
          type: 'INCOME',
          category: 'DP Rental',
          amount: newRental.dpAmount,
          notes: `DP for ${newRental.customerName}`
        });
      }
      await fetchData();
      setShowBookingForm(false);
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan booking.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMotor = async (newMotor: Motor) => {
    setIsLoading(true);
    try {
      await callGAS('addRecord', 'Motors', newMotor);
      await fetchData();
    } catch (err) {
      alert("Gagal menambah unit motor.");
    } finally {
      setIsLoading(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory Motor', icon: Bike },
    { id: 'calendar', label: 'Kalender Sewa', icon: CalendarIcon },
    { id: 'bookings', label: 'Data Sewa', icon: ClipboardList },
    { id: 'htg', label: 'Manajemen HTG', icon: AlertCircle },
    { id: 'financials', label: 'Keuangan', icon: Wallet },
    { id: 'database', label: 'Database', icon: Database },
  ];

  if (isLoading && motors.length === 0) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black tracking-widest uppercase text-xs animate-pulse">Menghubungkan Database RMJ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out z-50
        md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bike size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight uppercase">RMJ</h1>
              <p className="text-xs text-slate-400">Rental Motor Jakarta</p>
            </div>
          </div>

          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
          <button 
            onClick={fetchData}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs transition-colors border border-slate-700"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh Data
          </button>
          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400 mb-1 font-medium text-center uppercase tracking-tighter">Monitoring Aktif</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] font-semibold text-white truncate">Connected to Google Sheets</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              {navItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              {isLoading ? 'Syncing...' : 'Live Sync'}
            </div>
            <button 
              onClick={() => setShowBookingForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Booking Baru</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'dashboard' && <Dashboard stats={stats} rentals={rentals} transactions={transactions} motors={motors} />}
          {activeTab === 'inventory' && <Inventory motors={motors} setMotors={setMotors} rentals={rentals} onAddMotor={handleAddMotor} />}
          {activeTab === 'calendar' && <BookingCalendar rentals={rentals} motors={motors} />}
          {activeTab === 'bookings' && <BookingList rentals={rentals} setRentals={setRentals} motors={motors} setMotors={setMotors} setTransactions={setTransactions} />}
          {activeTab === 'htg' && <HTGManager rentals={rentals} setRentals={setRentals} />}
          {activeTab === 'financials' && <Financials transactions={transactions} stats={stats} setTransactions={setTransactions} />}
          {activeTab === 'database' && <DataCenter motors={motors} rentals={rentals} transactions={transactions} onImport={fetchData} sheetUrl={sheetUrl} />}
        </div>
      </main>

      {showBookingForm && (
        <BookingForm motors={motors} onClose={() => setShowBookingForm(false)} onSubmit={handleAddBooking} />
      )}
    </div>
  );
};

export default App;

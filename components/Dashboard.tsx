
import React, { useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { Wallet, AlertCircle, Bike, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { Motor, Rental, Transaction, MotorStatus } from '../types';
import { formatCurrency } from '../utils/helpers';

interface DashboardProps {
  stats: any;
  rentals: Rental[];
  transactions: Transaction[];
  motors: Motor[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, rentals, transactions, motors }) => {
  const motorStatusData = [
    { name: 'Ready', value: stats.readyCount, color: '#22c55e' },
    { name: 'Disewa', value: stats.rentedCount, color: '#3b82f6' },
    { name: 'Booking', value: stats.bookedCount, color: '#f59e0b' },
  ];

  // Group transactions by date for daily chart
  const dailyData = useMemo(() => {
    const groups: Record<string, { date: string, income: number, expense: number }> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(date => {
      groups[date] = { date, income: 0, expense: 0 };
    });

    transactions.forEach(t => {
      const date = t.date.split('T')[0];
      if (groups[date]) {
        if (t.type === 'INCOME') groups[date].income += t.amount;
        else groups[date].expense += t.amount;
      }
    });

    return Object.values(groups);
  }, [transactions]);

  const StatCard = ({ title, value, subtitle, iconColor, iconBg, icon: Icon }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <p className="text-gray-500 font-medium text-sm">{title}</p>
          <div className={`${iconBg} ${iconColor} p-2 rounded-lg`}>
            <Icon size={20} />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <p className="text-xs text-gray-400 mt-2 font-medium">{subtitle}</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Metrics Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pemasukan" 
          value={formatCurrency(stats.totalIncome)}
          subtitle="Total akumulasi masuk"
          iconColor="text-green-600"
          iconBg="bg-green-50"
          icon={TrendingUp}
        />
        <StatCard 
          title="Total Pengeluaran" 
          value={formatCurrency(stats.totalExpense)}
          subtitle="Biaya operasional & unit"
          iconColor="text-red-600"
          iconBg="bg-red-50"
          icon={ArrowDownRight}
        />
        <StatCard 
          title="HTG (Piutang)" 
          value={formatCurrency(stats.totalHTG)}
          subtitle="Hutang sewa belum lunas"
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          icon={AlertCircle}
        />
        <StatCard 
          title="Setoran Hari Ini" 
          value={formatCurrency(stats.dailyIncome - stats.dailyExpense)}
          subtitle="Net cash flow hari ini"
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          icon={Wallet}
        />
      </div>

      {/* Metrics Row 2 (Operational) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Bike size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Motor Ready</p>
            <p className="text-xl font-black text-gray-900">{stats.readyCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Bike size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Sedang Disewa</p>
            <p className="text-xl font-black text-gray-900">{stats.rentedCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Bike size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Dibooking</p>
            <p className="text-xl font-black text-gray-900">{stats.bookedCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><Bike size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Armada</p>
            <p className="text-xl font-black text-gray-900">{motors.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Cashflow Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Laporan Keuangan Harian (7 Hari Terakhir)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar name="Pemasukan" dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar name="Pengeluaran" dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Distribution */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Distribusi Armada</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={motorStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {motorStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-3 mt-6">
            {motorStatusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm font-bold text-gray-600">{s.name}</span>
                </div>
                <span className="font-black text-gray-900">{s.value} <span className="text-[10px] text-gray-400 font-normal">UNIT</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

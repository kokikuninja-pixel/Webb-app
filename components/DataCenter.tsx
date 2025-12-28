
import React, { useState } from 'react';
import { Database, Upload, Download, RefreshCw, Table, FileJson, AlertCircle, CheckCircle2, LayoutGrid, ExternalLink, FileSpreadsheet } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

declare const google: any;

interface DataCenterProps {
  motors: any[];
  rentals: any[];
  transactions: any[];
  onImport: () => void;
  sheetUrl?: string;
}

const DataCenter: React.FC<DataCenterProps> = ({ motors, rentals, transactions, onImport, sheetUrl }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onImport();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const openSheet = () => {
    if (sheetUrl) {
      window.open(sheetUrl, '_blank');
    } else {
      alert("URL Spreadsheet tidak ditemukan. Pastikan Anda menjalankan aplikasi ini di Google Apps Script.");
    }
  };

  const exportToCSV = (data: any[], fileName: string) => {
    if (data.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(header => {
        let val = row[header];
        if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
        return val;
      }).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Database & Sinkronisasi</h2>
            <p className="text-sm text-gray-500">Kelola data terpusat di Google Sheets</p>
          </div>
        </div>

        {/* Cloud Connection Status */}
        <div className="p-8 bg-slate-900 rounded-3xl text-white space-y-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Database size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-green-400">
              <CheckCircle2 size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Sistem Aktif</span>
            </div>
            <h3 className="text-2xl font-black mb-4">Integrasi Google Sheets Aktif</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Data Anda disimpan secara aman di Spreadsheet RMJ. Klik tombol di bawah untuk sinkronisasi manual atau membuka database mentah.
            </p>
            
            <div className="flex flex-wrap gap-3 mt-8">
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-500/20"
              >
                <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={18} />
                Refresh Data
              </button>
              <button 
                onClick={openSheet}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all text-sm"
              >
                <Table size={18} />
                Buka Spreadsheet <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-green-600" /> Export Data ke Excel (CSV)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => exportToCSV(motors, "RMJ_Armada")}
              className="p-4 border-2 border-gray-100 rounded-2xl hover:border-green-200 hover:bg-green-50 transition-all text-left flex flex-col gap-2 group"
            >
              <Download size={20} className="text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-black text-gray-900">Data Armada</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{motors.length} Unit</span>
            </button>
            <button 
              onClick={() => exportToCSV(rentals, "RMJ_Sewa")}
              className="p-4 border-2 border-gray-100 rounded-2xl hover:border-green-200 hover:bg-green-50 transition-all text-left flex flex-col gap-2 group"
            >
              <Download size={20} className="text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-black text-gray-900">Data Penyewaan</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{rentals.length} Record</span>
            </button>
            <button 
              onClick={() => exportToCSV(transactions, "RMJ_Keuangan")}
              className="p-4 border-2 border-gray-100 rounded-2xl hover:border-green-200 hover:bg-green-50 transition-all text-left flex flex-col gap-2 group"
            >
              <Download size={20} className="text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-black text-gray-900">Laporan Keuangan</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{transactions.length} Transaksi</span>
            </button>
          </div>
        </div>

        {/* Database Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-gray-100 rounded-3xl bg-gray-50/50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Unit Motor</p>
            <p className="text-2xl font-black text-gray-900">{motors.length} <span className="text-xs text-gray-400 uppercase">Baris</span></p>
          </div>
          <div className="p-6 border border-gray-100 rounded-3xl bg-gray-50/50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Riwayat Sewa</p>
            <p className="text-2xl font-black text-gray-900">{rentals.length} <span className="text-xs text-gray-400 uppercase">Baris</span></p>
          </div>
          <div className="p-6 border border-gray-100 rounded-3xl bg-gray-50/50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Arus Keuangan</p>
            <p className="text-2xl font-black text-gray-900">{transactions.length} <span className="text-xs text-gray-400 uppercase">Baris</span></p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4">
        <AlertCircle className="text-blue-600 shrink-0" size={24} />
        <div>
          <h4 className="text-sm font-black text-blue-800 mb-1">Cara Kerja Database</h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            Aplikasi ini terhubung langsung ke spreadsheet <strong>RMJ Database</strong>. Pastikan Anda tidak menghapus header atau mengubah nama sheet agar integrasi tetap lancar. Gunakan <strong>Export CSV</strong> untuk pengolahan data Excel lebih lanjut.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataCenter;


import React from 'react';
import { X, Printer, Download, Bike, MapPin, Phone, User, Calendar } from 'lucide-react';
import { Rental, Motor } from '../types';
import { formatCurrency } from '../utils/helpers';

interface InvoiceDetailProps {
  rental: Rental;
  motor: Motor;
  onClose: () => void;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ rental, motor, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[110] flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 no-print">
          <h3 className="font-bold text-gray-900">E-Invoice Preview</h3>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold"
            >
              <Printer size={18} /> Print
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-gray-200">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-10 flex-1 print-only" id="invoice-content">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Bike size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">RMJ</h1>
              </div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Rental Motor Jakarta</p>
              <p className="text-xs text-gray-400">Jakarta Monitoring Center</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black text-gray-900 mb-1">INVOICE</h2>
              <p className="text-sm font-bold text-blue-600">#{rental.id}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(rental.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b pb-2">Data Penyewa</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <User size={16} className="text-gray-300 mt-0.5" />
                  <div>
                    <p className="text-sm font-black text-gray-900">{rental.customerName}</p>
                    <p className="text-xs text-gray-500">{rental.customerPhone}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin size={16} className="text-gray-300 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">{rental.customerAddress || '-'}</p>
                </div>
                <p className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">{rental.locationDetails}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b pb-2">Unit Motor</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Bike size={16} className="text-gray-300 mt-0.5" />
                  <div>
                    <p className="text-sm font-black text-gray-900">{motor.type}</p>
                    <p className="text-xs font-mono text-blue-600">{motor.plateNumber}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Calendar size={16} className="text-gray-300 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Sewa s/d</p>
                    <p className="text-xs text-gray-700">{new Date(rental.endDate).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mb-12">
            <thead className="border-b-2 border-gray-900">
              <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="py-4">Deskripsi Layanan</th>
                <th className="py-4 text-right">Jumlah</th>
                <th className="py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="text-sm">
                <td className="py-5">
                  <p className="font-bold text-gray-900">Sewa Motor {motor.type}</p>
                  <p className="text-xs text-gray-500">Durasi: {Math.ceil((new Date(rental.endDate).getTime() - new Date(rental.startDate).getTime()) / (1000 * 3600 * 24))} Hari</p>
                </td>
                <td className="py-5 text-right font-medium">1</td>
                <td className="py-5 text-right font-bold">{formatCurrency(rental.basePrice)}</td>
              </tr>
              {rental.outOfTownFee > 0 && (
                <tr className="text-sm">
                  <td className="py-4 font-bold text-gray-900">Fee Luar Kota</td>
                  <td className="py-4 text-right font-medium">-</td>
                  <td className="py-4 text-right font-bold">{formatCurrency(rental.outOfTownFee)}</td>
                </tr>
              )}
              {rental.pickupDropoffFee > 0 && (
                <tr className="text-sm">
                  <td className="py-4 font-bold text-gray-900">Fee Antar Jemput</td>
                  <td className="py-4 text-right font-medium">-</td>
                  <td className="py-4 text-right font-bold">{formatCurrency(rental.pickupDropoffFee)}</td>
                </tr>
              )}
              <tr className="text-sm border-t border-gray-200">
                <td className="py-4 font-bold text-gray-900 italic">Kelengkapan: Helm ({rental.accessories.helmets}), Jas Hujan ({rental.accessories.raincoats})</td>
                <td className="py-4 text-right text-xs font-bold text-gray-400">TOTAL</td>
                <td className="py-4 text-right text-xl font-black text-blue-600">{formatCurrency(rental.totalPrice)}</td>
              </tr>
            </tbody>
          </table>

          {/* Payment Summary */}
          <div className="flex justify-end mb-16">
            <div className="w-full max-w-xs space-y-3 bg-gray-50 p-6 rounded-2xl">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-bold uppercase">DP Masuk</span>
                <span className="font-bold text-green-600">-{formatCurrency(rental.dpAmount)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-bold uppercase">Sisa Pelunasan</span>
                <span className="font-black text-red-600">{formatCurrency(rental.htgAmount)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-900 uppercase">Metode</span>
                <span className="text-xs font-bold text-gray-700">{rental.paymentType} {rental.bankName ? `(${rental.bankName})` : ''}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-20">
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-16">Penyewa</p>
              <div className="border-t border-gray-300 pt-2">
                <p className="text-sm font-bold text-gray-900">{rental.customerName}</p>
                <p className="text-[10px] text-gray-400 uppercase">Tanda Tangan</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-16">Admin RMJ Jakarta</p>
              <div className="border-t border-gray-300 pt-2">
                <p className="text-sm font-bold text-gray-900">{rental.officerName}</p>
                <p className="text-[10px] text-gray-400 uppercase">Cap & Tanda Tangan</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">Terima kasih telah menggunakan layanan RMJ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;

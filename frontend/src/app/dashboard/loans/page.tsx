'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, History, AlertCircle } from 'lucide-react';
import { loanAPI, adminApi } from '@/lib/api';

export default function LoansPage() {
  const [data, setData] = useState<any>(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const res = await (loanAPI as any).getStatus(); // Ensure this is in api.ts
    setData(res.data.data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleRepay = async (loanId: string) => {
    if (!confirm("Repay loan with 9% interest?")) return;
    try {
      await (loanAPI as any).repay(loanId);
      alert("Repaid Successfully!");
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Repayment failed");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Loan Management</h1>

      {/* ACTIVE LOAN SECTION */}
      {data.activeLoan ? (
        <div className="bg-indigo-700 text-white p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="opacity-80 text-sm">Active Loan (Principal: ৳{data.activeLoan.principal_amount})</p>
              <h2 className="text-4xl font-bold mt-1">Total Due: ৳{data.activeLoan.principal_amount * 1.09}</h2>
              <p className="mt-2 text-xs bg-indigo-500 inline-block px-2 py-1 rounded">Status: {data.activeLoan.status}</p>
            </div>
            <button 
              onClick={() => handleRepay(data.activeLoan.loan_id)}
              className="bg-white text-indigo-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Repay Now
            </button>
          </div>
        </div>
      ) : data.latestApplication?.decision_status === 'submitted' ? (
        <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl flex items-center gap-4">
          <Clock className="text-yellow-600 w-12 h-12" />
          <div>
            <h3 className="font-bold text-yellow-800 text-lg">Application Under Review</h3>
            <p className="text-yellow-700">Requested ৳{data.latestApplication.requested_amount}. Check back soon!</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500">Your Credit Limit</p>
            <h2 className="text-5xl font-black text-green-600">৳{data.limit}</h2>
            <div className="mt-6 flex gap-3">
                <input type="number" className="border p-3 flex-1 rounded-xl" placeholder="Amount (min 500)" onChange={e => setAmount(Number(e.target.value))} />
                <button onClick={() => loanAPI.apply({amount}).then(loadData)} disabled={amount < 500 || amount > data.limit} className="bg-primary-600 text-white px-8 rounded-xl font-bold disabled:bg-gray-300">Apply</button>
            </div>
        </div>
      )}

      {/* LOAN HISTORY SECTION */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2"><History className="w-5 h-5"/> Loan History</h3>
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4">Amount</th>
                <th className="p-4">Paid Total (Inc. 9%)</th>
                <th className="p-4">Repaid Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.history.map((h: any) => (
                <tr key={h.loan_id}>
                  <td className="p-4 font-medium">৳{h.principal_amount}</td>
                  <td className="p-4">৳{h.principal_amount * 1.09}</td>
                  <td className="p-4 text-sm text-gray-500">{new Date(h.repaid_at).toLocaleDateString()}</td>
                  <td className="p-4"><span className="text-green-600 text-xs font-bold uppercase">Repaid</span></td>
                </tr>
              ))}
              {data.history.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-gray-400">No past loans found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

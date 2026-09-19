import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Loader2, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CouponTab() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ code: '', discountType: 'percentage', discountValue: '', expiryDate: '' });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/coupons`, { headers: { Authorization: `Bearer ${token}` } });
      setCoupons(res.data.coupons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/coupons`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setFormData({ code: '', discountType: 'percentage', discountValue: '', expiryDate: '' });
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating coupon');
    }
  };

  const handleDelete = async (id) => {
    if(!confirm('Delete this coupon?')) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/coupons/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCoupons();
    } catch (err) {
      alert('Error deleting coupon');
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-[#A2691F]" /></div>;

  return (
    <div className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-6">
      <h2 className="mb-4 font-display text-[18px] font-semibold text-[#3C080D]">Manage Coupons</h2>
      
      <form onSubmit={handleCreate} className="mb-8 grid gap-4 md:grid-cols-5 items-end">
        <div>
          <label className="text-[10px] font-bold uppercase text-[#6B3A2A]/80">Code</label>
          <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full rounded border border-[#5A0E14]/15 px-3 py-2 text-sm" placeholder="e.g. SAVE20" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-[#6B3A2A]/80">Type</label>
          <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full rounded border border-[#5A0E14]/15 px-3 py-2 text-sm">
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-[#6B3A2A]/80">Value</label>
          <input required type="number" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} className="w-full rounded border border-[#5A0E14]/15 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-[#6B3A2A]/80">Expiry Date</label>
          <input required type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full rounded border border-[#5A0E14]/15 px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="rounded bg-[#C1272D] px-4 py-2 text-sm font-bold text-white hover:bg-[#9C1C22]">Add</button>
      </form>

      <table className="w-full text-left text-sm">
        <thead className="bg-[#FDECC8]/30">
          <tr>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Discount</th>
            <th className="px-4 py-2">Expiry</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(c => (
            <tr key={c._id} className="border-b border-[#5A0E14]/10">
              <td className="px-4 py-2 font-bold">{c.code}</td>
              <td className="px-4 py-2">{c.discountValue}{c.discountType === 'percentage' ? '%' : '₹'}</td>
              <td className="px-4 py-2">{new Date(c.expiryDate).toLocaleDateString()}</td>
              <td className="px-4 py-2 text-right">
                <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4 inline" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Trash2, Edit } from "lucide-react";

import { API_URL } from "../../config/api";

export default function PageTab() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ slug: '', title: '', content: '' });

  const fetchPages = async () => {
    try {
      const res = await axios.get(`${API_URL}/pages`);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/pages`, formData, { headers: { Authorization: `Bearer ${token}` } });
      alert('Page saved!');
      setFormData({ slug: '', title: '', content: '' });
      fetchPages();
    } catch (err) {
      alert('Error saving page');
    }
  };

  const handleDelete = async (slug) => {
    if(!confirm('Delete this page?')) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/pages/${slug}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchPages();
    } catch (err) {
      alert('Error deleting page');
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-[#A2691F]" /></div>;

  return (
    <div className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-6">
      <h2 className="mb-4 font-display text-[18px] font-semibold text-[#3C080D]">Static Page Management</h2>
      
      <form onSubmit={handleSave} className="mb-8 grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-[#6B3A2A]/80">Slug (URL Path)</label>
            <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full rounded border border-[#5A0E14]/15 px-3 py-2 text-sm" placeholder="about-us" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-[#6B3A2A]/80">Page Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full rounded border border-[#5A0E14]/15 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-[#6B3A2A]/80">Content (HTML allowed)</label>
          <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full rounded border border-[#5A0E14]/15 px-3 py-2 text-sm" rows={8} />
        </div>
        <button type="submit" className="rounded bg-[#C1272D] px-4 py-2 text-sm font-bold text-white hover:bg-[#9C1C22] w-max">Save Page</button>
      </form>

      <table className="w-full text-left text-sm">
        <thead className="bg-[#FDECC8]/30">
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Slug (/page/...)</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(p => (
            <tr key={p._id} className="border-b border-[#5A0E14]/10">
              <td className="px-4 py-2 font-bold">{p.title}</td>
              <td className="px-4 py-2 text-blue-600 underline">/page/{p.slug}</td>
              <td className="px-4 py-2 text-right flex justify-end gap-2">
                <button onClick={() => setFormData(p)} className="text-gray-600 hover:text-black"><Edit className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(p.slug)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

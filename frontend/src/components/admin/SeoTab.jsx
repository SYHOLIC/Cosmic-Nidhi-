import { useState, useEffect } from "react";
import axios from "axios";
import { Save, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function SeoTab() {
  const [seoList, setSeoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ pageName: '', title: '', description: '', keywords: '' });

  const fetchSeo = async () => {
    try {
      const res = await axios.get(`${API_URL}/seo`);
      setSeoList(res.data.seoList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSeo(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/seo`, formData, { headers: { Authorization: `Bearer ${token}` } });
      alert('SEO saved!');
      setFormData({ pageName: '', title: '', description: '', keywords: '' });
      fetchSeo();
    } catch (err) {
      alert('Error saving SEO');
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-[#A2691F]" /></div>;

  return (
    <div className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-6">
      <h2 className="mb-4 font-display text-[18px] font-semibold text-[#3C080D]">SEO Management</h2>
      
      <form onSubmit={handleSave} className="mb-8 grid gap-4 max-w-lg">
        <div>
          <label className="text-[10px] font-bold uppercase text-[#6B3A2A]/80">Page Name (e.g. home, shop)</label>
          <input required type="text" value={formData.pageName} onChange={e => setFormData({...formData, pageName: e.target.value})} className="w-full rounded border border-[#5A0E14]/15 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-[#6B3A2A]/80">Title Tag</label>
          <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full rounded border border-[#5A0E14]/15 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-[#6B3A2A]/80">Meta Description</label>
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded border border-[#5A0E14]/15 px-3 py-2 text-sm" rows={2} />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-[#6B3A2A]/80">Keywords</label>
          <input type="text" value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} className="w-full rounded border border-[#5A0E14]/15 px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="rounded bg-[#C1272D] px-4 py-2 text-sm font-bold text-white hover:bg-[#9C1C22]">Save SEO Tags</button>
      </form>

      <div className="grid gap-4 mt-6">
        <h3 className="font-semibold text-sm">Existing SEO Configurations:</h3>
        {seoList.map(seo => (
          <div key={seo._id} className="rounded bg-gray-50 p-4 border border-gray-200">
            <p className="font-bold text-indigo-700 capitalize">{seo.pageName}</p>
            <p className="text-sm font-semibold">{seo.title}</p>
            <p className="text-xs text-gray-600 mt-1">{seo.description}</p>
            <button onClick={() => setFormData(seo)} className="mt-2 text-xs text-blue-600 underline">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

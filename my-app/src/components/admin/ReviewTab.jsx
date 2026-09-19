import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Loader2, Star } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ReviewTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/reviews`, { headers: { Authorization: `Bearer ${token}` } });
      setReviews(res.data.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id) => {
    if(!confirm('Delete this review?')) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/reviews/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchReviews();
    } catch (err) {
      alert('Error deleting review');
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-[#A2691F]" /></div>;

  return (
    <div className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-6">
      <h2 className="mb-6 font-display text-[18px] font-semibold text-[#3C080D]">Reviews & Ratings</h2>
      <div className="grid gap-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews found.</p>
        ) : reviews.map(r => (
          <div key={r._id} className="rounded border border-[#5A0E14]/15 p-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-[#3C080D]">{r.user?.name}</span>
                <span className="text-xs text-gray-500">on {r.product?.name}</span>
              </div>
              <div className="flex text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'fill-current' : 'text-gray-300'}`} />)}
              </div>
              <p className="text-sm text-gray-700">{r.comment}</p>
            </div>
            <button onClick={() => handleDelete(r._id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

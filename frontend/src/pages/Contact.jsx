import { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import SEOHead from "../components/SEOHead";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await axios.post(`${API_URL}/contact`, formData);
      if (res.data.success) {
        setSuccess("Thank you! Your message has been received.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFDF9] pt-28 pb-20">
      <SEOHead 
        pageName="contact" 
        fallbackTitle="Contact Us | Cosmic Nidhi" 
        fallbackDescription="Get in touch with Cosmic Nidhi for astrology services, order inquiries, and support."
      />
      
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        <h1 className="font-display text-[32px] md:text-[48px] font-bold text-[#3C080D] text-center mb-4">
          Contact Us
        </h1>
        <p className="text-center text-[#5A0E14]/80 max-w-2xl mx-auto mb-16">
          Have a question about your order, our astrology services, or just want to say hello? 
          Drop us a message and our cosmic guides will get back to you soon.
        </p>

        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* Contact Info */}
          <div className="flex flex-col gap-8 bg-[#180205] text-[#FFF8EC] p-10 rounded-[20px] shadow-lg border border-[#E9A534]/20">
            <h2 className="font-display text-[28px] font-semibold text-[#E9A534]">Get In Touch</h2>
            
            <div className="flex items-start gap-4">
              <div className="bg-[#260005] p-3 rounded-full text-[#E9A534]">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Our Location</h3>
                <p className="text-[#FFF8EC]/70">123 Cosmic Way, Sector 9<br/>New Delhi, India 110001</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#260005] p-3 rounded-full text-[#E9A534]">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email Us</h3>
                <p className="text-[#FFF8EC]/70">support@cosmicnidhi.com</p>
                <p className="text-[#FFF8EC]/70">astro@cosmicnidhi.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#260005] p-3 rounded-full text-[#E9A534]">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Call Us</h3>
                <p className="text-[#FFF8EC]/70">+91 98765 43210</p>
                <p className="text-[#E9A534]/60 text-sm mt-1">Mon - Fri, 10:00 AM - 6:00 PM (IST)</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-10 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#5A0E14]/10">
            <h2 className="font-display text-[28px] font-semibold text-[#3C080D] mb-6">Send a Message</h2>
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                {success}
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-[#3C080D] mb-1.5">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[#5A0E14]/20 px-4 py-2.5 focus:outline-none focus:border-[#E9A534] focus:ring-1 focus:ring-[#E9A534]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#3C080D] mb-1.5">Your Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[#5A0E14]/20 px-4 py-2.5 focus:outline-none focus:border-[#E9A534] focus:ring-1 focus:ring-[#E9A534]"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#3C080D] mb-1.5">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#5A0E14]/20 px-4 py-2.5 focus:outline-none focus:border-[#E9A534] focus:ring-1 focus:ring-[#E9A534]"
                  placeholder="Order Inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#3C080D] mb-1.5">Message</label>
                <textarea 
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#5A0E14]/20 px-4 py-2.5 focus:outline-none focus:border-[#E9A534] focus:ring-1 focus:ring-[#E9A534]"
                  placeholder="How can we help you?"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] border border-[#F2C66D] py-3 text-sm font-bold uppercase tracking-wider text-[#3C080D] transition-transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50"
              >
                <Send size={18} />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}

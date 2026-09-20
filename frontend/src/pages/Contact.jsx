import { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import SEOHead from "../components/SEOHead";

import { API_URL } from "../config/api";

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
          <div className="flex flex-col gap-7 bg-[#180205] text-[#FFF8EC] p-8 sm:p-10 rounded-[20px] shadow-lg border border-[#E9A534]/20">
            <h2 className="font-display text-[28px] font-semibold text-[#E9A534]">Get In Touch</h2>
            
            <div className="flex items-start gap-4">
              <div className="bg-[#260005] p-3 rounded-full text-[#E9A534] shrink-0 mt-0.5">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">Our Location</h3>
                <p className="text-[#FFF8EC]/75 leading-relaxed text-sm">
                  A-56/1, 4th Floor, A Block,<br/>
                  Sector 50, Noida, Uttar Pradesh 201301
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#260005] p-3 rounded-full text-[#E9A534] shrink-0 mt-0.5">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">Email Us</h3>
                <a href="mailto:cosmicnidhi.astro@gmail.com" className="text-[#FFF8EC]/75 hover:text-[#E9A534] transition-colors text-sm">
                  cosmicnidhi.astro@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#260005] p-3 rounded-full text-[#E9A534] shrink-0 mt-0.5">
                <Phone size={22} />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">Primary Contacts</h3>
                <p className="text-[#FFF8EC]/75 text-sm">
                  <a href="tel:9560437360" className="hover:text-[#E9A534] transition-colors">+91 95604 37360</a>
                  {" / "}
                  <a href="tel:8826044955" className="hover:text-[#E9A534] transition-colors">+91 88260 44955</a>
                </p>
                <p className="text-[#E9A534]/70 text-xs mt-1">Available for Call & WhatsApp Consultations</p>
              </div>
            </div>

            {/* Social Connect Profiles */}
            <div className="border-t border-[#E9A534]/15 pt-5 mt-1">
              <h3 className="font-bold text-sm text-[#E9C76D] mb-3 uppercase tracking-wider">Connect With Nidhi Asthana</h3>
              <div className="flex flex-wrap gap-3">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/cosmicnidhi.astrology/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-[#E9A534]/25 bg-white/5 px-3.5 py-1.5 text-xs text-[#FFF8EC] transition-all hover:border-[#E9A534] hover:bg-[#E9A534]/10 hover:text-[#E9A534]"
                >
                  <svg className="h-3.5 w-3.5 fill-current text-[#FD1D1D]" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-3.584-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.28-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.333.014 8.741 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  Instagram
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@nidhiasthana3699"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-[#E9A534]/25 bg-white/5 px-3.5 py-1.5 text-xs text-[#FFF8EC] transition-all hover:border-[#E9A534] hover:bg-[#E9A534]/10 hover:text-[#E9A534]"
                >
                  <svg className="h-3.5 w-3.5 fill-current text-[#FF0000]" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.997 2.997 0 00-2.11-2.12C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.388.566a2.997 2.997 0 00-2.11 2.12C0 8.07 0 12 0 12s0 3.93.502 5.814a2.997 2.997 0 002.11 2.12c1.883.566 9.388.566 9.388.566s7.505 0 9.388-.566a2.997 2.997 0 002.11-2.12C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/nidhi-asthana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-[#E9A534]/25 bg-white/5 px-3.5 py-1.5 text-xs text-[#FFF8EC] transition-all hover:border-[#E9A534] hover:bg-[#E9A534]/10 hover:text-[#E9A534]"
                >
                  <svg className="h-3.5 w-3.5 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  LinkedIn
                </a>

                {/* Website */}
                <a
                  href="https://www.cosmicnidhi.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-[#E9A534]/25 bg-white/5 px-3.5 py-1.5 text-xs text-[#FFF8EC] transition-all hover:border-[#E9A534] hover:bg-[#E9A534]/10 hover:text-[#E9A534]"
                >
                  <span className="text-[#E9A534]">🌐</span>
                  cosmicnidhi.in
                </a>
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

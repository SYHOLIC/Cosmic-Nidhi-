import { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";
import SEOHead from "../components/SEOHead";
import { useToast } from "../context/ToastContext";

import { API_URL } from "../config/api";

export default function Contact() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    let val = e.target.value;
    if (e.target.name === "name") {
      val = val.replace(/[^a-zA-Z\s]/g, "");
    }
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = String(formData.name || "").trim();
    if (!cleanName || !/^[a-zA-Z\s]{2,50}$/.test(cleanName)) {
      const msg = "Please enter a valid Name (letters and spaces only, at least 2 characters).";
      setError(msg);
      toast.error(msg);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/contact`, { ...formData, name: cleanName });
      if (res.data.success) {
        setSubmitted(true);
        toast.success("Thank you! Your message has been sent successfully.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send message. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFDF9] pt-28 pb-20">
      <SEOHead 
        pageName="contact" 
        fallbackTitle="Contact Us | Consult Astrologer | Cosmic Nidhi" 
        fallbackDescription="Get in touch with Cosmic Nidhi for personalized Vedic astrology consultations, gemstones guidance, order queries, and support."
        fallbackKeywords="contact cosmic nidhi, astrology support, consult astrologer, kundali inquiry, spiritual advice"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Contact Us", url: "/contact" },
        ]}
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
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = ["mail", "to:", "cosmicnidhi.astro", "@", "gmail.com"].join("");
                  }}
                  className="text-[#FFF8EC]/75 hover:text-[#E9A534] transition-colors text-sm"
                >
                  <span>cosmicnidhi.astro&#64;gmail.com</span>
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
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/1GeMYtoBf1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-[#E9A534]/25 bg-white/5 px-3.5 py-1.5 text-xs text-[#FFF8EC] transition-all hover:border-[#E9A534] hover:bg-[#E9A534]/10 hover:text-[#E9A534]"
                >
                  <svg className="h-3.5 w-3.5 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>

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
                  href="https://youtube.com/@cosmicnidhi?si=eAu8TIl29r1V2tTO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-[#E9A534]/25 bg-white/5 px-3.5 py-1.5 text-xs text-[#FFF8EC] transition-all hover:border-[#E9A534] hover:bg-[#E9A534]/10 hover:text-[#E9A534]"
                >
                  <svg className="h-3.5 w-3.5 fill-current text-[#FF0000]" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.997 2.997 0 00-2.11-2.12C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.388.566a2.997 2.997 0 00-2.11 2.12C0 8.07 0 12 0 12s0 3.93.502 5.814a2.997 2.997 0 002.11 2.12c1.883.566 9.388.566 9.388.566s7.505 0 9.388-.566a2.997 2.997 0 002.11-2.12C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919999710777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/30 px-3.5 py-1.5 text-xs text-[#FFF8EC] transition-all hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                >
                  <svg className="h-3.5 w-3.5 fill-current text-[#25D366]" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  WhatsApp
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
          <div className="bg-white p-8 sm:p-10 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#5A0E14]/10">
            <h2 className="font-display text-[28px] font-semibold text-[#3C080D] mb-6">Send a Message</h2>
            
            {submitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#3C080D] mb-2">Message Sent!</h3>
                <p className="font-sans text-sm text-[#6B3A2A]/80 max-w-sm mb-6 leading-relaxed">
                  Thank you for reaching out to Cosmic Nidhi. Astrologer Nidhi Asthana and our guides will review your message and reply promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="rounded-full border border-[#5A0E14]/20 px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-[#5A0E14] hover:bg-[#5A0E14]/5 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-bold text-[#3C080D] mb-1.5">Your Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#5A0E14]/20 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E9A534] focus:ring-1 focus:ring-[#E9A534]"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#3C080D] mb-1.5">Your Email *</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#5A0E14]/20 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E9A534] focus:ring-1 focus:ring-[#E9A534]"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#3C080D] mb-1.5">Subject *</label>
                    <input 
                      type="text" 
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[#5A0E14]/20 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E9A534] focus:ring-1 focus:ring-[#E9A534]"
                      placeholder="Consultation or Order Inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#3C080D] mb-1.5">Message *</label>
                    <textarea 
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[#5A0E14]/20 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E9A534] focus:ring-1 focus:ring-[#E9A534] resize-none"
                      placeholder="How can we assist you on your spiritual path?"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] border border-[#F2C66D] py-3 text-sm font-bold uppercase tracking-wider text-[#3C080D] transition-transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

import React, { useState } from 'react';
import { PageContent } from '../types/index.js';
import { api } from '../utils/api.ts';
import { 
  Mail, Send, CheckCircle2, AlertCircle, ExternalLink, 
  MapPin, Phone, MessageSquare, Sparkles 
} from 'lucide-react';

interface ContactPageProps {
  pageContent: PageContent | null;
}

export const ContactPage: React.FC<ContactPageProps> = ({ pageContent }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const contactEmail = pageContent?.contactEmail || 'contact@shikurandigital.com';
  const phonePlaceholder = pageContent?.contactPhonePlaceholder || '+1 (555) 019-2834';
  const addressPlaceholder = pageContent?.contactAddressPlaceholder || 'Shikuran Digital Learning Center, Global Online Campus';
  const tiktokHandle = pageContent?.tiktokHandle || '@shikuranskills';
  const formspreeId = pageContent?.formspreeId || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Spam honeypot
    if (honeypot) return;

    // Validation
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage('Please enter a message of at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitContact({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        honeypot
      }, formspreeId);

      setSuccessMessage('Thank you! Your message has been sent successfully. We will reply to your email soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Page Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          We Are Here To Help
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Get In Touch
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Have a question about a tutorial, a suggested digital topic, or feedback for Shikuran Skills? Reach out and we will be delighted to connect.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Form (With Formspree & Database Integration) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Fill out the form below and we will get back to you promptly.
              </p>
            </div>
            {formspreeId && (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Formspree Connected
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot field for anti-spam */}
            <div className="hidden" aria-hidden="true">
              <label>Leave this empty</label>
              <input
                type="text"
                tabIndex={-1}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                autoComplete="off"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Michael Smith"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="michael@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Message *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist your digital skills journey? Share your question or feedback..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y"
              />
            </div>

            {/* Success feedback */}
            {successMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>{successMessage}</p>
              </div>
            )}

            {/* Error feedback */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        {/* Right Info Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold">
              Contact Information
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We respond to all genuine inquiries, tutorial suggestions, and partnership requests within 24 to 48 hours.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Email Address</div>
                  <div className="text-sm font-semibold text-white">{contactEmail}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Support Line (Placeholder)</div>
                  <div className="text-sm font-semibold text-white">{phonePlaceholder}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Headquarters</div>
                  <div className="text-sm font-semibold text-white">{addressPlaceholder}</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Official TikTok Channel
              </div>
              <a
                href="https://www.tiktok.com/@shikuranskills"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-colors border border-slate-700 group"
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 fill-current text-white group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.41a6.33 6.33 0 0 0-.85-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 0 0 0 9.17 5.61 6.3 6.3 0 0 0 3.52-5.61V8.41a8.18 8.18 0 0 0 4.76 1.72V6.69z"/>
                  </svg>
                  <span>{tiktokHandle}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick FAQ card */}
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 space-y-2">
            <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Looking for a custom guide?</span>
            </h4>
            <p className="text-xs text-blue-800 leading-relaxed">
              If your school, workplace, or community group needs a guide on a specific computer skill or software, let us know! We often write new tutorials based directly on reader requests.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

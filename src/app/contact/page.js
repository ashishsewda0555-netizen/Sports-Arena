'use client';

import { useState, useEffect } from 'react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, Mail, Clock, CheckCircle2, Send } from 'lucide-react';
import { getTelLink } from '@/lib/utils';

import { SchemaMarkup, generateLocalBusinessSchema } from '@/components/seo/SchemaMarkup';
import { fetchApi } from '@/lib/apiClient';
import { useToast } from '@/components/ui/ToastProvider';

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const toast = useToast();
  const [operatingHours, setOperatingHours] = useState(null);
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    async function loadHours() {
      try {
        const data = await fetchApi('/public/operating-hours');
        if (data && data.schedule) {
          setOperatingHours(data.schedule);
          
          // Calculate if open now
          const now = new Date();
          // JS getDay(): 0 = Sunday, 1 = Monday, etc.
          // Map JS day to our schema day names
          const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const todayName = daysMap[now.getDay()];
          const todaySchedule = data.schedule.find(s => s.day === todayName);
          
          if (todaySchedule && todaySchedule.isOpen) {
            const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
            const [openH, openM] = todaySchedule.openTime.split(':').map(Number);
            const [closeH, closeM] = todaySchedule.closeTime.split(':').map(Number);
            
            const openTotalMinutes = openH * 60 + openM;
            const closeTotalMinutes = closeH * 60 + closeM;
            
            if (currentTotalMinutes >= openTotalMinutes && currentTotalMinutes <= closeTotalMinutes) {
              setIsOpenNow(true);
            } else {
              setIsOpenNow(false);
            }
          } else {
            setIsOpenNow(false);
          }
        }
      } catch (err) {
        setFetchError(true);
      }
    }
    loadHours();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setStatus('success');
        toast.success('Your message has been sent successfully! We will get back to you soon.');
        setFormData({ name: '', phone: '', message: '' });
      } else {
        setStatus('error');
        toast.error('Failed to send your message. Please try again later.');
      }
    } catch (error) {
      setStatus('error');
      toast.error('An error occurred. Please try again.');
    }
  };

  const schema = generateLocalBusinessSchema({
    name: "Bharti Sports Arena",
    description: "Premium multi-sport facility offering professional coaching and casual play in Sikar.",
    url: "https://bhartisportsarena.com/contact",
    image: "https://bhartisportsarena.com/images/hero.jpg",
    address: { street: "Kanwarpura Chouraha, Near Prince Education Hub, Bikaner Agra Bypass Road", city: "Sikar", state: "Rajasthan", zip: "332001" },
    phone: "+919352812625"
  });

  return (
    <>
      <SchemaMarkup schema={schema} />
      <div className="page-banner">
        <div className="container mx-auto px-4 relative z-10">
          <h1>Get in Touch</h1>
          <div className="breadcrumb">
            Home <span className="mx-2">/</span> Contact
          </div>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Form */}
          <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
            <h2 className="font-heading font-bold text-2xl mb-2">Send us a Message</h2>
            <p className="text-text-secondary text-sm mb-8">We'll get back to you within 24 hours.</p>
            
            {status === 'success' ? (
              <div className="bg-success/10 text-success p-8 rounded-xl border border-success/20 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">Thank You!</h3>
                <p className="text-sm mb-6">We have received your message and will get back to you shortly.</p>
                <Button variant="secondary" onClick={() => setStatus('idle')}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full h-12 px-4 rounded-xl border border-border bg-bg text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    className="w-full h-12 px-4 rounded-xl border border-border bg-bg text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full p-4 rounded-xl border border-border bg-bg text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-y min-h-[120px]"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you're interested in..."
                  />
                </div>
                
                {status === 'error' && (
                  <p className="text-error text-sm bg-error/10 p-3 rounded-lg border border-error/20">An error occurred. Please try again.</p>
                )}
                
                <Button type="submit" className="w-full" disabled={status === 'loading'}>
                  <Send className="w-4 h-4 mr-2" />
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info Card */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-heading font-bold text-2xl mb-8">Contact Information</h2>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-text-secondary text-sm">Kanwarpura Chouraha, Near Prince Education Hub, Bikaner Agra Bypass Road, Sikar, Rajasthan 332001</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <a href={getTelLink('+919352812625')} className="text-text-secondary text-sm hover:text-primary transition-colors">+91 9352812625</a>
                    <br />
                    <a href={getTelLink('+919571794918')} className="text-text-secondary text-sm hover:text-primary transition-colors">+91 9571794918</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <a href="mailto:bhartisportsarena@gmail.com" className="text-text-secondary text-sm hover:text-primary transition-colors">bhartisportsarena@gmail.com</a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-semibold text-lg">Operating Hours</h4>
                {operatingHours && (
                  <span className={`ml-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${isOpenNow ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOpenNow ? 'bg-success animate-pulse' : 'bg-error'}`} />
                    {isOpenNow ? 'Open Now' : 'Closed Now'}
                  </span>
                )}
              </div>
              <ul className="space-y-3 text-sm">
                {operatingHours ? (
                  operatingHours.map((schedule, idx) => (
                    <li key={idx} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-text-secondary capitalize">{schedule.day}</span>
                      {schedule.isOpen ? (
                        <span className="font-medium">{formatTime(schedule.openTime)} - {formatTime(schedule.closeTime)}</span>
                      ) : (
                        <span className="font-medium text-error">Closed</span>
                      )}
                    </li>
                  ))
                ) : fetchError ? (
                  <li className="text-center py-4 text-error font-medium">Schedule unavailable right now.</li>
                ) : (
                  <li className="text-center py-4 text-text-secondary animate-pulse">Loading schedule...</li>
                )}
              </ul>
            </div>
          </div>

        </div>
      </Section>
      
      {/* Google Map */}
      <div className="w-full h-[400px] bg-surface-alt relative overflow-hidden">
        <iframe
          src={process.env.NEXT_PUBLIC_MAP_EMBED_URL || "https://maps.google.com/maps?q=27.6025,75.1104468+(Bharti%20Sports%20Arena)&z=16&output=embed"}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
          className="absolute inset-0 grayscale contrast-125 opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
        />
      </div>
    </>
  );
}

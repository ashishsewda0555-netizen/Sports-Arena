'use client';

import { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';
import { getTelLink } from '@/lib/utils';

import { SchemaMarkup, generateLocalBusinessSchema } from '@/components/seo/SchemaMarkup';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');

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
        setFormData({ name: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const schema = generateLocalBusinessSchema({
    name: "Champions Sports Arena",
    description: "Premium multi-sport facility offering professional coaching and casual play in Jaipur.",
    url: "https://championssportsarena.com/contact",
    image: "https://championssportsarena.com/images/hero.jpg",
    address: { street: "123 Arena Street", city: "Jaipur", state: "Rajasthan", zip: "302001" },
    phone: "+919876543210"
  });

  return (
    <>
      <SchemaMarkup schema={schema} />
      <div className="bg-surface-alt py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">Get in Touch</h1>
          <div className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold">
            Home <span className="mx-2">/</span> Contact
          </div>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Form */}
          <div className="bg-surface p-8 rounded-lg border border-border shadow-sm">
            <h2 className="font-heading font-bold text-2xl mb-6">Send us a Message</h2>
            
            {status === 'success' ? (
              <div className="bg-success/10 text-success p-6 rounded-md border border-success/20 flex flex-col items-center text-center">
                <CheckCircle2 className="w-12 h-12 mb-4" />
                <h3 className="font-bold text-lg mb-2">Thank You!</h3>
                <p className="text-sm">We have received your message and will get back to you shortly.</p>
                <Button variant="secondary" className="mt-6" onClick={() => setStatus('idle')}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-body-sm text-text-secondary mb-2">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full h-[48px] px-4 rounded-sm border border-border bg-bg focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-body-sm text-text-secondary mb-2">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    className="w-full h-[48px] px-4 rounded-sm border border-border bg-bg focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-body-sm text-text-secondary mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full p-4 rounded-sm border border-border bg-bg focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary resize-y min-h-[120px]"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                
                {status === 'error' && (
                  <p className="text-error text-sm">An error occurred. Please try again.</p>
                )}
                
                <Button type="submit" className="w-full" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending...' : 'Submit'}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info Card */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-heading font-bold text-2xl mb-6">Contact Information</h2>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-text-secondary text-sm">123 Arena Street, Sports City, ST 12345</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <a href={getTelLink('+919876543210')} className="text-text-secondary text-sm hover:text-primary transition-colors">+91 98765 43210</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <a href="mailto:hello@sportsarena.com" className="text-text-secondary text-sm hover:text-primary transition-colors">hello@sportsarena.com</a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-surface-alt p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Operating Hours</h4>
                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5"></span> Open Now
                </span>
              </div>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex justify-between"><span>Monday - Friday</span> <span>6:00 AM - 10:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span> <span>6:00 AM - 11:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday</span> <span>6:00 AM - 9:00 PM</span></li>
              </ul>
            </div>
          </div>

        </div>
      </Section>
      
      {/* Google Map */}
      <div className="w-full h-[400px] bg-surface-alt relative overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.23306019385!2d75.71391510427672!3d26.885141695420108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1709825421251!5m2!1sen!2sin"
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

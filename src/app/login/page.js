'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/apiClient';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Constants for perfectly aligning input icons without CSS conflicts
  const ICON_LEFT = 16;
  const ICON_SIZE = 20;
  const INPUT_PADDING_LEFT = ICON_LEFT + ICON_SIZE + 12;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--gradient-page-banner)' }}>
      {/* Decorative blurs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md bg-white dark:bg-surface border border-border rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-8 md:p-10 relative z-10 flex flex-col">
        {/* Integrated Header */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl overflow-hidden relative mb-6 shadow-lg shadow-primary/20 shrink-0">
            <Image src="/images/logo.jpg" alt="Bharti Sports Arena Logo" fill className="object-cover" sizes="64px" />
          </div>
          <h1 className="font-heading font-bold text-3xl text-text-primary mb-2">Welcome Back</h1>
          <p className="text-text-secondary text-base">Sign in to manage Sports Arena</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold text-text-primary mb-2.5">Email Address</label>
            <div className="relative">
              <div 
                className="absolute inset-y-0 flex items-center pointer-events-none"
                style={{ left: ICON_LEFT }}
              >
                <Mail className="text-text-disabled" style={{ width: ICON_SIZE, height: ICON_SIZE }} />
              </div>
              <input
                type="email"
                required
                className="block w-full h-14 pr-4 rounded-xl border border-border bg-surface-alt text-text-primary text-base placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                style={{ paddingLeft: INPUT_PADDING_LEFT }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
          </div>
          
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold text-text-primary mb-2.5">Password</label>
            <div className="relative">
              <div 
                className="absolute inset-y-0 flex items-center pointer-events-none"
                style={{ left: ICON_LEFT }}
              >
                <Lock className="text-text-disabled" style={{ width: ICON_SIZE, height: ICON_SIZE }} />
              </div>
              <input
                type="password"
                required
                className="block w-full h-14 pr-4 rounded-xl border border-border bg-surface-alt text-text-primary text-base placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                style={{ paddingLeft: INPUT_PADDING_LEFT }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 flex items-center justify-center w-full h-14 rounded-xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 hover:bg-primary-dark hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary/30 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all duration-200"
          >
            <LogIn className="w-5 h-5 mr-2" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

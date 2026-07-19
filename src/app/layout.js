import { Poppins, Inter } from 'next/font/google';
import "./globals.css";
import { Providers } from "./providers";
import { PublicShell } from "@/components/layout/PublicShell";

const poppins = Poppins({
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});
export const metadata = {
  metadataBase: new URL('https://bhartisportsarena.com'),
  title: {
    template: '%s | Bharti Sports Arena',
    default: 'Bharti Sports Arena | Multi-Sport Academy & Badminton in Jaipur',
  },
  description: 'Train under professional coaches at Bharti Sports Arena, Jaipur\'s growing multi-sport academy offering badminton, table tennis, snooker, fitness & more.',
  openGraph: {
    title: 'Bharti Sports Arena | Multi-Sport Academy & Badminton in Jaipur',
    description: 'Train under professional coaches at Bharti Sports Arena, Jaipur\'s growing multi-sport academy offering badminton, table tennis, snooker, fitness & more.',
    url: 'https://bhartisportsarena.com',
    siteName: 'Bharti Sports Arena',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bharti Sports Arena | Multi-Sport Academy & Badminton in Jaipur',
    description: 'Train under professional coaches at Bharti Sports Arena, Jaipur\'s growing multi-sport academy offering badminton, table tennis, snooker, fitness & more.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased min-h-screen flex flex-col ${poppins.variable} ${inter.variable}`}>
        <Providers>
          <PublicShell>
            {children}
          </PublicShell>
        </Providers>
      </body>
    </html>
  );
}


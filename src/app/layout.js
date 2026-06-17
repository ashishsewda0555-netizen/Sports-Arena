import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyContactBar } from "@/components/layout/StickyContactBar";

export const metadata = {
  metadataBase: new URL('https://championssportsarena.com'),
  title: {
    template: '%s | Champions Sports Arena',
    default: 'Champions Sports Arena | Multi-Sport Arena & Badminton Academy in Jaipur',
  },
  description: 'Train under national-level coaches at Champions Sports Arena, Jaipur\'s premier multi-sport arena offering badminton, table tennis, snooker, fitness & more.',
  openGraph: {
    title: 'Champions Sports Arena | Multi-Sport Arena & Badminton Academy in Jaipur',
    description: 'Train under national-level coaches at Champions Sports Arena, Jaipur\'s premier multi-sport arena offering badminton, table tennis, snooker, fitness & more.',
    url: 'https://championssportsarena.com',
    siteName: 'Champions Sports Arena',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Champions Sports Arena | Multi-Sport Arena & Badminton Academy in Jaipur',
    description: 'Train under national-level coaches at Champions Sports Arena, Jaipur\'s premier multi-sport arena offering badminton, table tennis, snooker, fitness & more.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-grow pt-[64px] lg:pt-[80px]">
            {children}
          </main>
          <Footer />
          <StickyContactBar />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import CartSidebar from '@/components/cart/CartSidebar';
import NudgePopup from '@/components/cart/NudgePopup';
import ToastProvider from '@/components/ui/ToastProvider';
import { ThemeProvider } from 'next-themes';
import AiAssistant from '@/components/chat/AiAssistant';
import AuthBootstrap from '@/components/auth/AuthBootstrap';

export const metadata: Metadata = {
  title: 'ShopSense AI — Smart Shopping, Styled for You',
  description: 'AI-powered multi-category ecommerce with vibe-based curation, visual search, and intelligent recommendations.',
  keywords: 'AI shopping, fashion, ecommerce, personalized, visual search',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthBootstrap />
          <Navbar />
          <main>{children}</main>
          <CartSidebar />
          <NudgePopup />
          <ToastProvider />
          <AiAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dark Blade — Premium Marketplace',
  description: 'Enterprise-grade multi-vendor marketplace with Bitcoin payments',
  keywords: 'marketplace, bitcoin, payments, e-commerce',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

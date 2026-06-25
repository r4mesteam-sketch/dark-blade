import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dark Blade',
  description: 'Premium Bitcoin marketplace for modern sellers and buyers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background text-white">
      {/* مە لێرە فۆنتێن ستاندارد سەپاندن دا چ نیشانێن سەیر دەرنەکەڤن */}
      <body className="min-h-screen bg-background text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
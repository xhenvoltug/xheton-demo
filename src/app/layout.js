import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "XHETON - The Future of Business Management",
  description: "Advanced Sales & Inventory System powered by Next.js 16, AI forecasting, and intelligent automation. Built by Xhenvolt.",
  keywords: "inventory management, sales system, POS, business automation, ERP, accounting",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

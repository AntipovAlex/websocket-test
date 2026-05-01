import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Event Feed Dashboard',
  description: 'Real-time event feed using Next.js + NestJS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

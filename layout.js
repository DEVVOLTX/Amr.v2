import { Michroma, Cairo } from 'next/font/google';
import './globals.css';

const michroma = Michroma({ subsets: ['latin'], weight: '400', variable: '--f-m', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: ['400', '600'], variable: '--f-c', display: 'swap' });

export const metadata = {
  title: 'Amr Essam — Full-Stack Developer & Creative Designer',
  description: 'Software Engineering student from Kafr El Dawar, Egypt. Full-Stack Developer, Game Developer, Cybersecurity Enthusiast & Graphic Designer.',
  openGraph: { title: 'Amr Essam — Portfolio', type: 'website' },
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#090909' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${michroma.variable} ${cairo.variable}`}>
      <body>{children}</body>
    </html>
  );
}

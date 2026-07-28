import './globals.css';

export const metadata = {
  title: 'rTriibe Tracker UAE',
  description: 'Live recruitment desk tracker for rTriibe DMCC — UAE desk',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

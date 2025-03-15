import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moni FIRE",
  description: "Achieve Financial Independence and Retire Early",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    images: [
      {
        url: "/moni-icon.svg",
        width: 300,
        height: 300,
        alt: "Moni FIRE Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    images: ["/moni-icon.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

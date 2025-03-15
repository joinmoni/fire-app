import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moni FIRE",
  description:
    "Calculate your path to Financial Independence and Retire Early (FIRE). Discover when you can achieve FIRE, track your progress, and create a personalized roadmap to financial freedom. Our tools help you determine your FIRE age, optimize your savings rate, and plan your investment strategy for a secure early retirement.",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  metadataBase: new URL("https://moni.africa"),
  openGraph: {
    title: "FIRE with Moni",
    description:
      "Calculate your path to Financial Independence and Retire Early (FIRE). Discover when you can achieve FIRE, track your progress, and create a personalized roadmap to financial freedom.",
    images: [
      {
        url: "/moni-icon.svg",
        width: 300,
        height: 300,
        alt: "Moni FIRE Logo",
      },
    ],
    type: "website",
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

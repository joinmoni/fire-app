import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIRE with Moni",
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
        url: "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/event-covers/op/4078051a-945c-49dc-ac4d-7707657057f4.png",
        width: 400,
        height: 400,
        alt: "Women that FIRE Webinar",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    images: [
      "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/event-covers/op/4078051a-945c-49dc-ac4d-7707657057f4.png",
    ],
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

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moni FIRE ",
  description: "Achieve Financial Independence and Retire Early",
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

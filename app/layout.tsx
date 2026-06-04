import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BigBox AI & Big Data",
  description: "Solusi AI dan Big Data untuk keputusan bisnis yang akurat.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

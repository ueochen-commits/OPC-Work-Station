import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OPC Work Station",
  description: "A task workstation for one-person companies."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

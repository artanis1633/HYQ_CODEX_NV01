import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NVIDIA 智算设备配置系统",
  description: "NVIDIA Intelligent Computing Configurator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

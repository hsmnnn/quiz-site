import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech Quiz | カンファレンスブース",
  description: "4択クイズに挑戦して景品をゲットしよう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen" style={{ backgroundColor: "#000d19" }}>
        {children}
      </body>
    </html>
  );
}

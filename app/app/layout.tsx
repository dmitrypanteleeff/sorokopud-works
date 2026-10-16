import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TERRA CORIUM — изделия из натуральной кожи ручной работы",
  description:
    "Кошельки, ремни и обложки для паспорта. Ручная прошивка, натуральное дубление, честные материалы.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="bg-linen min-h-full font-sans">{children}</body>
    </html>
  );
}

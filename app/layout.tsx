import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TERRA CORIUM — изделия из натуральной кожи ручной работы",
  description:
    "Кошельки, ремни и обложки для паспорта. Ручная прошивка, натуральное дубление, честные материалы.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`h-full antialiased ${playfair.variable} ${manrope.variable}`}
    >
      <body className="texture min-h-full font-sans">{children}</body>
    </html>
  );
}

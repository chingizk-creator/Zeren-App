import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zeren — Свежие продукты с базара с доставкой | Алматы",
  description:
    "Доставка свежих продуктов с Алтын Орды по базарным ценам. На 25–40% дешевле супермаркетов. Подписка от ₸2 990/мес.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Zeren — Базар к вашей двери",
    description:
      "Свежие продукты с базара на 25–40% дешевле Magnum. Доставка в тот же день.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeren — Базар к вашей двери",
    description: "Свежие продукты с базара на 25–40% дешевле Magnum.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3D2E1F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${playfair.variable} ${jakarta.variable}`}>
      <body style={{ fontFamily: "var(--font-jakarta, inherit)" }}>{children}</body>
    </html>
  );
}

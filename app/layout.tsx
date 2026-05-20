import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


export const metadata = {
  title: "Stutzmanâ€™s Construction",
  description:
    "Premium Montana custom homes, remodels, garages, shops, additions, roofing, siding, and exterior finish work.",
  applicationName: "Stutzmanâ€™s Construction",
  metadataBase: new URL("https://stutzmansconstruction.builders"),
  openGraph: {
    title: "Stutzmanâ€™s Construction",
    description:
      "Premium Montana custom homes, remodels, garages, shops, additions, roofing, siding, and exterior finish work.",
    url: "https://stutzmansconstruction.builders",
    siteName: "Stutzmanâ€™s Construction",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stutzmanâ€™s Construction",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stutzmanâ€™s Construction",
    description:
      "Premium Montana custom homes, remodels, garages, shops, additions, roofing, siding, and exterior finish work.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}



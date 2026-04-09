import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Products Catalog | Premium",
  description: "A premium modern products catalog.",
};

import QueryProvider from "@/providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        <QueryProvider>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex justify-between items-center py-6 border-b border-gray-200 mb-10">
              <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                Products Catalog
              </Link>
              <div className="flex gap-6">
                <Link href="/" className="font-medium hover:text-indigo-600 transition-colors">Home</Link>
                <Link href="/admin/categories" className="font-medium hover:text-indigo-600 transition-colors">Categories</Link>
                <Link href="/admin/products" className="font-medium hover:text-indigo-600 transition-colors">Products</Link>
              </div>
            </nav>
            <main>
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}

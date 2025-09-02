"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
    { href: "/about", label: "About" },
  ];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F0F4F8] text-gray-900 flex flex-col min-h-screen`}
      >
        {/* Navbar */}
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-8 md:px-12 py-6 flex justify-between items-center">
            {/* Logo */}
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center">
              <span className="text-indigo-600 font-poppins">mon</span>
              <span className="text-gray-900 font-roboto">exa</span>
            </h1>

            {/* Links */}
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative font-medium transition-all duration-300 
                    hover:text-indigo-600
                    px-3 py-2 rounded-lg
                    ${
                      pathname === link.href
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700"
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}

              {/* Login Button */}
              <Link
                href="/login"
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl shadow-md 
                           hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                Login
              </Link>
            </div>
          </nav>
        </header>

        {/* Page Content */}
        <main className="flex-1 max-w-7xl mx-auto px-8 md:px-12 py-12 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full bg-gray-900 mt-auto">
  <div className="max-w-7xl mx-auto px-8 md:px-12 py-6 text-center text-gray-400 text-sm">
    © {new Date().getFullYear()} Monexa. All rights reserved.
  </div>
</footer>

      </body>
    </html>
  );
}


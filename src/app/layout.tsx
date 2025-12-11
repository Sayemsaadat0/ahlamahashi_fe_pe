import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/provider/TanstackProvider";
import { Toaster } from "@/components/ui/sonner";
import GuestIdInitializer from "@/components/core/GuestIdInitializer";
import VisitorTracker from "@/components/core/VisitorTracker";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "",
  description: "Discover and order delicious food nearby",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <TanstackProvider>
          <GuestIdInitializer />
          <VisitorTracker />
          <main>{children}
            <Toaster />
          </main>
        </TanstackProvider>
      </body>
    </html>
  );
}

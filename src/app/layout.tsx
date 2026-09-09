import type { Metadata } from "next";
import { Manrope, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import TouchFeedback from "@/components/TouchFeedback";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Framing Contractor Surrey BC | Mannat Framing Ltd.",
  description:
    "Mannat Framing Ltd. is a licensed framing contractor in Surrey, BC with 10+ years of experience. Residential, multi-family, townhouse & commercial framing across the Lower Mainland. Get a free quote today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${plexMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Sets the theme class before first paint so there is no light/dark flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=localStorage.getItem('mf-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark');}document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();",
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <MotionProvider>
          <SmoothScroll />
          <ScrollProgress />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
          <TouchFeedback />
        </MotionProvider>
      </body>
    </html>
  );
}

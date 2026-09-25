import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { AuthProvider } from "@/lib/AuthContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import { WalletProvider } from "@/lib/WalletContext";
import { VIPProvider } from "@/lib/VIPContext";
import { CartProvider } from "@/lib/CartContext";
import CartDrawer from "@/components/CartDrawer";
import AIChatbot from "@/components/AIChatbot";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://glownxt.com";

export const viewport: Viewport = {
  themeColor: "#e11d48",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GlowNXT — India's Premium At-Home Beauty & Wellness Marketplace",
    template: "%s | GlowNXT",
  },
  description:
    "Book 200+ verified at-home beauty & salon services on GlowNXT — luxury facials, waxing, massage, bridal makeup, nail art, and grooming delivered directly to your doorstep.",
  keywords: [
    "GlowNXT",
    "Glow NXT",
    "GlowNXT app",
    "GlowNXT beauty",
    "GlowNXT salon at home",
    "beauty services at home",
    "salon at home",
    "bridal makeup",
    "facial at home",
    "doorstep salon India",
    "India beauty marketplace",
  ],
  authors: [{ name: "GlowNXT" }],
  creator: "GlowNXT",
  publisher: "GlowNXT",
  applicationName: "GlowNXT",
  appleWebApp: {
    capable: true,
    title: "GlowNXT",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "GlowNXT — India's Premium Beauty Marketplace",
    description: "Book verified beauty professionals for at-home services across India. Search GlowNXT to book instantly.",
    type: "website",
    locale: "en_IN",
    siteName: "GlowNXT",
    url: siteUrl,
    images: [
      {
        url: "/icon-512.svg",
        width: 512,
        height: 512,
        alt: "GlowNXT Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GlowNXT — India's Premium Beauty Marketplace",
    description: "Book 200+ at-home beauty services with verified professionals on GlowNXT.",
    images: ["/icon-512.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
    apple: "/icon-192.svg",
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "GlowNXT",
      alternateName: ["Glow NXT", "GlowNXT App", "GlowNXT Beauty", "GlowNXT Salon"],
      description: "India's premium on-demand at-home beauty and salon marketplace.",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/services?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "GlowNXT",
      url: siteUrl,
      logo: `${siteUrl}/icon-512.svg`,
      sameAs: [
        "https://www.instagram.com/glownxt",
        "https://twitter.com/glownxt",
        "https://www.facebook.com/glownxt",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-800-GLOWNXT",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi", "Marathi"],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            <WalletProvider>
              <VIPProvider>
                <CartProvider>
                  <LoadingScreen />
                  {children}
                  <CartDrawer />
                  <AIChatbot />
                  <PWAInstallPrompt />
                </CartProvider>
              </VIPProvider>
            </WalletProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

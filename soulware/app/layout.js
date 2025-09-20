import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import Header from "@/components/header";
import PageTransition from "@/components/page-transition";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Digital Mental Health and Psychological Support Platform",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <ThemeProvider>
        <html lang="en">
          <body
            className={`${inter.variable} antialiased`}
          >
            <Header />
            <div className="p-4 flex justify-end">
              <LanguageSwitcher />
            </div>
            <PageTransition>
              {children}
            </PageTransition>
            <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
              }
            `,
          }}
        />
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}

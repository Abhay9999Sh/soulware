import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import Header from "@/components/header";
import PageTransition from "@/components/page-transition";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (!window.chatbase || window.chatbase("getState") !== "initialized") {
                  window.chatbase = (...args) => {
                    if (!window.chatbase.q) { window.chatbase.q = []; }
                    window.chatbase.q.push(args);
                  };
                  window.chatbase = new Proxy(window.chatbase, {
                    get(target, prop) {
                      if (prop === "q") { return target.q; }
                      return (...args) => target(prop, ...args);
                    }
                  });
                }
                const onLoad = function() {
                  const script = document.createElement("script");
                  script.src = "https://www.chatbase.co/embed.min.js";
                  script.id = "MQ1SI9V9i4BPq2jnAnaKo";
                  script.domain = "www.chatbase.co";
                  document.body.appendChild(script);
                };
                if (document.readyState === "complete") {
                  onLoad();
                } else {
                  window.addEventListener("load", onLoad);
                }
              })();
            `,
          }}
        />
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}

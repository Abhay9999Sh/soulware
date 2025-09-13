import { Inter } from "next/font/google";
import "./globals.css";
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
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}

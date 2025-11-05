import "@/styles/globals.css";
import { Header } from "@/components/Global/header";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import ApolloProviderWrapper from "@/lib/ApolloProviderWrapper";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Happlicant Task",
  description: "Happlicant Task",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <ApolloProviderWrapper>
        <Header />
        {children}
        <Toaster position="top-right" />
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}

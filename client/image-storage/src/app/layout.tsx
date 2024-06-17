import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Navigation from "./navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Image Uploader",
  description: "This is an image uploader file storage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Navigation>{children}</Navigation>
        </UserProvider>
      </body>
    </html>
  );
}

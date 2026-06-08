import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enterprise RAG Platform",
  description: "Admin dashboard and document chat workspace"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


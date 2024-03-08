import type { Metadata } from "next";
import { Nanum_Gothic } from "next/font/google";
import "./globals.css";
import { CssBaseline } from "@mui/material";
import { ReactQueryProvider } from "@/components/provider/ReactQueryProvider";

const nanumGothic = Nanum_Gothic({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React Deep Dive",
  description: "React Deep Dive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nanumGothic.className}>
        <CssBaseline />
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}

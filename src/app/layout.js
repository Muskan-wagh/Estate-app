import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "Estate | Elite Real Estate Platform",
  description: "Discover premium properties and architectural gems globally.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased font-outfit`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

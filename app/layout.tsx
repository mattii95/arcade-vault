import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono, Courier_Prime } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "./globals.css";

const pixel = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const courier = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Arcade Vault",
  description: "Compite por la puntuación más alta",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${pixel.variable} ${jetbrains.variable} ${courier.variable}`}
    >
      <body>
        <div className="av-bg" />
        <div className="av-noise" />
        <div id="root">
          <Nav />
          <main className="av-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

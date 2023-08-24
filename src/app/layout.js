import "./globals.css";
import { Bubblegum_Sans } from "next/font/google";
import GoogleAnalytics from "./components/GoogleAnalytics";

// import Loading from "./loading";

const Bubblegum = Bubblegum_Sans({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: "MESI SwanVestas",
  description: "Competition Leaderboard for monks eleigh investors",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={Bubblegum.className}>
      <body suppressHydrationWarning={true}>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}
        {children}
      </body>
    </html>
  );
}

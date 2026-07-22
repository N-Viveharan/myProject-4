import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  
  subsets: ["latin"],weight:["400","500","600","700"]
});



export const metadata = {
  title: "Stitch Cloud — File Manager",
  description: "A modern cloud file manager to organize and manage your files.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "MyShop",
  description: "E-commerce site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-serif">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

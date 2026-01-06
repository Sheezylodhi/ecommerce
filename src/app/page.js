// app/page.js
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import HomeClient from "@/components/HomeClient";

async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-white relative">
      <Navbar />
      <HomeClient products={products} />
      <Footer />
      <CartSidebar />
    </div>
  );
}

import { Product } from "@/lib/models/Product.js";

export default async function MenPage() {
  const products = await Product.find({}).populate("category");
  const menProducts = products.filter(p => p.category.name.toLowerCase() === "men");

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {menProducts.map(p => (
        <div key={p._id} className="border p-2">
          <img src={`/uploads/${p.image}`} alt={p.name} />
          <h2>{p.name}</h2>
          <p>${p.price}</p>
        </div>
      ))}
    </div>
  );
}

import Link from "next/link";
import { API_URL } from "../lib/config";

async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-8">Discover Products</h1>
      {products.length === 0 ? (
        <p className="text-gray-500 text-lg">No products available or unable to connect to API.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p: any) => (
            <Link href={`/products/${p.slug}`} key={p.id} className="block group">
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 p-6 group-hover:-translate-y-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {p.category?.name || "Uncategorized"}
                </span>
                <p className="text-2xl font-bold text-gray-900 mt-4">${p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

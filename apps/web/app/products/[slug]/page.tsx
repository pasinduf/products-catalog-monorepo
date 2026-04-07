import { Metadata } from 'next';
import Link from 'next/link';

const API_URL = "http://localhost:3001";

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    category: { name: string };
}

export async function generateStaticParams() {
    try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) return [];
        const products: Product[] = await res.json();
        return products.map((product) => ({
            slug: product.slug,
        }));
    } catch (e) {
        return [];
    }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const resolvedParams = await params;
    return {
        title: `${resolvedParams.slug} | Products Catalog`,
    };
}

export default async function ProductDetailsPage({ params }: any) {
    const { slug } = await params;

    let product: Product | null = null;
    try {
        const res = await fetch(`${API_URL}/products/${slug}`, { cache: 'force-cache' });
        if (res.ok) {
            product = await res.json();
        }
    } catch (e) {
        product = null;
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Product Not Found</h1>
                <Link href="/" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
      <>
        <div className="text-left  max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-700 hover:bg-slate-700 transition-colors"
          >
            Back
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 mb-6">
            {product.category?.name}
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">{product.name}</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">{product.description}</p>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-2">
            <span className="text-3xl font-extrabold text-emerald-600">${product.price}</span>
            <button className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transform hover:-translate-y-0.5 transition-all">
              Add to Cart
            </button>
          </div>
        </div>
      </>
    );
}

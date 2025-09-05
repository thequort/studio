import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';
import type { Product } from '@/lib/types';

export default function Home() {
  const categories = [
    'Anime Collectibles',
    'Movie Memorabilia',
    'Clothing',
    'Bags',
  ];

  const productsByCategory = categories.map((category) => ({
    name: category,
    products: products.filter((p) => p.category === category),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-headline text-4xl font-bold text-center tracking-tight">
        Our Collection
      </h1>
      <div className="space-y-12">
        {productsByCategory.map(({ name, products }) => (
          <section key={name}>
            <h2 className="mb-6 font-headline text-3xl font-bold">{name}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

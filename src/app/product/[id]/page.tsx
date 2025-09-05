import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import { ProductDetails } from '@/components/ProductDetails';

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetails product={product} relatedProducts={relatedProducts} />;
}

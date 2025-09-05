'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart } from './icons';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/product/${product.id}`} className="block">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
            data-ai-hint="product image"
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <Link href={`/product/${product.id}`}>
          <CardTitle className="font-headline text-xl leading-tight hover:text-primary">
            {product.name}
          </CardTitle>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xl font-semibold">${product.price.toFixed(2)}</p>
        <Button onClick={() => addToCart(product)} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

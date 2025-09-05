'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/lib/types';
import { refineProductDescription } from '@/ai/flows/refine-product-description';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, ShoppingCart } from '@/components/icons';
import { ProductCard } from './ProductCard';

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState(product.description);
  const [isRefining, setIsRefining] = useState(false);

  const handleRefineDescription = async () => {
    setIsRefining(true);
    try {
      const result = await refineProductDescription({ rawDescription: description });
      if (result.refinedDescription) {
        setDescription(result.refinedDescription);
        toast({
          title: 'Description Refined',
          description: 'The product description has been enhanced by AI.',
        });
      }
    } catch (error) {
      console.error('Failed to refine description:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not refine the description at this time.',
      });
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="p-0">
                      <Image
                        src={img}
                        alt={`${product.name} image ${index + 1}`}
                        width={800}
                        height={800}
                        className="w-full h-auto aspect-square object-cover rounded-lg"
                        data-ai-hint="product image"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="space-y-6">
          <h1 className="font-headline text-4xl font-bold">{product.name}</h1>
          <p className="text-3xl font-semibold text-primary">
            ${product.price.toFixed(2)}
          </p>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-headline text-xl font-bold">Description</h2>
              <Button variant="outline" size="sm" onClick={handleRefineDescription} disabled={isRefining}>
                {isRefining ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Refine with AI
              </Button>
            </div>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))}><span className="text-2xl">-</span></Button>
              <span className="w-12 text-center text-lg font-medium">{quantity}</span>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity(quantity + 1)}><span className="text-2xl">+</span></Button>
            </div>
            <Button size="lg" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => addToCart(product, quantity)}>
                <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <Separator />

          <div>
            <h2 className="font-headline text-xl font-bold mb-2">Specifications</h2>
            <ul className="space-y-1 text-muted-foreground">
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold text-foreground">{key}:</span> {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-24">
            <h2 className="font-headline text-3xl font-bold text-center mb-8">Related Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}

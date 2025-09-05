'use client';

import { CheckoutForm } from '@/components/CheckoutForm';
import { useCart } from '@/hooks/useCart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CheckoutPage() {
  const { cart, cartTotal, itemCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (itemCount === 0) {
      router.replace('/');
    }
  }, [itemCount, router]);

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-headline text-4xl font-bold text-center mb-12">
        Checkout
      </h1>
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <CheckoutForm />

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                      data-ai-hint="product image"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <p>Subtotal</p>
                <p>${cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${cartTotal.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

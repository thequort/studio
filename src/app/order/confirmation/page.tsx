'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

// This is a simplified version of what an order type would look like
type OrderData = {
  orderId: string;
  name: string;
  email: string;
  address: string;
  items: { product: { name: string; images: string[]; price: number; }; quantity: number; }[];
  total: number;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const orderDataString = sessionStorage.getItem('lastOrder');
      if (orderDataString) {
        setOrder(JSON.parse(orderDataString));
        // Clean up session storage after retrieving the data
        sessionStorage.removeItem('lastOrder');
      } else {
        throw new Error("No order data found.");
      }
    } catch (e) {
      console.error("Failed to load order data:", e);
      setError("We couldn't retrieve your order details. Please check your email for a confirmation.");
    }
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-headline text-4xl font-bold mb-4">An Error Occurred</h1>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <h1 className="font-headline text-4xl font-bold text-primary">Thank You!</h1>
          <CardDescription className="text-lg">Your order has been placed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono font-semibold text-lg">{order.orderId}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Shipping to:</h3>
            <p className="text-muted-foreground">{order.name}</p>
            <p className="text-muted-foreground">{order.address}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Items Ordered:</h3>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.product.name} className="flex items-center gap-4">
                  <Image src={item.product.images[0]} alt={item.product.name} width={60} height={60} className="rounded-md object-cover" data-ai-hint="product image" />
                  <div className="flex-1">
                    <p>{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between items-center font-bold text-xl">
            <p>Total Paid</p>
            <p>${order.total.toFixed(2)}</p>
          </div>
          
          <div className="text-center pt-4">
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

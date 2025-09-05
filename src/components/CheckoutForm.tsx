'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  address: z.string().min(10, { message: 'Please enter a full shipping address.' }),
  orderNotes: z.string().optional(),
  contactMethod: z.enum(['Phone', 'WhatsApp']),
});

export function CheckoutForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { clearCart, cart, cartTotal } = useCart();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      orderNotes: '',
      contactMethod: 'Phone',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const orderId = `TQ-${Date.now()}`;
    
    // In a real app, you would send this data to your backend
    const orderData = {
      orderId,
      ...values,
      items: cart,
      total: cartTotal,
    };

    console.log('Order Submitted:', orderData);
    
    toast({
      title: 'Order Placed!',
      description: 'Your order has been successfully submitted.',
    });
    
    // Store order data in session storage to display on confirmation page
    try {
        sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
    } catch(e) {
        console.error("Could not save order to session storage", e);
    }
    
    clearCart();

    router.push('/order/confirmation');
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="123 Main St, Anytown, USA 12345"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any special instructions..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Preferred Contact Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Phone" />
                        </FormControl>
                        <FormLabel className="font-normal">Phone</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="WhatsApp" />
                        </FormControl>
                        <FormLabel className="font-normal">WhatsApp</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
              Place Order
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

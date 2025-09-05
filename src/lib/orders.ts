import type { Order } from './types';
import { products } from './products';

export const orders: Order[] = [
  {
    id: 'ORD-2024-001',
    customerName: 'Kenji Tanaka',
    email: 'kenji.t@email.com',
    phone: '123-456-7890',
    shippingAddress: '123 Anime St, Otaku City, CA 12345',
    contactMethod: 'Email',
    items: [
      { product: products[0], quantity: 1 },
      { product: products[4], quantity: 2 },
    ],
    total: 209.97,
    date: '2024-07-22T14:48:00.000Z',
    status: 'Delivered',
  },
  {
    id: 'ORD-2024-002',
    customerName: 'Jane Doe',
    email: 'jane.d@email.com',
    phone: '987-654-3210',
    shippingAddress: '456 Movie Ln, Cineville, NY 54321',
    contactMethod: 'Phone',
    items: [{ product: products[2], quantity: 1 }],
    total: 499.99,
    date: '2024-07-21T10:20:00.000Z',
    status: 'Shipped',
  },
  {
    id: 'ORD-2024-003',
    customerName: 'Sam Wilson',
    email: 'sam.w@email.com',
    phone: '555-123-4567',
    shippingAddress: '789 Fashion Ave, Styleburg, TX 78901',
    contactMethod: 'WhatsApp',
    items: [
      { product: products[5], quantity: 1 },
      { product: products[7], quantity: 1 },
    ],
    total: 249.98,
    date: '2024-07-23T09:05:00.000Z',
    status: 'Pending',
  },
  {
    id: 'ORD-2024-004',
    customerName: 'Emily Carter',
    email: 'emily.c@email.com',
    phone: '555-987-6543',
    shippingAddress: '321 Artifact Rd, Relic Town, FL 65432',
    contactMethod: 'Email',
    items: [{ product: products[6], quantity: 1 }],
    total: 189.99,
    date: '2024-07-20T18:00:00.000Z',
    status: 'Delivered',
  },
];

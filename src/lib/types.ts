export type Product = {
  id: string;
  name: string;
  category: 'Anime Collectibles' | 'Movie Memorabilia' | 'Clothing' | 'Bags';
  price: number;
  description: string;
  images: string[];
  specifications: { [key: string]: string };
  stock: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  orderNotes?: string;
  contactMethod: 'Phone' | 'WhatsApp';
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
};

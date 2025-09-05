
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { orders as initialOrders } from '@/lib/orders';
import { Pencil, PlusCircle, Trash2, Loader2 } from '@/components/icons';
import { useState, useEffect } from 'react';
import type { Product, Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Users, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';


const revenueData = [
  { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
];

const emptyProduct: Omit<Product, 'id' | 'specifications'> & { images: string } = {
  name: '',
  category: 'Clothing',
  price: 0,
  description: '',
  images: '',
  stock: 0,
};

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch products from the database.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map((o) => o.email)).size;

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    setIsLoading(true);
    try {
      const productRef = doc(db, "products", editingProduct.id);
      await updateDoc(productRef, { ...editingProduct });
      await fetchProducts(); // Refetch products to show updated data
      toast({
          title: "Product Updated",
          description: `${editingProduct.name} has been successfully updated.`,
      });
      setEditingProduct(null);
    } catch (error) {
       console.error("Error updating product: ", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update the product.",
      });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingProduct) return;
    const { name, value } = e.target;
    setEditingProduct({
        ...editingProduct,
        [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    });
  };

  const handleNewFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({
        ...newProduct,
        [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    });
  };

  const handleAddNewProduct = async () => {
    setIsLoading(true);
    try {
      const newProductData: Omit<Product, 'id'> = {
        ...newProduct,
        images: newProduct.images.split(',').map(url => url.trim()).filter(url => url),
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        specifications: {}, // Simplified for now
      };
      const docRef = await addDoc(collection(db, "products"), newProductData);
      setProducts([{ id: docRef.id, ...newProductData }, ...products]);
      toast({
          title: "Product Added",
          description: `${newProduct.name} has been successfully added.`,
      });
      setIsNewProductDialogOpen(false);
      setNewProduct(emptyProduct);
    } catch (error) {
      console.error("Error adding product: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add the new product.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsLoading(true);
    try {
        await deleteDoc(doc(db, "products", productToDelete));
        await fetchProducts(); // Refetch
        toast({
            title: "Product Deleted",
            description: "The product has been successfully deleted.",
        });
        setProductToDelete(null);
    } catch (error) {
        console.error("Error deleting product: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not delete the product.",
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleEditOrder = (order: Order) => {
    setEditingOrder({ ...order });
  };
  
  const handleSaveOrder = () => {
    if (!editingOrder) return;
    setOrders(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
    toast({
        title: "Order Updated",
        description: `Order ${editingOrder.id} has been successfully updated.`,
    });
    setEditingOrder(null);
  };

  const handleOrderStatusChange = (status: 'Pending' | 'Shipped' | 'Delivered') => {
    if (!editingOrder) return;
    setEditingOrder({...editingOrder, status});
  };

  const handleDeleteOrder = () => {
    if (!orderToDelete) return;
    setOrders(orders.filter(o => o.id !== orderToDelete));
    toast({
        title: "Order Deleted",
        description: "The order has been successfully deleted.",
    });
    setOrderToDelete(null);
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-muted-foreground">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className='font-headline'>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === 'Delivered'
                            ? 'default'
                            : order.status === 'Shipped'
                            ? 'secondary'
                            : 'outline'
                        }
                        className={order.status === 'Delivered' ? 'bg-green-600 text-white' : ''}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${order.total.toFixed(2)}
                    </TableCell>
                     <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleEditOrder(order)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setOrderToDelete(order.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle className='font-headline'>Product Inventory</CardTitle>
              <CardDescription>Current stock levels for all products.</CardDescription>
            </div>
             <Button size="sm" onClick={() => setIsNewProductDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New
            </Button>
          </CardHeader>
          <CardContent>
             <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {isLoading && products.length === 0 ? (<div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>) : 
                products.map(product => (
                    <div key={product.id} className="flex items-center">
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.stock} units</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setProductToDelete(product.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

       <Card className="mt-8">
          <CardHeader>
            <CardTitle className='font-headline'>Revenue Overview</CardTitle>
            <CardDescription>A chart showing revenue over the last year.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                  }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {editingProduct && (
            <Dialog open={!!editingProduct} onOpenChange={(isOpen) => !isOpen && setEditingProduct(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" name="name" value={editingProduct.name} onChange={handleEditFormChange} className="col-span-3" disabled={isLoading}/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Price</Label>
                            <Input id="price" name="price" type="number" value={editingProduct.price} onChange={handleEditFormChange} className="col-span-3" disabled={isLoading}/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock" className="text-right">Stock</Label>
                            <Input id="stock" name="stock" type="number" value={editingProduct.stock} onChange={handleEditFormChange} className="col-span-3" disabled={isLoading}/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Textarea id="description" name="description" value={editingProduct.description} onChange={handleEditFormChange} className="col-span-3" disabled={isLoading}/>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isLoading}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSaveProduct} disabled={isLoading}>
                           {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}

        <Dialog open={isNewProductDialogOpen} onOpenChange={setIsNewProductDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newName" className="text-right">Name</Label>
                        <Input id="newName" name="name" value={newProduct.name} onChange={handleNewFormChange} className="col-span-3" disabled={isLoading} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newPrice" className="text-right">Price</Label>
                        <Input id="newPrice" name="price" type="number" value={newProduct.price} onChange={handleNewFormChange} className="col-span-3" disabled={isLoading}/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newStock" className="text-right">Stock</Label>
                        <Input id="newStock" name="stock" type="number" value={newProduct.stock} onChange={handleNewFormChange} className="col-span-3" disabled={isLoading}/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newDescription" className="text-right">Description</Label>
                        <Textarea id="newDescription" name="description" value={newProduct.description} onChange={handleNewFormChange} className="col-span-3" disabled={isLoading}/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newImages" className="text-right">Image URLs</Label>
                        <Input id="newImages" name="images" value={newProduct.images} onChange={handleNewFormChange} className="col-span-3" placeholder="Comma-separated URLs" disabled={isLoading}/>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isLoading}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddNewProduct} disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Product
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {editingOrder && (
            <Dialog open={!!editingOrder} onOpenChange={(isOpen) => !isOpen && setEditingOrder(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Order {editingOrder.id}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="orderStatus" className="text-right">Status</Label>
                            <Select value={editingOrder.status} onValueChange={handleOrderStatusChange}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Shipped">Shipped</SelectItem>
                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Customer</Label>
                            <p className="col-span-3 text-sm">{editingOrder.customerName}</p>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Total</Label>
                            <p className="col-span-3 text-sm">${editingOrder.total.toFixed(2)}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSaveOrder}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
        
        <AlertDialog open={!!productToDelete} onOpenChange={(isOpen) => !isOpen && setProductToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteProduct} disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!orderToDelete} onOpenChange={(isOpen) => !isOpen && setOrderToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the order.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteOrder}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}

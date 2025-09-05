import Link from 'next/link';
import { TeQourtLogo } from '@/components/icons';
import { CartSheet } from './CartSheet';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <TeQourtLogo className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold tracking-tighter">
            téQourt
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/admin"
            className="transition-colors hover:text-primary"
          >
            Admin
          </Link>
        </nav>
        <div className="flex items-center justify-end">
          <CartSheet />
        </div>
      </div>
    </header>
  );
}

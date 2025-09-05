import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} téQourt. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="#" className="text-sm hover:text-primary">
            Twitter
          </Link>
          <Link href="#" className="text-sm hover:text-primary">
            Instagram
          </Link>
          <Link href="#" className="text-sm hover:text-primary">
            Facebook
          </Link>
        </div>
      </div>
    </footer>
  );
}

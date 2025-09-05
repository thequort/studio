import type { SVGProps } from 'react';
export {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Film,
  Shirt,
  Briefcase,
  Sparkles,
  Loader2,
  ChevronDown,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Pencil,
  PlusCircle,
  MoreHorizontal,
} from 'lucide-react';

export const TeQourtLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    {...props}
  >
    <path
      d="M20 25H80L70 75H30L20 25Z"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <path d="M50 25V15" stroke="currentColor" strokeWidth="5" />
    <path d="M40 25L35 18" stroke="currentColor" strokeWidth="5" />
    <path d="M60 25L65 18" stroke="currentColor" strokeWidth="5" />
    <path
      d="M35 40 Q 50 35, 65 40"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
    />
    <path
      d="M38 60 Q 50 65, 62 60"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
    />
  </svg>
);

export const ToyBrickIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="8" width="18" height="12" rx="1" />
    <path d="M10 8V5c0-1.1.9-2 2-2h0c1.1 0 2 .9 2 2v3" />
    <path d="M7 12v0" />
    <path d="M12 12v0" />
    <path d="M17 12v0" />
    <path d="M7 16v0" />
    <path d="M12 16v0" />
    <path d="M17 16v0" />
  </svg>
);

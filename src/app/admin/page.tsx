'use client';

import { AdminDashboard } from "@/components/AdminDashboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem('tqsr-admin');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.username === 'tqsr' && userData.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          router.replace('/admin/login');
        }
      } catch (error) {
        router.replace('/admin/login');
      }
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return <AdminDashboard />;
}

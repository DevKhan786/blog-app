"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/contexts/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      router.push("/");
    }
  }, [user, loading, router]);

  return (
    <section className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">{children}</main>
    </section>
  );
}

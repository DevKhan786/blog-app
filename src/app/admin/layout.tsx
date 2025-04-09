"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.push("/");
      } else {
        setVerified(true);
      }
    }
  }, [user, loading]);

  if (loading || !verified) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <section className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">{children}</main>
    </section>
  );
}

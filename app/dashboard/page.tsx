"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (!u) {
        router.replace("/login");
      } else {
        setUser(u);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return <div style={{ padding: 40 }}>Loading user...</div>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>DASHBOARD ✅</h1>
      <p>User: {user.email}</p>
    </div>
  );
}
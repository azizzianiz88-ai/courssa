"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useLogout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Clear client-side cookies too (just in case)
      document.cookie = "courssa_session=; path=/; max-age=0;";
      document.cookie = "courssa_role=; path=/; max-age=0;";
      router.push("/auth");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
}

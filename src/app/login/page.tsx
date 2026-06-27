"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Login is now handled as a modal overlay on the landing page.
// This page simply redirects to home with a hash that triggers the modal.
export default function LoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/#login");
  }, [router]);
  return null;
}

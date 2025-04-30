"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="hover:bg-muted"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      <span className="hidden sm:block">Back to Dashboard</span>
    </Button>
  );
}

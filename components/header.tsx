"use client";
import { Search, Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme/theme-toggler";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { SearchBar } from "./searchBar";
import Link from "next/link";

export function Header() {
  const pathname = usePathname();
  const hideHeaderOn = ["/add-media", "/select-username", "/profile"];

  const isMediaDetailPage =
    /^\/[^\/]+\/[^\/]+$/.test(pathname) && !pathname.startsWith("/library/");

  // If the current path is in the hideHeaderOn array, don't render the header
  if (hideHeaderOn.includes(pathname) || isMediaDetailPage) {
    return null;
  }

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden">
          <Menu />
        </SidebarTrigger>
        <Separator orientation="vertical" className="mr-2 h-6 md:hidden" />
        <div className="relative w-96">
          <SearchBar />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Link href={`/profile`} passHref>
          <Button size="icon" variant="ghost" className="rounded-full">
            <User className="h-4 w-4" />
            <span className="sr-only">User menu</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}

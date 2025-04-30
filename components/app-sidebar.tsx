"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Library,
  Home,
  Heart,
  Users,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: Library },
  // { href: "/", label: "Wishlist", icon: Heart },
  { href: "/following", label: "Friends", icon: Users },
  // { href: "/", label: "Discover", icon: Sparkles },
];

export function AppSidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const { openMobile, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  const hideSidebarOn = ["/select-username"];

  useEffect(() => {
    if (!isMobile && openMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, openMobile, setOpenMobile]);

  const handleSignOut = async () => {
    const { data, error } = await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          console.log("success!");
          toast.success("Successfully signed out!");
          router.push("/sign-in");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });

    console.log(data, error);
  };

  if (hideSidebarOn.includes(pathname)) {
    return null;
  }

  if (isMobile) {
    return (
      <Sidebar>
        <SidebarHeader className="px-6 py-4">
          <Link
            href="/"
            onClick={() => isMobile && setOpenMobile(false)}
            className="flex items-center space-x-3"
          >
            <Library className="h-6 w-6" />
            <span className="text-xl font-bold text-gray-800">MediaShelf</span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-4">
          <div className="space-y-8">
            {/* Main Menu */}
            <SidebarMenu>
              {menuItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    className="h-11 gap-3 px-4 hover:bg-secondary"
                  >
                    <Link
                      href={href}
                      onClick={() => isMobile && setOpenMobile(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </SidebarContent>

        {/* Footer - Logout */}

        <SidebarFooter className="px-4 py-4">
          <SidebarSeparator className="my-4" />
          <SidebarMenu>
            {/* Settings */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="h-11 gap-3 px-4 hover:bg-secondary"
              >
                <Link
                  href="/profile"
                  onClick={() => isMobile && setOpenMobile(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Logout Button */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleSignOut}
                className="h-11 gap-3 px-4 w-full text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <div className="flex h-screen">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isHovered ? "w-60" : "w-20"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar
          collapsible="none"
          className={`transition-all duration-300 ease-in-out ${
            isHovered ? "w-60" : "w-20"
          }`}
        >
          <SidebarHeader className="px-6 py-4">
            {/* <Link href="/" className="flex items-center space-x-3"> */}
            <Link
              href="/"
              className={`flex items-center ${
                isHovered ? "space-x-3" : "justify-center"
              }`}
            >
              <Library className="h-6 w-6" />
              <span
                className={`text-xl font-bold text-gray-800 ${
                  isHovered ? "opacity-100" : "opacity-0 w-0"
                } transition-opacity duration-300`}
              >
                MediaShelf
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-4">
            <div className="space-y-8">
              {/* Main Menu */}
              <SidebarMenu>
                {menuItems.map(({ href, label, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      className="h-11 gap-3 px-4 hover:bg-secondary"
                    >
                      <Link href={href}>
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </SidebarContent>

          {/* Footer - Logout */}

          <SidebarFooter className="px-4 py-4">
            <SidebarSeparator className="my-4" />
            <SidebarMenu>
              {/* Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="h-11 gap-3 px-4 hover:bg-secondary"
                >
                  <Link
                    href="/profile"
                    onClick={() => isMobile && setOpenMobile(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Logout Button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSignOut}
                  className="h-11 gap-3 px-4 w-full text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </div>
    </div>
  );
}

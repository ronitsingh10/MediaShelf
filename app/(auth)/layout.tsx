import { ReactNode } from "react";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={inter.className}>
      <Toaster />
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left Column: For the page-specific content (sign-in/sign-up form) */}
        <div className="p-8 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">{children}</div>
        </div>

        {/* Right Column: Shared branding and informational content */}
        <div className="hidden lg:flex bg-emerald-800 text-white p-8 item">
          <div className="my-auto">
            <h2 className="text-4xl font-serif">
              Enter the Future
              <br />
              of Media Cataloging,
              <br />
              today
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

"use client";

import Link from "next/link";
import SignInForm from "@/components/auth/sign-in-form";

const SignIn = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your MediaShelf account
        </p>
      </div>

      <SignInForm />

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-emerald-800 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;

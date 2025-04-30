"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { signInSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the redirect URL from the query parameters
  const redirectUrl = searchParams.get("redirect") || "/";

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    const DEMO_TOKEN = process.env.NEXT_PUBLIC_RESUME_TOKEN;
    const DEMO_EMAIL = process.env.NEXT_PUBLIC_RESUME_EMAIL;
    const DEMO_PASSWORD = process.env.NEXT_PUBLIC_RESUME_PASSWORD;

    const token = searchParams.get("token");
    if (token && token === DEMO_TOKEN) {
      setLoading(true);
      authClient.signIn
        .email(
          { email: DEMO_EMAIL!, password: DEMO_PASSWORD!, rememberMe: true },
          {
            onSuccess: async () => {
              toast.success("Signed in via resume link!");
              router.push(redirectUrl);
            },
            onError: (ctx) => {
              toast.error(ctx.error.message);
            },
          }
        )
        .finally(() => setLoading(false));
    }
    // we only want to run this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (formData: SignInFormValues) => {
    setLoading(true);
    console.log(formData);
    const { data, error } = await authClient.signIn.email(
      {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      },
      {
        onSuccess: async (ctx) => {
          toast.success("Successfully signed in!");
          const newSession = await authClient.getSession();
          router.push(
            !newSession.data.user.userName ? "/select-username" : redirectUrl
          );
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    // Add your Google sign in logic here
    toast.info("Google sign-in initiated");
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: redirectUrl,
    });
  };

  return (
    <div className="space-y-8">
      <Form {...signInForm}>
        <form
          onSubmit={signInForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={signInForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="hello@example.com"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={signInForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <FormField
              control={signInForm.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="remember-me"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Remember me</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <div
              // href="/forgot-password"
              className="text-sm text-emerald-800 hover:underline"
            >
              Forgot password?
            </div>
          </div>

          <Button
            className="w-full bg-emerald-800 hover:bg-emerald-700"
            disabled={loading}
            type="submit"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign in"}
          </Button>
        </form>
      </Form>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        type="button"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </Button>
    </div>
  );
};

export default SignInForm;

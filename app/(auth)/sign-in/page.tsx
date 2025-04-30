import Link from "next/link";
import SignInForm from "@/components/auth/sign-in-form";

const SignIn = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        {/* <div className="h-12 w-12 bg-emerald-800 rounded-lg flex items-center justify-center"> */}
        {/* <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg> */}
        {/* </div> */}
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

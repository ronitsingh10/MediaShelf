import Link from "next/link";
import SignUpForm from "@/components/auth/sign-up-form";

const SignUp = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-12 w-12 bg-emerald-800 rounded-lg flex items-center justify-center">
          <svg
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
          </svg>
        </div>
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your information to get started
        </p>
      </div>

      <SignUpForm />

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-emerald-800 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUp;

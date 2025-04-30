import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import UsernameForm from "./components/UserNameForm";

const SelectUserName = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  // If user already has a username, redirect before rendering
  if (session?.user?.userName) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-6 text-center">
          Set Your Username
        </h1>
        <div className="max-w-md mx-auto">
          <UsernameForm />
        </div>
      </div>
    </div>
  );
};

export default SelectUserName;

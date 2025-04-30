"use client";

import type React from "react";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { checkUserName, updateUserName } from "@/server/actions/user-actions";
import { toast } from "sonner";

const UsernameForm = () => {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setUsername(value);

    // Reset states when input changes
    setIsAvailable(null);
    setIsChecking(false);

    // Basic validation
    if (value.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (value.length > 20) {
      setError("Username must be less than 20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setError("Username can only contain letters, numbers, and underscores");
      return;
    }

    setError(null);
  };

  const checkAvailability = async () => {
    if (!username || error) return;

    setIsChecking(true);
    try {
      const available = await checkUserName(username);
      console.log("Availanle username:", available);
      setIsAvailable(available);
    } catch (err) {
      console.error("Error checking username:", err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAvailable) {
      const response = await updateUserName(username);
      if (response.success) {
        toast.success("Username selected!");
        router.push("/");
      } else {
        console.error("Error saving username:", response.error);
        setError("Something went wrong. Please try again.");
      }
    } else {
      await checkAvailability();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Choose your username</CardTitle>
        <CardDescription>
          Your username is how other members will know you on the platform. Pick
          something memorable!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">
              Username
              {isChecking && (
                <Loader2 className="inline ml-2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {isAvailable === true && !isChecking && (
                <Check className="inline ml-2 h-4 w-4 text-green-500" />
              )}
              {isAvailable === false && !isChecking && (
                <X className="inline ml-2 h-4 w-4 text-red-500" />
              )}
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 inset-y-0 flex items-center text-muted-foreground">
                  @
                </span>
                <Input
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  onBlur={checkAvailability}
                  className={cn(
                    "pl-7",
                    isAvailable === true &&
                      "border-green-500 focus-visible:ring-green-500",
                    isAvailable === false &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="cooluser"
                  autoComplete="off"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {isAvailable === false && !isChecking && (
              <p className="text-sm text-red-500">
                This username is already taken. Try another one.
              </p>
            )}
            {isAvailable === true && !isChecking && (
              <p className="text-sm text-green-500">
                Great choice! This username is available.
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className={cn(
            "w-full transition-all duration-200",
            // Apply different visual styles based on state
            username.length >= 3 &&
              !error &&
              !isChecking &&
              "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
            //   : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
          )}
          disabled={username.length < 3 || isChecking || !!error}
          onClick={handleSubmit}
        >
          {isAvailable ? "Confirm Username" : "Check Availability"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UsernameForm;

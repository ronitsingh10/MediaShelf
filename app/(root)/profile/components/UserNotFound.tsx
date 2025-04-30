import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserNotFoundProfile() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md mx-auto">
        <Card className="border-muted-foreground/20">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">User Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              The user profile you&apos;re looking for doesn&apos;t exist or may
              have been removed.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 text-sm text-left">
              <p className="font-medium mb-2">This could be because:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>The username was entered incorrectly</li>
                <li>The user has deleted their account</li>
                <li>The profile has been suspended</li>
                <li>You don&apos;t have permission to view this profile</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

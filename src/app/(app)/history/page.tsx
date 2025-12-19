'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History as HistoryIcon, Loader2 } from "lucide-react";
import { useAuthContext } from "@/context/auth-context";
import { AuthDialog } from "@/components/auth-dialog";

export default function HistoryPage() {
  const { isAdmin, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AuthDialog />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">
        Practice History
      </h2>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12">
            <HistoryIcon className="w-16 h-16 mb-4" />
            <p>Your practice session history will appear here.</p>
            <p>Keep practicing to build up your records!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

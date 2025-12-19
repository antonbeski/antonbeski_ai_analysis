import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">
        Settings
      </h2>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12">
            <SettingsIcon className="w-16 h-16 mb-4" />
            <p>Application and user settings will be available here in a future update.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

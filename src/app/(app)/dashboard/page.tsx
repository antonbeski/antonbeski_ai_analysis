import { StatsCards } from "@/components/dashboard/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, BrainCircuit } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">
        Dashboard
      </h2>
      <div className="space-y-4">
        <StatsCards />
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Daily Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12">
                        <BarChart className="w-16 h-16 mb-4" />
                        <p>Your daily progress chart will appear here once you complete a few practice sessions.</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">AI Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12">
                        <BrainCircuit className="w-16 h-16 mb-4" />
                        <p>Your personalized AI-driven performance analysis will be displayed here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

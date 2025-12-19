import { StatsCards } from "@/components/dashboard/stats-cards";
import { DailyProgressChart } from "@/components/dashboard/daily-progress-chart";
import { AccuracyChart } from "@/components/dashboard/accuracy-chart";
import { PerformanceSummary } from "@/components/dashboard/performance-summary";
import { performanceHistory, accuracyData, aiAnalysis } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">
        Dashboard
      </h2>
      <div className="space-y-4">
        <StatsCards />
        <div className="grid gap-4 md:grid-cols-2">
          <DailyProgressChart data={performanceHistory} />
          <AccuracyChart data={accuracyData} />
        </div>
        <PerformanceSummary
          strengths={aiAnalysis.strengths}
          weaknesses={aiAnalysis.weaknesses}
          suggestedTopics={aiAnalysis.suggestedTopics}
        />
      </div>
    </div>
  );
}

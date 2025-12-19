import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingDown, TrendingUp } from "lucide-react";

interface PerformanceSummaryProps {
  strengths: string;
  weaknesses: string;
  suggestedTopics: string;
}

export function PerformanceSummary({
  strengths,
  weaknesses,
  suggestedTopics,
}: PerformanceSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          AI Performance Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Strengths
          </h3>
          <p className="text-sm text-muted-foreground">{strengths}</p>
        </div>
        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            Weaknesses
          </h3>
          <p className="text-sm text-muted-foreground">{weaknesses}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Suggested Focus Areas</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedTopics.split(',').map((topic, index) => (
              <Badge key={index} variant="secondary">{topic.trim()}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

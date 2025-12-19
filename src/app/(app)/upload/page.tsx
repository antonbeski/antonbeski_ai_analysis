'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">
        Upload PDFs
      </h2>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>PDF Data Ingestion</CardTitle>
          <CardDescription>Parse and index JEE PDFs (questions and solutions).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
            <UploadCloud className="w-16 h-16 mb-4" />
            <p>Drag and drop your PDF files here or click to browse.</p>
            <p className="text-xs mt-2">This feature is available only to the administrator.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

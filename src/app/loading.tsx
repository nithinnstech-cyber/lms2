import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-blue-500">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading LearnHub...</p>
      </div>
    </div>
  );
}

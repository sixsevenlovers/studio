import type { Achievement } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, Lock } from "lucide-react";

type AchievementCardProps = {
  achievement: Achievement;
  isUnlocked: boolean;
};

export function AchievementCard({ achievement, isUnlocked }: AchievementCardProps) {
  return (
    <Card className={cn(
        "transition-all duration-300 relative overflow-hidden",
        isUnlocked ? "bg-accent/20 border-accent" : "bg-muted/50"
    )}>
      {isUnlocked && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-xs font-bold text-accent-foreground bg-accent px-2 py-1 rounded-full">
          <CheckCircle className="size-4"/>
          <span>Unlocked</span>
        </div>
      )}
       {!isUnlocked && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-xs font-bold text-muted-foreground bg-muted/80 px-2 py-1 rounded-full">
          <Lock className="size-4"/>
          <span>Locked</span>
        </div>
      )}
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
         <div className={cn("text-4xl", !isUnlocked && "grayscale opacity-60")}>
            {achievement.emoji}
         </div>
        <div>
          <CardTitle>{achievement.title}</CardTitle>
          <CardDescription className="mt-1">{achievement.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
       
      </CardContent>
    </Card>
  );
}

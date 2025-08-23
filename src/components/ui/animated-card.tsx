import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
}

export const AnimatedCard = ({ 
  children, 
  className, 
  hoverEffect = true,
  delay = 0 
}: AnimatedCardProps) => {
  return (
    <div
      className={cn(
        "animate-fade-in rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
        hoverEffect && "hover:shadow-md hover:-translate-y-1",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
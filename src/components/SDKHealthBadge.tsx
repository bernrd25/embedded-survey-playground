import { useSDKHealth } from "../hooks/useSDKHealth";
import { cn } from "../lib/utils";

const CONFIG: Record<
  ReturnType<typeof useSDKHealth>,
  { label: string; dot: string; text: string }
> = {
  idle: {
    label: "SDK Idle",
    dot: "bg-slate-400",
    text: "text-slate-500",
  },
  loading: {
    label: "SDK Loading",
    dot: "bg-yellow-400 animate-pulse",
    text: "text-yellow-600",
  },
  ready: {
    label: "SDK Ready",
    dot: "bg-green-500",
    text: "text-green-600",
  },
  error: {
    label: "SDK Error",
    dot: "bg-red-500",
    text: "text-red-600",
  },
};

export function SDKHealthBadge({ className }: { className?: string }) {
  const status = useSDKHealth();
  const { label, dot, text } = CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
        "bg-background border-border",
        text,
        className,
      )}
      title={label}
    >
      <span className={cn("w-2 h-2 rounded-full shrink-0", dot)} />
      {label}
    </span>
  );
}

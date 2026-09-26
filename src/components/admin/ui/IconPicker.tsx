import React from "react";
import {
  Code,
  Cpu,
  Zap,
  Database,
  Award,
  Sparkles,
  GraduationCap,
  Terminal,
  Trophy,
  Globe,
  Layers,
  BookOpen,
  Briefcase,
  Star,
  CheckCircle2,
} from "lucide-react";

// eslint-disable-next-line react-refresh/only-export-components
export const AVAILABLE_ICONS = [
  { id: "code", label: "Code", Icon: Code },
  { id: "cpu", label: "CPU / Architecture", Icon: Cpu },
  { id: "zap", label: "Lightning / Clean Code", Icon: Zap },
  { id: "db", label: "Database", Icon: Database },
  { id: "award", label: "Award / Certificate", Icon: Award },
  { id: "sparkles", label: "Sparkles", Icon: Sparkles },
  { id: "grad", label: "Graduation", Icon: GraduationCap },
  { id: "terminal", label: "Terminal / GFG", Icon: Terminal },
  { id: "trophy", label: "Trophy / Badges", Icon: Trophy },
  { id: "codechef", label: "Competitive", Icon: Code },
  { id: "globe", label: "Globe", Icon: Globe },
  { id: "layers", label: "Layers / Stack", Icon: Layers },
  { id: "book", label: "Book / Academics", Icon: BookOpen },
  { id: "briefcase", label: "Briefcase / Career", Icon: Briefcase },
  { id: "star", label: "Star", Icon: Star },
  { id: "check", label: "Checkmark", Icon: CheckCircle2 },
];

interface IconPickerProps {
  value: string;
  onChange: (iconId: string) => void;
  label?: string;
}

export function IconPicker({ value, onChange, label = "Icon" }: IconPickerProps) {
  const current = AVAILABLE_ICONS.find((i) => i.id === value) || AVAILABLE_ICONS[0];
  const CurrentIcon = current?.Icon || Code;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <div className="size-9 rounded-lg border border-border bg-card flex items-center justify-center text-primary shrink-0 shadow-2xs">
          <CurrentIcon className="size-4.5" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-border-strong bg-card px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none cursor-pointer"
        >
          {AVAILABLE_ICONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label} ({item.id})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-surface-800 bg-surface-950/80 px-6 backdrop-blur-sm">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Search assessments, reports..."
            leftIcon={<Search size={16} />}
            className="border-surface-700 bg-surface-800/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-surface-400 hover:bg-surface-800 hover:text-surface-200">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />
        </button>
      </div>
    </header>
  );
}

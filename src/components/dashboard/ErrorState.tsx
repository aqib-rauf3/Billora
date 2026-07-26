import { IconAlertTriangle } from "@tabler/icons-react";

// Shared error banner — every list page shows this instead of a blank/stuck
// screen when its fetch fails, with a retry action.
export default function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <div className="w-12 h-12 rounded-full bg-redBg flex items-center justify-center mb-4">
        <IconAlertTriangle size={22} className="text-red" />
      </div>
      <p className="text-sm font-medium text-ink mb-1">Couldn&apos;t load this</p>
      <p className="text-xs text-muted max-w-[280px] mb-4">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="text-xs text-navy dark:text-[#8FA9E8] font-medium hover:underline"
      >
        Try again
      </button>
    </div>
  );
}

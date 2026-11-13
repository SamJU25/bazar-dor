"use client";

interface CatalogEmptyPanelProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

/** Shared accessible empty-state card used when catalog filters or upstream queries yield no items. */
export default function CatalogEmptyPanel({
  message,
  actionLabel,
  onAction,
}: CatalogEmptyPanelProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-white rounded-2xl border border-[#dce6dc] p-10 text-center space-y-3"
    >
      <p className="text-slate-600 text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center justify-center h-11 sm:h-10 px-5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-sm font-semibold leading-none transition-colors cursor-pointer"
      >
        {actionLabel}
      </button>
    </div>
  );
}

import { AlertCircle, Inbox } from "lucide-react";

export function LoadingState({ label = "Loading data..." }) {
  return <div className="panel p-8 text-center text-sm font-medium text-slate-500">{label}</div>;
}

export function EmptyState({ title, message }) {
  return (
    <div className="panel flex flex-col items-center p-8 text-center">
      <Inbox className="h-10 w-10 text-slate-300" />
      <h3 className="mt-3 text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="panel flex flex-col items-center p-8 text-center">
      <AlertCircle className="h-10 w-10 text-danger" />
      <h3 className="mt-3 text-base font-semibold text-slate-950">Unable to load data</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>
      {onRetry && (
        <button className="btn-secondary mt-4" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

interface LoadingIndicatorProps {
  isLoading?: boolean;
  text?: string;
}

export default function LoadingIndicator({ 
  isLoading = true, 
  text = "読み込み中..." 
}: LoadingIndicatorProps) {
  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="text-gray-600">{text}</span>
      </div>
    </div>
  );
}

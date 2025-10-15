import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorBlockProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorBlock({ 
  message = "エラーが発生しました", 
  onRetry 
}: ErrorBlockProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {message}
      </h3>
      <p className="text-gray-600 mb-4">
        しばらく時間をおいてから再度お試しください
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          再試行
        </button>
      )}
    </div>
  )
}

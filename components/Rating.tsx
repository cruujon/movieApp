import { Star } from 'lucide-react'

interface RatingProps {
  value: number
  className?: string
}

export default function Rating({ value, className = "" }: RatingProps) {
  const displayValue = value ? value.toFixed(1) : "N/A"
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Star 
        className="w-4 h-4 fill-yellow-400 text-yellow-400" 
        aria-hidden="true"
      />
      <span 
        className="text-sm font-medium text-gray-700"
        aria-label={`評価 ${displayValue} / 10`}
      >
        {displayValue}
      </span>
      <span className="text-xs text-gray-500">/ 10</span>
    </div>
  )
}

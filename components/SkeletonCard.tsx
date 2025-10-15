export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* 画像スケルトン */}
      <div className="aspect-[2/3] bg-gray-300"></div>
      
      {/* コンテンツスケルトン */}
      <div className="p-4 space-y-3">
        {/* タイトル */}
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
        
        {/* 評価 */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>
        
        {/* 公開日 */}
        <div className="h-4 bg-gray-300 rounded w-16"></div>
        
        {/* 一言 */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  )
}

export default function SkeletonCard() {
    return (
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-md flex flex-col h-full animate-pulse">
        <div className="h-48 w-full bg-muted"></div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-muted rounded w-full mb-2"></div>
          <div className="h-4 bg-muted rounded w-5/6 mb-6"></div>
          
          <div className="flex items-center justify-between text-sm mb-6">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/6"></div>
          </div>
  
          <div className="flex items-center justify-between mt-auto">
            <div className="h-9 bg-muted rounded-xl w-1/3"></div>
            <div className="h-9 bg-muted rounded-full w-9"></div>
          </div>
        </div>
      </div>
    );
  }

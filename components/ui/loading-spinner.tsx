export function LoadingSpinner({ size = "default", text = "Loading..." }: { size?: "sm" | "default" | "lg", text?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8", 
    lg: "h-16 w-16"
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]} mb-4`}></div>
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  )
}

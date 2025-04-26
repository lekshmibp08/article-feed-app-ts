function Card({ children, className = "", ...props }: any) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`} {...props}>
        {children}
      </div>
    )
  }
  
  export { Card }
  
  
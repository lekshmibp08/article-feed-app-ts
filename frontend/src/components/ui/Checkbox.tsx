function Checkbox({ id, checked, onCheckedChange, className = "", ...props }) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
        className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
        {...props}
      />
    </div>
  )
}

export { Checkbox }


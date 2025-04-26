import { useState, useRef, useEffect } from "react"

interface IOption {
  value: string;
  label: string;
}

interface ISelectProps {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options?: IOption[];
  className?: string;
}

function Select({ id, value, onValueChange, placeholder, options = [], className = "" }: ISelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || "")
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedValue(value || "")
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (option: IOption) => {
    setSelectedValue(option.value)
    onValueChange && onValueChange(option.value)
    setIsOpen(false)
  }

  const selectedOption = options.find((option) => option.value === selectedValue)

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        id={id}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedValue ? "" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="ml-2">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
                selectedValue === option.value ? "bg-blue-50 font-medium text-blue-600" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { Select }


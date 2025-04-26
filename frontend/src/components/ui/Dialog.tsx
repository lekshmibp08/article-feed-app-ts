import { useEffect } from "react"

interface IDialogProps {
  isOpen: any;
  onClose: any;
  title: any;
  children: any;
}

function Dialog({ isOpen, onClose, title, children }: IDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md md:max-w-2xl rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button className="rounded-full p-1 hover:bg-gray-100" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export { Dialog }


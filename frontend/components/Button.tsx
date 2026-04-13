import { cn } from './Header';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  isLoading = false,
  children,
  disabled,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-nvidia-green text-black hover:bg-nvidia-green/90",
    secondary: "bg-gray-800 text-white hover:bg-gray-700",
    outline: "border border-gray-700 text-gray-300 hover:bg-gray-800",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nvidia-green disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

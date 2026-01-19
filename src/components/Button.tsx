interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary: 'bg-st-green text-white shadow-md hover:bg-st-green-light hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
        secondary: 'bg-white/80 text-gray-700 border border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5',
        outline: 'bg-transparent text-st-green-lighter border-2 border-st-green-lighter hover:bg-st-green-lighter/10 hover:-translate-y-0.5',
        danger: 'bg-red-600 text-white shadow-md hover:bg-red-500 hover:shadow-lg hover:-translate-y-0.5',
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2 text-base',
        lg: 'px-8 py-3 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

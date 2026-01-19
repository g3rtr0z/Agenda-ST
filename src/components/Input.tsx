interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-semibold text-gray-700">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-2 text-base text-gray-900 bg-white border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-300 focus:border-st-green focus:ring-st-green/10'
                    } rounded-md outline-none transition-all duration-200 hover:border-gray-400 focus:ring-4 ${className}`}
                {...props}
            />
            {error && (
                <span className="text-sm text-red-500">{error}</span>
            )}
        </div>
    );
}

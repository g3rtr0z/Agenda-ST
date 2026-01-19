interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export default function Select({ label, error, options, className = '', ...props }: SelectProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-semibold text-gray-700">
                    {label}
                </label>
            )}
            <select
                className={`w-full px-4 py-2 text-base text-gray-900 bg-white border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-300 focus:border-st-green focus:ring-st-green/10'
                    } rounded-md outline-none transition-all duration-200 cursor-pointer hover:border-gray-400 focus:ring-4 ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <span className="text-sm text-red-500">{error}</span>
            )}
        </div>
    );
}

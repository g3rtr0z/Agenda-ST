interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
    const baseStyles = 'bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition-all duration-300';
    const hoverStyles = hover ? 'hover:bg-white hover:border-gray-200 hover:shadow-xl hover:-translate-y-1' : '';
    const clickableStyles = onClick ? 'cursor-pointer active:-translate-y-0.5' : '';

    return (
        <div
            className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

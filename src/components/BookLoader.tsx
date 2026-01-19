import { useEffect, useState } from 'react';

export default function BookLoader({ onFinished }: { onFinished?: () => void }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Start opening animation
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 500);

        // Notify finished after animation
        const finishTimer = setTimeout(() => {
            if (onFinished) onFinished();
        }, 3500); // 3.5s total duration

        return () => {
            clearTimeout(timer);
            clearTimeout(finishTimer);
        };
    }, [onFinished]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0f0f0] perspective-1000">
            <div className={`relative w-80 h-[30rem] md:w-96 md:h-[36rem] transition-transform duration-1000 preserve-3d ${isOpen ? 'rotate-y-0 translate-x-[50%]' : 'rotate-y-[-10deg]'}`}>

                {/* Back Cover */}
                <div className="absolute inset-0 bg-[#005a41] rounded-r-lg shadow-xl translate-z-[-10px] flex items-center justify-center">
                    {/* Spines/Binding */}
                    <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#00402e] rounded-l-sm" />
                </div>

                {/* Pages (Block) */}
                <div className="absolute inset-y-3 right-3 left-8 bg-white shadow-inner transform translate-z-[-5px]" />

                {/* Front Cover (Opens) */}
                <div
                    className={`absolute inset-0 bg-st-green rounded-r-lg origin-left transition-all duration-[2000ms] ease-in-out preserve-3d shadow-2xl z-20 flex items-center justify-center
                    ${isOpen ? 'rotate-y-[-160deg] shadow-none' : 'rotate-y-0'}
                    `}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Cover Front Design */}
                    <div className="absolute inset-0 backface-hidden bg-st-green rounded-r-lg flex flex-col items-center justify-center border-l-[10px] border-[#d4af37]">
                        <div className="w-40 h-40 border-[5px] border-[#d4af37] rounded-full flex items-center justify-center mb-6">
                            <span className="text-[#d4af37] text-6xl font-serif font-bold">ST</span>
                        </div>
                        <h1 className="text-white font-serif text-3xl tracking-widest mt-2 uppercase">Agenda</h1>
                        <div className="absolute bottom-10 w-full text-center">
                            <p className="text-white/60 text-xs">Santo Tomás</p>
                        </div>
                    </div>

                    {/* Cover Inside (Visible when open) */}
                    <div className="absolute inset-0 backface-visible bg-[#004e38] rounded-l-lg rotate-y-180 flex items-center justify-center">
                        <div className="text-white/20 font-serif italic text-sm">
                            Santo Tomás
                        </div>
                    </div>
                </div>

                {/* First Page (Revealed) */}
                <div className="absolute inset-y-3 right-3 left-8 bg-white z-10 flex flex-col items-center justify-center p-8 text-center transform translate-z-[0px]">
                    <div className="w-full h-full border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-serif text-st-green font-bold mb-2">Bienvenido</h2>
                        <div className="w-16 h-1 bg-st-gold mb-4"></div>
                        <p className="text-gray-500 text-sm">Cargando directorio...</p>

                        <div className="mt-8 flex gap-2">
                            <div className="w-2 h-2 bg-st-green rounded-full animate-bounce delay-0"></div>
                            <div className="w-2 h-2 bg-st-green rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-st-green rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

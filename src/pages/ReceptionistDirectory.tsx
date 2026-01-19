import { useState, useMemo } from 'react';
import { useContacts } from '../context/ContactContext';
import { useNavigate } from 'react-router-dom';
import {
    HiMagnifyingGlass,
    HiLockClosed,
    HiPhone,
    HiEnvelope,
    HiMapPin,
    HiTableCells,
    HiSquares2X2,
    HiUser,
    HiBuildingOffice2,
    HiInboxArrowDown
} from 'react-icons/hi2';

type ViewMode = 'list' | 'card';

export default function ReceptionistDirectory() {
    const {
        contacts,
        departments,
        loading,
    } = useContacts();

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('list');

    const filteredContacts = useMemo(() => {
        if (!searchQuery) return contacts;
        const query = searchQuery.toLowerCase().trim();

        // Helper: check if any word in the text starts with the query
        const startsWithQuery = (text: string) => {
            const words = text.toLowerCase().split(/\s+/);
            return words.some(word => word.startsWith(query));
        };

        // Helper: check if a number/extension starts with the query
        const numberStartsWith = (text: string) => {
            return text.toLowerCase().startsWith(query);
        };

        return contacts.filter(c =>
            startsWithQuery(c.fullName) ||
            numberStartsWith(c.extension) ||
            startsWithQuery(c.email.split('@')[0]) || // Check email username
            startsWithQuery(c.location) ||
            (c.position && startsWithQuery(c.position))
        );
    }, [contacts, searchQuery]);

    const getDepartmentName = (deptId: string) => {
        const dept = departments.find(d => d.id === deptId);
        return dept?.name || 'Sin departamento';
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header Compacto - Barra de búsqueda arriba del todo */}
            <header className="bg-st-green sticky top-0 z-30 shadow-md">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="grid grid-cols-3 items-center">
                        {/* 1. Logo (Izquierda) */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                <span className="text-white font-bold text-lg">ST</span>
                            </div>
                            <span className="text-white font-bold text-lg hidden sm:block truncate">Santo Tomás</span>
                        </div>

                        {/* 2. Barra de Búsqueda Centrada Exactamente */}
                        <div className="relative group">
                            <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-st-green transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar contacto..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2 bg-white rounded-xl text-gray-900 placeholder-gray-400 shadow-soft focus:shadow-hover focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium text-sm"
                            />
                        </div>

                        {/* 3. Acciones (Derecha) */}
                        <div className="flex items-center justify-end gap-2">
                            {/* View Toggle - Desktop */}
                            <div className="hidden md:flex bg-white/10 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'list'
                                        ? 'bg-white text-st-green shadow-sm'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    <HiTableCells className="w-4 h-4" />
                                    <span className="hidden lg:inline">Lista</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('card')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'card'
                                        ? 'bg-white text-st-green shadow-sm'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    <HiSquares2X2 className="w-4 h-4" />
                                    <span className="hidden lg:inline">Tarjetas</span>
                                </button>
                            </div>

                            <button
                                onClick={() => navigate('/admin')}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-all"
                            >
                                <HiLockClosed className="w-4 h-4" />
                                <span className="hidden sm:inline text-xs font-medium">Admin</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile View Toggle */}
            <div className="sm:hidden max-w-7xl mx-auto px-4 mb-4">
                <div className="flex glass rounded-xl p-1.5 shadow-soft">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'list'
                            ? 'bg-st-green text-white shadow-md'
                            : 'text-gray-600 hover:text-st-green'
                            }`}
                    >
                        <HiTableCells className="w-4 h-4" />
                        Lista
                    </button>
                    <button
                        onClick={() => setViewMode('card')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'card'
                            ? 'bg-st-green text-white shadow-md'
                            : 'text-gray-600 hover:text-st-green'
                            }`}
                    >
                        <HiSquares2X2 className="w-4 h-4" />
                        Tarjetas
                    </button>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 flex-1">
                {searchQuery && (
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Buscando: <span className="font-medium text-gray-900">"{searchQuery}"</span>
                        </span>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="text-sm text-st-green hover:text-st-green-dark font-medium transition-colors"
                        >
                            Limpiar
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 glass rounded-2xl shadow-soft">
                        <div className="w-12 h-12 border-4 border-st-green/20 border-t-st-green rounded-full animate-spin mb-4" />
                        <p className="text-gray-500">Cargando directorio...</p>
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 glass rounded-2xl shadow-soft text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <HiInboxArrowDown className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron contactos</h3>
                        <p className="text-gray-500 max-w-md">
                            {searchQuery
                                ? `No hay resultados para "${searchQuery}".`
                                : 'Aún no hay contactos en el directorio.'}
                        </p>
                    </div>
                ) : viewMode === 'list' ? (
                    /* Table View */
                    <div className="glass rounded-2xl shadow-soft overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200/50">
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Anexo</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Correo</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ubicación</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Departamento</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {filteredContacts.map(contact => (
                                        <tr
                                            key={contact.id}
                                            className="hover:bg-st-green/5 transition-colors duration-200 group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-st-green/10 rounded-full flex items-center justify-center text-st-green group-hover:bg-st-green group-hover:text-white transition-colors duration-200">
                                                        <HiUser className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 group-hover:text-st-green transition-colors">{contact.fullName}</p>
                                                        <p className="text-sm text-gray-500">{contact.position || 'Sin cargo'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center gap-1.5 font-mono font-bold text-st-green bg-st-green/10 px-4 py-2 rounded-xl text-sm">
                                                    <HiPhone className="w-4 h-4" />
                                                    {contact.extension}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 hidden md:table-cell">
                                                <a
                                                    href={`mailto:${contact.email}`}
                                                    className="inline-flex items-center gap-2 text-gray-600 hover:text-st-green transition-colors"
                                                >
                                                    <HiEnvelope className="w-4 h-4 text-gray-400" />
                                                    <span className="truncate max-w-[180px]">{contact.email}</span>
                                                </a>
                                            </td>
                                            <td className="px-6 py-5 hidden lg:table-cell">
                                                <span className="inline-flex items-center gap-2 text-gray-600">
                                                    <HiMapPin className="w-4 h-4 text-gray-400" />
                                                    <span className="truncate max-w-[140px]">{contact.location}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 hidden xl:table-cell">
                                                <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                                                    <HiBuildingOffice2 className="w-4 h-4 text-gray-400" />
                                                    <span className="truncate max-w-[140px]">{getDepartmentName(contact.departmentId)}</span>
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Card View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredContacts.map(contact => (
                            <div
                                key={contact.id}
                                className="glass rounded-2xl p-6 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-14 h-14 bg-st-green/10 rounded-2xl flex items-center justify-center text-st-green group-hover:bg-st-green group-hover:text-white transition-all duration-300 shrink-0">
                                        <HiUser className="w-7 h-7" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900 group-hover:text-st-green transition-colors truncate">{contact.fullName}</h3>
                                        <p className="text-sm text-gray-500 truncate">{contact.position || 'Sin cargo'}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-st-green/5 rounded-xl">
                                        <HiPhone className="w-5 h-5 text-st-green" />
                                        <span className="font-mono font-bold text-st-green text-lg">{contact.extension}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <HiEnvelope className="w-4 h-4 text-gray-400 shrink-0" />
                                        <a href={`mailto:${contact.email}`} className="text-gray-600 hover:text-st-green truncate transition-colors">
                                            {contact.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <HiMapPin className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="text-gray-600 truncate">{contact.location}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                                    <HiBuildingOffice2 className="w-4 h-4 text-st-gold" />
                                    <span className="text-xs text-gray-500 truncate">{getDepartmentName(contact.departmentId)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm text-gray-400">
                        Santo Tomás · Directorio Digital
                    </p>
                </div>
            </footer>
        </div>
    );
}

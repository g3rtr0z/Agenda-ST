import { useState, useMemo } from 'react';
import { useContacts } from '../context/ContactContext';
import { useNavigate } from 'react-router-dom';
import {
    HiUser,
    HiClipboardDocumentList,
    HiFolderOpen,
    HiEnvelope,
    HiPhone,
    HiDevicePhoneMobile,
    HiMapPin,
    HiClock,
    HiBuildingOffice2,
    HiInboxArrowDown,
    HiMagnifyingGlass,
    HiLockClosed
} from 'react-icons/hi2';

export default function Directory() {
    const {
        contacts,
        departments,
        selectedDepartment,
        setSelectedDepartment,
        loading,
    } = useContacts();

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredContacts = useMemo(() => {
        let filtered = contacts;
        if (selectedDepartment) {
            filtered = filtered.filter(c => c.departmentId === selectedDepartment.id);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                c =>
                    c.fullName.toLowerCase().includes(query) ||
                    c.email.toLowerCase().includes(query) ||
                    c.location.toLowerCase().includes(query) ||
                    (c.position && c.position.toLowerCase().includes(query))
            );
        }
        return filtered;
    }, [contacts, selectedDepartment, searchQuery]);

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Header Global - Barra de búsqueda arriba del todo */}
            <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 z-30 shadow-sm">
                <span className="font-bold tracking-wide text-sm uppercase text-st-green whitespace-nowrap">Santo Tomás</span>
                <div className="flex-1 max-w-md relative group">
                    <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-st-green transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar contacto..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-gray-100 border-none rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-st-green/20 focus:bg-white transition-all outline-none"
                    />
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm z-20">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-0.5">Departamentos</h2>
                        <p className="text-gray-500 text-xs">Filtra por área</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                        <button
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${!selectedDepartment
                                ? 'bg-st-green text-white shadow-md shadow-st-green/20'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-st-green'
                                }`}
                            onClick={() => setSelectedDepartment(null)}
                        >
                            <span className="flex items-center gap-3">
                                <HiClipboardDocumentList className={`w-5 h-5 ${!selectedDepartment ? 'text-white' : 'text-gray-400 group-hover:text-st-green'}`} />
                                <span className="font-medium">Todos</span>
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${!selectedDepartment ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-st-green/10 group-hover:text-st-green'}`}>
                                {contacts.length}
                            </span>
                        </button>

                        {departments.map(dept => (
                            <div key={dept.id} className="group/item relative flex items-center">
                                <button
                                    className={`flex-1 flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${selectedDepartment?.id === dept.id
                                        ? 'bg-st-green text-white shadow-md shadow-st-green/20'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-st-green'
                                        }`}
                                    onClick={() => setSelectedDepartment(dept)}
                                >
                                    <span className="flex items-center gap-3">
                                        <HiFolderOpen className={`w-5 h-5 ${selectedDepartment?.id === dept.id ? 'text-white' : 'text-gray-400 group-hover:text-st-green'}`} />
                                        <span className="font-medium truncate max-w-[140px]" title={dept.name}>{dept.name}</span>
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${selectedDepartment?.id === dept.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-st-green/10 group-hover:text-st-green'}`}>
                                        {contacts.filter(c => c.departmentId === dept.id).length}
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-st-green hover:bg-st-green/10 transition-all duration-200 border border-st-green/20"
                        >
                            <HiClipboardDocumentList className="w-5 h-5" />
                            <span className="font-medium text-sm">Vista Lista</span>
                        </button>
                        <button
                            onClick={() => navigate('/admin')}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white hover:shadow-sm transition-all duration-200"
                        >
                            <HiLockClosed className="w-5 h-5" />
                            <span className="font-medium text-sm">Acceso Administrativo</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50 relative">

                    {/* Contacts Grid */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="mb-6 flex items-baseline justify-between">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {selectedDepartment ? selectedDepartment.name : 'Todos los Contactos'}
                            </h1>
                            <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                                {filteredContacts.length} {filteredContacts.length === 1 ? 'resultado' : 'resultados'}
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-st-green mb-4"></div>
                                <p>Cargando directorio...</p>
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-96 text-center">
                                <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                                    <HiInboxArrowDown className="w-16 h-16 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron contactos</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    {searchQuery
                                        ? `No hay resultados para "${searchQuery}". Intenta con otros términos.`
                                        : 'Aún no hay contactos en este departamento.'}
                                </p>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-6 text-st-green font-medium hover:underline"
                                    >
                                        Limpiar búsqueda
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-10">
                                {filteredContacts.map(contact => {
                                    const dept = departments.find(d => d.id === contact.departmentId);
                                    return (
                                        <div
                                            key={contact.id}
                                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-1 h-full bg-st-green opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 bg-gray-50 rounded-xl text-st-green-lighter group-hover:bg-st-green group-hover:text-white transition-colors duration-300 relative group/icon">
                                                    <HiUser className="w-6 h-6" />
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-st-green transition-colors">
                                                {contact.fullName}
                                            </h3>
                                            <p className="text-gray-500 text-sm mb-4 font-medium min-h-[1.25rem]">
                                                {contact.position || 'Sin cargo definido'}
                                            </p>

                                            <div className="space-y-2.5">
                                                <div className="flex items-center gap-3 text-sm text-gray-600 group/link">
                                                    <HiPhone className="w-4 h-4 text-gray-400 group-hover/link:text-st-green transition-colors" />
                                                    <span className="font-mono font-medium text-gray-900 bg-gray-50 px-1.5 rounded">{contact.extension}</span>
                                                </div>

                                                <div className="flex items-center gap-3 text-sm text-gray-600 group/link">
                                                    <HiEnvelope className="w-4 h-4 text-gray-400 group-hover/link:text-st-green transition-colors" />
                                                    <a href={`mailto:${contact.email}`} className="truncate hover:text-st-green transition-colors" title={contact.email}>
                                                        {contact.email}
                                                    </a>
                                                </div>

                                                {(contact.phone || contact.location || contact.schedule || (!selectedDepartment && dept)) && (
                                                    <div className="pt-3 mt-3 border-t border-gray-50 flex flex-wrap gap-y-2 gap-x-4">
                                                        {contact.phone && (
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <HiDevicePhoneMobile className="w-3.5 h-3.5" />
                                                                <span>{contact.phone}</span>
                                                            </div>
                                                        )}
                                                        {contact.location && (
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <HiMapPin className="w-3.5 h-3.5" />
                                                                <span className="truncate max-w-[120px]" title={contact.location}>{contact.location}</span>
                                                            </div>
                                                        )}
                                                        {contact.schedule && (
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <HiClock className="w-3.5 h-3.5" />
                                                                <span className="truncate max-w-[120px]" title={contact.schedule}>{contact.schedule}</span>
                                                            </div>
                                                        )}
                                                        {(!selectedDepartment && dept) && (
                                                            <div className="flex items-center gap-2 text-xs text-st-green font-medium">
                                                                <HiBuildingOffice2 className="w-3.5 h-3.5" />
                                                                <span className="truncate max-w-[120px]" title={dept.name}>{dept.name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}


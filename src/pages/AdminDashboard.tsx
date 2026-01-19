import { useState, useMemo } from 'react';
import { useContacts } from '../context/ContactContext';
import { departmentService, contactService } from '../services/firebaseService';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import type { ContactFormData, DepartmentFormData } from '../types';
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
    HiPencil,
    HiTrash,
    HiPlus,
    HiInboxArrowDown,
    HiMagnifyingGlass,
    HiArrowRightOnRectangle
} from 'react-icons/hi2';

export default function AdminDashboard() {
    const {
        contacts,
        departments,
        selectedDepartment,
        setSelectedDepartment,
        loading,
    } = useContacts();

    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'management' | 'directory'>('management');

    // Shared State
    const [searchQuery, setSearchQuery] = useState('');
    const [showContactModal, setShowContactModal] = useState(false);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);

    // Contact Management State
    const [editingContact, setEditingContact] = useState<string | null>(null);
    const [contactForm, setContactForm] = useState<ContactFormData>({
        fullName: '',
        email: '',
        extension: '',
        location: '',
        departmentId: '',
        position: '',
        phone: '',
        schedule: '',
    });

    // Department Management State
    const [departmentForm, setDepartmentForm] = useState<DepartmentFormData>({
        name: '',
    });
    const [editingDepartment, setEditingDepartment] = useState<string | null>(null);

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

    const handleAddContact = () => {
        setEditingContact(null);
        setContactForm({
            fullName: '',
            email: '',
            extension: '',
            location: '',
            departmentId: selectedDepartment?.id || '',
            position: '',
            phone: '',
            schedule: '',
        });
        setShowContactModal(true);
    };

    const handleEditContact = (contactId: string) => {
        const contact = contacts.find(c => c.id === contactId);
        if (contact) {
            setEditingContact(contactId);
            setContactForm({
                fullName: contact.fullName,
                email: contact.email,
                extension: contact.extension,
                location: contact.location,
                departmentId: contact.departmentId,
                position: contact.position || '',
                phone: contact.phone || '',
                schedule: contact.schedule || '',
            });
            setShowContactModal(true);
        }
    };

    const handleSaveContact = async () => {
        try {
            if (editingContact) {
                await contactService.update(editingContact, contactForm);
            } else {
                await contactService.create(contactForm);
            }
            setShowContactModal(false);
            // Optionally switch to directory to see the new contact? 
            // setActiveTab('directory');
        } catch (error) {
            console.error('Error guardando contacto:', error);
            alert('Error al guardar el contacto');
        }
    };

    const handleDeleteContact = async (contactId: string) => {
        if (!confirm('¿Estás seguro de eliminar este contacto?')) return;
        try {
            await contactService.delete(contactId);
        } catch (error) {
            console.error('Error eliminando contacto:', error);
            alert('Error al eliminar el contacto');
        }
    };

    const handleEditDepartment = (deptId: string) => {
        const dept = departments.find(d => d.id === deptId);
        if (dept) {
            setEditingDepartment(dept.id);
            setDepartmentForm({ name: dept.name });
            setShowDepartmentModal(true);
        }
    };

    const handleSaveDepartment = async () => {
        try {
            if (editingDepartment) {
                await departmentService.update(editingDepartment, departmentForm);
            } else {
                await departmentService.create(departmentForm);
            }
            setShowDepartmentModal(false);
            setDepartmentForm({ name: '' });
            setEditingDepartment(null);
        } catch (error) {
            console.error('Error guardando departamento:', error);
            alert('Error al guardar el departamento');
        }
    };

    const handleDeleteDepartment = async (deptId: string) => {
        const hasContacts = contacts.some(c => c.departmentId === deptId);
        if (hasContacts) {
            alert('No se puede eliminar un departamento con contactos asociados.');
            return;
        }
        if (!confirm('¿Estás seguro de eliminar este departamento?')) return;
        try {
            await departmentService.delete(deptId);
            if (selectedDepartment?.id === deptId) {
                setSelectedDepartment(null);
            }
        } catch (error) {
            console.error('Error eliminando departamento:', error);
            alert('Error al eliminar el departamento');
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 z-30">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 text-lg">Panel de Administración</span>
                    </div>

                    <nav className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('management')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'management'
                                ? 'bg-white text-st-green shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Gestión General
                        </button>
                        <button
                            onClick={() => setActiveTab('directory')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'directory'
                                ? 'bg-white text-st-green shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Ver Directorio
                        </button>
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                    <HiArrowRightOnRectangle className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                </button>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">

                {/* MANAGEMENT TAB */}
                {activeTab === 'management' && (
                    <div className="h-full overflow-y-auto p-8 max-w-5xl mx-auto w-full animate-fadeIn">

                        {/* Quick Actions Card */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="bg-gradient-to-br from-st-green to-st-green-light text-white p-8 rounded-2xl shadow-lg shadow-st-green/20 relative overflow-hidden group hover:scale-[1.01] transition-transform">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <HiUser className="w-32 h-32" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Nuevo Contacto</h3>
                                <p className="text-st-green-lighter mb-6 opacity-90">Agrega un nuevo funcionario al directorio.</p>
                                <Button
                                    variant="secondary" // White button on green bg
                                    onClick={handleAddContact}
                                    className="w-fit shadow-md !text-st-green !bg-white hover:!bg-white/90"
                                >
                                    <HiPlus className="w-5 h-5" />
                                    Agregar Contacto
                                </Button>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-st-green/30 transition-colors">
                                <div className="absolute top-0 right-0 p-8 text-gray-50 opacity-10 group-hover:text-st-green/10 transition-colors">
                                    <HiBuildingOffice2 className="w-32 h-32" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Nuevo Departamento</h3>
                                <p className="text-gray-500 mb-6">Crea una nueva unidad o departamento.</p>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        setEditingDepartment(null);
                                        setDepartmentForm({ name: '' });
                                        setShowDepartmentModal(true);
                                    }}
                                    className="w-fit"
                                >
                                    <HiPlus className="w-5 h-5" />
                                    Crear Departamento
                                </Button>
                            </div>
                        </div>

                        {/* Departments Management List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Departamentos y Unidades</h3>
                                    <p className="text-sm text-gray-500">Gestiona los nombres y existencia de las unidades.</p>
                                </div>
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                                    {departments.length} Unidades
                                </span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {departments.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">No hay departamentos creados.</div>
                                ) : (
                                    departments.map(dept => {
                                        const deptContacts = contacts.filter(c => c.departmentId === dept.id).length;
                                        return (
                                            <div key={dept.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-gray-100 rounded-lg text-gray-400 group-hover:text-st-green group-hover:bg-st-green/10 transition-colors">
                                                        <HiFolderOpen className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{dept.name}</p>
                                                        <p className="text-xs text-gray-500">{deptContacts} {deptContacts === 1 ? 'contacto' : 'contactos'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEditDepartment(dept.id)}
                                                        className="p-2 text-gray-400 hover:text-st-green hover:bg-st-green/10 rounded-lg transition-colors"
                                                        title="Editar nombre"
                                                    >
                                                        <HiPencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteDepartment(dept.id)}
                                                        className={`p-2 rounded-lg transition-colors ${deptContacts > 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                                                        title={deptContacts > 0 ? "No puedes eliminar departamentos con contactos" : "Eliminar"}
                                                        disabled={deptContacts > 0}
                                                    >
                                                        <HiTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}


                {/* DIRECTORY TAB */}
                {activeTab === 'directory' && (
                    <div className="flex h-full animate-fadeIn">
                        {/* Sidebar */}
                        <aside className="w-80 bg-white border-r border-gray-100 flex flex-col shadow-sm z-20">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                                <p className="text-gray-500 text-xs">Selecciona un departamento</p>
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
                                                <span className="font-medium truncate max-w-[170px]" title={dept.name}>{dept.name}</span>
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${selectedDepartment?.id === dept.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-st-green/10 group-hover:text-st-green'}`}>
                                                {contacts.filter(c => c.departmentId === dept.id).length}
                                            </span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </aside>

                        {/* Main Grid content */}
                        <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50">
                            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                                <div className="flex-1 max-w-2xl">
                                    <div className="relative group">
                                        <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-st-green transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Buscar en el directorio..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-2.5 bg-gray-100 border-none rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-st-green/20 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </header>

                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="mb-6 flex items-baseline justify-between">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {selectedDepartment ? selectedDepartment.name : 'Todos los Contactos'}
                                    </h1>
                                    <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                                        {filteredContacts.length} resultados
                                    </span>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-st-green mb-4"></div>
                                        <p>Cargando...</p>
                                    </div>
                                ) : filteredContacts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-96 text-center">
                                        <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                                            <HiInboxArrowDown className="w-16 h-16 text-gray-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron contactos</h3>
                                        <p className="text-gray-500">Intenta con otra búsqueda o selecciona otro departamento.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-10">
                                        {filteredContacts.map(contact => {
                                            const dept = departments.find(d => d.id === contact.departmentId);
                                            return (
                                                <div
                                                    key={contact.id}
                                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-st-green opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="p-2 bg-gray-50 rounded-xl text-st-green-lighter group-hover:bg-st-green group-hover:text-white transition-colors duration-300 relative group/icon">
                                                            <HiUser className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            <button
                                                                className="p-1.5 text-gray-400 hover:text-st-green hover:bg-st-green/10 rounded-lg transition-colors"
                                                                onClick={() => handleEditContact(contact.id)}
                                                                title="Editar"
                                                            >
                                                                <HiPencil className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                onClick={() => handleDeleteContact(contact.id)}
                                                                title="Eliminar"
                                                            >
                                                                <HiTrash className="w-4 h-4" />
                                                            </button>
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
                        </div>
                    </div>
                )}
            </div>

            {/* Contact Modal (Shared) */}
            <Modal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
                title={editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowContactModal(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSaveContact}
                            disabled={!contactForm.fullName || !contactForm.email}
                        >
                            Guardar
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col gap-4">
                    <Input
                        label="Nombre Completo *"
                        value={contactForm.fullName}
                        onChange={e => setContactForm({ ...contactForm, fullName: e.target.value })}
                        placeholder="Juan Pérez"
                        required
                    />

                    <Input
                        label="Correo Institucional *"
                        type="email"
                        value={contactForm.email}
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="jperez@santotomas.cl"
                        required
                    />

                    <Input
                        label="Anexo *"
                        value={contactForm.extension}
                        onChange={e => setContactForm({ ...contactForm, extension: e.target.value })}
                        placeholder="1234"
                        required
                    />

                    <Input
                        label="Ubicación *"
                        value={contactForm.location}
                        onChange={e => setContactForm({ ...contactForm, location: e.target.value })}
                        placeholder="Edificio A, Oficina 201"
                        required
                    />

                    <Select
                        label="Departamento *"
                        value={contactForm.departmentId}
                        onChange={e => setContactForm({ ...contactForm, departmentId: e.target.value })}
                        options={[
                            { value: '', label: 'Seleccionar departamento' },
                            ...departments.map(d => ({ value: d.id, label: d.name })),
                        ]}
                        required
                    />

                    <Input
                        label="Cargo"
                        value={contactForm.position || ''}
                        onChange={e => setContactForm({ ...contactForm, position: e.target.value })}
                        placeholder="Director"
                    />

                    <Input
                        label="Teléfono Directo"
                        type="tel"
                        value={contactForm.phone || ''}
                        onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+56 9 1234 5678"
                    />

                    <Input
                        label="Horario de Atención"
                        value={contactForm.schedule || ''}
                        onChange={e => setContactForm({ ...contactForm, schedule: e.target.value })}
                        placeholder="Lunes a Viernes, 9:00 - 18:00"
                    />
                </div>
            </Modal>

            {/* Department Modal (Shared) */}
            <Modal
                isOpen={showDepartmentModal}
                onClose={() => setShowDepartmentModal(false)}
                title={editingDepartment ? 'Editar Departamento' : 'Nuevo Departamento'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowDepartmentModal(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSaveDepartment}
                            disabled={!departmentForm.name}
                        >
                            {editingDepartment ? 'Guardar Cambios' : 'Crear'}
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col gap-4">
                    <Input
                        label="Nombre del Departamento *"
                        value={departmentForm.name}
                        onChange={e => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                        placeholder="Rectoría"
                        required
                    />
                </div>
            </Modal>
        </div>
    );
}

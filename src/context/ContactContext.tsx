// Global State Management with Context API
// Manages contacts and departments

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Contact, Department } from '../types';
import { contactService, departmentService } from '../services/firebaseService';

interface ContactContextType {
    // State
    contacts: Contact[];
    departments: Department[];
    selectedDepartment: Department | null;
    loading: boolean;
    error: string | null;

    // Actions
    setSelectedDepartment: (department: Department | null) => void;
    refreshData: () => Promise<void>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: ReactNode }) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to real-time updates
    useEffect(() => {
        setLoading(true);
        setError(null);

        let deptsLoaded = false;
        let contactsLoaded = false;

        const checkLoading = () => {
            if (deptsLoaded && contactsLoaded) {
                setLoading(false);
            }
        };

        // Subscribe to departments
        const unsubscribeDepartments = departmentService.subscribe(
            (newDepartments) => {
                setDepartments(newDepartments);
                deptsLoaded = true;
                checkLoading();
            },
            (err) => {
                console.error("Error loading departments:", err);
                setError("No se pudieron cargar los departamentos. Verifique su conexión.");
                deptsLoaded = true;
                checkLoading();
            }
        );

        // Subscribe to contacts
        const unsubscribeContacts = contactService.subscribe(
            (newContacts) => {
                setContacts(newContacts);
                contactsLoaded = true;
                checkLoading();
            },
            (err) => {
                console.error("Error loading contacts:", err);
                // Don't overwrite error if one already exists implies multiple failures
                setError(prev => prev || "No se pudieron cargar los contactos. Verifique su conexión.");
                contactsLoaded = true;
                checkLoading();
            }
        );

        return () => {
            unsubscribeDepartments();
            unsubscribeContacts();
        };
    }, []);

    const refreshData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [newDepartments, newContacts] = await Promise.all([
                departmentService.getAll(),
                contactService.getAll(),
            ]);

            setDepartments(newDepartments);
            setContacts(newContacts);
        } catch (err) {
            setError('Error al cargar los datos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const value: ContactContextType = {
        contacts,
        departments,
        selectedDepartment,
        loading,
        error,
        setSelectedDepartment,
        refreshData,
    };

    return (
        <ContactContext.Provider value={value}>
            {children}
        </ContactContext.Provider>
    );
}

export function useContacts() {
    const context = useContext(ContactContext);
    if (!context) {
        throw new Error('useContacts must be used within ContactProvider');
    }
    return context;
}

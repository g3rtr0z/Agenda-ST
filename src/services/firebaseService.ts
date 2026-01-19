// Firebase Firestore Services
// CRUD operations for contacts and departments

import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Contact, Department, ContactFormData, DepartmentFormData } from '../types';

// ============================================
// Department Services
// ============================================

export const departmentService = {
    // Create a new department
    async create(data: DepartmentFormData): Promise<string> {
        const docRef = await addDoc(collection(db, 'departments'), {
            ...data,
            createdAt: Date.now(),
        });
        return docRef.id;
    },

    // Get all departments
    async getAll(): Promise<Department[]> {
        const q = query(collection(db, 'departments'), orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Department[];
    },

    // Update a department
    async update(id: string, data: Partial<DepartmentFormData>): Promise<void> {
        const docRef = doc(db, 'departments', id);
        await updateDoc(docRef, data);
    },

    // Delete a department
    async delete(id: string): Promise<void> {
        const docRef = doc(db, 'departments', id);
        await deleteDoc(docRef);
    },

    // Subscribe to departments changes in real-time
    subscribe(callback: (departments: Department[]) => void, onError?: (error: Error) => void) {
        const q = query(
            collection(db, 'departments'),
            orderBy('name', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const departments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Department[];
            callback(departments);
        }, onError);
    },
};

// ============================================
// Contact Services
// ============================================

export const contactService = {
    // Create a new contact
    async create(data: ContactFormData): Promise<string> {
        const docRef = await addDoc(collection(db, 'contacts'), {
            ...data,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return docRef.id;
    },

    // Get all contacts for a department
    async getByDepartment(departmentId: string): Promise<Contact[]> {
        const q = query(
            collection(db, 'contacts'),
            where('departmentId', '==', departmentId),
            orderBy('fullName', 'asc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Contact[];
    },

    // Get all contacts
    async getAll(): Promise<Contact[]> {
        const q = query(collection(db, 'contacts'), orderBy('fullName', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Contact[];
    },

    // Update a contact
    async update(id: string, data: Partial<ContactFormData>): Promise<void> {
        const docRef = doc(db, 'contacts', id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: Date.now(),
        });
    },

    // Delete a contact
    async delete(id: string): Promise<void> {
        const docRef = doc(db, 'contacts', id);
        await deleteDoc(docRef);
    },

    // Subscribe to contacts changes in real-time
    subscribe(callback: (contacts: Contact[]) => void, onError?: (error: Error) => void) {
        const q = query(
            collection(db, 'contacts'),
            orderBy('fullName', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const contacts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Contact[];
            callback(contacts);
        }, onError);
    },

    // Subscribe to department contacts in real-time
    subscribeByDepartment(departmentId: string, callback: (contacts: Contact[]) => void) {
        const q = query(
            collection(db, 'contacts'),
            where('departmentId', '==', departmentId),
            orderBy('fullName', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const contacts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Contact[];
            callback(contacts);
        });
    },
};

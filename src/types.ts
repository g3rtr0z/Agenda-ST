// ============================================
// Type Definitions for Santo Tomás Agenda
// ============================================

export interface Department {
  id: string;
  name: string;
  createdAt: number;
}

export interface Contact {
  id: string;
  fullName: string;
  email: string;
  extension: string;
  location: string;
  departmentId: string;
  position?: string;
  phone?: string;
  schedule?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  extension: string;
  location: string;
  departmentId: string;
  position?: string;
  phone?: string;
  schedule?: string;
}

export interface DepartmentFormData {
  name: string;
}

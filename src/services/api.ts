// Mock API service for backend communication

export interface PatientSubmissionData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  phone: string;
  emergencyContact: string;
  chiefComplaint: string;
  selectedSymptoms: string[];
  vitals: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    respiratoryRate: string;
    oxygenSaturation: string;
    painLevel: string;
  };
}

export interface PatientResponse {
  id: string;
  severityScore: number;
  priority: 'Critical' | 'Urgent' | 'Non-Urgent';
  estimatedWaitTime: string;
  triageNotes?: string;
}

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse';
  department: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface Bed {
  id: string;
  number: string;
  type: 'icu' | 'emergency' | 'general' | 'isolation';
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  patientId?: string;
  patientName?: string;
  assignedAt?: string;
  estimatedDischarge?: string;
  location: string;
}

class ApiService {
  private baseUrl = 'https://api.hospital-system.com'; // Dummy endpoint

  // Simulate network delay
  private async simulateDelay(ms: number = 1000) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  // Patient API
  async submitPatient(patientData: PatientSubmissionData): Promise<PatientResponse> {
    await this.simulateDelay(1500);
    
    // Mock severity calculation from backend
    const mockSeverityScore = Math.floor(Math.random() * 100) + 20;
    let priority: 'Critical' | 'Urgent' | 'Non-Urgent';
    let estimatedWaitTime: string;
    
    if (mockSeverityScore >= 70) {
      priority = 'Critical';
      estimatedWaitTime = 'Immediate';
    } else if (mockSeverityScore >= 40) {
      priority = 'Urgent';
      estimatedWaitTime = '< 30 minutes';
    } else {
      priority = 'Non-Urgent';
      estimatedWaitTime = '< 2 hours';
    }

    return {
      id: `patient_${Date.now()}`,
      severityScore: mockSeverityScore,
      priority,
      estimatedWaitTime,
      triageNotes: 'Automated triage assessment completed successfully.'
    };
  }

  // Staff Management API
  async getStaff(): Promise<StaffMember[]> {
    await this.simulateDelay();
    
    // Mock staff data
    return [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@hospital.com',
        role: 'doctor',
        department: 'Emergency',
        phone: '+1 (555) 123-4567',
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z',
        lastLogin: '2024-01-20T14:22:00Z'
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@hospital.com',
        role: 'nurse',
        department: 'Emergency',
        phone: '+1 (555) 234-5678',
        status: 'active',
        createdAt: '2024-01-10T09:15:00Z',
        lastLogin: '2024-01-20T13:45:00Z'
      },
      {
        id: '3',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@hospital.com',
        role: 'admin',
        department: 'Administration',
        phone: '+1 (555) 345-6789',
        status: 'active',
        createdAt: '2024-01-05T08:00:00Z',
        lastLogin: '2024-01-20T15:10:00Z'
      }
    ];
  }

  async createStaffMember(staffData: Omit<StaffMember, 'id' | 'createdAt'>): Promise<StaffMember> {
    await this.simulateDelay();
    
    return {
      ...staffData,
      id: `staff_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  }

  async updateStaffMember(id: string, staffData: Partial<StaffMember>): Promise<StaffMember> {
    await this.simulateDelay();
    
    const staff = await this.getStaff();
    const existing = staff.find(s => s.id === id);
    if (!existing) throw new Error('Staff member not found');
    
    return { ...existing, ...staffData };
  }

  async deleteStaffMember(id: string): Promise<void> {
    await this.simulateDelay();
    // Mock deletion
  }

  // Bed Management API
  async getBeds(): Promise<Bed[]> {
    await this.simulateDelay();
    
    return [
      {
        id: '1',
        number: 'ER-001',
        type: 'emergency',
        status: 'occupied',
        patientId: 'patient_123',
        patientName: 'Sarah Johnson',
        assignedAt: '2024-01-20T10:30:00Z',
        estimatedDischarge: '2024-01-20T18:00:00Z',
        location: 'Emergency Ward - Room 1'
      },
      {
        id: '2',
        number: 'ER-002',
        type: 'emergency',
        status: 'available',
        location: 'Emergency Ward - Room 2'
      },
      {
        id: '3',
        number: 'ICU-001',
        type: 'icu',
        status: 'occupied',
        patientId: 'patient_456',
        patientName: 'Michael Chen',
        assignedAt: '2024-01-19T14:15:00Z',
        location: 'ICU - Room 1'
      },
      {
        id: '4',
        number: 'ICU-002',
        type: 'icu',
        status: 'maintenance',
        location: 'ICU - Room 2'
      },
      {
        id: '5',
        number: 'GEN-001',
        type: 'general',
        status: 'available',
        location: 'General Ward - Room 1'
      }
    ];
  }

  async updateBedStatus(id: string, status: Bed['status'], patientData?: { patientId: string; patientName: string }): Promise<Bed> {
    await this.simulateDelay();
    
    const beds = await this.getBeds();
    const bed = beds.find(b => b.id === id);
    if (!bed) throw new Error('Bed not found');
    
    return {
      ...bed,
      status,
      ...(patientData && {
        patientId: patientData.patientId,
        patientName: patientData.patientName,
        assignedAt: new Date().toISOString()
      })
    };
  }
}

export const apiService = new ApiService();
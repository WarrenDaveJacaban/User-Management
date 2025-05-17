// frontend/src/app/_models/workflow.ts
export class Workflow {
    id?: number;
    type: 'Onboarding' | 'Department Transfer' | 'Request' | 'Other';
    status: 'Pending' | 'In Progress' | 'Approved' | 'Rejected' | 'Completed';
    description?: string;
    employeeId?: number;
    requestId?: number;
    assignedTo?: number;
    completedBy?: number;
    completedAt?: Date;
    created?: Date;
    updated?: Date;
    
    // Related data
    employeeName?: string;
    departmentName?: string;
    assignedToName?: string;
    completedByName?: string;
}
// frontend/src/app/_models/request.ts
export class RequestItem {
    id?: number;
    name: string;
    quantity: number;
    description?: string;
}

export class Request {
    id?: number;
    requestNumber?: string;
    type: 'Equipment' | 'Leave' | 'Resource' | 'Other';
    status?: 'Pending' | 'In Progress' | 'Approved' | 'Rejected' | 'Completed';
    title: string;
    description?: string;
    accountId?: number;
    employeeId?: number;
    assignedTo?: number;
    completedBy?: number;
    completedAt?: Date;
    created?: Date;
    updated?: Date;
    
    // Related data
    requestorName?: string;
    requestorEmail?: string;
    departmentName?: string;
    assignedToName?: string;
    completedByName?: string;
    
    // Request items
    items: RequestItem[];
}
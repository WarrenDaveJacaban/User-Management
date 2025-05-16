// frontend/src/app/_models/employee.ts
export class Employee {
    id?: number;
    employeeId: string;
    position: string;
    hireDate: Date;
    status: 'Active' | 'Inactive' | 'On Leave' | 'Terminated';
    departmentId: number;
    accountId: number;
    created?: Date;
    updated?: Date;
    
    // Related data
    accountName?: string;
    accountEmail?: string;
    departmentName?: string;
}
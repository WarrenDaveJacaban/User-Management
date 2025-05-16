// frontend/src/app/_services/employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Employee } from '../_models';

// Fixed API URL construction
const apiBaseUrl = environment.apiUrl.replace('/accounts', '');
const baseUrl = `${apiBaseUrl}/employees`;

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Employee[]> {
        return this.http.get<Employee[]>(baseUrl);
    }

    getById(id: string): Observable<Employee> {
        return this.http.get<Employee>(`${baseUrl}/${id}`);
    }

    create(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(baseUrl, employee);
    }

    update(id: string, employee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${baseUrl}/${id}`, employee);
    }

    delete(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${baseUrl}/${id}`);
    }

    // Added methods for department transfer workflow
    transferDepartment(employeeId: string, newDepartmentId: string, reason: string): Observable<any> {
        return this.http.post<any>(`${baseUrl}/${employeeId}/transfer`, {
            departmentId: newDepartmentId,
            reason: reason
        });
    }
}
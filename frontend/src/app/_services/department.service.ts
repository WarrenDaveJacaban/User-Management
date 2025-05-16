// frontend/src/app/_services/department.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Department } from '../_models';

// Fixed API URL construction
const apiBaseUrl = environment.apiUrl.replace('/accounts', '');
const baseUrl = `${apiBaseUrl}/departments`;

@Injectable({ providedIn: 'root' })
export class DepartmentService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Department[]> {
        return this.http.get<Department[]>(baseUrl);
    }

    getById(id: string): Observable<Department> {
        return this.http.get<Department>(`${baseUrl}/${id}`);
    }

    create(department: Department): Observable<Department> {
        return this.http.post<Department>(baseUrl, department);
    }

    update(id: string, department: Department): Observable<Department> {
        return this.http.put<Department>(`${baseUrl}/${id}`, department);
    }

    delete(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${baseUrl}/${id}`);
    }
}
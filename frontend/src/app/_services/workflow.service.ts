// frontend/src/app/_services/workflow.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Workflow } from '../_models';

const baseUrl = `${environment.apiUrl.replace('/accounts', '')}/workflows`;

@Injectable({ providedIn: 'root' })
export class WorkflowService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Workflow[]> {
        return this.http.get<Workflow[]>(baseUrl);
    }

    getById(id: string): Observable<Workflow> {
        return this.http.get<Workflow>(`${baseUrl}/${id}`);
    }

    getByEmployee(employeeId: string): Observable<Workflow[]> {
        return this.http.get<Workflow[]>(`${baseUrl}/employee/${employeeId}`);
    }

    create(workflow: Workflow): Observable<Workflow> {
        return this.http.post<Workflow>(baseUrl, workflow);
    }

    update(id: string, workflow: Workflow): Observable<Workflow> {
        return this.http.put<Workflow>(`${baseUrl}/${id}`, workflow);
    }

    delete(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${baseUrl}/${id}`);
    }
}
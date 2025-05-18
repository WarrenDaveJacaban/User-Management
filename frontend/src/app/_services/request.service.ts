// frontend/src/app/_services/request.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Request } from '../_models';

const baseUrl = `${environment.apiUrl.replace('/accounts', '')}/requests`;

@Injectable({ providedIn: 'root' })
export class RequestService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Request[]> {
        return this.http.get<Request[]>(baseUrl);
    }
    
    getMyRequests(): Observable<Request[]> {
        return this.http.get<Request[]>(`${baseUrl}/my-requests`);
    }

    getById(id: string): Observable<Request> {
        return this.http.get<Request>(`${baseUrl}/${id}`);
    }

    create(request: Request): Observable<Request> {
        return this.http.post<Request>(baseUrl, request);
    }

    update(id: string, request: Request): Observable<Request> {
        return this.http.put<Request>(`${baseUrl}/${id}`, request);
    }

    delete(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${baseUrl}/${id}`);
    }
}
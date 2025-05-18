// frontend/src/app/requests/list.component.ts
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { RequestService, AlertService } from '../_services';
import { Request } from '../_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    requests: Request[] = [];
    filteredRequests: Request[] = [];
    loading = false;
    error = '';
    searchTerm = '';

    constructor(
        private requestService: RequestService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.loadRequests();
    }

    loadRequests() {
        this.loading = true;
        this.requestService.getAll()
            .pipe(first())
            .subscribe({
                next: requests => {
                    this.requests = requests;
                    this.filteredRequests = requests;
                    this.loading = false;
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }

    deleteRequest(id: number) {
        if (!id) return;
        
        if (confirm('Are you sure you want to delete this request?')) {
            this.loading = true;
            this.requestService.delete(id.toString())
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.alertService.success('Request deleted successfully', { keepAfterRouteChange: true });
                        this.loadRequests();
                    },
                    error: error => {
                        this.alertService.error(error);
                        this.loading = false;
                    }
                });
        }
    }
    
    applyFilter() {
        if (!this.searchTerm) {
            this.filteredRequests = this.requests;
            return;
        }
        
        const term = this.searchTerm.toLowerCase();
        this.filteredRequests = this.requests.filter(request => 
            request.requestNumber?.toLowerCase().includes(term) ||
            request.title.toLowerCase().includes(term) ||
            request.requestorName?.toLowerCase().includes(term) ||
            request.type.toLowerCase().includes(term) ||
            request.status?.toLowerCase().includes(term)
        );
    }
}
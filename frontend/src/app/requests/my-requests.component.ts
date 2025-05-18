// frontend/src/app/requests/my-requests.component.ts
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { RequestService, AlertService } from '../_services';
import { Request } from '../_models';

@Component({ templateUrl: 'my-requests.component.html' })
export class MyRequestsComponent implements OnInit {
    requests: Request[] = [];
    loading = false;
    error = '';

    constructor(
        private requestService: RequestService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.loadMyRequests();
    }

    loadMyRequests() {
        this.loading = true;
        this.requestService.getMyRequests()
            .pipe(first())
            .subscribe({
                next: requests => {
                    this.requests = requests;
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
                        this.loadMyRequests();
                    },
                    error: error => {
                        this.alertService.error(error);
                        this.loading = false;
                    }
                });
        }
    }
}
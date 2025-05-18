// frontend/src/app/requests/details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RequestService, AlertService, AccountService } from '../_services';
import { Request, Account, Role } from '../_models';

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent implements OnInit {
    id: string;
    request: Request;
    loading = false;
    error = '';
    account: Account | null;
    isAdmin = false;
    
    statusForm: FormGroup;
    updatingStatus = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private requestService: RequestService,
        private accountService: AccountService,
        private alertService: AlertService,
        private formBuilder: FormBuilder
    ) {
        // Get the current user
        this.account = this.accountService.accountValue;
        this.isAdmin = this.account?.role === Role.Admin;
    }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        
        // Initialize status form
        this.statusForm = this.formBuilder.group({
            status: ['', Validators.required]
        });
        
        this.loadRequest();
    }

    loadRequest() {
        this.loading = true;
        this.requestService.getById(this.id)
            .pipe(first())
            .subscribe({
                next: request => {
                    this.request = request;
                    this.statusForm.patchValue({
                        status: request.status
                    });
                    this.loading = false;
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }
    
    updateStatus() {
        if (this.statusForm.invalid) {
            return;
        }
        
        this.updatingStatus = true;
        this.requestService.update(this.id, {
            ...this.request,
            status: this.statusForm.value.status
        })
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Request status updated successfully');
                this.loadRequest(); // Reload to get the updated data
                this.updatingStatus = false;
            },
            error: error => {
                this.alertService.error(error);
                this.updatingStatus = false;
            }
        });
    }
    
  get canEdit(): boolean {
        if (!this.request) return false;
        return this.isAdmin ||
               (String(this.request.accountId) === String(this.account?.id) &&
               this.request.status === 'Pending');
    }

    get canDelete(): boolean {
        if (!this.request) return false;
        return this.isAdmin ||
               (String(this.request.accountId) === String(this.account?.id) &&
               this.request.status === 'Pending');
    }
    
    deleteRequest() {
        if (!this.canDelete) return;
        
        if (confirm('Are you sure you want to delete this request?')) {
            this.loading = true;
            this.requestService.delete(this.id)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.alertService.success('Request deleted successfully', { keepAfterRouteChange: true });
                        this.router.navigate(['/requests/my-requests']);
                    },
                    error: error => {
                        this.alertService.error(error);
                        this.loading = false;
                    }
                });
        }
    }
}
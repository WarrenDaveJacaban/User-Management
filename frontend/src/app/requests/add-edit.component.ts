// frontend/src/app/requests/add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';

import { RequestService, AccountService, AlertService } from '../_services';
import { Request, RequestItem } from '../_models';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitting = false;
    request: Request;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private requestService: RequestService,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // Initialize form with empty items array
        this.form = this.formBuilder.group({
            type: ['Equipment', Validators.required],
            title: ['', Validators.required],
            description: [''],
            items: this.formBuilder.array([], Validators.required)
        });
        
        if (!this.isAddMode) {
            this.loading = true;
            this.requestService.getById(this.id)
                .pipe(first())
                .subscribe(request => {
                    this.request = request;
                    
                    // Patch form values
                    this.form.patchValue({
                        type: request.type,
                        title: request.title,
                        description: request.description
                    });
                    
                    // Add each item to the form array
                    if (request.items && request.items.length > 0) {
                        request.items.forEach(item => {
                            this.addItemToForm(item);
                        });
                    }
                    
                    this.loading = false;
                });
        } else {
            // Add a default item in add mode
            this.addItem();
        }
    }

    // Getter for easy access to form fields
    get f() { return this.form.controls; }
    
    // Getter for items FormArray
    get items() { return this.f.items as FormArray; }

    addItem() {
        const itemForm = this.formBuilder.group({
            name: ['', Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]],
            description: ['']
        });
        
        this.items.push(itemForm);
    }
    
    addItemToForm(item: RequestItem) {
        const itemForm = this.formBuilder.group({
            name: [item.name, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            description: [item.description || '']
        });
        
        this.items.push(itemForm);
    }
    
    removeItem(index: number) {
        this.items.removeAt(index);
    }

    onSubmit() {
        this.alertService.clear();
        
        if (this.form.invalid) {
            return;
        }
        
        this.submitting = true;
        
        if (this.isAddMode) {
            this.createRequest();
        } else {
            this.updateRequest();
        }
    }

    private createRequest() {
        this.requestService.create(this.form.value)
            .pipe(
                first(),
                finalize(() => this.submitting = false)
            )
            .subscribe({
                next: () => {
                    this.alertService.success('Request created successfully with a new workflow', { keepAfterRouteChange: true });
                    this.router.navigate(['../my-requests'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                }
            });
    }

    private updateRequest() {
        this.requestService.update(this.id, this.form.value)
            .pipe(
                first(),
                finalize(() => this.submitting = false)
            )
            .subscribe({
                next: () => {
                    this.alertService.success('Request updated successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../../my-requests'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                }
            });
    }
}
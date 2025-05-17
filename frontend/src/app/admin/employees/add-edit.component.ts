// frontend/src/app/admin/employees/add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { EmployeeService, AccountService, DepartmentService, AlertService } from '../../_services';
import { Account, Department } from '../../_models';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    submitting = false;
    accounts: Account[] = [];
    departments: Department[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService,
        private accountService: AccountService,
        private departmentService: DepartmentService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        this.loading = true;
        
        // Load accounts and departments
        forkJoin({
            accounts: this.accountService.getAll(),
            departments: this.departmentService.getAll()
        }).pipe(
            first(),
            finalize(() => this.loading = false)
        ).subscribe({
            next: ({ accounts, departments }) => {
                this.accounts = accounts;
                this.departments = departments;
                
                this.form = this.formBuilder.group({
                    employeeId: [''],
                    position: ['', Validators.required],
                    // hireDate is a string in 'YYYY-MM-DD' format
                    hireDate: [new Date().toISOString().substring(0, 10), Validators.required],
                    status: ['Active', Validators.required],
                    departmentId: ['', Validators.required],
                    accountId: ['', Validators.required]
                });
                
                if (!this.isAddMode) {
                    this.employeeService.getById(this.id)
                        .pipe(first())
                        .subscribe(employee => {
                            let patchData = { ...employee };
                            if (employee.hireDate) {
                                // Ensure hireDate is a string in 'YYYY-MM-DD' format
                                const hireDate = new Date(employee.hireDate);
                                patchData.hireDate = hireDate;
                            }
                            
                            this.form.patchValue(patchData);
                            this.form.patchValue(patchData);
                        });
                }
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        if (this.isAddMode) {
            this.createEmployee();
        } else {
            this.updateEmployee();
        }
    }

    private createEmployee() {
        this.employeeService.create(this.form.value)
            .pipe(
                first(),
                finalize(() => this.submitting = false)
            )
            .subscribe({
                next: () => {
                    this.alertService.success('Employee created successfully with onboarding workflow', { keepAfterRouteChange: true });
                    this.router.navigate(['..'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                }
            });
    }

    private updateEmployee() {
        this.employeeService.update(this.id, this.form.value)
            .pipe(
                first(),
                finalize(() => this.submitting = false)
            )
            .subscribe({
                next: () => {
                    this.alertService.success('Employee updated successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['..'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                }
            });
    }
}
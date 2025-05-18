// frontend/src/app/admin/employees/transfer.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';

import { EmployeeService, DepartmentService, AlertService } from '../../_services';
import { Department, Employee } from '../../_models';

@Component({ templateUrl: 'transfer.component.html' })
export class TransferComponent implements OnInit {
    id: string;
    employee: Employee;
    departments: Department[] = [];
    form: FormGroup;
    loading = false;
    submitting = false;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.form = this.formBuilder.group({
            departmentId: ['', Validators.required]
        });
        
        this.loading = true;
        
        // Load employee and department data
        this.employeeService.getById(this.id)
            .pipe(first())
            .subscribe({
                next: employee => {
                    this.employee = employee;
                    // Load departments excluding current one
                    this.loadDepartments();
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }
    
    loadDepartments() {
        this.departmentService.getAll()
            .pipe(
                first(),
                finalize(() => this.loading = false)
            )
            .subscribe({
                next: departments => {
                    // Filter out current department
                    this.departments = departments.filter(
                        dept => dept.id !== this.employee.departmentId
                    );
                },
                error: error => {
                    this.error = error;
                }
            });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitting = true;
        this.alertService.clear();
        
        if (this.form.invalid) {
            this.submitting = false;
            return;
        }
        
        this.employeeService.transferEmployee(this.id, this.f.departmentId.value)
            .pipe(
                first(),
                finalize(() => this.submitting = false)
            )
            .subscribe({
                next: result => {
                    this.alertService.success(`Employee transferred successfully. ${result.message}`, { keepAfterRouteChange: true });
                    this.router.navigate(['../../details', this.id], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                }
            });
    }
}
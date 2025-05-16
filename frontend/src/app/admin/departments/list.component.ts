// frontend/src/app/admin/departments/list.component.ts
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { DepartmentService, AlertService } from '../../_services';
import { Department } from '../../_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    departments: Department[] = [];
    loading = false;
    error = '';

    constructor(
        private departmentService: DepartmentService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.loadDepartments();
    }

    loadDepartments() {
        this.loading = true;
        this.departmentService.getAll()
            .pipe(first())
            .subscribe({
                next: departments => {
                    this.departments = departments;
                    this.loading = false;
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }

    deleteDepartment(id: number) {
        if (!id) return;
        
        if (confirm('Are you sure you want to delete this department?')) {
            const department = this.departments.find(x => x.id === id);
            if (department && department.employeeCount && department.employeeCount > 0) {
                this.alertService.error(`Cannot delete department with ${department.employeeCount} employees`);
                return;
            }
            
            this.loading = true;
            this.departmentService.delete(id.toString())
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.alertService.success('Department deleted successfully', { keepAfterRouteChange: true });
                        this.loadDepartments();
                    },
                    error: error => {
                        this.alertService.error(error);
                        this.loading = false;
                    }
                });
        }
    }
}
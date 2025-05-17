// frontend/src/app/admin/employees/list.component.ts
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { EmployeeService, AlertService } from '@app/_services';
import { Employee } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    employees: Employee[] = [];
    filteredEmployees: Employee[] = [];
    loading = false;
    error = '';

    constructor(
        private employeeService: EmployeeService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.loadEmployees();
    }

    loadEmployees() {
        this.loading = true;
        this.employeeService.getAll()
            .pipe(first())
            .subscribe({
                next: employees => {
                    this.employees = employees;
                    this.filteredEmployees = employees;
                    this.loading = false;
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
        
        this.filteredEmployees = this.employees.filter(employee => 
            employee.employeeId?.toLowerCase().includes(filterValue) ||
            employee.accountName?.toLowerCase().includes(filterValue) ||
            employee.departmentName?.toLowerCase().includes(filterValue) ||
            employee.position?.toLowerCase().includes(filterValue) ||
            employee.status?.toLowerCase().includes(filterValue)
        );
    }

    deleteEmployee(id: number) {
        if (!id) return;
        
        if (confirm('Are you sure you want to delete this employee? This will also delete associated workflows.')) {
            this.loading = true;
            this.employeeService.delete(id.toString())
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.alertService.success('Employee deleted successfully', { keepAfterRouteChange: true });
                        this.loadEmployees();
                    },
                    error: error => {
                        this.alertService.error(error);
                        this.loading = false;
                    }
                });
        }
    }
}
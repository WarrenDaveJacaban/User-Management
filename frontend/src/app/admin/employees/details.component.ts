// frontend/src/app/admin/employees/details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { EmployeeService, WorkflowService, AlertService } from '../../_services';
import { Employee, Workflow } from '../../_models';

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent implements OnInit {
    id: string;
    employee: Employee;
    workflows: Workflow[] = [];
    loading = false;
    loadingWorkflows = false;
    error = '';

    // For workflow update modal
    workflowForm: FormGroup;
    selectedWorkflow: Workflow;

    constructor(
        private route: ActivatedRoute,
        private employeeService: EmployeeService,
        private workflowService: WorkflowService,
        private formBuilder: FormBuilder,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.loadEmployee();
        this.loadWorkflows();
        
        // Initialize workflow form
        this.workflowForm = this.formBuilder.group({
            status: ['', Validators.required],
            description: [''],
            assignedTo: ['']
        });
    }

    loadEmployee() {
        this.loading = true;
        this.employeeService.getById(this.id)
            .pipe(first())
            .subscribe({
                next: employee => {
                    this.employee = employee;
                    this.loading = false;
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }

    loadWorkflows() {
        this.loadingWorkflows = true;
        this.workflowService.getByEmployee(this.id)
            .pipe(first())
            .subscribe({
                next: workflows => {
                    this.workflows = workflows;
                    this.loadingWorkflows = false;
                },
                error: error => {
                    this.error = error;
                    this.loadingWorkflows = false;
                }
            });
    }

    refreshWorkflows() {
        this.loadWorkflows();
    }

    updateWorkflow(workflow: Workflow) {
        this.selectedWorkflow = workflow;
        
        // For demonstration, we'll simply set the status to the next step
        // In a real application, this would open a modal
        let newStatus: 'Pending' | 'In Progress' | 'Approved' | 'Rejected' | 'Completed';
        
        switch (workflow.status) {
            case 'Pending':
                newStatus = 'In Progress';
                break;
            case 'In Progress':
                newStatus = 'Completed';
                break;
            case 'Approved':
                newStatus = 'Completed';
                break;
            case 'Rejected':
                newStatus = 'Pending';
                break;
            case 'Completed':
                newStatus = 'Completed'; // Can't change
                break;
            default:
                newStatus = 'In Progress';
        }
        
        // Update the workflow
        if (workflow.status !== newStatus && workflow.id !== undefined && workflow.id !== null) {
            this.workflowService.update(workflow.id.toString(), { 
                ...workflow,
                status: newStatus 
            })
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success(`Workflow updated to ${newStatus}`);
                    this.refreshWorkflows();
                },
                error: error => {
                    this.alertService.error(error);
                }
            });
        }
    }
}
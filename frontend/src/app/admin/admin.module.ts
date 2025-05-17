// frontend/src/app/admin/admin.module.ts (updated for Vercel)
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout.component';
import { OverViewComponent } from './overview.component';

// Explicitly import core services
import { AccountService } from '../_services/account.service';
import { AlertService } from '../_services/alert.service';
import { DepartmentService } from '../_services/department.service';
import { EmployeeService } from '../_services/employee.service';
import { WorkflowService } from '../_services/workflow.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    FormsModule
  ],
  declarations: [
    LayoutComponent,
    OverViewComponent
  ],
  providers: [
    // Explicitly provide all services needed by child modules
    AccountService,
    AlertService,
    DepartmentService,
    EmployeeService,
    WorkflowService
  ]
})
export class AdminModule { }
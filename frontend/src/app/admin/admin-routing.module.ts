// frontend/src/app/admin/admin-routing.module.ts (updated)
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { OverViewComponent } from './overview.component';

const accountsModule = () => import('./accounts/accounts.module').then(x => x.AccountsModule);
const analyticsModule = () => import('./analytics/analytics.module').then(x => x.AnalyticsModule);
const departmentsModule = () => import('./departments/departments.module').then(x => x.DepartmentsModule);
const employeesModule = () => import('./employees/employees.module').then(x => x.EmployeesModule);

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: OverViewComponent },
            { path: 'accounts', loadChildren: accountsModule },
            { path: 'analytics', loadChildren: analyticsModule },
            { path: 'departments', loadChildren: departmentsModule },
            { path: 'employees', loadChildren: employeesModule }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
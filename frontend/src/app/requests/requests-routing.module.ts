// frontend/src/app/requests/requests-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { MyRequestsComponent } from './my-requests.component';
import { AddEditComponent } from './add-edit.component';
import { DetailsComponent } from './details.component';
import { Role } from '../_models';
import { AuthGuard } from '../_helpers';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: ListComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
            { path: 'my-requests', component: MyRequestsComponent },
            { path: 'add', component: AddEditComponent },
            { path: 'edit/:id', component: AddEditComponent },
            { path: 'details/:id', component: DetailsComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RequestsRoutingModule { }
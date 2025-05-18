// frontend/src/app/requests/requests.module.ts
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RequestsRoutingModule } from './requests-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { MyRequestsComponent } from './my-requests.component';
import { AddEditComponent } from './add-edit.component';
import { DetailsComponent } from './details.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RequestsRoutingModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        MyRequestsComponent,
        AddEditComponent,
        DetailsComponent
    ]
})
export class RequestsModule { }
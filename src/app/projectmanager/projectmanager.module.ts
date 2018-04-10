import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ProjectSelectorComponent } from './components/project-selector/project-selector.component';
import { ProjectViewComponent } from './components/project-view/project-view.component';
import { FiltersComponent } from './components/filters/filters.component';
import { TicketsOverviewComponent } from './components/tickets-overview/tickets-overview.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectmanagerComponent } from './projectmanager.component';
import { ProjectService } from './services/project.service';
import { MainContentContainerComponent } from './components/main-content-container/main-content-container.component';
import { DataService } from './services/data.service';
import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { ProjectEditComponent } from './components/project-edit/project-edit.component';
import { TicketViewComponent } from './components/ticket-view/ticket-view.component';
import { NewTicketDialogComponent } from './components/new-ticket-dialog/new-ticket-dialog.component';
import { AccountViewComponent } from './components/account-view/account-view.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ManagerPanelComponent } from './components/manager-panel/manager-panel.component';

const routes: Routes = [
  { path: 'manager', component: ManagerPanelComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: AccountViewComponent },
  { path: 'projects/create', component: ProjectCreateComponent },
  { path: 'projects/edit/:id', component: ProjectEditComponent },
  { path: 'projects/:id/:ticketId', component: TicketViewComponent },
  { path: 'projects/:id', component: ProjectViewComponent },
  { path: 'tickets/:id', component: TicketViewComponent },
  { path: '', component: ProjectmanagerComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    // UserService,
    ProjectService,
    DataService
  ],
  declarations: [
      ProjectmanagerComponent,
      ToolbarComponent,
      ProjectSelectorComponent,
      ProjectViewComponent,
      ProjectEditComponent,
      ProjectCreateComponent,
      FiltersComponent,
      TicketsOverviewComponent,
      MainContentContainerComponent,
      TicketViewComponent,
      NewTicketDialogComponent,
      AccountViewComponent,
      ChangePasswordComponent,
      LoginComponent,
      RegisterComponent,
      ManagerPanelComponent
  ],
  entryComponents: [
    NewTicketDialogComponent,
    ChangePasswordComponent
  ]
})
export class ProjectmanagerModule { }

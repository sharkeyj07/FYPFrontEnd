import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProjectCreateComponent } from '../project-create/project-create.component';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.scss']
})
export class AccountViewComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private data: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.data.changeHeaderText('My Account');
  }

  newProject() {
    this.router.navigate(['/projectmanager/projects/create']);
  }

  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '90%'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  navigateToProjects() {
    this.router.navigate(['/projectmanager']);
  }

}

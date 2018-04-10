import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project';
import { FormControl, Validators } from '@angular/forms';
import { MatListOption, MatDialogRef, SimpleSnackBar, MatSnackBarRef, MatSnackBar } from '@angular/material';
import { ProjectService } from '../../services/project.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent implements OnInit {

  user: User;
  project: Project;

  title = new FormControl('', [Validators.required]);
  username = new FormControl('', [Validators.required]);
  priority = new FormControl('', [Validators.required]);
  status = new FormControl('', [Validators.required]);
  sprint = new FormControl('', [Validators.required]);
  sprintStartDateValidator = new FormControl('', [Validators.required]);
  sprintEndDateValidator = new FormControl('', [Validators.required]);

  usernameToAdd = '';
  priorityToAdd = '';
  statusToAdd = '';
  sprintToAdd = '';
  sprintStartDate;
  sprintEndDate;


  getErrorMessage() {
    return this.title.hasError('required') ? 'You must enter a title' :
      '';
  }

  getUsernameErrorMessage() {
    return this.username.hasError('required') ? 'You must enter a username' :
      '';
  }

  getPriorityErrorMessage() {
    return this.priority.hasError('required') ? 'You must enter a priority name' :
      '';
  }

  getStatusErrorMessage() {
    return this.status.hasError('required') ? 'You must enter a status name' :
      '';
  }

  getSprintErrorMessage() {
    return this.status.hasError('required') ? 'You must enter a sprint name' :
      '';
  }

  addUser() {
    // tslint:disable-next-line:triple-equals
    if (this.usernameToAdd == '') { return; }
    this.project.users.push(this.usernameToAdd);
    this.usernameToAdd = '';
    this.username.markAsUntouched();
  }

  removeSelectedUsers(users: MatListOption[]) {
    users.forEach(user => {
      const index = this.project.users.indexOf(user._text.nativeElement.innerText);
      if (index > -1) {
        this.project.users.splice(index, 1);
      }
    });
    // tslint:disable-next-line:triple-equals
    if (this.usernameToAdd == '') { return; }
    this.project.users.push(this.usernameToAdd);
    this.usernameToAdd = '';
    this.username.markAsUntouched();
  }

  promote(users: MatListOption[]) {
    users.forEach(user => {
      this.project.admins.push(user._text.nativeElement.innerText);
      const index = this.project.users.indexOf(user._text.nativeElement.innerText);
      if (index > -1) {
        this.project.users.splice(index, 1);
      }
    });
  }

  demote(admins: MatListOption[]) {
    admins.forEach(admin => {
      this.project.users.push(admin._text.nativeElement.innerText);
      const index = this.project.admins.indexOf(admin._text.nativeElement.innerText);
      if (index > -1) {
        this.project.admins.splice(index, 1);
      }
    });
  }

  addPriority() {
    // tslint:disable-next-line:triple-equals
    if (this.priorityToAdd == '') { return; }
    let largestId = 0;
    this.project.priorities.forEach(priority => {
      if (priority.ID > largestId) { largestId = priority.ID; }
    });
    this.project.priorities.push({ 'ID': largestId + 1, 'name': this.priorityToAdd });
    this.priorityToAdd = '';
    this.priority.markAsUntouched();
  }

  addStatus() {
    // tslint:disable-next-line:triple-equals
    if (this.statusToAdd == '') { return; }
    let largestId = 0;
    this.project.ticketStatuses.forEach(status => {
      if (status.ID > largestId) { largestId = status.ID; }
    });
    this.project.ticketStatuses.push({ 'ID': largestId + 1, 'name': this.statusToAdd });
    this.statusToAdd = '';
    this.status.markAsUntouched();
  }

  addSprint() {
    // tslint:disable-next-line:triple-equals
    if (this.sprintToAdd == '' || this.sprintStartDate == '' || this.sprintEndDate == '') {
      this.openSnackBar('All sprint fields required');
      return;
    }
    if (this.sprintStartDate >= this.sprintEndDate) {
      this.openSnackBar('Cannot have a sprint start date before, or the same as the end date');
      return;
    }
    let largestId = 0;
    this.project.sprints.forEach(sprint => {
      if (sprint.ID > largestId) { largestId = sprint.ID; }
    });
    this.project.sprints.push({
      ID: largestId + 1,
      startDate: this.sprintStartDate,
      endDate: this.sprintEndDate,
      name: this.sprintToAdd
    });
    this.sprintToAdd = '';
    this.sprintStartDate = '';
    this.sprintEndDate = '';
    this.sprint.markAsUntouched();
    this.sprintStartDateValidator.markAsUntouched();
    this.sprintEndDateValidator.markAsUntouched();
  }



  create() {
    if (!this.project.title) {
      this.openSnackBar('Title required');
      return;
    }
    this.projects.newProject(this.project, this.user.username);
  }

  cancel() {
    this.router.navigate(['/projectmanager/account']);
  }

  openSnackBar(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, null, {
      duration: 5000,
    });
  }


  constructor(
    private projects: ProjectService,
    private data: DataService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.data.changeHeaderText('Creating Project');
    this.project = new Project();
    this.data.currentUser.subscribe(user => {
      if (!user.username) {
        this.router.navigate(['/projectmanager/login']);
      }
      this.project.admins.push(user.username);
      this.user = user;
    });
    this.sprintStartDate = '';
    this.sprintEndDate = '';
  }

}

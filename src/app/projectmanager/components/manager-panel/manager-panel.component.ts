import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project';
import { FormControl, Validators } from '@angular/forms';
import { MatListOption } from '@angular/material';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-manager-panel',
  templateUrl: './manager-panel.component.html',
  styleUrls: ['./manager-panel.component.scss']
})
export class ManagerPanelComponent implements OnInit {

  usernameToAdd = '';
  project = new Project();
  allProjects: Project[];

  username = new FormControl('', [Validators.required]);

  constructor(
    private projects: ProjectService
  ) { }

  ngOnInit() {
    this.projects.getAllProjects()
    .then(data => {
      this.allProjects = data;
    });
  }

  getUsernameErrorMessage() {
    return this.username.hasError('required') ? 'You must enter a username' :
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

  save() {
    this.projects.saveProject(this.project);
  }
}

import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { DataService } from './services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projectmanager',
  template: `
    <app-toolbar></app-toolbar>
    <app-main-content-container ></app-main-content-container>
  `,
  styles: []
})
export class ProjectmanagerComponent implements OnInit {

  constructor(
    private data: DataService,
    private router: Router
  ) { }

  user: User;

  ngOnInit() {
    this.data.currentUser.subscribe(user => {
      if (!user.username) {
        this.router.navigate(['/projectmanager/login']);
      }
    });
  }

}

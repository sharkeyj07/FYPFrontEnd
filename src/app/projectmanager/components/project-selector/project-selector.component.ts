import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { User } from '../../models/user';
import { Observable } from 'rxjs/Observable';
import { Project } from '../../models/project';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent implements OnInit, AfterViewInit {

  user: User;
  projects: Observable<Project[]>;
  myColabProjects: Observable<Project[]>;
  myProjects: Observable<Project[]>;

  constructor(
    private projectService: ProjectService,
    private data: DataService,
    private router: Router
  ) {  }

  ngOnInit() {
    this.data.currentUser.subscribe(user => {
      if (!user.username) {
        this.router.navigate(['/projectmanager/login']);
      }
      this.user = user;
    });
    this.projects = this.projectService.projects;
    this.myProjects = this.projectService.myProjects;
    this.myColabProjects = this.projectService.myColabProjects;
    this.projectService.loadMy(this.user.username);
    this.projectService.loadColab(this.user.username);
  }

  ngAfterViewInit() {
    this.data.changeHeaderText('Projects');
  }

  projectSelected(project: Project) {
    this.data.changeProject(project);
    this.router.navigate(['/projectmanager/projects', project._id]);
  }

  edit(project: Project) {
    this.data.changeProject(project);
    this.router.navigate(['/projectmanager/projects/edit', project._id]);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Project } from '../models/project';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';
import { Ticket } from '../models/ticket';
import { Router } from '@angular/router';

@Injectable()
export class ProjectService {

  private _projects: BehaviorSubject<Project[]>;
  private _myProjects: BehaviorSubject<Project[]>;
  private _myColabProjects: BehaviorSubject<Project[]>;
  // private projectsUrl = 'http://localhost:3000/projects/'; // change data service too
   private projectsUrl = 'https://fathomless-sands-67498.herokuapp.com/projects/';

  private dataStore: {
    projects: Project[],
    myProjects: Project[],
    myColabProjects: Project[]
  };

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private router: Router
  ) {
    this.dataStore = {
      projects: [],
      myProjects: [],
      myColabProjects: []
      };
    this._projects = new BehaviorSubject<Project[]>([]);
    this._myProjects = new BehaviorSubject<Project[]>([]);
    this._myColabProjects = new BehaviorSubject<Project[]>([]);
  }

  get projects(): Observable<Project[]> {
    return this._projects.asObservable();
  }

  get myProjects(): Observable<Project[]> {
    return this._myProjects.asObservable();
  }

  get myColabProjects(): Observable<Project[]> {
    return this._myColabProjects.asObservable();
  }

  addProject(project: Project): Promise<Project> {
    return new Promise((resolver, reject) => {
      project._id = String(this.dataStore.projects.length + 1);
      this.dataStore.projects.push(project);
      this._projects.next(Object.assign({}, this.dataStore).projects);
      resolver(project);
    });
  }

  projectById(id: String) {
    this.dataStore.projects = this.dataStore.myProjects.concat(this.dataStore.myColabProjects);
    // tslint:disable-next-line:triple-equals
    return this.dataStore.projects.find(x => x._id == id);
  }

  getProjectById(id: String) {
    this.http.get<Project>(this.projectsUrl + id)
    .subscribe(data => {
      this.dataService.changeProject(data);
    });
  }

  loadAll() {
    return this.http.get<Project[]>(this.projectsUrl)
    .subscribe( data => {
      this.dataStore.projects = data;
      this._projects.next(Object.assign({}, this.dataStore).projects);
    }, error => {
      console.log('Failed to fetch projects', error);
    });
  }

  getAllProjects(): Promise<Project[]> {
    return new Promise((resolver, reject) => {
      this.http.get<Project[]>(this.projectsUrl)
        .subscribe(data => {
          resolver(data);
        }, error => {
          console.log('Failed to fetch projects', error);
          reject();
        });
    });
  }

  loadMy(username: string) {
    return this.http.get<Project[]>(this.projectsUrl + 'myProjects/' + username)
    .subscribe( data => {
      this.dataStore.myProjects = data;
      this._myProjects.next(Object.assign({}, this.dataStore).myProjects);
    }, error => {
      console.log('Failed to fetch projects', error);
    });
  }

  loadColab(username: string) {
    return this.http.get<Project[]>(this.projectsUrl + 'collabProjects/' + username)
    .subscribe( data => {
      this.dataStore.myColabProjects = data;
      this._myColabProjects.next(Object.assign({}, this.dataStore).myColabProjects);
    }, error => {
      console.log('Failed to fetch projects', error);
    });
  }

  saveProject(project: Project)  {
    return this.http.post<Project>(this.projectsUrl.concat('edit'), project)
    .subscribe(data => {
      this.dataService.changeProject(project);
    }, error => {
      console.log('Failed to edit project', error);
    });
  }

  newProject(project: Project, username: string)  {
    return this.http.post<Project>(this.projectsUrl.concat('new'), project)
    .subscribe(data => {
      this.loadMy(username);
      this.router.navigate(['/projectmanager']);
    }, error => {
      console.log('Failed to create project', error);
    });
  }

  deleteTicket(project: Project, ticket: Ticket)  {
    project.tickets.splice(project.tickets.indexOf(ticket), 1);
    return this.http.post<Project>(this.projectsUrl.concat('edit'), project)
    .subscribe(data => {
    }, error => {
      console.log('Failed to edit project', error);
    });
  }

  addTicket(project: Project, ticket: Ticket)  {
    console.log(ticket);
    project.tickets.push(ticket);
    return this.http.post<{message: string, createdProject: Project}>(this.projectsUrl.concat('edit'), project)
    .subscribe(data => {
      this.dataService.changeProject(data.createdProject);
    }, error => {
      console.log('Failed to edit project', error);
    });
  }
}

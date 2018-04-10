import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Project } from '../models/project';
import { HeaderRowPlaceholder } from '@angular/cdk/table';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Injectable()
export class DataService {

  // private projectsUrl = 'http://localhost:3000/';
   private projectsUrl = 'https://fathomless-sands-67498.herokuapp.com/';

  public ticketView: boolean;
  private projectSource = new BehaviorSubject<Project>(new Project());
  private headerSource = new BehaviorSubject<string>('My App');
  private userSource = new BehaviorSubject<User>(new User());
  private filterSource = new BehaviorSubject<object>({
    statuses: [],
    priorites: [],
    assignedTo: [],
    selectedSprint: -1
  });
  private showFilterSource = new BehaviorSubject<boolean>(false);

  currentProject = this.projectSource.asObservable();
  currentHeader = this.headerSource.asObservable();
  getShowFilters = this.showFilterSource.asObservable();
  currentUser = this.userSource.asObservable();
  currentFilters = this.filterSource.asObservable();

  private dataStore: {
    currentProject: Project,
    currentHeader: string,
    currentUser: User,
    currentFilters: {
      statuses: number[],
      priorites: number[],
      assignedTo: string[],
      selectedSprint: number
    },
    showFilters: boolean
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.dataStore = {
      currentProject: new Project(),
      currentHeader: 'My App',
      currentUser: new User(),
      currentFilters: {
        statuses: [],
        priorites: [],
        assignedTo: [],
        selectedSprint: -1
      },
      showFilters: false
    };
  }

  changeProject(project: Project) {
    this.dataStore.currentProject = project;
    this.projectSource.next(project);
  }

  changeHeaderText(header: string) {
    this.dataStore.currentHeader = header;
    this.headerSource.next(header);
  }

  logout() {
    this.dataStore.currentUser = new User();
    this.userSource.next(this.dataStore.currentUser);
    this.router.navigate(['/projectmanager/login']);
  }

  changeUser(user: User) {
    this.dataStore.currentUser = user;
    this.userSource.next(user);
  }

  toggleFilters() {
    this.dataStore.showFilters = !this.dataStore.showFilters;
    this.showFilterSource.next(!this.dataStore.showFilters);
  }

  changePassword(currentPassword: string, newPassword: string): Promise<string> {
    return new Promise((resolver, reject) => {
        this.http.post<string>(this.projectsUrl + 'users/changePassword', {
        username: this.dataStore.currentUser.username,
        currentPassword: currentPassword,
        newPassword: newPassword
      })
        .subscribe(data => {
          resolver(data);
        }, error => {
          console.log('Failed to change password', error);
          reject();
        });
    });
  }

  updateFilters(statuses: number[], priorites: number[], assignedTo: string[], selectedSprint: number) {
    this.dataStore.currentFilters.statuses = statuses;
    this.dataStore.currentFilters.priorites = priorites;
    this.dataStore.currentFilters.assignedTo = assignedTo;
    this.dataStore.currentFilters.selectedSprint = selectedSprint;
    this.filterSource.next(this.dataStore.currentFilters);
  }

  login(username: string, password: string): Promise<User> {
    return new Promise((resolver, reject) => {
      this.http.post<User>(this.projectsUrl + 'users/login', {
        username: username,
        password: password
      })
        .subscribe(data => {
          resolver(data);
        }, error => {
          console.log('Failed to login', error);
          reject();
        });
    });
  }

  register(username: string, password: string): Promise<User> {
    return new Promise((resolver, reject) => {
        this.http.post<User>(this.projectsUrl + 'users/', {
        username: username,
        password: password
      })
        .subscribe(data => {
          resolver(data);
        }, error => {
          console.log('Failed to register', error);
          reject();
        });
    });
  }
}

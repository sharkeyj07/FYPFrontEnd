import { Component, OnInit, Input } from '@angular/core';
import { Hour } from '../../models/hour';
import { Project } from '../../models/project';
import { TicketDisplayModel } from '../../models/ticketDisplayModel';
import { DataService } from '../../services/data.service';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Ticket } from '../../models/ticket';
import { ProjectService } from '../../services/project.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.scss']
})
export class TicketViewComponent implements OnInit {

  public allContributors: string[];
  ticket: Ticket;
  user: User;
  project: Project;
  hoursToAdd: number;

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private projectService: ProjectService,
    private router: Router
  ) { }

  ngOnInit() {
    this.data.currentProject.subscribe(proj => {
      this.project = proj;
      if (!this.project.title) {
        this.route.params.subscribe(params => {
          const id = params['id'];
          if (id) {
            this.projectService.getProjectById(id);
          } else {
            console.log('No proj id');
          }
        });
      } else {
        this.route.params.subscribe(params => {
          const ticketId = params['ticketId'];
          if (ticketId) {
            // tslint:disable-next-line:triple-equals
            this.ticket = this.project.tickets.find(x => x.ID == ticketId);
          } else {
            console.log('No ticketId');
          }
        });
      }
      this.allContributors = this.project.admins.concat(this.project.users);
    } );
    this.data.currentUser.subscribe(user => {
      if (!user.username) {
        this.router.navigate(['/projectmanager/login']);
      }
      this.user = user;
    });
  }

  removeHour(hour: Hour) {
    if (!this.project) {return; }
    const index = this.ticket.hours.indexOf(hour);
    if (index > -1) {
      this.ticket.hours.splice(index, 1);
    }
  }

  addHours() {
    // tslint:disable-next-line:triple-equals
    if (!this.hoursToAdd) {
      return;
    }
    this.ticket.hours.push({
      dateAdded: new Date(),
      value: this.hoursToAdd,
      user: this.user.username
    });
    this.hoursToAdd = null;
  }

  save() {
    this.projectService.saveProject(this.project);
    this.router.navigate(['/projectmanager/projects/', this.project._id]);
  }

  cancel() {
    this.router.navigate(['/projectmanager/projects/', this.project._id]);
  }

  delete() {
    this.projectService.deleteTicket(this.project, this.ticket);
    this.router.navigate(['/projectmanager/projects/', this.project._id]);
  }

}

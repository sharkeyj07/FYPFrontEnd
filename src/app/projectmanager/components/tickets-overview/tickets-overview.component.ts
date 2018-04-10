import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Project } from '../../models/project';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TicketDisplayModel } from '../../models/ticketDisplayModel';
import { Ticket } from '../../models/ticket';
import { DataService } from '../../services/data.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tickets-overview',
  templateUrl: './tickets-overview.component.html',
  styleUrls: ['./tickets-overview.component.scss']
})
export class TicketsOverviewComponent implements OnInit, AfterViewInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filters: any;
  user: User;
  project: Project;
  displayedColumns = ['ID', 'title', 'priority'];
  dataSource: MatTableDataSource<TicketDisplayModel>;

  constructor(
    private data: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<TicketDisplayModel>();
    this.data.currentProject.subscribe(proj => {
      this.project = proj;
      this.populateTable();
    });
    this.data.currentUser.subscribe(user => {
      if (!user.username) {
        this.router.navigate(['/projectmanager/login']);
      }
      this.user = user;
    });
    this.data.currentFilters.subscribe(filters => {
      this.filters = filters;
      this.populateTable();
    });
  }

  populateTable() {
    if (this.project.title && this.filters) {
      let ticketDisplayModels: TicketDisplayModel[];
      ticketDisplayModels = [];

      this.project.tickets.forEach(ticket => {
        let valid = true;

        // tslint:disable-next-line:triple-equals
        if (this.filters.statuses.length != 0) {
          if (!this.filters.statuses.includes(ticket.status)) {
            valid = false;
          }
        }
        // tslint:disable-next-line:triple-equals
        if (this.filters.priorites.length != 0) {
          if (!this.filters.priorites.includes(ticket.priority)) {
            valid = false;
          }
        }
        // tslint:disable-next-line:triple-equals
        if (this.filters.assignedTo.length != 0) {
          if (!this.filters.assignedTo.includes(ticket.assignedTo)) {
            valid = false;
          }
        }
        // tslint:disable-next-line:triple-equals
        if (this.filters.selectedSprint != -1) {
          if (!(this.filters.selectedSprint === ticket.sprint)) {
            valid = false;
          }
        }
        if (valid) {
          ticketDisplayModels.push(
            {
              ID: ticket.ID,
              title: ticket.title,
              description: ticket.description,
              // tslint:disable-next-line:triple-equals
              priority: this.project.priorities.find(x => x.ID == ticket.priority),
              assignedTo: ticket.assignedTo,
              hours: ticket.hours,
              // tslint:disable-next-line:triple-equals
              sprint: this.project.sprints.find(x => x.ID == ticket.sprint),
              // tslint:disable-next-line:triple-equals
              status: this.project.ticketStatuses.find(x => x.ID == ticket.status),
            }
          );
        }
      });
      this.dataSource = new MatTableDataSource<TicketDisplayModel>(ticketDisplayModels);
    }
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      console.log('no data source');
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ticketSelected(ticket: TicketDisplayModel) {
    this.router.navigate(['/projectmanager/projects/', this.project._id, ticket.ID]);
  }
}

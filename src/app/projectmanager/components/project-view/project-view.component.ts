import { Component, OnInit, Input, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../models/project';
import { DataService } from '../../services/data.service';
import { ProjectService } from '../../services/project.service';
import { User } from '../../models/user';
import { NewTicketDialogComponent } from '../new-ticket-dialog/new-ticket-dialog.component';
import { MatDialog, MatSidenav, MatListOption } from '@angular/material';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit, OnDestroy {

  private mediaMathcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px`);

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  project: Project;
  allMembers: string[];
  user: User;
  selectedSprint: number;

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private projects: ProjectService,
    private dialog: MatDialog,
    zone: NgZone,
    private router: Router
  ) {
    this.mediaMathcher.addListener(mql =>
      zone.run(() => this.mediaMathcher = mql));
  }

  ngOnInit() {
    this.data.currentProject.subscribe(proj => {
      this.project = proj;
      this.allMembers = this.project.users.concat(this.project.admins);

      if (!proj.title) { // Doesn't Have Project Data
        this.route.params.subscribe(params => {
          const id = params['id'];
          if (id) {
            this.projects.getProjectById(id);
          } else {
            console.log('No id');
          }
        });
      }
      this.data.changeHeaderText(this.project.title);
    });
    this.data.currentUser.subscribe(user => {
      if (!user.username) {
        this.router.navigate(['/projectmanager/login']);
      }
      this.user = user;
    });

    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
    this.selectedSprint = -1;
    this.data.getShowFilters.subscribe(() => this.sidenav.open());
    this.data.ticketView = true;
  }

  ngOnDestroy() {
    this.data.ticketView = false;
  }

  newTicket() {
    const dialogRef = this.dialog.open(NewTicketDialogComponent, {
      width: '90%',
      height: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  isScreenSmall(): boolean {
    return this.mediaMathcher.matches;
  }

  applyFilters(statuses: MatListOption[], priorities: MatListOption[], assignedTo: MatListOption[]) {
    const statusesToFilter = [];
    statuses.forEach(status => {
      const statusObject = this.project.ticketStatuses.find(x => x.name === status._text.nativeElement.innerText);
      if (statusObject) {
        statusesToFilter.push(statusObject.ID);
      }
    });

    const prioritiesToFilter = [];
    priorities.forEach(priority => {
      const priorityObject = this.project.priorities.find(x => x.name === priority._text.nativeElement.innerText);
      if (priorityObject) {
        prioritiesToFilter.push(priorityObject.ID);
      }
    });

    const asiignmentsToFilter = [];
    assignedTo.forEach(assignment => {
      asiignmentsToFilter.push(assignment._text.nativeElement.innerText);
    });

    this.data.updateFilters(statusesToFilter, prioritiesToFilter, asiignmentsToFilter, this.selectedSprint);
  }
}

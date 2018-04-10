import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material';
import { Ticket } from '../../models/ticket';
import { DataService } from '../../services/data.service';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project';

@Component({
  selector: 'app-new-ticket-dialog',
  templateUrl: './new-ticket-dialog.component.html',
  styleUrls: ['./new-ticket-dialog.component.scss']
})
export class NewTicketDialogComponent implements OnInit {

  project: Project;
  ticket: Ticket;
  allContributors: string[];

  constructor(
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NewTicketDialogComponent>,
    private data: DataService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.ticket = new Ticket();
    this.data.currentProject.subscribe(proj => {
      this.project = proj;
      this.allContributors = this.project.admins.concat(this.project.users);
    });
  }

  save() {
    // tslint:disable-next-line:triple-equals
    if (this.ticket.title == '') {
      this.openSnackBar('Title required');
      return;
    }
    console.log(this.ticket.priority);
    if (!this.ticket.priority) {
      this.openSnackBar('Priority required');
      return;
    }
    this.projectService.addTicket(this.project, this.ticket);
    this.dialogRef.close(this.ticket);
  }

  cancel() {
    this.dialogRef.close(null);
  }

  openSnackBar(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, null, {
      duration: 5000,
    });
  }
}

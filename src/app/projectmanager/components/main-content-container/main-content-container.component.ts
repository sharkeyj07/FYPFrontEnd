import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Observable } from 'rxjs/Observable';
import { Project } from '../../models/project';
import { User } from '../../models/user';
import { ProjectSelectorComponent } from '../project-selector/project-selector.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-main-content-container',
  templateUrl: './main-content-container.component.html',
  styleUrls: ['./main-content-container.component.scss']
})
export class MainContentContainerComponent implements OnInit {

  selectedProject: Project;

  constructor(
    private data: DataService
  ) {
   }

  ngOnInit() {
    this.data.currentProject.subscribe(proj => this.selectedProject = proj);
  }

}

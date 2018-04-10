import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  private mediaMathcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px`);

  @ViewChild(MatButton) menuButton: MatButton;

  constructor(
    private data: DataService,
    private router: Router,
    zone: NgZone,
  ) {
    this.mediaMathcher.addListener(mql =>
      zone.run(() => this.mediaMathcher = mql));
  }
  user: User;
  title: string;
  filtersButtonVisible: boolean;

  ngOnInit() {
    this.data.currentHeader.subscribe(header => {
      setTimeout(() => {
        this.title = header;
    }, 0);
    }

  );
    this.user = {
      _id : '1',
      username : 'userOne',
      passwordHash : 'testPasswordHash'
    };
    this.filtersButtonVisible = false;
    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.filtersButtonVisible = true;
      }
    });
  }

  navigateToAccount() {
    this.router.navigate(['/projectmanager/account']);
  }

  isScreenSmall(): boolean {
    return this.mediaMathcher.matches;
  }

  isMenuButtonVisible(): boolean {
    return this.isScreenSmall() && this.isTicketView();
  }

  isTicketView(): boolean {
    return this.data.ticketView;
  }

  toggleFilters() {
    this.data.toggleFilters();
  }

  logout() {
    this.data.logout();
  }

}

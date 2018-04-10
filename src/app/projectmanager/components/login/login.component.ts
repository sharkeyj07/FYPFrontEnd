import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username;
  password;

  constructor(
    private data: DataService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    const promise = this.data.login(this.username, this.password);
    promise.then(success => {
      this.data.changeUser(success);
      this.router.navigate(['/projectmanager']);
    },
    error => {
      console.log(error);
      this.openSnackBar('Login Unsuccessful');
    });
  }

  register() {
    this.router.navigate(['/projectmanager/register']);
  }

  openSnackBar(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, null, {
      duration: 5000,
    });
  }
}

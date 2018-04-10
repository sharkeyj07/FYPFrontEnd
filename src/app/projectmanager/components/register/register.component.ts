import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  username;
  password;
  repeatPassword;

  constructor(
    private data: DataService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.router.navigate(['/projectmanager/login']);
  }

  register() {
    if (this.password !== this.repeatPassword) {
      this.openSnackBar('Passwords Don\'t Match');
      return;
    }
    const promise = this.data.register(this.username, this.password);
    promise.then(success => {
      this.data.changeUser(success);
      this.router.navigate(['/projectmanager/account']);
    },
    error => {
        this.openSnackBar('Register Unsuccessful');
    });
  }

  openSnackBar(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, null, {
      duration: 5000,
    });
  }
}

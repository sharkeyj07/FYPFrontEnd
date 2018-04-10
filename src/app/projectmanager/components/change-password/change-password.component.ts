import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  currentPasswordControl = new FormControl('', [Validators.required]);
  newPasswordControl = new FormControl('', [Validators.required]);
  newPassword2Control = new FormControl('', [Validators.required]);

  currentPassword: string;
  newPassword: string;
  newPassword2: string;

  getCurrentErrorMessage() {
    return this.currentPasswordControl.hasError('required') ? 'You must enter your current password' :
      '';
  }

  getNewErrorMessage() {
    return this.currentPasswordControl.hasError('required') ? 'You must enter your new password' :
      '';
  }

  getNew2ErrorMessage() {
    return this.currentPasswordControl.hasError('required') ? 'You must repeat your new password' :
      '';
  }

  change() {
    if (this.newPassword !== this.newPassword2) {
      this.openSnackBar('Passwords Don\'t Match');
      return;
    }
    this.openSnackBar('Changing...');
    const promise = this.data.changePassword(this.currentPassword, this.newPassword);
    promise.then(success => {
      this.openSnackBar('Password Changed');
      this.dialogRef.close();
    },
      failure => {
        this.openSnackBar('Password Change Failed');
      });
  }

  openSnackBar(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, null, {
      duration: 5000,
    });
  }

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private snackBar: MatSnackBar,
    private data: DataService
  ) { }

  ngOnInit() {
  }

}
